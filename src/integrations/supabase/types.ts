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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      compliance_documents: {
        Row: {
          category: string | null
          completed_date: string | null
          created_at: string
          document_name: string
          document_type: string
          due_date: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          notes: string | null
          shipment_id: string
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completed_date?: string | null
          created_at?: string
          document_name: string
          document_type: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          shipment_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completed_date?: string | null
          created_at?: string
          document_name?: string
          document_type?: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          shipment_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "compliance_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_permits: {
        Row: {
          application_date: string | null
          approval_date: string | null
          created_at: string
          document_url: string | null
          expiration_date: string | null
          id: string
          is_required: boolean | null
          issuing_authority: string
          jurisdiction: Database["public"]["Enums"]["jurisdiction_type"]
          metadata: Json | null
          notes: string | null
          permit_name: string
          permit_type: string
          reference_number: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["permit_status"]
          updated_at: string
        }
        Insert: {
          application_date?: string | null
          approval_date?: string | null
          created_at?: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          is_required?: boolean | null
          issuing_authority: string
          jurisdiction: Database["public"]["Enums"]["jurisdiction_type"]
          metadata?: Json | null
          notes?: string | null
          permit_name: string
          permit_type: string
          reference_number?: string | null
          shipment_id: string
          status?: Database["public"]["Enums"]["permit_status"]
          updated_at?: string
        }
        Update: {
          application_date?: string | null
          approval_date?: string | null
          created_at?: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          is_required?: boolean | null
          issuing_authority?: string
          jurisdiction?: Database["public"]["Enums"]["jurisdiction_type"]
          metadata?: Json | null
          notes?: string | null
          permit_name?: string
          permit_type?: string
          reference_number?: string | null
          shipment_id?: string
          status?: Database["public"]["Enums"]["permit_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_permits_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "compliance_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_phase_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          notes: string | null
          performed_by: string | null
          phase: Database["public"]["Enums"]["shipment_phase"]
          shipment_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by?: string | null
          phase: Database["public"]["Enums"]["shipment_phase"]
          shipment_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by?: string | null
          phase?: Database["public"]["Enums"]["shipment_phase"]
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_phase_logs_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "compliance_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_risks: {
        Row: {
          created_at: string
          id: string
          impact: string
          likelihood: string
          metadata: Json | null
          mitigation_status: string | null
          mitigation_strategy: string | null
          owner: string | null
          risk_category: string
          risk_description: string
          shipment_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          impact?: string
          likelihood?: string
          metadata?: Json | null
          mitigation_status?: string | null
          mitigation_strategy?: string | null
          owner?: string | null
          risk_category: string
          risk_description: string
          shipment_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          impact?: string
          likelihood?: string
          metadata?: Json | null
          mitigation_status?: string | null
          mitigation_strategy?: string | null
          owner?: string | null
          risk_category?: string
          risk_description?: string
          shipment_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_risks_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "compliance_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_shipments: {
        Row: {
          actual_ship_date: string | null
          batch_id: string | null
          created_at: string
          current_phase: Database["public"]["Enums"]["shipment_phase"]
          description: string | null
          destination_country: string
          destination_entity: string | null
          estimated_value: number | null
          id: string
          linked_transaction_id: string | null
          metadata: Json | null
          origin_country: string
          origin_state: string
          phase_started_at: string | null
          product_type: string
          quantity: string | null
          shipment_reference: string
          status: string
          target_ship_date: string | null
          thc_concentration: number | null
          updated_at: string
          use_case: string
        }
        Insert: {
          actual_ship_date?: string | null
          batch_id?: string | null
          created_at?: string
          current_phase?: Database["public"]["Enums"]["shipment_phase"]
          description?: string | null
          destination_country: string
          destination_entity?: string | null
          estimated_value?: number | null
          id?: string
          linked_transaction_id?: string | null
          metadata?: Json | null
          origin_country?: string
          origin_state: string
          phase_started_at?: string | null
          product_type: string
          quantity?: string | null
          shipment_reference: string
          status?: string
          target_ship_date?: string | null
          thc_concentration?: number | null
          updated_at?: string
          use_case: string
        }
        Update: {
          actual_ship_date?: string | null
          batch_id?: string | null
          created_at?: string
          current_phase?: Database["public"]["Enums"]["shipment_phase"]
          description?: string | null
          destination_country?: string
          destination_entity?: string | null
          estimated_value?: number | null
          id?: string
          linked_transaction_id?: string | null
          metadata?: Json | null
          origin_country?: string
          origin_state?: string
          phase_started_at?: string | null
          product_type?: string
          quantity?: string | null
          shipment_reference?: string
          status?: string
          target_ship_date?: string | null
          thc_concentration?: number | null
          updated_at?: string
          use_case?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_shipments_linked_transaction_id_fkey"
            columns: ["linked_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_stakeholders: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          jurisdiction: string | null
          metadata: Json | null
          organization_name: string
          role_description: string | null
          shipment_id: string
          stakeholder_type: Database["public"]["Enums"]["stakeholder_type"]
          status: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          jurisdiction?: string | null
          metadata?: Json | null
          organization_name: string
          role_description?: string | null
          shipment_id: string
          stakeholder_type: Database["public"]["Enums"]["stakeholder_type"]
          status?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          jurisdiction?: string | null
          metadata?: Json | null
          organization_name?: string
          role_description?: string | null
          shipment_id?: string
          stakeholder_type?: Database["public"]["Enums"]["stakeholder_type"]
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_stakeholders_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "compliance_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      configuration_orders: {
        Row: {
          accessories: string[] | null
          base_price: number
          created_at: string
          customer_email: string
          customer_name: string | null
          id: string
          led_color: string
          pdf_url: string | null
          render_urls: string[] | null
          status: string | null
          stripe_session_id: string | null
          surface_finish: string
          total_price: number
          updated_at: string
        }
        Insert: {
          accessories?: string[] | null
          base_price?: number
          created_at?: string
          customer_email: string
          customer_name?: string | null
          id?: string
          led_color: string
          pdf_url?: string | null
          render_urls?: string[] | null
          status?: string | null
          stripe_session_id?: string | null
          surface_finish: string
          total_price: number
          updated_at?: string
        }
        Update: {
          accessories?: string[] | null
          base_price?: number
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          led_color?: string
          pdf_url?: string | null
          render_urls?: string[] | null
          status?: string | null
          stripe_session_id?: string | null
          surface_finish?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          policy_reference: string
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          policy_reference: string
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          policy_reference?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      honeypot_logs: {
        Row: {
          attempted_password: string | null
          attempted_username: string | null
          created_at: string
          id: string
          interaction_type: string
          ip_hint: string | null
          metadata: Json | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          attempted_password?: string | null
          attempted_username?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          ip_hint?: string | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          attempted_password?: string | null
          attempted_username?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          ip_hint?: string | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      investor_contacts: {
        Row: {
          created_at: string | null
          email: string
          firm: string | null
          id: string
          investment_interest: string
          message: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          firm?: string | null
          id?: string
          investment_interest: string
          message?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          firm?: string | null
          id?: string
          investment_interest?: string
          message?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nesting_sites: {
        Row: {
          chicks: number | null
          created_at: string
          eggs: number | null
          id: string
          last_check: string | null
          latitude: number
          longitude: number
          name: string
          observer_notes: string | null
          site_id: string
          status: string
          threat_level: string | null
          updated_at: string
        }
        Insert: {
          chicks?: number | null
          created_at?: string
          eggs?: number | null
          id?: string
          last_check?: string | null
          latitude: number
          longitude: number
          name: string
          observer_notes?: string | null
          site_id: string
          status?: string
          threat_level?: string | null
          updated_at?: string
        }
        Update: {
          chicks?: number | null
          created_at?: string
          eggs?: number | null
          id?: string
          last_check?: string | null
          latitude?: number
          longitude?: number
          name?: string
          observer_notes?: string | null
          site_id?: string
          status?: string
          threat_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string | null
          status: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          source?: string | null
          status?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          source?: string | null
          status?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      pilot_applications: {
        Row: {
          budget_range: string | null
          company_name: string
          company_size: string
          contact_email: string
          contact_name: string
          contact_title: string | null
          created_at: string
          current_solution: string | null
          desired_timeline: string
          id: string
          industry: string
          notes: string | null
          priority: string | null
          status: string | null
          updated_at: string
          use_case: string
          use_case_details: string | null
        }
        Insert: {
          budget_range?: string | null
          company_name: string
          company_size: string
          contact_email: string
          contact_name: string
          contact_title?: string | null
          created_at?: string
          current_solution?: string | null
          desired_timeline: string
          id?: string
          industry: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
          use_case: string
          use_case_details?: string | null
        }
        Update: {
          budget_range?: string | null
          company_name?: string
          company_size?: string
          contact_email?: string
          contact_name?: string
          contact_title?: string | null
          created_at?: string
          current_solution?: string | null
          desired_timeline?: string
          id?: string
          industry?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
          use_case?: string
          use_case_details?: string | null
        }
        Relationships: []
      }
      scheduled_emails: {
        Row: {
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          payload: Json
          recipient_email: string
          recipient_name: string | null
          scheduled_at: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          payload: Json
          recipient_email: string
          recipient_name?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          payload?: Json
          recipient_email?: string
          recipient_name?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sourced_products: {
        Row: {
          approved_for_listing: boolean | null
          category: string | null
          cost_price: number
          crawl_session_id: string | null
          created_at: string
          description: string
          gross_margin: number | null
          id: string
          image_urls: string[] | null
          in_stock: boolean | null
          lovable_margin_percent: number | null
          notes: string | null
          original_source_url: string
          product_name: string
          scraped_at: string | null
          scraped_raw_content: string | null
          ships_to: string[] | null
          sourcing_confidence: number | null
          status: string | null
          stock_status: string | null
          suggested_retail_price: number
          supplier_name: string | null
          supplier_rating: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          approved_for_listing?: boolean | null
          category?: string | null
          cost_price: number
          crawl_session_id?: string | null
          created_at?: string
          description: string
          gross_margin?: number | null
          id?: string
          image_urls?: string[] | null
          in_stock?: boolean | null
          lovable_margin_percent?: number | null
          notes?: string | null
          original_source_url: string
          product_name: string
          scraped_at?: string | null
          scraped_raw_content?: string | null
          ships_to?: string[] | null
          sourcing_confidence?: number | null
          status?: string | null
          stock_status?: string | null
          suggested_retail_price: number
          supplier_name?: string | null
          supplier_rating?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          approved_for_listing?: boolean | null
          category?: string | null
          cost_price?: number
          crawl_session_id?: string | null
          created_at?: string
          description?: string
          gross_margin?: number | null
          id?: string
          image_urls?: string[] | null
          in_stock?: boolean | null
          lovable_margin_percent?: number | null
          notes?: string | null
          original_source_url?: string
          product_name?: string
          scraped_at?: string | null
          scraped_raw_content?: string | null
          ships_to?: string[] | null
          sourcing_confidence?: number | null
          status?: string | null
          stock_status?: string | null
          suggested_retail_price?: number
          supplier_name?: string | null
          supplier_rating?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      strata_access: {
        Row: {
          amount_paid: number | null
          created_at: string
          email: string
          granted_at: string | null
          id: string
          location_count: number
          payment_status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          email: string
          granted_at?: string | null
          id?: string
          location_count?: number
          payment_status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          email?: string
          granted_at?: string | null
          id?: string
          location_count?: number
          payment_status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visa_applications: {
        Row: {
          application_date: string | null
          created_at: string | null
          current_phase: string | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_date?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_date?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visa_documents: {
        Row: {
          application_id: string | null
          created_at: string | null
          document_name: string
          document_type: string
          due_date: string | null
          file_url: string | null
          id: string
          notes: string | null
          status: string | null
          submitted_date: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_date?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          due_date?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_interviews: {
        Row: {
          agenda: string | null
          application_id: string | null
          created_at: string | null
          id: string
          interview_type: string | null
          location: string | null
          next_actions: string[] | null
          notes: string | null
          outcome: string | null
          scheduled_date: string | null
          status: string | null
        }
        Insert: {
          agenda?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          interview_type?: string | null
          location?: string | null
          next_actions?: string[] | null
          notes?: string | null
          outcome?: string | null
          scheduled_date?: string | null
          status?: string | null
        }
        Update: {
          agenda?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          interview_type?: string | null
          location?: string | null
          next_actions?: string[] | null
          notes?: string | null
          outcome?: string | null
          scheduled_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_milestones: {
        Row: {
          application_id: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          id: string
          milestone_type: string
          status: string | null
          target_date: string | null
          title: string
        }
        Insert: {
          application_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          milestone_type: string
          status?: string | null
          target_date?: string | null
          title: string
        }
        Update: {
          application_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          milestone_type?: string
          status?: string | null
          target_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_milestones_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "visa_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_coordinate_logs: {
        Row: {
          created_at: string
          id: string
          latitude: number
          location_name: string | null
          longitude: number
          page_source: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          latitude: number
          location_name?: string | null
          longitude: number
          page_source?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          location_name?: string | null
          longitude?: number
          page_source?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      lovable_listings: {
        Row: {
          approved_for_listing: boolean | null
          category: string | null
          cost_price: number | null
          crawl_session_id: string | null
          created_at: string | null
          description: string | null
          gross_margin: number | null
          id: string | null
          image_urls: string[] | null
          in_stock: boolean | null
          lovable_margin_percent: number | null
          notes: string | null
          original_source_url: string | null
          product_name: string | null
          scraped_at: string | null
          scraped_raw_content: string | null
          ships_to: string[] | null
          sourcing_confidence: number | null
          status: string | null
          stock_status: string | null
          suggested_retail_price: number | null
          supplier_name: string | null
          supplier_rating: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          approved_for_listing?: boolean | null
          category?: string | null
          cost_price?: number | null
          crawl_session_id?: string | null
          created_at?: string | null
          description?: string | null
          gross_margin?: number | null
          id?: string | null
          image_urls?: string[] | null
          in_stock?: boolean | null
          lovable_margin_percent?: number | null
          notes?: string | null
          original_source_url?: string | null
          product_name?: string | null
          scraped_at?: string | null
          scraped_raw_content?: string | null
          ships_to?: string[] | null
          sourcing_confidence?: number | null
          status?: string | null
          stock_status?: string | null
          suggested_retail_price?: number | null
          supplier_name?: string | null
          supplier_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          approved_for_listing?: boolean | null
          category?: string | null
          cost_price?: number | null
          crawl_session_id?: string | null
          created_at?: string | null
          description?: string | null
          gross_margin?: number | null
          id?: string | null
          image_urls?: string[] | null
          in_stock?: boolean | null
          lovable_margin_percent?: number | null
          notes?: string | null
          original_source_url?: string | null
          product_name?: string | null
          scraped_at?: string | null
          scraped_raw_content?: string | null
          ships_to?: string[] | null
          sourcing_confidence?: number | null
          status?: string | null
          stock_status?: string | null
          suggested_retail_price?: number | null
          supplier_name?: string | null
          supplier_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      jurisdiction_type:
        | "us_federal"
        | "us_state"
        | "destination_country"
        | "international"
      permit_status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "approved"
        | "denied"
        | "expired"
      shipment_phase:
        | "legal_clearance"
        | "regulatory_approvals"
        | "contracts_compliance"
        | "logistics_engagement"
        | "cross_border_transport"
        | "post_delivery"
      stakeholder_type:
        | "regulator"
        | "legal_counsel"
        | "logistics"
        | "clinical"
        | "customs"
        | "lab"
      transaction_status: "Completed" | "Pending" | "Failed"
      transaction_type: "Premium" | "Claim" | "Adjustment" | "Rebate"
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
      app_role: ["admin", "user"],
      jurisdiction_type: [
        "us_federal",
        "us_state",
        "destination_country",
        "international",
      ],
      permit_status: [
        "not_started",
        "in_progress",
        "submitted",
        "approved",
        "denied",
        "expired",
      ],
      shipment_phase: [
        "legal_clearance",
        "regulatory_approvals",
        "contracts_compliance",
        "logistics_engagement",
        "cross_border_transport",
        "post_delivery",
      ],
      stakeholder_type: [
        "regulator",
        "legal_counsel",
        "logistics",
        "clinical",
        "customs",
        "lab",
      ],
      transaction_status: ["Completed", "Pending", "Failed"],
      transaction_type: ["Premium", "Claim", "Adjustment", "Rebate"],
    },
  },
} as const
