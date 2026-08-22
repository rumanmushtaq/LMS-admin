import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardBalance1 = ({
   totalTutors,
   activeUsers,
   teacherDelta,
}: {
   totalTutors?: number;
   activeUsers?: number;
   teacherDelta?: number;
}) => {
   return (
      <Card
         css={{
            width: '100%',
            borderRadius: '$2xl',
            border: 'none',
            background:
               'linear-gradient(135deg, #0A84FF 0%, #0060DF 55%, #0047AB 100%)',
            boxShadow: '0 12px 30px -12px rgba(10,132,255,0.55)',
            transition: 'transform .25s ease, box-shadow .25s ease',
            '&:hover': {
               transform: 'translateY(-4px)',
               boxShadow: '0 20px 40px -14px rgba(10,132,255,0.6)',
            },
         }}
      >
         <Card.Body css={{ p: '$10' }}>
            <Flex justify={'between'} align={'start'}>
               <Flex direction={'column'} css={{ gap: '$1' }}>
                  <Text
                     span
                     css={{ color: 'rgba(255,255,255,0.82)', letterSpacing: '.2px' }}
                     size={'$sm'}
                     weight={'medium'}
                  >
                     Total Teachers
                  </Text>
                  <Text span css={{ color: 'rgba(255,255,255,0.62)' }} size={'$xs'}>
                     {totalTutors || 0} Registered
                  </Text>
               </Flex>
               <Box
                  css={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     width: '44px',
                     height: '44px',
                     borderRadius: '$xl',
                     background: 'rgba(255,255,255,0.18)',
                     backdropFilter: 'blur(4px)',
                     '& svg': { color: '#fff' },
                  }}
               >
                  <Community />
               </Box>
            </Flex>

            <Flex css={{ gap: '$5', mt: '$7' }} align={'end'}>
               <Text
                  span
                  css={{ color: '#fff', lineHeight: 1, fontSize: '2.4rem' }}
                  weight={'bold'}
               >
                  {totalTutors || 0}
               </Text>
               <TrendPill delta={teacherDelta} />
            </Flex>

            <Flex css={{ gap: '$3', mt: '$5' }} align={'center'}>
               <Box
                  css={{
                     width: '7px',
                     height: '7px',
                     borderRadius: '$pill',
                     background: '#4ADE80',
                     boxShadow: '0 0 8px #4ADE80',
                  }}
               />
               <Text span size={'$xs'} css={{ color: 'rgba(255,255,255,0.85)' }}>
                  {activeUsers || 0} Active Platform Users
               </Text>
            </Flex>
         </Card.Body>
      </Card>
   );
};

/** Small "↑ N this month" pill, used on the colored cards. */
const TrendPill = ({ delta }: { delta?: number }) => {
   const value = delta ?? 0;
   return (
      <Box
         css={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            px: '$4',
            py: '$1',
            borderRadius: '$pill',
            background: 'rgba(255,255,255,0.2)',
            mb: '4px',
         }}
      >
         <Text span size={'$xs'} weight={'bold'} css={{ color: '#EAFBF0' }}>
            ↑ {value}
         </Text>
         <Text span size={'$xs'} css={{ color: 'rgba(255,255,255,0.8)' }}>
            this month
         </Text>
      </Box>
   );
};
