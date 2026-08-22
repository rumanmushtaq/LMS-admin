import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardBalance2 = ({
   totalStudents,
   pendingUsers,
   studentDelta,
}: {
   totalStudents?: number;
   pendingUsers?: number;
   studentDelta?: number;
}) => {
   return (
      <Card
         css={{
            width: '100%',
            borderRadius: '$2xl',
            background: '$backgroundContrast',
            border: '1px solid $border',
            boxShadow: '0 12px 30px -18px rgba(0,0,0,0.25)',
            transition: 'transform .25s ease, box-shadow .25s ease',
            '&:hover': {
               transform: 'translateY(-4px)',
               boxShadow: '0 20px 40px -18px rgba(0,0,0,0.28)',
            },
         }}
      >
         <Card.Body css={{ p: '$10' }}>
            <Flex justify={'between'} align={'start'}>
               <Flex direction={'column'} css={{ gap: '$1' }}>
                  <Text span css={{ color: '$accents9' }} size={'$sm'} weight={'medium'}>
                     Total Students
                  </Text>
                  <Text span css={{ color: '$accents7' }} size={'$xs'}>
                     {totalStudents || 0} Registered
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
                     background: 'rgba(23,201,100,0.12)',
                     '& svg': { color: '#17C964' },
                  }}
               >
                  <Community color={'#17C964'} />
               </Box>
            </Flex>

            <Flex css={{ gap: '$5', mt: '$7' }} align={'end'}>
               <Text
                  span
                  css={{ color: '$accents9', lineHeight: 1, fontSize: '2.4rem' }}
                  weight={'bold'}
               >
                  {totalStudents || 0}
               </Text>
               <Box
                  css={{
                     display: 'inline-flex',
                     alignItems: 'center',
                     gap: '2px',
                     px: '$4',
                     py: '$1',
                     borderRadius: '$pill',
                     background: 'rgba(23,201,100,0.14)',
                     mb: '4px',
                  }}
               >
                  <Text span size={'$xs'} weight={'bold'} css={{ color: '#12A150' }}>
                     ↑ {studentDelta ?? 0}
                  </Text>
                  <Text span size={'$xs'} css={{ color: '$accents7' }}>
                     this month
                  </Text>
               </Box>
            </Flex>

            <Flex css={{ gap: '$3', mt: '$5' }} align={'center'}>
               <Box
                  css={{
                     width: '7px',
                     height: '7px',
                     borderRadius: '$pill',
                     background: '#F5A524',
                  }}
               />
               <Text span size={'$xs'} css={{ color: '$accents8' }}>
                  {pendingUsers || 0} Pending Verification
               </Text>
            </Flex>
         </Card.Body>
      </Card>
   );
};
