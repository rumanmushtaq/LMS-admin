import {Dropdown, Navbar} from '@nextui-org/react';
import {useRouter} from 'next/router';
import React from 'react';
import {NotificationIcon} from '../icons/navbar/notificationicon';
import {useAdminNotifications} from '../../store/adminNotifications';

export const NotificationsDropdown = () => {
   const router = useRouter();
   const items = useAdminNotifications((s) => s.items);
   const unreadCount = useAdminNotifications((s) => s.unreadCount);
   const markAllRead = useAdminNotifications((s) => s.markAllRead);

   const timeAgo = (iso: string) => {
      const diff = Date.now() - new Date(iso).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1) return 'just now';
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h ago`;
      return `${Math.floor(h / 24)}d ago`;
   };

   return (
      <Dropdown
         placement="bottom-right"
         onOpenChange={(open) => {
            // Opening the bell clears the unread count.
            if (open) markAllRead();
         }}
      >
         <Navbar.Item>
            <Dropdown.Trigger>
               <button
                  aria-label="Notifications"
                  className="bg-transparent border-none p-0 cursor-pointer outline-none flex items-center justify-center relative"
               >
                  <NotificationIcon />
                  {unreadCount > 0 && (
                     <span
                        style={{
                           position: 'absolute',
                           top: -4,
                           right: -4,
                           minWidth: 18,
                           height: 18,
                           padding: '0 5px',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           borderRadius: 9999,
                           background: '#e00000',
                           color: '#fff',
                           fontSize: 10,
                           fontWeight: 700,
                           lineHeight: 1,
                        }}
                     >
                        {unreadCount > 99 ? '99+' : unreadCount}
                     </span>
                  )}
               </button>
            </Dropdown.Trigger>
         </Navbar.Item>
         <Dropdown.Menu
            aria-label="Notifications"
            css={{
               '$$dropdownMenuWidth': '340px',
               '$$dropdownItemHeight': '70px',
               '& .nextui-dropdown-item': {
                  'py': '$4',
                  'svg': {color: '$secondary', mr: '$4'},
                  '& .nextui-dropdown-item-content': {w: '100%', fontWeight: '$semibold'},
               },
            }}
            onAction={(key) => {
               // Clicking a chat notification opens the moderation chat page.
               const item = items.find((i) => i.id === key);
               if (item?.conversationId) {
                  router.push(`/chat?openConversation=${item.conversationId}`);
               }
            }}
         >
            <Dropdown.Section title="Notifications">
               {items.length === 0 ? (
                  <Dropdown.Item key="empty" showFullDescription description="You're all caught up.">
                     No notifications yet
                  </Dropdown.Item>
               ) : (
                  (items.slice(0, 12).map((n) => (
                     <Dropdown.Item
                        key={n.id}
                        showFullDescription
                        description={`${n.content}${n.content ? ' · ' : ''}${timeAgo(n.createdAt)}`}
                     >
                        💬 {n.title}
                     </Dropdown.Item>
                  )) as any)
               )}
            </Dropdown.Section>
         </Dropdown.Menu>
      </Dropdown>
   );
};
