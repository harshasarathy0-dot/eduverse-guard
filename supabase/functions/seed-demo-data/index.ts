import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "@supabase/supabase-js/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const demoUsers = [
      { email: "admin@eduverse.com", password: "admin123", name: "Admin User", role: "admin" as const },
      { email: "sarah@eduverse.com", password: "staff123", name: "Dr. Sarah Chen", role: "staff" as const },
      { email: "james@eduverse.com", password: "student123", name: "James Wilson", role: "student" as const },
      { email: "robert@eduverse.com", password: "parent123", name: "Robert Wilson", role: "parent" as const },
    ];

    const results = [];

    for (const u of demoUsers) {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name },
      });

      if (authError) {
        // User might already exist
        if (authError.message?.includes("already been registered")) {
          // Get existing user
          const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
          const existing = users?.find(eu => eu.email === u.email);
          if (existing) {
            // Ensure role exists
            await supabaseAdmin.from("user_roles").upsert(
              { user_id: existing.id, role: u.role },
              { onConflict: "user_id,role" }
            );
            results.push({ email: u.email, status: "already exists", userId: existing.id });
          }
          continue;
        }
        results.push({ email: u.email, status: "error", error: authError.message });
        continue;
      }

      if (authData.user) {
        // Assign role
        await supabaseAdmin.from("user_roles").insert({
          user_id: authData.user.id,
          role: u.role,
        });

        results.push({ email: u.email, status: "created", userId: authData.user.id });
      }
    }

    // Now seed students, attendance, fees, etc. using admin user IDs
    const { data: { users: allUsers } } = await supabaseAdmin.auth.admin.listUsers();
    const studentUser = allUsers?.find(u => u.email === "james@eduverse.com");
    const parentUser = allUsers?.find(u => u.email === "robert@eduverse.com");

    if (studentUser) {
      // Seed students
      const { data: existingStudents } = await supabaseAdmin.from("students").select("id").limit(1);
      if (!existingStudents?.length) {
        const studentsToInsert = [
          { user_id: studentUser.id, name: "James Wilson", email: "james@eduverse.com", enrollment_no: "EDU2024001", department: "Computer Science", semester: 5, gpa: 3.7, status: "active", parent_user_id: parentUser?.id },
          { name: "Maria Garcia", email: "m.garcia@eduverse.com", enrollment_no: "EDU2024002", department: "Mathematics", semester: 3, gpa: 3.9, status: "active" },
          { name: "Liam O'Brien", email: "l.obrien@eduverse.com", enrollment_no: "EDU2024003", department: "Physics", semester: 7, gpa: 3.2, status: "active" },
          { name: "Aisha Patel", email: "a.patel@eduverse.com", enrollment_no: "EDU2024004", department: "Computer Science", semester: 5, gpa: 3.85, status: "active" },
          { name: "Chen Wei", email: "c.wei@eduverse.com", enrollment_no: "EDU2024005", department: "Engineering", semester: 1, gpa: 3.5, status: "inactive" },
          { name: "Sophie Laurent", email: "s.laurent@eduverse.com", enrollment_no: "EDU2024006", department: "Biology", semester: 3, gpa: 3.6, status: "active" },
        ];
        const { data: insertedStudents } = await supabaseAdmin.from("students").insert(studentsToInsert).select();

        if (insertedStudents?.length) {
          // Seed attendance
          const james = insertedStudents.find(s => s.name === "James Wilson");
          const maria = insertedStudents.find(s => s.name === "Maria Garcia");
          if (james && maria) {
            await supabaseAdmin.from("attendance").insert([
              { student_id: james.id, student_name: "James Wilson", subject_name: "Algorithm Design", date: "2026-03-17", status: "present", marked_by: "Dr. Sarah Chen" },
              { student_id: maria.id, student_name: "Maria Garcia", subject_name: "Matrix Theory", date: "2026-03-17", status: "absent", marked_by: "Prof. Alan Turing" },
              { student_id: james.id, student_name: "James Wilson", subject_name: "Algorithm Design", date: "2026-03-16", status: "present", marked_by: "Dr. Sarah Chen" },
            ]);

            // Seed fees
            await supabaseAdmin.from("fees").insert([
              { student_id: james.id, student_name: "James Wilson", total: 50000, paid: 35000, pending: 15000, due_date: "2026-04-15", status: "partial", semester: "Spring 2026" },
              { student_id: maria.id, student_name: "Maria Garcia", total: 50000, paid: 50000, pending: 0, due_date: "2026-03-15", status: "paid", semester: "Spring 2026" },
            ]);
          }
        }

        // Seed announcements
        await supabaseAdmin.from("announcements").insert([
          { title: "Mid-Semester Exams Scheduled", message: "Mid-semester examinations will begin from April 5th.", priority: "urgent", created_by: "Admin User", roles: ["admin", "staff", "student", "parent"], expires_at: "2026-04-10" },
          { title: "Library Hours Extended", message: "Library will remain open until 10 PM during exam week.", priority: "info", created_by: "Admin User", roles: ["student", "staff"], expires_at: "2026-04-15" },
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
