import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../layout/layout-context";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  const { setCollapsed } = useSidebarContext();

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };

  return (
    <NextLink href={href} legacyBehavior>
      <a
        onClick={handleClick}
        className={`relative flex items-center gap-4 w-full min-h-[44px] h-full px-7 rounded-xl cursor-pointer transition-all duration-200 active:scale-95 group ${
          isActive
            ? "bg-[#7047EB]/10 font-bold shadow-sm"
            : "hover:bg-[#f1f5f9]"
        }`}
        style={{ color: isActive ? "#7047EB" : "#4b5563" }}
      >
        {/* Active Indicator Bar */}
        {isActive && (
          <div className="absolute left-0 w-1 h-6 bg-[#7047EB] rounded-r-full shadow-[0_0_8px_#7047EB]" />
        )}

        <div
          className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"} [&_svg_path]:fill-current`}
        >
          {icon}
        </div>
        <span className="text-base font-medium">{title}</span>
      </a>
    </NextLink>
  );
};
