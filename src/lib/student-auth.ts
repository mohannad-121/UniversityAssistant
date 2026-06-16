import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type StudentMajor =
  | "Computer Science"
  | "Artificial Intelligence"
  | "Software Engineering"
  | "Cybersecurity";

export type StudentSignupInput = {
  fullName: string;
  universityId: string;
  password: string;
  major: StudentMajor;
};

export type StudentLoginInput = {
  universityId: string;
  password: string;
};

const studentAuthEmailDomain =
  (import.meta.env.VITE_STUDENT_AUTH_EMAIL_DOMAIN as string | undefined)?.trim() ||
  "students.example.com";

function studentEmail(universityId: string) {
  return `${universityId.trim().toLowerCase()}@${studentAuthEmailDomain}`;
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  return supabase;
}

export async function signUpStudent(input: StudentSignupInput) {
  const client = requireSupabase();
  const universityId = input.universityId.trim();

  const { data, error } = await client.auth.signUp({
    email: studentEmail(universityId),
    password: input.password,
    options: {
      data: {
        role: "student",
        full_name: input.fullName.trim(),
        university_id: universityId,
        major: input.major,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await client.from("students").upsert(
      {
        id: data.user.id,
        full_name: input.fullName.trim(),
        university_id: universityId,
        major: input.major,
      },
      { onConflict: "id" },
    );

    if (profileError && !profileError.message.toLowerCase().includes("row-level security")) {
      throw profileError;
    }
  }

  return data;
}

export async function signInStudent(input: StudentLoginInput) {
  const client = requireSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email: studentEmail(input.universityId),
    password: input.password,
  });

  if (error) throw error;

  const { data: student, error: studentError } = await client
    .from("students")
    .select("id, university_id, full_name, major")
    .eq("id", data.user.id)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!student) throw new Error("This account is not registered as a مرشدي student.");

  return { session: data.session, user: data.user, student };
}

