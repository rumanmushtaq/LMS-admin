import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Loader2,
  PlayCircle,
  Video as VideoIcon,
  Calendar,
  ExternalLink,
} from "lucide-react";
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
  const [previewError, setPreviewError] = useState(false);

  // Strip protocol/query for a compact, readable source label.
  const hostLabel = (() => {
    try {
      return new URL(banner.videoUrl).hostname.replace(/^www\./, "");
    } catch {
      return banner.videoUrl || "—";
    }
  })();

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
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {banner.videoUrl && !previewError ? (
          <video
            // The media fragment seeks to 0.5s so the browser paints a real
            // frame as the thumbnail instead of a black poster.
            src={`${banner.videoUrl}#t=0.5`}
            preload="metadata"
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
            onMouseOver={(e) => {
              const v = e.currentTarget;
              v.play().catch(() => {});
            }}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <VideoIcon className="w-8 h-8" />
            <span className="text-xs font-medium">
              {banner.videoUrl ? "Preview unavailable" : "No video"}
            </span>
          </div>
        )}

        {/* Play hint — only over a real preview */}
        {banner.videoUrl && !previewError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <PlayCircle className="w-10 h-10 text-white/90 drop-shadow" />
          </div>
        )}

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
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDate(banner.createdAt)}
          </p>
          {banner.videoUrl && (
            <a
              href={banner.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={banner.videoUrl}
              className="mt-1 inline-flex max-w-[180px] items-center gap-1 truncate text-[11px] text-[#7047EB] hover:underline"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{hostLabel}</span>
            </a>
          )}
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
