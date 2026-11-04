import React, { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  Eye,
  Edit3,
  MoreVertical,
  Trash2,
  Slash,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

/** One cached page of the teachers list, as table.tsx stores it. */
export interface TeacherPage {
  teachers: any[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

/**
 * Edits the rows of every cached ["teachers", ...] page — whichever page or
 * filter the row is sitting on — so a change shows without a refetch.
 */
export const updateTeacherRows = (
  queryClient: QueryClient,
  fn: (rows: any[]) => any[],
) =>
  queryClient.setQueriesData<TeacherPage>({ queryKey: ["teachers"] }, (old) =>
    old ? { ...old, teachers: fn(old.teachers) } : old,
  );

/** Sets one teacher's status in every cached list page. */
export const setTeacherStatus = (
  queryClient: QueryClient,
  id: string,
  status: string,
) =>
  updateTeacherRows(queryClient, (rows) =>
    rows.map((t) => ((t._id || t.id) === id ? { ...t, status } : t)),
  );

const loadAdminService = () =>
  import("../../services/admin").then((m) => m.default);

interface Props {
  teacher: any;
  onRefresh?: () => void;
  onVerify?: () => void;
  router?: any;
}

/**
 * Self-managed actions dropdown for a teacher row.
 *
 * Replaces NextUI's <Dropdown>, whose react-stately collection + overlay made
 * the menu need a double click to open and dismissed itself the moment an item
 * was clicked (the pointer leaving the trigger dropped focus out of its
 * FocusScope before the action ran). This is a plain button + absolutely
 * positioned list: one click opens it, one click on an item runs the action
 * and then closes it, and a click anywhere outside closes it.
 */
export const TeacherActionsMenu = ({
  teacher,
  onRefresh,
  onVerify,
  router,
}: Props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const id = teacher._id || teacher.id;
  const isActive = teacher.status === "active";

  /** Quietly refetch the list (and this teacher's detail page) in the background. */
  const refreshQuietly = () => {
    queryClient.invalidateQueries({ queryKey: ["teachers"] });
    queryClient.invalidateQueries({ queryKey: ["teacher", id] });
  };

  const deleteMutation = useMutation({
    mutationFn: async () => (await loadAdminService()).deleteUser(id),
    onSuccess: () => {
      // Drop the row right away; the rest of the table stays put.
      queryClient.setQueriesData<TeacherPage>(
        { queryKey: ["teachers"] },
        (old) => {
          if (!old) return old;
          const teachers = old.teachers.filter((t) => (t._id || t.id) !== id);
          if (teachers.length === old.teachers.length) return old;
          return {
            ...old,
            teachers,
            meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
          };
        },
      );
      alert("Teacher deleted successfully");
      refreshQuietly();
      onRefresh?.();
    },
    onError: () => {
      alert("Failed to delete teacher");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (action: "suspend" | "activate") => {
      const adminService = await loadAdminService();
      return action === "suspend"
        ? adminService.suspendUser(id)
        : adminService.activateUser(id);
    },
    onMutate: async (action) => {
      // Flip the badge immediately and keep a snapshot to revert to.
      await queryClient.cancelQueries({ queryKey: ["teachers"] });
      const previous = queryClient.getQueriesData<TeacherPage>({
        queryKey: ["teachers"],
      });
      setTeacherStatus(
        queryClient,
        id,
        action === "suspend" ? "suspended" : "active",
      );
      return { previous };
    },
    onSuccess: (_res, action) => {
      alert(
        action === "suspend"
          ? "Teacher suspended successfully"
          : "Teacher activated successfully",
      );
      // With a status filter applied the row may no longer belong in the
      // list, so refresh — quietly, without blanking the table.
      refreshQuietly();
      onRefresh?.();
    },
    onError: (_err, action, context) => {
      // Put the rows back the way they were; the server never accepted it.
      context?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      alert(`Failed to ${action} teacher`);
    },
  });

  const getFullName = () =>
    `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
    teacher.name;

  // Close on any click outside the menu, and on Escape.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (target: string) => {
    if (router) router.push(target);
    else window.location.href = target;
  };

  const run = (action: "view" | "edit" | "verify" | "suspend" | "activate" | "delete") => {
    setOpen(false);
    if (action === "view") return go(`/teachers/${id}`);
    if (action === "edit") return go(`/teachers/${id}?edit=1`);
    if (action === "verify") return onVerify?.();
    if (action === "delete") {
      if (!confirm(`Are you sure you want to delete ${getFullName()}?`)) return;
      deleteMutation.mutate();
      return;
    }
    // suspend | activate
    statusMutation.mutate(action);
  };

  const itemClass =
    "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-[#7047EB]/10";

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" role="menuitem" className={itemClass} onClick={() => run("view")}>
            <Eye size={16} /> View Detail
          </button>
          <button type="button" role="menuitem" className={itemClass} onClick={() => run("edit")}>
            <Edit3 size={16} /> Edit Profile
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-[#7047EB]`}
            onClick={() => run("verify")}
          >
            <ShieldCheck size={16} /> Verify Account
          </button>
          <div className="my-1 border-t border-gray-100" />
          {isActive ? (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-amber-600`}
              onClick={() => run("suspend")}
            >
              <Slash size={16} /> Suspend
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-green-600`}
              onClick={() => run("activate")}
            >
              <CheckCircle2 size={16} /> Activate
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-red-600`}
            onClick={() => run("delete")}
          >
            <Trash2 size={16} /> Delete Profile
          </button>
        </div>
      )}
    </div>
  );
};
