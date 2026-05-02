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
        className={`flex items-center gap-4 w-full min-h-[44px] h-full px-7 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
          isActive
            ? "bg-[#7047EB]/10 text-[#7047EB] [&_svg_path]:fill-[#7047EB] font-semibold shadow-sm"
            : "text-[#a19db5] hover:bg-[#2d2645] hover:text-white [&_svg_path]:fill-[#a19db5]"
        }`}
      >
        {icon}
        <span className="text-base font-normal">{title}</span>
      </a>
    </NextLink>
  );
};
