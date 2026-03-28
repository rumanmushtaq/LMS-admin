import NextLink from 'next/link';
import React from 'react';
import {useSidebarContext} from '../layout/layout-context';

interface Props {
   title: string;
   icon: React.ReactNode;
   isActive?: boolean;
   href?: string;
}

export const SidebarItem = ({icon, title, isActive, href = ''}: Props) => {
   const {setCollapsed} = useSidebarContext();

   const handleClick = () => {
      if (window.innerWidth < 768) {
         setCollapsed();
      }
   };
   
   return (
      <NextLink href={href}>
         <a
            onClick={handleClick}
            className={`flex items-center gap-4 w-full min-h-[44px] h-full px-7 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
               isActive
                  ? 'bg-blue-50 text-blue-600 [&_svg_path]:fill-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
            }`}
         >
            {icon}
            <span className="text-base font-normal">
               {title}
            </span>
         </a>
      </NextLink>
   );
};
