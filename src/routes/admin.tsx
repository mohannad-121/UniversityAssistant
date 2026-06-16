import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, BookOpen, Users, Building2, HelpCircle } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  deleteRow,
  fetchTable,
  getFallbackData,
  isCurrentUserAdmin,
  upsertRow,
  type DataTable,
} from "@/lib/university-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - مرشدي" },
      {
        name: "description",
        content:
          "Manage the مرشدي knowledge base: add, edit, and delete courses, instructors, departments, and FAQs.",
      },
    ],
  }),
  component: AdminPage,
});

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "list";
  placeholder?: string;
};

type Row = Record<string, unknown> & { id: string };

function AdminPage() {
  const { data: isAdmin = false, isLoading: checkingAdmin } = useQuery({
    queryKey: ["current-user-admin"],
    queryFn: isCurrentUserAdmin,
  });
  const { data: courses = getFallbackData("courses") as Row[] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchTable("courses") as Promise<Row[]>,
    enabled: isAdmin,
  });
  const { data: instructors = getFallbackData("instructors") as Row[] } = useQuery({
    queryKey: ["instructors"],
    queryFn: () => fetchTable("instructors") as Promise<Row[]>,
    enabled: isAdmin,
  });
  const { data: departments = getFallbackData("departments") as Row[] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchTable("departments") as Promise<Row[]>,
    enabled: isAdmin,
  });
  const { data: faqs = getFallbackData("faqs") as Row[] } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => fetchTable("faqs") as Promise<Row[]>,
    enabled: isAdmin,
  });

  if (checkingAdmin) {
    return (
      <PageLayout>
        <PageHeader
          eyebrow="Staff Only"
          title="Checking access"
          subtitle="Verifying your admin permissions."
        />
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return (
      <PageLayout>
        <PageHeader
          eyebrow="Restricted"
          title="Admin access required"
          subtitle="This dashboard is only available to approved مرشدي staff accounts."
        />
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Staff Only"
        title="Admin Dashboard"
        subtitle="Manage the university knowledge base. Changes are stored in local state - ready to connect to a database later."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={BookOpen} label="Courses" value={courses.length} />
          <Stat icon={Users} label="Instructors" value={instructors.length} />
          <Stat icon={Building2} label="Departments" value={departments.length} />
          <Stat icon={HelpCircle} label="FAQs" value={faqs.length} />
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6 flex h-auto flex-wrap">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CrudManager
              table="courses"
              title="Course"
              rows={courses}
              columns={["code", "name", "department"]}
              fields={[
                { key: "code", label: "Course code", placeholder: "AI301" },
                { key: "name", label: "Course name", placeholder: "Artificial Intelligence" },
                { key: "department", label: "Department", placeholder: "Data Science and AI" },
                { key: "creditHours", label: "Credit hours", type: "number", placeholder: "3" },
                {
                  key: "prerequisites",
                  label: "Prerequisites (comma separated)",
                  type: "list",
                  placeholder: "Data Structures, Calculus",
                },
                { key: "description", label: "Description", type: "textarea" },
              ]}
            />
          </TabsContent>

          <TabsContent value="instructors">
            <CrudManager
              table="instructors"
              title="Instructor"
              rows={instructors}
              columns={["name", "department", "office"]}
              fields={[
                { key: "name", label: "Name", placeholder: "Dr. Ahmad Aburomman" },
                { key: "department", label: "Department", placeholder: "Data Science and AI" },
                { key: "office", label: "Office", placeholder: "IT-204" },
                { key: "email", label: "Email", placeholder: "a.aburomman@university.edu" },
                {
                  key: "courses",
                  label: "Courses (comma separated)",
                  type: "list",
                  placeholder: "Artificial Intelligence, Machine Learning",
                },
                { key: "officeHours", label: "Office hours", placeholder: "Sun & Tue, 10:00 - 12:00" },
              ]}
            />
          </TabsContent>

          <TabsContent value="departments">
            <CrudManager
              table="departments"
              title="Department"
              rows={departments}
              columns={["name", "contactOffice", "head"]}
              fields={[
                { key: "name", label: "Department name", placeholder: "Computer Science" },
                { key: "shortName", label: "Short name", placeholder: "Computer Science" },
                { key: "description", label: "Description", type: "textarea" },
                {
                  key: "mainCourses",
                  label: "Main courses (comma separated)",
                  type: "list",
                  placeholder: "Database Systems, Operating Systems",
                },
                { key: "contactOffice", label: "Contact office", placeholder: "IT-209" },
                { key: "head", label: "Department head", placeholder: "Department Head (TBA)" },
              ]}
            />
          </TabsContent>

          <TabsContent value="faqs">
            <CrudManager
              table="faqs"
              title="FAQ"
              rows={faqs}
              columns={["category", "question"]}
              fields={[
                { key: "category", label: "Category", placeholder: "Registration" },
                { key: "question", label: "Question", type: "textarea" },
                { key: "answer", label: "Answer", type: "textarea" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function CrudManager({
  table,
  title,
  rows,
  columns,
  fields,
}: {
  table: DataTable;
  title: string;
  rows: Row[];
  columns: string[];
  fields: Field[];
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const saveMutation = useMutation({
    mutationFn: (row: Row) => upsertRow(table, row),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      setOpen(false);
      setError("");
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Could not save this record.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRow(table, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      setError("");
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Could not delete this record.");
    },
  });

  function openAdd() {
    setEditing(null);
    setForm({});
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = row[f.key];
      next[f.key] = Array.isArray(v) ? (v as string[]).join(", ") : v == null ? "" : String(v);
    }
    setForm(next);
    setOpen(true);
  }

  function save() {
    const record: Row = { id: editing?.id ?? `${title}-${Date.now()}` };
    for (const f of fields) {
      const raw = form[f.key] ?? "";
      if (f.type === "list") {
        record[f.key] = raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === "number") {
        record[f.key] = Number(raw) || 0;
      } else {
        record[f.key] = raw;
      }
    }
    saveMutation.mutate(record);
  }

  function remove(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 className="font-display text-lg font-bold text-foreground">Manage {title}s</h2>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add {title}
        </Button>
      </div>

      {error && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((c) => (
                <th key={c} className="px-5 py-3 font-semibold">
                  {fields.find((f) => f.key === c)?.label ?? c}
                </th>
              ))}
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                {columns.map((c) => (
                  <td key={c} className="px-5 py-3 text-foreground">
                    {c === "code" ? (
                      <Badge variant="secondary" className="font-mono">
                        {String(row[c])}
                      </Badge>
                    ) : (
                      <span className="line-clamp-1">{String(row[c] ?? "")}</span>
                    )}
                  </td>
                ))}
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => remove(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-muted-foreground">
                  No {title.toLowerCase()}s yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "Add"} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.key}
                    value={form[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    id={f.key}
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : editing ? "Save changes" : `Add ${title}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

