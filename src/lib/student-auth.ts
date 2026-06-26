export type StudentMajor =
  | "Computer Science"
  | "Artificial Intelligence"
  | "Software Engineering"
  | "Cybersecurity";

export type StudentLoginInput = {
  universityId: string;
  password: string;
};

export type StudentSession = {
  fullName: string;
  universityId: string;
  major: StudentMajor;
};

export const TEMP_STUDENT_ACCOUNT: StudentSession & { password: string } = {
  fullName: "Test Student",
  universityId: "202012345",
  password: "12345678",
  major: "Computer Science",
};

const storageKey = "murshidi-temp-session";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredStudentSession(): StudentSession | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StudentSession;
    if (
      typeof parsed?.fullName === "string" &&
      typeof parsed?.universityId === "string" &&
      typeof parsed?.major === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function isTempStudentSignedIn() {
  return Boolean(getStoredStudentSession());
}

export function signOutTempStudent() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event("storage"));
}

export async function signInStudent(input: StudentLoginInput) {
  const universityId = input.universityId.trim();
  const password = input.password.trim();

  if (
    universityId !== TEMP_STUDENT_ACCOUNT.universityId ||
    password !== TEMP_STUDENT_ACCOUNT.password
  ) {
    throw new Error("Invalid university ID or password.");
  }

  const session: StudentSession = {
    fullName: TEMP_STUDENT_ACCOUNT.fullName,
    universityId: TEMP_STUDENT_ACCOUNT.universityId,
    major: TEMP_STUDENT_ACCOUNT.major,
  };

  if (canUseStorage()) {
    window.localStorage.setItem(storageKey, JSON.stringify(session));
    window.dispatchEvent(new Event("storage"));
  }

  return { session };
}
