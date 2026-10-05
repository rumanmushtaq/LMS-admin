import { Navbar } from '@nextui-org/react';
import React from 'react';
import { Box } from '../styles/box';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';

interface Props {
   children: React.ReactNode;
}

/**
 * Top bar. Deliberately minimal: only controls that actually do something —
 * the mobile sidebar toggle, the notifications bell, and the user menu. The
 * template's search box, "Feedback?", support and GitHub links, and the
 * hardcoded collapse menu were inert placeholders and have been removed.
 */
export const NavbarWrapper = ({ children }: Props) => {
   return (
      <Box
         css={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
         }}
      >
         <Navbar
            isBordered
            css={{
               'borderBottom': '1px solid $border',
               'justifyContent': 'space-between',
               'width': '100%',
               '& .nextui-navbar-container': {
                  'border': 'none',
                  'maxWidth': '100%',
                  'gap': '$6',
                  'justifyContent': 'space-between',
               },
            }}
         >
            <Navbar.Content showIn="md">
               <BurguerButton />
            </Navbar.Content>

            {/* Spacer keeps the actions pinned to the right on wide screens. */}
            <Navbar.Content css={{ width: '100%' }} />

            <Navbar.Content>
               <NotificationsDropdown />
               <UserDropdown />
            </Navbar.Content>
         </Navbar>
         {children}
      </Box>
   );
};
