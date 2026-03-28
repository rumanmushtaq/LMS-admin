import React, {useState, useEffect} from 'react';
import {ChevronUpIcon} from '../icons/sidebar/chevron-up-icon';
import {useSidebarContext} from '../layout/layout-context';
import NextLink from 'next/link';
import {useRouter} from 'next/router';

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

export const SidebarCollapseItem = ({icon, items, title, isActive}: Props) => {
   const [open, setOpen] = useState<boolean>(isActive || false);
   const {setCollapsed} = useSidebarContext();
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
            className={`flex items-center justify-between w-full min-h-[44px] h-full px-7 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
               isActive || open
                  ? 'bg-blue-50 text-blue-600 [&_svg_path]:fill-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={handleToggle}
         >
            <div className="flex items-center gap-4">
               {icon}
               <span className="text-base font-normal">{title}</span>
            </div>
            <ChevronUpIcon
               css={{
                  transition: 'transform 0.3s ease',
                  transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
               }}
            />
         </div>
         
         {open && (
            <div className="flex flex-col gap-1 pl-12 pr-4 pt-1">
               {items.map((item, index) => {
                  const isSubActive = router.pathname === item.href;
                  return (
                     <NextLink href={item.href} key={index}>
                        <a
                           onClick={handleClick}
                           className={`px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                              isSubActive
                                 ? 'text-blue-600 bg-blue-50/50 font-semibold'
                                 : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                           }`}
                        >
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
