import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import adminService from "../../services/admin";
import { updateTeacherRows } from "./actions-menu";

interface Props {
  teacher: any;
  /** "icon" for a table row, "button" for the detail page. */
  variant?: "icon" | "button";
}

/**
 * Puts a tutor in (or takes them out of) the website's home page "Trending
 * Instructors" section. The star flips at once in every cached list page and
 * on the detail page, and goes back if the server refuses.
 */
export const TrendingToggle = ({ teacher, variant = "icon" }: Props) => {
  const queryClient = useQueryClient();
  const id: string = teacher._id || teacher.id;
  const trending = Boolean(teacher.isTrending);

  const setRow = (value: boolean) => {
    updateTeacherRows(queryClient, (rows) =>
      rows.map((t) => ((t._id || t.id) === id ? { ...t, isTrending: value } : t)),
    );
    queryClient.setQueryData(["teacher", id], (old: any) =>
      old ? { ...old, isTrending: value } : old,
    );
  };

  const mutation = useMutation({
    mutationFn: (next: boolean) => adminService.setTutorTrending(id, next),
    onMutate: async (next) => {
      // A refetch landing after the flip would put the old value back.
      await queryClient.cancelQueries({ queryKey: ["teachers"] });
      setRow(next);
      return { previous: trending };
    },
    onError: (_err, _next, ctx) => {
      setRow(Boolean(ctx?.previous));
      alert("Could not update trending. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
    },
  });

  const label = trending
    ? "Remove from Trending Instructors"
    : "Show in Trending Instructors";
  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    mutation.mutate(!trending);
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={mutation.isPending}
        aria-pressed={trending}
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-black transition-colors disabled:opacity-50 ${
          trending
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "border-2 border-amber-400 text-amber-600 hover:bg-amber-50"
        }`}
      >
        <Star size={18} className={trending ? "fill-current" : ""} />
        {trending ? "Trending — remove" : "Mark as Trending"}
      </button>
    );
  }

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={trending}
      onClick={toggle}
      disabled={mutation.isPending}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
        trending
          ? "text-amber-500 hover:bg-amber-500/10"
          : "text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
      }`}
    >
      <Star size={18} className={trending ? "fill-current" : ""} />
    </button>
  );
};
