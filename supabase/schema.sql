create table if not exists public.courses (
  id text primary key,
  code text not null unique,
  name text not null,
  department text not null,
  "creditHours" integer not null default 3,
  prerequisites text[] not null default '{}',
  description text not null default ''
);

create table if not exists public.instructors (
  id text primary key,
  name text not null,
  department text not null,
  office text not null default '',
  email text not null default '',
  courses text[] not null default '{}',
  "officeHours" text not null default ''
);

create table if not exists public.departments (
  id text primary key,
  name text not null,
  "shortName" text not null,
  description text not null default '',
  "mainCourses" text[] not null default '{}',
  "contactOffice" text not null default '',
  head text not null default ''
);

create table if not exists public.faqs (
  id text primary key,
  category text not null,
  question text not null,
  answer text not null
);

create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  university_id text not null unique,
  full_name text not null,
  major text not null check (major in ('Computer Science', 'Artificial Intelligence', 'Software Engineering', 'Cybersecurity')),
  role text not null default 'student' check (role = 'student'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;
alter table public.instructors enable row level security;
alter table public.departments enable row level security;
alter table public.faqs enable row level security;
alter table public.students enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = user_id
  );
$$;

drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses" on public.courses for select using (true);

drop policy if exists "Public read instructors" on public.instructors;
create policy "Public read instructors" on public.instructors for select using (true);

drop policy if exists "Public read departments" on public.departments;
create policy "Public read departments" on public.departments for select using (true);

drop policy if exists "Public read faqs" on public.faqs;
create policy "Public read faqs" on public.faqs for select using (true);

drop policy if exists "Students can read own profile" on public.students;
create policy "Students can read own profile" on public.students
  for select using (auth.uid() = id);

drop policy if exists "Students can create own profile" on public.students;
create policy "Students can create own profile" on public.students
  for insert with check (auth.uid() = id);

drop policy if exists "Students can update own profile" on public.students;
create policy "Students can update own profile" on public.students
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users" on public.admin_users
  for select using (public.is_admin(auth.uid()));

create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data ->> 'role' = 'student' then
    insert into public.students (id, university_id, full_name, major)
    values (
      new.id,
      new.raw_user_meta_data ->> 'university_id',
      coalesce(new.raw_user_meta_data ->> 'full_name', ''),
      coalesce(new.raw_user_meta_data ->> 'major', 'Computer Science')
    )
    on conflict (id) do update set
      university_id = excluded.university_id,
      full_name = excluded.full_name,
      major = excluded.major,
      updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student on auth.users;
create trigger on_auth_user_created_student
  after insert on auth.users
  for each row execute function public.handle_new_student();

-- Production admin policies. To grant access, add a trusted Supabase auth user:
-- insert into public.admin_users (id, email)
-- select id, email from auth.users where email = 'admin@example.com';
drop policy if exists "Demo write courses" on public.courses;
drop policy if exists "Admin insert courses" on public.courses;
drop policy if exists "Admin update courses" on public.courses;
drop policy if exists "Admin delete courses" on public.courses;
create policy "Admin insert courses" on public.courses
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Admin update courses" on public.courses
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin delete courses" on public.courses
  for delete to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "Demo write instructors" on public.instructors;
drop policy if exists "Admin insert instructors" on public.instructors;
drop policy if exists "Admin update instructors" on public.instructors;
drop policy if exists "Admin delete instructors" on public.instructors;
create policy "Admin insert instructors" on public.instructors
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Admin update instructors" on public.instructors
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin delete instructors" on public.instructors
  for delete to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "Demo write departments" on public.departments;
drop policy if exists "Admin insert departments" on public.departments;
drop policy if exists "Admin update departments" on public.departments;
drop policy if exists "Admin delete departments" on public.departments;
create policy "Admin insert departments" on public.departments
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Admin update departments" on public.departments
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin delete departments" on public.departments
  for delete to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "Demo write faqs" on public.faqs;
drop policy if exists "Admin insert faqs" on public.faqs;
drop policy if exists "Admin update faqs" on public.faqs;
drop policy if exists "Admin delete faqs" on public.faqs;
create policy "Admin insert faqs" on public.faqs
  for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Admin update faqs" on public.faqs
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admin delete faqs" on public.faqs
  for delete to authenticated using (public.is_admin(auth.uid()));

insert into public.courses (id, code, name, department, "creditHours", prerequisites, description) values
  ('ai301', 'AI301', 'Artificial Intelligence', 'Data Science and AI', 3, array['Data Structures'], 'Foundations of intelligent systems: search, knowledge representation, reasoning, and an introduction to machine learning.'),
  ('ml401', 'ML401', 'Machine Learning', 'Data Science and AI', 3, array['Probability and Statistics', 'Python Programming'], 'Supervised and unsupervised learning, model evaluation, regression, classification, and neural network basics.'),
  ('db202', 'DB202', 'Database Systems', 'Computer Science', 3, array['Programming 2'], 'Relational model, SQL, normalization, transactions, and the fundamentals of database design and management.'),
  ('web210', 'WEB210', 'Web Development', 'Software Engineering', 3, array['Programming 1'], 'Building modern responsive web applications with HTML, CSS, JavaScript, and component-based frameworks.'),
  ('net220', 'NET220', 'Computer Networks', 'Information Technology', 3, array['Computer Fundamentals'], 'Network models, protocols, routing, switching, and the basics of network security and administration.'),
  ('dm310', 'DM310', 'Data Mining', 'Data Science and AI', 3, array['Database Systems', 'Probability and Statistics'], 'Discovering patterns in large datasets: clustering, association rules, classification, and preprocessing.'),
  ('sec305', 'SEC305', 'Information Security', 'Cybersecurity', 3, array['Computer Networks'], 'Principles of confidentiality, integrity, and availability, cryptography basics, and threat modeling.')
