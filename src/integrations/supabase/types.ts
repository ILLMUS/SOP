export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          label: string
          last_used_at: string | null
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          label?: string
          last_used_at?: string | null
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          label?: string
          last_used_at?: string | null
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          job_id: string | null
          org_id: string | null
          stage: Database["public"]["Enums"]["job_stage"] | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          job_id?: string | null
          org_id?: string | null
          stage?: Database["public"]["Enums"]["job_stage"] | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          job_id?: string | null
          org_id?: string | null
          stage?: Database["public"]["Enums"]["job_stage"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_logs: {
        Row: {
          battery_end: number | null
          battery_start: number | null
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          flight_path: Json | null
          id: string
          job_id: string
          notes: string | null
          pilot_id: string
          started_at: string
          updated_at: string
        }
        Insert: {
          battery_end?: number | null
          battery_start?: number | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          flight_path?: Json | null
          id?: string
          job_id: string
          notes?: string | null
          pilot_id: string
          started_at: string
          updated_at?: string
        }
        Update: {
          battery_end?: number | null
          battery_start?: number | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          flight_path?: Json | null
          id?: string
          job_id?: string
          notes?: string | null
          pilot_id?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          job_id: string
          method: string | null
          notes: string | null
          paid_at: string
          payment_type: string
          proof_url: string | null
          recorded_by: string
          reference: string | null
          updated_at: string
          variation_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          job_id: string
          method?: string | null
          notes?: string | null
          paid_at: string
          payment_type: string
          proof_url?: string | null
          recorded_by: string
          reference?: string | null
          updated_at?: string
          variation_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          job_id?: string
          method?: string | null
          notes?: string | null
          paid_at?: string
          payment_type?: string
          proof_url?: string | null
          recorded_by?: string
          reference?: string | null
          updated_at?: string
          variation_id?: string | null
        }
        Relationships: []
      }
      job_stages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          form_data: Json | null
          id: string
          job_id: string
          notes: string | null
          position: number
          primary_owner_id: string | null
          rejection_reason: string | null
          secondary_owner_id: string | null
          sla_deadline_hours: number | null
          sla_started_at: string | null
          sop_stage_id: string | null
          stage: Database["public"]["Enums"]["job_stage"] | null
          stage_name: string | null
          status: Database["public"]["Enums"]["stage_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          form_data?: Json | null
          id?: string
          job_id: string
          notes?: string | null
          position?: number
          primary_owner_id?: string | null
          rejection_reason?: string | null
          secondary_owner_id?: string | null
          sla_deadline_hours?: number | null
          sla_started_at?: string | null
          sop_stage_id?: string | null
          stage?: Database["public"]["Enums"]["job_stage"] | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["stage_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          form_data?: Json | null
          id?: string
          job_id?: string
          notes?: string | null
          position?: number
          primary_owner_id?: string | null
          rejection_reason?: string | null
          secondary_owner_id?: string | null
          sla_deadline_hours?: number | null
          sla_started_at?: string | null
          sop_stage_id?: string | null
          stage?: Database["public"]["Enums"]["job_stage"] | null
          stage_name?: string | null
          status?: Database["public"]["Enums"]["stage_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_stages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_stages_sop_stage_id_fkey"
            columns: ["sop_stage_id"]
            isOneToOne: false
            referencedRelation: "sop_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_variations: {
        Row: {
          amount: number
          approved_by: string | null
          client_decision_at: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          job_id: string
          rejection_reason: string | null
          status: string
          updated_at: string
          variation_number: number
        }
        Insert: {
          amount?: number
          approved_by?: string | null
          client_decision_at?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          job_id: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          variation_number: number
        }
        Update: {
          amount?: number
          approved_by?: string | null
          client_decision_at?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          job_id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          variation_number?: number
        }
        Relationships: []
      }
      jobs: {
        Row: {
          client_email: string | null
          client_location: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string
          current_sop_stage_id: string | null
          current_stage: Database["public"]["Enums"]["job_stage"]
          farm_size_ha: number | null
          field_boundary: Json | null
          id: string
          job_category: string
          job_number: string
          org_id: string
          service_type: string | null
          status: Database["public"]["Enums"]["job_status"]
          template_id: string | null
          template_version: number | null
          tracking_token: string | null
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          client_location?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by: string
          current_sop_stage_id?: string | null
          current_stage?: Database["public"]["Enums"]["job_stage"]
          farm_size_ha?: number | null
          field_boundary?: Json | null
          id?: string
          job_category?: string
          job_number: string
          org_id: string
          service_type?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          template_id?: string | null
          template_version?: number | null
          tracking_token?: string | null
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          client_location?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string
          current_sop_stage_id?: string | null
          current_stage?: Database["public"]["Enums"]["job_stage"]
          farm_size_ha?: number | null
          field_boundary?: Json | null
          id?: string
          job_category?: string
          job_number?: string
          org_id?: string
          service_type?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          template_id?: string | null
          template_version?: number | null
          tracking_token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_current_sop_stage_id_fkey"
            columns: ["current_sop_stage_id"]
            isOneToOne: false
            referencedRelation: "sop_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "sop_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          job_id: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          job_id?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          job_id?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      org_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_admin: boolean
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_admin?: boolean
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          brand_color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          employee_count: string | null
          id: string
          industry: string | null
          job_prefix: string
          location: string | null
          logo_url: string | null
          main_services: string | null
          name: string
          onboarding_completed: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          brand_color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: string | null
          id?: string
          industry?: string | null
          job_prefix?: string
          location?: string | null
          logo_url?: string | null
          main_services?: string | null
          name: string
          onboarding_completed?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          brand_color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: string | null
          id?: string
          industry?: string | null
          job_prefix?: string
          location?: string | null
          logo_url?: string | null
          main_services?: string | null
          name?: string
          onboarding_completed?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_flight_logs: {
        Row: {
          completed_by: string
          created_at: string
          data_submitted: boolean
          equipment_cleaned: boolean
          id: string
          inspection_notes: string | null
          inspection_passed: boolean
          job_id: string
          updated_at: string
        }
        Insert: {
          completed_by: string
          created_at?: string
          data_submitted?: boolean
          equipment_cleaned?: boolean
          id?: string
          inspection_notes?: string | null
          inspection_passed?: boolean
          job_id: string
          updated_at?: string
        }
        Update: {
          completed_by?: string
          created_at?: string
          data_submitted?: boolean
          equipment_cleaned?: boolean
          id?: string
          inspection_notes?: string | null
          inspection_passed?: boolean
          job_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pre_flight_checks: {
        Row: {
          battery_pct: number | null
          calibration_ok: boolean
          created_at: string
          drone_ok: boolean
          id: string
          job_id: string
          manager_approved_at: string | null
          manager_approved_by: string | null
          notes: string | null
          performed_by: string
          spray_system_ok: boolean
          updated_at: string
          weather_notes: string | null
          weather_ok: boolean
        }
        Insert: {
          battery_pct?: number | null
          calibration_ok?: boolean
          created_at?: string
          drone_ok?: boolean
          id?: string
          job_id: string
          manager_approved_at?: string | null
          manager_approved_by?: string | null
          notes?: string | null
          performed_by: string
          spray_system_ok?: boolean
          updated_at?: string
          weather_notes?: string | null
          weather_ok?: boolean
        }
        Update: {
          battery_pct?: number | null
          calibration_ok?: boolean
          created_at?: string
          drone_ok?: boolean
          id?: string
          job_id?: string
          manager_approved_at?: string | null
          manager_approved_by?: string | null
          notes?: string | null
          performed_by?: string
          spray_system_ok?: boolean
          updated_at?: string
          weather_notes?: string | null
          weather_ok?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          org_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          org_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          org_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_drawings: {
        Row: {
          approved_by: string | null
          client_approved_at: string | null
          client_approver_name: string | null
          created_at: string
          file_url: string
          id: string
          job_id: string
          notes: string | null
          rejection_reason: string | null
          revision: number
          status: string
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          approved_by?: string | null
          client_approved_at?: string | null
          client_approver_name?: string | null
          created_at?: string
          file_url: string
          id?: string
          job_id: string
          notes?: string | null
          rejection_reason?: string | null
          revision?: number
          status?: string
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          approved_by?: string | null
          client_approved_at?: string | null
          client_approver_name?: string | null
          created_at?: string
          file_url?: string
          id?: string
          job_id?: string
          notes?: string | null
          rejection_reason?: string | null
          revision?: number
          status?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      sla_defaults: {
        Row: {
          deadline_hours: number
          id: string
          org_id: string
          stage: Database["public"]["Enums"]["job_stage"]
          updated_at: string
        }
        Insert: {
          deadline_hours?: number
          id?: string
          org_id: string
          stage: Database["public"]["Enums"]["job_stage"]
          updated_at?: string
        }
        Update: {
          deadline_hours?: number
          id?: string
          org_id?: string
          stage?: Database["public"]["Enums"]["job_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_defaults_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sop_fields: {
        Row: {
          created_at: string
          field_key: string
          field_type: string
          help_text: string | null
          id: string
          label: string
          options: Json
          org_id: string
          placeholder: string | null
          position: number
          required: boolean
          stage_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_type?: string
          help_text?: string | null
          id?: string
          label: string
          options?: Json
          org_id: string
          placeholder?: string | null
          position?: number
          required?: boolean
          stage_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_type?: string
          help_text?: string | null
          id?: string
          label?: string
          options?: Json
          org_id?: string
          placeholder?: string | null
          position?: number
          required?: boolean
          stage_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sop_fields_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sop_fields_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "sop_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      sop_stages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          org_id: string
          position: number
          primary_role_id: string | null
          requires_approval: boolean
          secondary_role_id: string | null
          sla_hours: number
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          position?: number
          primary_role_id?: string | null
          requires_approval?: boolean
          secondary_role_id?: string | null
          sla_hours?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          position?: number
          primary_role_id?: string | null
          requires_approval?: boolean
          secondary_role_id?: string | null
          sla_hours?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sop_stages_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sop_stages_primary_role_id_fkey"
            columns: ["primary_role_id"]
            isOneToOne: false
            referencedRelation: "org_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sop_stages_secondary_role_id_fkey"
            columns: ["secondary_role_id"]
            isOneToOne: false
            referencedRelation: "org_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sop_stages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "sop_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sop_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          industry: string | null
          is_active: boolean
          is_locked: boolean
          is_published: boolean
          name: string
          org_id: string
          parent_template_id: string | null
          root_template_id: string | null
          updated_at: string
          version: number
          version_notes: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_locked?: boolean
          is_published?: boolean
          name: string
          org_id: string
          parent_template_id?: string | null
          root_template_id?: string | null
          updated_at?: string
          version?: number
          version_notes?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_locked?: boolean
          is_published?: boolean
          name?: string
          org_id?: string
          parent_template_id?: string | null
          root_template_id?: string | null
          updated_at?: string
          version?: number
          version_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sop_templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      spray_logs: {
        Row: {
          applied_at: string
          area_covered_ha: number
          chemical_used: string
          created_at: string
          id: string
          job_id: string
          notes: string | null
          pilot_id: string
          quantity_l: number
          updated_at: string
        }
        Insert: {
          applied_at?: string
          area_covered_ha: number
          chemical_used: string
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          pilot_id: string
          quantity_l: number
          updated_at?: string
        }
        Update: {
          applied_at?: string
          area_covered_ha?: number
          chemical_used?: string
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          pilot_id?: string
          quantity_l?: number
          updated_at?: string
        }
        Relationships: []
      }
      stage_assignments: {
        Row: {
          created_at: string
          id: string
          org_id: string
          primary_role: Database["public"]["Enums"]["app_role"]
          secondary_role: Database["public"]["Enums"]["app_role"] | null
          stage: Database["public"]["Enums"]["job_stage"]
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          primary_role: Database["public"]["Enums"]["app_role"]
          secondary_role?: Database["public"]["Enums"]["app_role"] | null
          stage: Database["public"]["Enums"]["job_stage"]
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          primary_role?: Database["public"]["Enums"]["app_role"]
          secondary_role?: Database["public"]["Enums"]["app_role"] | null
          stage?: Database["public"]["Enums"]["job_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "stage_assignments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_org_roles: {
        Row: {
          created_at: string
          id: string
          org_id: string
          org_role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          org_role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          org_role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_org_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_org_roles_org_role_id_fkey"
            columns: ["org_role_id"]
            isOneToOne: false
            referencedRelation: "org_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      active_org_id: { Args: never; Returns: string }
      can_access_job: { Args: { _job_id: string }; Returns: boolean }
      create_job_from_template: {
        Args: {
          _client_email?: string
          _client_location?: string
          _client_name: string
          _client_phone?: string
          _service_type?: string
          _template_id: string
        }
        Returns: string
      }
      create_organization: {
        Args: { _job_prefix?: string; _name: string }
        Returns: string
      }
      create_template_version: {
        Args: { _notes?: string; _template_id: string }
        Returns: string
      }
      get_job_by_tracking_token: { Args: { _token: string }; Returns: Json }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_org_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_owner: { Args: { _user_id: string }; Returns: boolean }
      is_org_admin: { Args: { _org_id: string }; Returns: boolean }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
      job_org_id: { Args: { _job_id: string }; Returns: string }
      setup_workspace: {
        Args: {
          _description?: string
          _employee_count?: string
          _industry?: string
          _job_prefix?: string
          _location?: string
          _main_services?: string
          _name: string
          _roles?: string[]
          _steps?: string[]
          _workflow_name?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "lead_handler"
        | "site_assessor"
        | "estimator"
        | "quotation_officer"
        | "workshop_manager"
        | "fabrication_team"
        | "installation_team"
        | "accounts_admin"
        | "owner_director"
        | "drone_pilot"
        | "operations_manager"
        | "client_manager"
      job_stage:
        | "lead_entry"
        | "lead_qualification"
        | "site_visit_authorization"
        | "site_assessment"
        | "job_scoping"
        | "costing"
        | "quotation_preparation"
        | "quote_submission"
        | "client_approval"
        | "fabrication_order"
        | "fabrication_installation"
        | "project_closure"
        | "pre_flight_check"
        | "flight_execution"
        | "post_flight_log"
        | "invoicing"
      job_status: "active" | "completed" | "on_hold" | "cancelled"
      stage_status:
        | "locked"
        | "active"
        | "pending_approval"
        | "approved"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "lead_handler",
        "site_assessor",
        "estimator",
        "quotation_officer",
        "workshop_manager",
        "fabrication_team",
        "installation_team",
        "accounts_admin",
        "owner_director",
        "drone_pilot",
        "operations_manager",
        "client_manager",
      ],
      job_stage: [
        "lead_entry",
        "lead_qualification",
        "site_visit_authorization",
        "site_assessment",
        "job_scoping",
        "costing",
        "quotation_preparation",
        "quote_submission",
        "client_approval",
        "fabrication_order",
        "fabrication_installation",
        "project_closure",
        "pre_flight_check",
        "flight_execution",
        "post_flight_log",
        "invoicing",
      ],
      job_status: ["active", "completed", "on_hold", "cancelled"],
      stage_status: [
        "locked",
        "active",
        "pending_approval",
        "approved",
        "rejected",
      ],
    },
  },
} as const
