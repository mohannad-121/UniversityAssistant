// Mock university knowledge base for مرشدي.
// Structured so it can later be replaced by Supabase / FastAPI without
// changing the consuming components. All reads go through these arrays.

import { studyPlanCourses } from "@/data/study-plans";
import { repairTextFields } from "@/lib/text-encoding";

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  creditHours: number;
  prerequisites: string[];
  description: string;
}

export interface Instructor {
  id: string;
  name: string;
  department: string;
  office: string;
  email: string;
  courses: string[];
  officeHours: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  mainCourses: string[];
  contactOffice: string;
  head: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const courses: Course[] = studyPlanCourses;

export const instructors: Instructor[] = repairTextFields([
  {
    id: "raed-al-azaidah",
    name: "Ø¯. Ø±Ø§Ø¦Ø¯ Ø­Ø³Ù† ØµØ§Ù„Ø­ Ø§Ù„Ø£Ø²Ø§ÙŠدة",
    department: "Artificial Intelligence",
    office: "159A",
    email: "razaidah@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "hayel-khafajah",
    name: "Ø¯. Ù‡Ø§ÙŠÙ„ Ø­Ø³ÙŠÙ† Ø¹Ù„ÙŠ خفاجة",
    department: "Artificial Intelligence",
    office: "151A",
    email: "hayelkh@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "sattam-al-matarneh",
    name: "Ø¯. Ø³Ø·Ø§Ù… Ù…Ø­Ù…Ø¯ Ø¹Ø·Ø§ Ø§Ù„Ù…Ø·Ø§Ø±Ù†Ù‡",
    department: "Artificial Intelligence",
    office: "151A",
    email: "salmatarneh@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "amneh-al-amleh",
    name: "Ø¯. Ø¢Ù…Ù†Ù‡ Ø­Ø³ÙŠÙ† Ù…Ø­Ù…Ø¯ Ø§Ù„Ø¹Ù…Ù„Ù‡",
    department: "Artificial Intelligence",
    office: "110B",
    email: "aamleh@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "ahmad-aburomman",
    name: "Ø¯. Ø§Ø­Ù…Ø¯ Ø¹Ø¨Ø¯Ø§Ù„ÙƒØ±ÙŠÙ… Ø¹Ù„ÙŠ Ø§Ø¨Ùˆ Ø±Ù…Ø§Ù†",
    department: "Artificial Intelligence",
    office: "181A",
    email: "aaburomman@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "qatadah-aljawazneh",
    name: "Ø¯. Ù‚ØªØ§Ø¯Ø© ØµØ§Ø¨Ø± Ø³Ù„ÙŠÙ… Ø§Ù„Ø¬ÙˆØ§Ø²Ù†ة",
    department: "Artificial Intelligence",
    office: "170A",
    email: "q.aljawazneh@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "anwar-qatrawi",
    name: "Ø¯. Ø§Ù†ÙˆØ± Ø­Ø³ÙŠÙ† Ø²ÙƒØ±ÙŠØ§ Ù‚Ø·Ø±Ø§ÙˆÙŠ",
    department: "Artificial Intelligence",
    office: "236B",
    email: "akatrawi@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "mosab-qtaish",
    name: "Ø¯. Ù…ØµØ¹Ø¨ Ù…Ø­Ù…ÙˆØ¯ Ù…Ø­Ù…Ø¯ Ù‚Ø·ÙŠط",
    department: "Artificial Intelligence",
    office: "362A",
    email: "migtait@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "moath-aluwaici",
    name: "Ø¯. Ù…Ø¹Ø§Ø° Ù…Ø­Ù…Ø¯ Ø®ÙŠØ± ÙØ§Ù„Ø­ Ø§Ù„ÙˆÙŠØ³ÙŠ",
    department: "Artificial Intelligence",
    office: "226B",
    email: "malluwaici@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "amer-alrawash",
    name: "Ø¯. Ø¹Ø§Ù…Ø± Ù…Ø­Ù…ÙˆØ¯ Ù…ÙˆØ³Ù‰ Ø§Ù„Ø±Ùˆاش",
    department: "Artificial Intelligence",
    office: "360",
    email: "aalrwash@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "yazid-al-sheikh",
    name: "Ø¯. ÙŠØ²ÙŠØ¯ Ø¬Ù…Ø§Ù„ Ø§Ø³Ù…Ø§Ø¹ÙŠÙ„ Ø¹Ø¨Ø¯Ø§Ù„Ø±Ø­ÙŠÙ… Ø§Ù„Ø´ÙŠخ",
    department: "Artificial Intelligence",
    office: "233B",
    email: "yazid_1981@hotmail.com",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "fadi-aljawazneh",
    name: "Ø¯. ÙØ§Ø¯ÙŠ ÙŠØ§Ø³ÙŠÙ† Ø³Ø§Ù„Ù… Ø§Ù„Ø¬ÙˆØ§Ø²Ù†Ù‡",
    department: "Artificial Intelligence",
    office: "374A",
    email: "Faljawazneh@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "ghada-bani-mousa",
    name: "Ø¯. ØºØ§Ø¯Ø© Ù…Ù†ÙŠØ± Ù…Ø­Ù…Ø¯ Ø¨Ù†ÙŠ Ù…ÙˆØ³Ù‰",
    department: "Artificial Intelligence",
    office: "167A",
    email: "Gbanimusa@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "rasha-alzaben",
    name: "Ø±Ø´Ø§ Ù…Ø­Ù…ÙˆØ¯ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ Ø§Ù„Ø²Ø¨Ù†",
    department: "Artificial Intelligence",
    office: "TBA",
    email: "alzabenr31@gmail.com",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "shorouq-aldaja",
    name: "Ø´Ø±ÙˆÙ‚ Ø§Ù†ÙˆØ± Ø¬Ù…Ø§Ù„ Ø§Ù„دعجة",
    department: "Artificial Intelligence",
    office: "126B",
    email: "s.aldaja@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "hanadi-bani-hamad",
    name: "Ù‡Ù†Ø§Ø¯ÙŠ Ù…Ø­Ù…Ø¯ Ø§Ø­Ù…Ø¯ Ø¨Ù†ÙŠ Ø­Ù…د",
    department: "Artificial Intelligence",
    office: "118B",
    email: "hbanihamad@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "malak-ayoub",
    name: "Ù…Ù„Ø§Ùƒ Ù…Ø­Ù…Ø¯ Ø§ÙŠÙˆØ¨ Ø§ÙŠÙˆب",
    department: "Artificial Intelligence",
    office: "233B",
    email: "Mayoub@zu.edu.jo",
    courses: ["Artificial Intelligence department courses"],
    officeHours: "Contact the department for office hours",
  },
  {
    id: "aburomman",
    name: "Dr. Ahmad Aburomman",
    department: "Data Science and AI",
    office: "IT-204",
    email: "a.aburomman@university.edu",
    courses: ["Artificial Intelligence", "Machine Learning"],
    officeHours: "Sun & Tue, 10:00 - 12:00",
  },
  {
    id: "azaidah",
    name: "Dr. Raed Al-Azaidah",
    department: "Data Science and AI",
    office: "IT-301",
    email: "r.azaidah@university.edu",
    courses: ["Data Mining", "Artificial Intelligence"],
    officeHours: "Mon & Wed, 11:00 - 13:00",
  },
  {
    id: "lina",
    name: "Dr. Lina Hassan",
    department: "Computer Science",
    office: "IT-210",
    email: "l.hassan@university.edu",
    courses: ["Database Systems"],
    officeHours: "Sun & Thu, 09:00 - 11:00",
  },
  {
    id: "omar",
    name: "Dr. Omar Khaled",
    department: "Software Engineering",
    office: "IT-105",
    email: "o.khaled@university.edu",
    courses: ["Web Development"],
    officeHours: "Tue & Thu, 12:00 - 14:00",
  },
]);

export const departments: Department[] = repairTextFields([
  {
    id: "ai",
    name: "Artificial Intelligence",
    shortName: "Artificial Intelligence",
    description:
      "Department focused on intelligent systems, machine learning, deep learning, data science, robotics, and AI applications.",
    mainCourses: [
      "Introduction to Artificial Intelligence",
      "Machine Learning",
      "Applied Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
    ],
    contactOffice: "AI Department - Office 1444",
    head: "Dr. Raed Hasan Saleh Al-Azaidah",
  },
  {
    id: "dsai",
    name: "Data Science and Artificial Intelligence",
    shortName: "Data Science and AI",
    description:
      "Focuses on intelligent systems, machine learning, and extracting insight from data to solve real-world problems.",
    mainCourses: ["Artificial Intelligence", "Machine Learning", "Data Mining"],
    contactOffice: "IT-200",
    head: "Department Head (TBA)",
  },
  {
    id: "cs",
    name: "Computer Science",
    shortName: "Computer Science",
    description:
      "Covers the theoretical and practical foundations of computing, algorithms, databases, and systems.",
    mainCourses: ["Database Systems", "Data Structures", "Operating Systems"],
    contactOffice: "IT-209",
    head: "Department Head (TBA)",
  },
  {
    id: "se",
    name: "Software Engineering",
    shortName: "Software Engineering",
    description:
      "Teaches disciplined design, development, testing, and maintenance of large-scale software systems.",
    mainCourses: ["Web Development", "Software Design", "Software Testing"],
    contactOffice: "IT-104",
    head: "Department Head (TBA)",
  },
  {
    id: "cyber",
    name: "Cybersecurity",
    shortName: "Cybersecurity",
    description:
      "Prepares students to protect systems and networks through security principles, cryptography, and defense.",
    mainCourses: ["Information Security", "Computer Networks", "Ethical Hacking"],
    contactOffice: "IT-302",
    head: "Department Head (TBA)",
  },
  {
    id: "cis",
    name: "Computer Information Systems",
    shortName: "Computer Information Systems",
    description:
      "Bridges business and technology, focusing on information systems, analysis, and enterprise solutions.",
    mainCourses: ["Information Systems", "Systems Analysis", "Database Systems"],
    contactOffice: "IT-115",
    head: "Department Head (TBA)",
  },
  {
    id: "it",
    name: "Information Technology",
    shortName: "Information Technology",
    description:
      "Hands-on department covering networks, infrastructure, IT support, and the technology that keeps the campus running.",
    mainCourses: ["Computer Networks", "IT Support", "System Administration"],
    contactOffice: "IT-100 (IT Help Desk)",
    head: "Department Head (TBA)",
  },
]);

export const itSupport = repairTextFields({
  name: "IT Department & Help Desk",
  office: "IT-100",
  email: "ithelpdesk@university.edu",
  phone: "+962 (0) 6 000 1100",
  hours: "Sunday - Thursday, 08:00 - 16:00",
  services: [
    "University account & email password resets",
    "Wi-Fi and campus network access",
    "Student portal and LMS login support",
    "Lab computers and software issues",
    "Printing and projector support",
  ],
});

export const faqs: Faq[] = repairTextFields([
  {
    id: "f1",
    category: "Registration",
    question: "How do I register for courses each semester?",
    answer:
      "Log in to the student portal during the registration period, select your courses, and confirm with your academic advisor before the deadline.",
  },
  {
    id: "f2",
    category: "Prerequisites",
    question: "What happens if I haven't passed a prerequisite?",
    answer:
      "You cannot register for a course until its prerequisites are completed. Check each course on the Courses page to see what is required.",
  },
  {
    id: "f3",
    category: "Prerequisites",
    question: "What should I take before Machine Learning?",
    answer:
      "Machine Learning (ML401) requires Probability and Statistics and Python Programming. Complete both before registering.",
  },
  {
    id: "f4",
    category: "Departments",
    question: "How many departments are in the IT faculty?",
    answer:
      "There are six departments: Data Science & AI, Computer Science, Software Engineering, Cybersecurity, Computer Information Systems, and Information Technology.",
  },
  {
    id: "f5",
    category: "IT Support",
    question: "How do I reset my university account password?",
    answer:
      "Visit the IT Help Desk at office IT-100 or email ithelpdesk@university.edu. Support is available Sunday-Thursday, 08:00-16:00.",
  },
  {
    id: "f6",
    category: "Office Locations",
    question: "How do I find an instructor's office?",
    answer:
      "Open the Instructors page to see each doctor's office number, email, and office hours, or ask the chatbot 'Where is Dr. Ahmad's office?'.",
  },
  {
    id: "f7",
    category: "Office Locations",
    question: "Where is the IT Help Desk located?",
    answer: "The IT Help Desk is in office IT-100 on the ground floor of the IT building.",
  },
]);


