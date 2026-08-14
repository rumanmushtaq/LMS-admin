import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance1 = ({ totalTutors, activeUsers }: { totalTutors?: number, activeUsers?: number }) => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$blue600',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ paddingTop: '$10', paddingBottom: '$10' }}>
            <Flex css={{gap: '$5'}}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{color: 'white'}}>
                     Total Teachers
                  </Text>
                  <Text span css={{color: 'white'}} size={'$xs'}>
                     {totalTutors || 0} Registered
                  </Text>
               </Flex>
            </Flex>
            <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
               <Text
                  span
                  size={'$xl'}
                  css={{color: 'white'}}
                  weight={'semibold'}
               >
                  {totalTutors || 0}
               </Text>
               <Text span css={{color: '$green600'}} size={'$xs'}>
                  Teachers
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
                  <Text span size={'$xs'} css={{color: '$white'}}>
                     {activeUsers || 0} Active Platform Users
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};
