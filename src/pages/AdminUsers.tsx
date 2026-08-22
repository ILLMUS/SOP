import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, UserPlus, Trash2 } from "lucide-react";
import UserRoleEditor from "@/components/admin/UserRoleEditor";
import RoleAuditTrail from "@/components/admin/RoleAuditTrail";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Navigate } from "react-router-dom";
import type { Tables, Database } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles extends Profile {
  roles: AppRole[];
  orgRoleIds: string[];
  orgRoleNames: string[];
  assignedStages: string[];
}

interface OrgRole {
  id: string;
  name: string;
}

interface WorkflowStage {
  name: string;
  primary_role_id: string | null;
  secondary_role_id: string | null;
}

/**
 * Extract the real error returned by a Supabase Edge Function.
 *
 * Supabase's functions.invoke() can return a generic FunctionsHttpError
 * while the useful error message is actually inside error.context.
 */
const getFunctionErrorMessage = async (
  error: any,
  fallback = "The server rejected the request."
): Promise<string> => {
  if (!error) return fallback;

  // Supabase FunctionsHttpError normally exposes the Response
  // through error.context.
  try {
    if (error.context instanceof Response) {
      const response = error.context;

      let body: any = null;

      try {
        body = await response.clone().json();
      } catch {
        try {
          body = await response.clone().text();
        } catch {
          body = null;
        }
      }

      if (typeof body === "string" && body.trim()) {
        return body;
      }

      if (body?.error) {
        return String(body.error);
      }

      if (body?.message) {
        return String(body.message);
      }

      if (body?.details) {
        return String(body.details);
      }

      if (response.status) {
        return `${fallback} (HTTP ${response.status})`;
      }
    }
  } catch {
    // Fall through to the standard error properties below.
  }

  if (error.message) {
    return String(error.message);
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
};

export default function AdminUsers() {
  const { isAdmin, orgId } = useAuth();

  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [orgRoles, setOrgRoles] = useState<OrgRole[]>([]);
  const [workflowName, setWorkflowName] = useState<string | null>(null);
  const [roleStages, setRoleStages] = useState<Record<string, string[]>>({});

  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "",
  });

  const [inviteMode, setInviteMode] = useState(true);

  useEffect(() => {
    if (isAdmin && orgId) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, orgId]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  /**
   * Load all members and their organization/workflow roles.
   */
  const fetchUsers = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Membership is the source of truth.
      const {
        data: members,
        error: membersError,
      } = await supabase
        .from("organization_members")
        .select("user_id")
        .eq("org_id", orgId);

      if (membersError) {
        throw membersError;
      }

      const memberIds = Array.from(
        new Set(
          (members || []).map((m: any) => m.user_id as string)
        )
      );

      const [
        profilesResult,
        rolesResult,
        orgRolesResult,
        userOrgRolesResult,
        templatesResult,
      ] = await Promise.all([
        memberIds.length
          ? supabase
              .from("profiles")
              .select("*")
              .in("id", memberIds)
              .order("created_at")
          : supabase
              .from("profiles")
              .select("*")
              .eq("org_id", orgId)
              .order("created_at"),

        supabase
          .from("user_roles")
          .select("*")
          .eq("org_id", orgId),

        supabase
          .from("org_roles")
          .select("id, name")
          .eq("org_id", orgId)
          .order("name"),

        supabase
          .from("user_org_roles")
          .select("user_id, org_role_id")
          .eq("org_id", orgId),

        supabase
          .from("sop_templates")
          .select("id, name, is_active, created_at")
          .eq("org_id", orgId)
          .order("created_at", { ascending: false }),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (rolesResult.error) throw rolesResult.error;
      if (orgRolesResult.error) throw orgRolesResult.error;
      if (userOrgRolesResult.error) throw userOrgRolesResult.error;
      if (templatesResult.error) throw templatesResult.error;

      const profiles = profilesResult.data || [];
      const roles = rolesResult.data || [];
      const oRoles = orgRolesResult.data || [];
      const userOrgRoles = userOrgRolesResult.data || [];
      const templates = templatesResult.data || [];

      const roleList = oRoles as OrgRole[];

      setOrgRoles(roleList);

      const active =
        templates.find((t: any) => t.is_active) ??
        templates[0];

      setWorkflowName(active?.name ?? null);

      let stages: WorkflowStage[] = [];

      if (active) {
        const {
          data: stageData,
          error: stagesError,
        } = await supabase
          .from("sop_stages")
          .select(
            "name, primary_role_id, secondary_role_id"
          )
          .eq("template_id", active.id)
          .order("position");

        if (stagesError) {
          throw stagesError;
        }

        stages = (stageData || []) as WorkflowStage[];
      }

      /**
       * Build:
       *
       * role ID -> workflow stages assigned to that role
       */
      const stageMap: Record<string, string[]> = {};

      stages.forEach((stage) => {
        [
          stage.primary_role_id,
          stage.secondary_role_id,
        ].forEach((roleId) => {
          if (!roleId) return;

          stageMap[roleId] = [
            ...(stageMap[roleId] || []),
            stage.name,
          ];
        });
      });

      setRoleStages(stageMap);

      /**
       * Combine profiles + global roles + organization roles
       * + workflow stages.
       */
      const usersWithRoles: UserWithRoles[] = profiles.map((profile) => {
        const userRoles = roles
          .filter((r: any) => r.user_id === profile.id)
          .map((r: any) => r.role as AppRole);

        const orgRoleIds = userOrgRoles
          .filter((r: any) => r.user_id === profile.id)
          .map((r: any) => r.org_role_id as string);

        const orgRoleNames = orgRoleIds
          .map(
            (id) =>
              roleList.find((role) => role.id === id)?.name
          )
          .filter(Boolean) as string[];

        const assignedStages = stages
          .filter(
            (stage) =>
              (stage.primary_role_id &&
                orgRoleIds.includes(stage.primary_role_id)) ||
              (stage.secondary_role_id &&
                orgRoleIds.includes(stage.secondary_role_id))
          )
          .map((stage) => stage.name);

        return {
          ...profile,
          roles: userRoles,
          orgRoleIds,
          orgRoleNames,
          assignedStages,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Failed to load users:", error);

      toast.error(
        error?.message ||
          "Failed to load organization members."
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create or invite a team member.
   */
  const handleCreateUser = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!orgId) {
      toast.error(
        "Your organization could not be identified. Please refresh and try again."
      );
      return;
    }

    const email = newUser.email.trim();
    const fullName = newUser.full_name.trim();
    const roleId = newUser.role.trim();

    if (!fullName) {
      toast.error("Please enter the team member's full name.");
      return;
    }

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    if (!roleId) {
      toast.error("Please select a workflow role.");
      return;
    }

    if (!inviteMode) {
      if (!newUser.password) {
        toast.error("Please enter a password.");
        return;
      }

      if (newUser.password.length < 6) {
        toast.error(
          "Password must be at least 6 characters."
        );
        return;
      }
    }

    setCreating(true);

    try {
      console.log("Inviting/creating team member:", {
        email,
        full_name: fullName,
        org_id: orgId,
        org_role_id: roleId,
        mode: inviteMode ? "invite" : "create",
      });

      const { data, error } =
        await supabase.functions.invoke("invite-user", {
          body: {
            email,
            password: inviteMode
              ? null
              : newUser.password,
            full_name: fullName,
            org_id: orgId,
            org_role_id: roleId,
            redirect_to: `${window.location.origin}/dashboard`,
          },
        });

      /**
       * IMPORTANT:
       *
       * A non-2xx Edge Function response arrives here as
       * `error`, but the useful message is often inside
       * error.context.
       */
      if (error) {
        const message =
          await getFunctionErrorMessage(
            error,
            "The invite service rejected the request."
          );

        console.error(
          "invite-user Edge Function error:",
          error
        );

        throw new Error(message);
      }

      /**
       * Some versions of the function may return:
       *
       * { error: "..." }
       *
       * even with a successful HTTP response.
       */
      if (data?.error) {
        throw new Error(String(data.error));
      }

      console.log(
        "invite-user response:",
        data
      );

      toast.success(
        data?.mode === "invited"
          ? "Invite email sent — they'll join your team once they accept."
          : data?.mode === "linked"
            ? "Existing account added to your team."
            : "Team member added to your organization."
      );

      setShowCreate(false);

      setNewUser({
        email: "",
        password: "",
        full_name: "",
        role: "",
      });

      await fetchUsers();
    } catch (error: any) {
      console.error(
        "Failed to create/invite user:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to create or invite user."
      );
    } finally {
      setCreating(false);
    }
  };

  /**
   * Remove a user from the organization.
   */
  const handleDeleteUser = async (
    userId: string,
    userName: string
  ) => {
    if (!userId) {
      toast.error("Invalid user.");
      return;
    }

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "delete-user",
          {
            body: {
              user_id: userId,
            },
          }
        );

      if (error) {
        const message =
          await getFunctionErrorMessage(
            error,
            "The delete service rejected the request."
          );

        console.error(
          "delete-user Edge Function error:",
          error
        );

        throw new Error(message);
      }

      if (data?.error) {
        throw new Error(String(data.error));
      }

      toast.success(
        `${userName} has been removed.`
      );

      await fetchUsers();
    } catch (error: any) {
      console.error(
        "Failed to delete user:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to delete user."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            User Management
          </h1>

          <p className="text-xs text-muted-foreground sm:text-sm">
            {workflowName
              ? `Roles and steps from "${workflowName}"`
              : "Invite members and assign workflow roles"}
          </p>
        </div>

        <Button
          onClick={() =>
            setShowCreate(!showCreate)
          }
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Create / Invite form */}
      {showCreate && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">
              {inviteMode
                ? "Invite Team Member"
                : "Create New User"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <form
              onSubmit={handleCreateUser}
              className="grid gap-4 sm:grid-cols-2"
            >
              {/* Mode */}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    inviteMode
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setInviteMode(true)
                  }
                >
                  Send invite email
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={
                    !inviteMode
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setInviteMode(false)
                  }
                >
                  Set a password
                </Button>
              </div>

              {/* Full name */}
              <div className="space-y-2">
                <Label>Full Name *</Label>

                <Input
                  value={newUser.full_name}
                  onChange={(e) =>
                    setNewUser((u) => ({
                      ...u,
                      full_name:
                        e.target.value,
                    }))
                  }
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email *</Label>

                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((u) => ({
                      ...u,
                      email:
                        e.target.value,
                    }))
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Password */}
              {!inviteMode && (
                <div className="space-y-2">
                  <Label>Password *</Label>

                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((u) => ({
                        ...u,
                        password:
                          e.target.value,
                      }))
                    }
                    minLength={6}
                    required
                  />

                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters.
                  </p>
                </div>
              )}

              {/* Organization role */}
              <div className="space-y-2">
                <Label>Role *</Label>

                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser((u) => ({
                      ...u,
                      role: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        orgRoles.length
                          ? "Select role..."
                          : "No roles defined yet"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {orgRoles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                      >
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  {orgRoles.length
                    ? `Your organization's workflow roles${
                        workflowName
                          ? ` — used by "${workflowName}"`
                          : ""
                      }.`
                    : "Create roles in Admin → Roles first, then assign them here."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-end">
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
                  disabled={
                    creating ||
                    !orgId ||
                    orgRoles.length === 0
                  }
                >
                  {creating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {inviteMode
                    ? "Send Invite"
                    : "Create User"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users */}
      <Card>
        <CardContent className="p-0">
          {/* Mobile */}
          <div className="divide-y lg:hidden">
            {users.map((u) => (
              <div
                key={u.id}
                className="space-y-3 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {u.full_name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete User
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          Are you sure you want to
                          remove{" "}
                          <strong>
                            {u.full_name}
                          </strong>
                          ? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() =>
                            handleDeleteUser(
                              u.id,
                              u.full_name
                            )
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Roles */}
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Roles
                  </p>

                  <UserRoleEditor
                    userId={u.id}
                    userName={u.full_name}
                    currentRoles={u.roles}
                    onRolesUpdated={
                      fetchUsers
                    }
                    orgRoles={orgRoles}
                    currentOrgRoleIds={
                      u.orgRoleIds
                    }
                    roleStages={
                      roleStages
                    }
                    workflowName={
                      workflowName
                    }
                  />
                </div>

                {/* Workflow roles */}
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Workflow roles
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {u.orgRoleNames.length >
                    0 ? (
                      u.orgRoleNames.map(
                        (name) => (
                          <Badge
                            key={name}
                            variant="outline"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        )
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned steps */}
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Assigned steps
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {u.assignedStages
                      .length > 0 ? (
                      u.assignedStages.map(
                        (stage) => (
                          <Badge
                            key={stage}
                            className="border-accent/20 bg-accent/10 text-xs text-accent"
                          >
                            {stage}
                          </Badge>
                        )
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No steps
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No members yet.
              </p>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Roles
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Workflow Roles
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Assigned Steps
                  </th>

                  <th className="w-20 px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b align-top"
                  >
                    <td className="px-4 py-3 font-medium">
                      {u.full_name}
                    </td>

                    <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">
                      {u.email}
                    </td>

                    <td className="px-4 py-3">
                      <UserRoleEditor
                        userId={u.id}
                        userName={
                          u.full_name
                        }
                        currentRoles={
                          u.roles
                        }
                        onRolesUpdated={
                          fetchUsers
                        }
                        orgRoles={
                          orgRoles
                        }
                        currentOrgRoleIds={
                          u.orgRoleIds
                        }
                        roleStages={
                          roleStages
                        }
                        workflowName={
                          workflowName
                        }
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.orgRoleNames
                          .length > 0 ? (
                          u.orgRoleNames.map(
                            (name) => (
                              <Badge
                                key={name}
                                variant="outline"
                                className="text-xs"
                              >
                                {name}
                              </Badge>
                            )
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.assignedStages
                          .length > 0 ? (
                          u.assignedStages.map(
                            (stage) => (
                              <Badge
                                key={stage}
                                className="border-accent/20 bg-accent/10 text-xs text-accent"
                              >
                                {stage}
                              </Badge>
                            )
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No steps
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete User
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              Are you sure you want to
                              remove{" "}
                              <strong>
                                {u.full_name}
                              </strong>
                              ? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() =>
                                handleDeleteUser(
                                  u.id,
                                  u.full_name
                                )
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RoleAuditTrail />
    </div>
  );
}