import { supabase } from "@/lib/supabase";
import {
  courses as fallbackCourses,
  departments as fallbackDepartments,
  faqs as fallbackFaqs,
  instructors as fallbackInstructors,
  type Course,
  type Department,
  type Faq,
  type Instructor,
} from "@/data/knowledge";
import { repairTextFields } from "@/lib/text-encoding";

export type DataTable = "courses" | "instructors" | "departments" | "faqs";

type EntityMap = {
  courses: Course;
  instructors: Instructor;
  departments: Department;
  faqs: Faq;
};

const fallbackData = {
  courses: fallbackCourses,
  instructors: fallbackInstructors,
  departments: fallbackDepartments,
  faqs: fallbackFaqs,
} satisfies { [K in DataTable]: EntityMap[K][] };

const orderBy: Record<DataTable, string> = {
  courses: "code",
  instructors: "name",
  departments: "name",
  faqs: "category",
};

export function getFallbackData<T extends DataTable>(table: T) {
  return repairTextFields(fallbackData[table]);
}

export async function fetchTable<T extends DataTable>(table: T): Promise<EntityMap[T][]> {
  if (!supabase) return getFallbackData(table);

  const { data, error } = await supabase.from(table).select("*").order(orderBy[table]);
  if (error) {
    console.warn(`Supabase read failed for ${table}; using fallback data.`, error.message);
    return getFallbackData(table);
  }

  if (table === "courses" && (data?.length ?? 0) < fallbackCourses.length) {
    return fallbackCourses as EntityMap[T][];
  }

  if (table === "instructors" && (data?.length ?? 0) < fallbackInstructors.length) {
    return fallbackInstructors as EntityMap[T][];
  }

  if (table === "departments" && (data?.length ?? 0) < fallbackDepartments.length) {
    return fallbackDepartments as EntityMap[T][];
  }

  return repairTextFields((data ?? []) as EntityMap[T][]);
}

export async function isCurrentUserAdmin() {
  if (!supabase) return false;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("Supabase admin check failed.", error.message);
    return false;
  }

  return Boolean(data);
}

export async function upsertRow<T extends DataTable>(table: T, row: EntityMap[T] | Record<string, unknown>) {
  if (!supabase) return row;

  const { data, error } = await supabase.from(table).upsert(row).select().single();
  if (error) throw error;
  return data as EntityMap[T];
}

export async function deleteRow(table: DataTable, id: string) {
  if (!supabase) return;

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
