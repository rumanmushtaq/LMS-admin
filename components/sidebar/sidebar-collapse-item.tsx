import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "../icons/sidebar/chevron-up-icon";
import { useSidebarContext } from "../layout/layout-context";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface SubItem {
  title: string;
  href: string;
}

interface Props {
  icon: React.ReactNode;
  title: string;
  items: SubItem[];
  isActive?: boolean;
}

export const SidebarCollapseItem = ({
  icon,
  items,
  title,
  isActive,
}: Props) => {
  const [open, setOpen] = useState<boolean>(isActive || false);
  const { setCollapsed } = useSidebarContext();
  const router = useRouter();

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const handleToggle = () => setOpen(!open);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className={`relative flex items-center justify-between w-full min-h-[44px] h-full px-7 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 group ${
          isActive || open ? "bg-[#7047EB]/10 font-bold" : "hover:bg-[#f1f5f9]"
        }`}
        style={{ color: isActive || open ? "#7047EB" : "#4b5563" }}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-4">
          {isActive && !open && (
            <div className="absolute left-0 w-1 h-6 bg-[#7047EB] rounded-r-full shadow-[0_0_8px_#7047EB]" />
          )}
          <div
            className={`transition-transform duration-200 ${isActive || open ? "scale-110" : "group-hover:scale-110"} [&_svg_path]:fill-current`}
          >
            {icon}
          </div>
          <span className="text-base font-medium">{title}</span>
        </div>
        <ChevronUpIcon
          css={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(-180deg)" : "rotate(0deg)",
            "& path": { fill: isActive || open ? "#7047EB" : "#4b5563" },
          }}
        />
      </div>

      {open && (
        <div className="flex flex-col gap-1 pl-14 pr-4 pt-1 pb-2">
          {items.map((item, index) => {
            const isSubActive = router.pathname === item.href;
            return (
              <NextLink href={item.href} key={index} legacyBehavior>
                <a
                  onClick={handleClick}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-3 ${
                    isSubActive
                      ? "bg-[#7047EB]/10 font-bold"
                      : "hover:bg-[#f1f5f9]"
                  }`}
                  style={{ color: isSubActive ? "#7047EB" : "#4b5563" }}
                >
                  {isSubActive && (
                    <div className="absolute left-0 w-1 h-4 bg-[#7047EB] rounded-r-full" />
                  )}
                  {item.title}
                </a>
              </NextLink>
            );
          })}
        </div>
      )}
    </div>
  );
};
