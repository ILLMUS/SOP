import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import NewJob from "@/pages/NewJob";
import JobDetail from "@/pages/JobDetail";
import AdminUsers from "@/pages/AdminUsers";
import AdminAssignments from "@/pages/AdminAssignments";
import AdminSopBuilder from "@/pages/AdminSopBuilder";
import AdminRoles from "@/pages/AdminRoles";
import Configuration from "@/pages/admin/Configuration";
import Integrations from "@/pages/admin/Integrations";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import TrackJob from "@/pages/TrackJob";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import Outreach from "@/pages/modules/Outreach";
import Sales from "@/pages/modules/Sales";
import Operations from "@/pages/modules/Operations";
import Clients from "@/pages/modules/Clients";
import Finance from "@/pages/modules/Finance";
import Accounts from "@/pages/crm/Accounts";
import AccountDetail from "@/pages/crm/AccountDetail";
import CrmContacts from "@/pages/crm/Contacts";
import CrmLeads from "@/pages/crm/Leads";
import CrmOpportunities from "@/pages/crm/Opportunities";
import CrmDeals from "@/pages/crm/Deals";
import CrmActivities from "@/pages/crm/Activities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/track" element={<TrackJob />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Home />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/outreach" element={<Outreach />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/crm/accounts" element={<Accounts />} />
              <Route path="/crm/accounts/:id" element={<AccountDetail />} />
              <Route path="/crm/contacts" element={<CrmContacts />} />
              <Route path="/crm/leads" element={<CrmLeads />} />
              <Route path="/crm/opportunities" element={<CrmOpportunities />} />
              <Route path="/crm/deals" element={<CrmDeals />} />
              <Route path="/crm/activities" element={<CrmActivities />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/new" element={<NewJob />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/assignments" element={<AdminAssignments />} />
              <Route path="/admin/sop" element={<AdminSopBuilder />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/configuration" element={<Configuration />} />
              <Route path="/admin/integrations" element={<Integrations />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
