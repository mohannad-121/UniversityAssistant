import type { MajorId } from "@/data/study-plans";

export type CourseState = "registered" | "completed";

export function courseStateKey(major: MajorId, state: CourseState) {
  return `murshidi.${state}Courses.${major}`;
}

export function readCourseCodes(major: MajorId, state: CourseState) {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(courseStateKey(major, state));
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function writeCourseCodes(major: MajorId, state: CourseState, codes: string[]) {
  window.localStorage.setItem(courseStateKey(major, state), JSON.stringify(Array.from(new Set(codes))));
  window.dispatchEvent(
    new CustomEvent("murshidi-course-state-change", { detail: { major, state } }),
  );
}

export function toggleCourseCode(major: MajorId, state: CourseState, code: string) {
  const current = readCourseCodes(major, state);
  const next = current.includes(code)
    ? current.filter((item) => item !== code)
    : [...current, code];

  writeCourseCodes(major, state, next);
  return next;
}

export function courseStateEventName() {
  return "murshidi-course-state-change";
}

