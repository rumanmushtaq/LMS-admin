import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2, PlayCircle, Video as VideoIcon } from "lucide-react";
import AdminService from "../../services/admin";
import { AddBanner } from "./add-banner";
import { formatDate } from "../../utils/formatDate";

interface TableWrapperProps {
  addButton?: React.ReactNode;
}

interface Banner {
  _id: string;
  videoUrl: string;
  isActive: boolean;
  createdAt?: string;
}

/** A pulsing placeholder card shown while banners load. */
const SkeletonCard = () => (
  <div className="rounded-2xl border border-[#ece9f6] bg-white overflow-hidden">
    <div className="aspect-video bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
    </div>
  </div>
);

const BannerCard = ({ banner }: { banner: Banner }) => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteHeroBanner(id),
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: (next: boolean) =>
      AdminService.updateHeroBanner(banner._id, { isActive: next }),
    onSuccess: invalidate,
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(banner._id);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-[#ece9f6] bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Video preview */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {banner.videoUrl ? (
          <video
            // The media fragment seeks to 0.5s so the browser paints a real
            // frame as the thumbnail instead of a black poster.
            src={`${banner.videoUrl}#t=0.5`}
            preload="metadata"
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onMouseOver={(e) => {
              const v = e.currentTarget;
              v.play().catch(() => {});
            }}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 gap-2 text-sm">
            <VideoIcon className="w-5 h-5" />
            No video
          </div>
        )}

        {/* Play hint */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <PlayCircle className="w-10 h-10 text-white/90 drop-shadow" />
        </div>

        {/* Status badge — click to toggle */}
        <button
          onClick={() => toggleMutation.mutate(!banner.isActive)}
          disabled={toggleMutation.isPending}
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-md transition-all disabled:opacity-60 ${
            banner.isActive
              ? "bg-green-500/90 text-white hover:bg-green-600"
              : "bg-gray-400/90 text-white hover:bg-gray-500"
          }`}
          title="Click to toggle status"
        >
          {toggleMutation.isPending && (
            <Loader2 className="w-3 h-3 animate-spin" />
          )}
          {banner.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      {/* Meta + actions */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500">
            Added {formatDate(banner.createdAt)}
          </p>
          <p
            className="mt-0.5 text-[11px] text-gray-400 truncate max-w-[200px]"
            title={banner.videoUrl}
          >
            {banner.videoUrl}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <AddBanner banner={banner} isEdit />
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete banner"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TableWrapper = ({ addButton }: TableWrapperProps) => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: () => AdminService.getHeroBanners(),
  });

  const list: Banner[] = banners?.data ?? banners ?? [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {isLoading
            ? "Loading banners…"
            : `${list.length} banner${list.length === 1 ? "" : "s"}`}
        </p>
        {addButton}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#e6e3f0] py-20 text-center">
          <VideoIcon className="w-10 h-10 text-gray-300" />
          <p className="font-semibold text-gray-600">No banners yet</p>
          <p className="text-sm text-gray-400">
            Add your first promotional video banner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((banner) => (
            <BannerCard key={banner._id} banner={banner} />
          ))}
        </div>
      )}
    </div>
  );
};
