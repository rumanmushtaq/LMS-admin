import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export interface RowAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  /** Extra classes for the item (e.g. a colour). */
  className?: string;
  /** Draw a divider above this item. */
  dividerBefore?: boolean;
  onSelect: () => void;
}

/**
 * A self-managed row actions dropdown.
 *
 * Replaces NextUI's <Dropdown> in table rows, whose react-stately collection +
 * overlay made the menu need a double click to open and dismissed itself the
 * moment an item was clicked. This is a plain button + absolutely positioned
 * list: one click opens it, one click on an item runs the action and then
 * closes it, and a click anywhere outside (or Escape) closes it.
 */
export const RowActionsMenu = ({ items }: { items: RowAction[] }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
          {items.map((item) => (
            <React.Fragment key={item.key}>
              {item.dividerBefore && (
                <div className="my-1 border-t border-gray-100" />
              )}
              <button
                type="button"
                role="menuitem"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#7047EB]/10 ${
                  item.className ?? ""
                }`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