on conflict (id) do update set
  code = excluded.code,
  name = excluded.name,
  department = excluded.department,
  "creditHours" = excluded."creditHours",
  prerequisites = excluded.prerequisites,
  description = excluded.description;

insert into public.instructors (id, name, department, office, email, courses, "officeHours") values
  ('aburomman', 'Dr. Ahmad Aburomman', 'Data Science and AI', 'IT-204', 'a.aburomman@university.edu', array['Artificial Intelligence', 'Machine Learning'], 'Sun & Tue, 10:00 - 12:00'),
  ('azaidah', 'Dr. Raed Al-Azaidah', 'Data Science and AI', 'IT-301', 'r.azaidah@university.edu', array['Data Mining', 'Artificial Intelligence'], 'Mon & Wed, 11:00 - 13:00'),
  ('lina', 'Dr. Lina Hassan', 'Computer Science', 'IT-210', 'l.hassan@university.edu', array['Database Systems'], 'Sun & Thu, 09:00 - 11:00'),
  ('omar', 'Dr. Omar Khaled', 'Software Engineering', 'IT-105', 'o.khaled@university.edu', array['Web Development'], 'Tue & Thu, 12:00 - 14:00')
on conflict (id) do update set
  name = excluded.name,
  department = excluded.department,
  office = excluded.office,
  email = excluded.email,
  courses = excluded.courses,
  "officeHours" = excluded."officeHours";

insert into public.departments (id, name, "shortName", description, "mainCourses", "contactOffice", head) values
  ('dsai', 'Data Science and Artificial Intelligence', 'Data Science and AI', 'Focuses on intelligent systems, machine learning, and extracting insight from data to solve real-world problems.', array['Artificial Intelligence', 'Machine Learning', 'Data Mining'], 'IT-200', 'Department Head (TBA)'),
  ('cs', 'Computer Science', 'Computer Science', 'Covers the theoretical and practical foundations of computing, algorithms, databases, and systems.', array['Database Systems', 'Data Structures', 'Operating Systems'], 'IT-209', 'Department Head (TBA)'),
  ('se', 'Software Engineering', 'Software Engineering', 'Teaches disciplined design, development, testing, and maintenance of large-scale software systems.', array['Web Development', 'Software Design', 'Software Testing'], 'IT-104', 'Department Head (TBA)'),
  ('cyber', 'Cybersecurity', 'Cybersecurity', 'Prepares students to protect systems and networks through security principles, cryptography, and defense.', array['Information Security', 'Computer Networks', 'Ethical Hacking'], 'IT-302', 'Department Head (TBA)'),
  ('cis', 'Computer Information Systems', 'Computer Information Systems', 'Bridges business and technology, focusing on information systems, analysis, and enterprise solutions.', array['Information Systems', 'Systems Analysis', 'Database Systems'], 'IT-115', 'Department Head (TBA)'),
  ('it', 'Information Technology', 'Information Technology', 'Hands-on department covering networks, infrastructure, IT support, and the technology that keeps the campus running.', array['Computer Networks', 'IT Support', 'System Administration'], 'IT-100 (IT Help Desk)', 'Department Head (TBA)')
on conflict (id) do update set
  name = excluded.name,
  "shortName" = excluded."shortName",
  description = excluded.description,
  "mainCourses" = excluded."mainCourses",
  "contactOffice" = excluded."contactOffice",
  head = excluded.head;

insert into public.faqs (id, category, question, answer) values
  ('f1', 'Registration', 'How do I register for courses each semester?', 'Log in to the student portal during the registration period, select your courses, and confirm with your academic advisor before the deadline.'),
  ('f2', 'Prerequisites', 'What happens if I have not passed a prerequisite?', 'You cannot register for a course until its prerequisites are completed. Check each course on the Courses page to see what is required.'),
  ('f3', 'Prerequisites', 'What should I take before Machine Learning?', 'Machine Learning (ML401) requires Probability and Statistics and Python Programming. Complete both before registering.'),
  ('f4', 'Departments', 'How many departments are in the IT faculty?', 'There are six departments: Data Science & AI, Computer Science, Software Engineering, Cybersecurity, Computer Information Systems, and Information Technology.'),
  ('f5', 'IT Support', 'How do I reset my university account password?', 'Visit the IT Help Desk at office IT-100 or email ithelpdesk@university.edu. Support is available Sunday-Thursday, 08:00-16:00.'),
  ('f6', 'Office Locations', 'How do I find an instructor office?', 'Open the Instructors page to see each doctor office number, email, and office hours, or ask the chatbot where the instructor office is.'),
  ('f7', 'Office Locations', 'Where is the IT Help Desk located?', 'The IT Help Desk is in office IT-100 on the ground floor of the IT building.')
on conflict (id) do update set
  category = excluded.category,
  question = excluded.question,
  answer = excluded.answer;
