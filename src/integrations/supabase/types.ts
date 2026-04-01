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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          message: string
          priority: string
          roles: string[]
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          message: string
          priority?: string
          roles?: string[]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          message?: string
          priority?: string
          roles?: string[]
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          student_name: string
          subject_name: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          marked_by: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          student_name: string
          subject_name: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          student_name?: string
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          anonymous: boolean
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          priority: Database["public"]["Enums"]["complaint_priority"]
          status: Database["public"]["Enums"]["complaint_status"]
          title: string
          tracking_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          anonymous?: boolean
          category?: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          priority?: Database["public"]["Enums"]["complaint_priority"]
          status?: Database["public"]["Enums"]["complaint_status"]
          title: string
          tracking_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          anonymous?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          priority?: Database["public"]["Enums"]["complaint_priority"]
          status?: Database["public"]["Enums"]["complaint_status"]
          title?: string
          tracking_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fees: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          paid: number
          pending: number
          semester: string | null
          status: Database["public"]["Enums"]["fee_status"]
          student_id: string
          student_name: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          paid?: number
          pending?: number
          semester?: string | null
          status?: Database["public"]["Enums"]["fee_status"]
          student_id: string
          student_name: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          paid?: number
          pending?: number
          semester?: string | null
          status?: Database["public"]["Enums"]["fee_status"]
          student_id?: string
          student_name?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          created_at: string
          description: string
          generated_by: string
          id: string
          severity: Database["public"]["Enums"]["incident_severity"]
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          generated_by: string
          id?: string
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          generated_by?: string
          id?: string
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      login_logs: {
        Row: {
          created_at: string
          device: string
          id: string
          ip: string
          risk_level: string
          risk_score: number
          success: boolean
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string
          device: string
          id?: string
          ip: string
          risk_level?: string
          risk_score?: number
          success?: boolean
          user_id?: string | null
          user_name: string
        }
        Update: {
          created_at?: string
          device?: string
          id?: string
          ip?: string
          risk_level?: string
          risk_score?: number
          success?: boolean
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          department: string
          email: string
          enrollment_no: string
          gpa: number
          id: string
          name: string
          parent_user_id: string | null
          semester: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          enrollment_no: string
          gpa?: number
          id?: string
          name: string
          parent_user_id?: string | null
          semester?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          enrollment_no?: string
          gpa?: number
          id?: string
          name?: string
          parent_user_id?: string | null
          semester?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      app_role: "admin" | "staff" | "student" | "parent"
      attendance_status: "present" | "absent" | "late"
      complaint_priority: "low" | "medium" | "high"
      complaint_status: "open" | "in_progress" | "resolved" | "escalated"
      fee_status: "paid" | "partial" | "pending" | "overdue"
      incident_severity: "low" | "medium" | "high"
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
      app_role: ["admin", "staff", "student", "parent"],
      attendance_status: ["present", "absent", "late"],
      complaint_priority: ["low", "medium", "high"],
      complaint_status: ["open", "in_progress", "resolved", "escalated"],
      fee_status: ["paid", "partial", "pending", "overdue"],
      incident_severity: ["low", "medium", "high"],
    },
  },
} as const
