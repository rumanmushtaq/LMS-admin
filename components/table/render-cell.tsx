import { Col, Row, Text, Tooltip } from '@nextui-org/react';
import React from 'react';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EditIcon } from '../icons/table/edit-icon';
import { EyeIcon } from '../icons/table/eye-icon';
import { RowUser } from './data';
import { IconButton, StyledBadge } from './table.styled';

interface Props {
   user: RowUser;
   columnKey: string | React.Key;
   onView?: (user: RowUser) => void;
   onEdit?: (user: RowUser) => void;
   onDelete?: (user: RowUser) => void;
}

const ROLE_LABELS: Record<string, string> = {
   tutor: 'Teacher',
   student: 'Student',
   admin: 'Admin',
};

// A palette of soft avatar backgrounds, picked deterministically per name so a
// given user keeps the same colour across renders.
const AVATAR_COLORS = [
   { bg: '#EDE9FE', fg: '#6D28D9' },
   { bg: '#DBEAFE', fg: '#1D4ED8' },
   { bg: '#DCFCE7', fg: '#15803D' },
   { bg: '#FEF3C7', fg: '#B45309' },
   { bg: '#FCE7F3', fg: '#BE185D' },
   { bg: '#CFFAFE', fg: '#0E7490' },
];

const initials = (name: string) =>
   name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('') || 'U';

const colorFor = (name: string) => {
   let h = 0;
   for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
   return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const formatJoined = (iso?: string) => {
   if (!iso) return '—';
   const d = new Date(iso);
   if (isNaN(d.getTime())) return '—';
   return `Joined ${d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
   })}`;
};

export const RenderCell = ({ user, columnKey, onView, onEdit, onDelete }: Props) => {
   switch (columnKey) {
      case 'name': {
         const c = colorFor(user.name || user.email || '');
         return (
            <Row align="center" css={{ gap: '$5' }}>
               <div
                  style={{
                     width: 40,
                     height: 40,
                     flexShrink: 0,
                     borderRadius: 12,
                     background: c.bg,
                     color: c.fg,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontWeight: 700,
                     fontSize: 14,
                  }}
               >
                  {initials(user.name || user.email || 'U')}
               </div>
               <Col css={{ minWidth: 0 }}>
                  <Text b size={14} css={{ m: 0, lineHeight: 1.2 }}>
                     {user.name || '—'}
                  </Text>
                  <Text size={13} css={{ m: 0, color: '$accents7' }}>
                     {user.email}
                  </Text>
               </Col>
            </Row>
         );
      }
      case 'role':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{ m: 0 }}>
                     {ROLE_LABELS[user.role] || user.role || '—'}
                  </Text>
               </Row>
               <Row>
                  <Text size={13} css={{ m: 0, color: '$accents7' }}>
                     {formatJoined(user.createdAt)}
                  </Text>
               </Row>
            </Col>
         );
      case 'status':
         return (
            // @ts-ignore — status is validated against the badge variants
            <StyledBadge type={String(user.status || 'active')}>
               {user.status || 'active'}
            </StyledBadge>
         );
      case 'actions':
         return (
            <Row justify="center" align="center" css={{ gap: '$8', '@md': { gap: 0 } }}>
               <Col css={{ d: 'flex' }}>
                  <Tooltip content="Details">
                     <IconButton onClick={() => onView?.(user)}>
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{ d: 'flex' }}>
                  <Tooltip content="Edit user">
                     <IconButton onClick={() => onEdit?.(user)}>
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{ d: 'flex' }}>
                  <Tooltip content="Delete user" color="error">
                     <IconButton onClick={() => onDelete?.(user)}>
                        <DeleteIcon size={20} fill="#FF0080" />
                     </IconButton>
                  </Tooltip>
               </Col>
            </Row>
         );
      default:
         return null;
   }
};
