import {
  courses,
  departments,
  faqs,
  instructors,
  itSupport,
  type Course,
  type Department,
  type Faq,
  type Instructor,
} from "@/data/knowledge";
import { getStudyPlanCourses, studyPlans, type StudyPlan } from "@/data/study-plans";

export interface BotReply {
  text: string;
  kind:
    | "prerequisite"
    | "unlocks"
    | "study-plan"
    | "instructor"
    | "department"
    | "it"
    | "course"
    | "faq"
    | "fallback"
    | "greeting";
}

export interface KnowledgeSource {
  courses: Course[];
  instructors: Instructor[];
  departments: Department[];
  faqs: Faq[];
}

const FALLBACK =
  "I could not find this information in the current university knowledge base. Please contact the department office.";

const defaultKnowledge: KnowledgeSource = {
  courses,
  instructors,
  departments,
  faqs,
};

function norm(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchTokens(query: string, name: string): boolean {
  const tokens = norm(name)
    .split(" ")
    .filter((token) => token.length > 3);

  return tokens.length > 0 && tokens.every((token) => query.includes(token));
}

function findCourse(query: string, source: KnowledgeSource): Course | undefined {
  const normalized = norm(query);

  return source.courses.find(
    (course) =>
      normalized.includes(norm(course.name)) ||
      normalized.includes(norm(course.code)) ||
      matchTokens(normalized, course.name),
  );
}

function findMajor(query: string): StudyPlan | undefined {
  const normalized = norm(query);

  return studyPlans.find((plan) => {
    const aliases: Record<StudyPlan["id"], string[]> = {
      ai: ["ai", "artificial intelligence"],
      cs: ["cs", "computer science"],
      cybersecurity: ["cyber", "cybersecurity", "cyber security"],
      "software-engineering": ["software", "software engineering", "se"],
    };

    return aliases[plan.id].some((alias) => new RegExp(`\\b${norm(alias)}\\b`).test(normalized));
  });
}

function findInstructor(query: string, source: KnowledgeSource): Instructor | undefined {
  const normalized = norm(query);

  return source.instructors.find((instructor) => {
    const parts = norm(instructor.name)
      .replace(/\bdr\b/g, "")
      .split(" ")
      .filter((part) => part.length > 2);

    return parts.some((part) => normalized.includes(part));
  });
}

function findDepartment(query: string, source: KnowledgeSource): Department | undefined {
  const normalized = norm(query);

  return source.departments.find(
    (department) =>
      normalized.includes(norm(department.shortName)) ||
      normalized.includes(norm(department.name)) ||
      matchTokens(normalized, department.shortName) ||
      (/(قسم|دكاترة|مدرسين|هيئة تدريس)/.test(normalized) &&
        /(ذكاء|اصطناعي)/.test(normalized) &&
        norm(department.name).includes("artificial intelligence")),
  );
}

function formatCourseRef(course: Course) {
  return `${course.name} (${course.code})`;
}

function formatPrerequisites(course: Course, source: KnowledgeSource) {
  return course.prerequisites.map((prerequisite) => {
    const match = source.courses.find(
      (item) => norm(item.code) === norm(prerequisite) || norm(item.name) === norm(prerequisite),
    );

    return match ? formatCourseRef(match) : prerequisite;
  });
}

function findUnlockedCourses(course: Course, source: KnowledgeSource) {
  const courseCode = norm(course.code);
  const courseName = norm(course.name);

  return source.courses.filter((item) =>
    item.prerequisites.some((prerequisite) => {
      const value = norm(prerequisite);
      return value === courseCode || value === courseName;
    }),
  );
}

function formatStudyPlan(plan: StudyPlan) {
  const lines = plan.categories.map(
    (category) =>
      `${category.name}: ${category.requiredHours} hours${
        category.selection === "choose" ? " chosen from the listed elective pool" : ""
      }`,
  );

  return `${plan.name} study plan has ${plan.totalHours} total credit hours.\n\n${lines.join("\n")}`;
}

export function getBotReply(rawInput: string, source = defaultKnowledge): BotReply {
  const query = rawInput.trim();
  const normalized = norm(query);

  if (!normalized) return { text: FALLBACK, kind: "fallback" };

  if (/^(hi|hello|hey|salam|good (morning|evening|afternoon))\b/.test(normalized)) {
    return {
      text: "Hello! I'm مرشدي. Ask me about study plans, course hours, prerequisites, what each course opens, instructors, departments, offices, or IT support.",
      kind: "greeting",
    };
  }

  const asksPrereq = /(prerequisite|pre req|prereq|before|need to take|take before|required for)/.test(
    normalized,
  );
  const asksUnlocks = /(open|opens|unlock|unlocks|after|next|eligible|allow)/.test(normalized);
  const asksPlan = /(study plan|plan|major|hours|credit|credits|courses in|courses for)/.test(
    normalized,
  );
  const asksOffice = /(office|where|location|room|building)/.test(normalized);
  const asksWhoTeaches = /(who teaches|who is teaching|instructor for|doctor for|teaches)/.test(
    normalized,
  );
  const asksIt = /(it (support|department|help|desk)|password|wifi|wi fi|help desk|reset)/.test(
    normalized,
  );

  if (asksPlan) {
    const major = findMajor(query);
    if (major) {
      return { text: formatStudyPlan(major), kind: "study-plan" };
    }
  }

  if (asksIt) {
    return {
      text:
        `${itSupport.name} - Office ${itSupport.office}\n` +
        `Email: ${itSupport.email} | Phone: ${itSupport.phone}\n` +
        `Hours: ${itSupport.hours}\n\n` +
        `Services:\n` +
        itSupport.services.map((service) => `- ${service}`).join("\n"),
      kind: "it",
    };
  }

  if (asksWhoTeaches) {
    const course = findCourse(query, source);
    if (course) {
      const teachers = source.instructors.filter((instructor) =>
        instructor.courses.some((item) => norm(item) === norm(course.name)),
      );

      if (teachers.length) {
        return {
          text: `${formatCourseRef(course)} is taught by ${teachers
            .map((teacher) => `${teacher.name} - office ${teacher.office}`)
            .join(", ")}.`,
          kind: "instructor",
        };
      }
    }
  }

  if (asksPrereq) {
    const course = findCourse(query, source);
    if (course) {
      const prerequisites = formatPrerequisites(course, source);

      return {
        text: prerequisites.length
          ? `Before taking ${formatCourseRef(course)}, complete: ${prerequisites.join(", ")}.`
          : `${formatCourseRef(course)} has no prerequisites. You can take it directly.`,
        kind: "prerequisite",
      };
    }
  }

  if (asksUnlocks) {
    const course = findCourse(query, source);
    if (course) {
      const unlocked = findUnlockedCourses(course, source);

      return {
        text: unlocked.length
          ? `After completing ${formatCourseRef(course)}, it opens: ${unlocked
              .map(formatCourseRef)
              .join(", ")}.`
          : `${formatCourseRef(course)} is not listed as a prerequisite for another course in the current study plans.`,
        kind: "unlocks",
      };
    }
  }

  const instructor = findInstructor(query, source);
  if (
    instructor &&
    (asksOffice || /(dr|doctor|professor|instructor|teach|email|courses|contact)/.test(normalized))
  ) {
    return {
      text:
        `${instructor.name} - ${instructor.department}\n` +
        `Office: ${instructor.office}\n` +
        `Email: ${instructor.email}\n` +
        `Office hours: ${instructor.officeHours}\n` +
        `Courses: ${instructor.courses.join(", ")}`,
      kind: "instructor",
    };
  }

  const department = findDepartment(query, source);
  if (department) {
    if (/(doctor|instructor|teacher|professor|staff|faculty)/.test(normalized)) {
      const deptStaff = source.instructors.filter(
        (instructor) => norm(instructor.department) === norm(department.shortName),
      );

      if (deptStaff.length) {
        return {
          text: `Instructors in ${department.name}: ${deptStaff
            .map((item) => `${item.name} (office ${item.office})`)
            .join(", ")}.`,
          kind: "instructor",
        };
      }
    }

    return {
      text:
        `${department.name}\n${department.description}\n\n` +
        `Main courses: ${department.mainCourses.join(", ")}\n` +
        `Contact office: ${department.contactOffice}`,
      kind: "department",
    };
  }

  const course = findCourse(query, source);
  if (course) {
    const prerequisites = formatPrerequisites(course, source);
    const unlocked = findUnlockedCourses(course, source);
    const appearsIn = studyPlans
      .filter((plan) => getStudyPlanCourses(plan).some((item) => item.course?.code === course.code))
      .map((plan) => plan.name);

    return {
      text:
        `${formatCourseRef(course)} - ${course.department}\n` +
        `${course.creditHours} credit hours\n` +
        `Prerequisites: ${prerequisites.length ? prerequisites.join(", ") : "None"}\n` +
        `Opens: ${unlocked.length ? unlocked.map(formatCourseRef).join(", ") : "No direct dependent course listed"}\n` +
        `Appears in: ${appearsIn.join(", ")}\n` +
        `${course.description}`,
      kind: "course",
    };
  }

  const faq = source.faqs.find((item) => {
    const tokens = norm(item.question)
      .split(" ")
      .filter((token) => token.length > 4);
    const hits = tokens.filter((token) => normalized.includes(token)).length;
    return tokens.length > 0 && hits / tokens.length >= 0.4;
  });

  if (faq) return { text: faq.answer, kind: "faq" };

  return { text: FALLBACK, kind: "fallback" };
}

export const suggestedQuestions = [
  "What are the prerequisites for Machine Learning?",
  "What does Computer Programming (1) open?",
  "How many hours are in the AI study plan?",
  "Show the Cybersecurity study plan",
  "What are the prerequisites for Web Programming (2)?",
];


