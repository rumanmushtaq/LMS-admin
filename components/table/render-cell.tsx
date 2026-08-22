import { Col, Row, Text, Tooltip } from '@nextui-org/react';
import React from 'react';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EditIcon } from '../icons/table/edit-icon';
import { EyeIcon } from '../icons/table/eye-icon';
import { RowUser } from './data';
import { IconButton, StyledBadge } from './table.styled';
import { colorFor, formatJoined, initials, roleLabel } from './user-row';

interface Props {
   user: RowUser;
   columnKey: string | React.Key;
   onView?: (user: RowUser) => void;
   onEdit?: (user: RowUser) => void;
   onDelete?: (user: RowUser) => void;
}

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
                     {roleLabel(user.role)}
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
