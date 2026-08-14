import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance2 = ({ totalStudents, pendingUsers }: { totalStudents?: number, pendingUsers?: number }) => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$accents0',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ paddingTop: '$10', paddingBottom: '$10' }}>
            <Flex css={{gap: '$5'}}>
               <Community color={'$accents9'} />
               <Flex direction={'column'}>
                  <Text span css={{color: ''}}>
                     Total Students
                  </Text>
                  <Text span size={'$xs'}>
                     {totalStudents || 0} Registered
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
               <Text span size={'$xl'} weight={'semibold'}>
                  {totalStudents || 0}
               </Text>
               <Text span css={{color: '$red600'}} size={'$xs'}>
                  Students
               </Text>
            </Flex>
            <Flex css={{gap: '$12'}} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '$green600'}}
                     weight={'semibold'}
                  >
                     {'↑'}
                  </Text>
                  <Text span size={'$xs'}>
                     {pendingUsers || 0} Pending Verification
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};
