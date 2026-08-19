import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance3 = ({ totalTransactions }: { totalTransactions?: number }) => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$green600',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body css={{ paddingTop: '$10', paddingBottom: '$10' }}>
            <Flex css={{gap: '$5'}}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{color: 'white'}}>
                     Total Transactions
                  </Text>
                  <Text span css={{color: 'white'}} size={'$xs'}>
                     {totalTransactions || 0} This Week
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
                  {totalTransactions || 0}
               </Text>
               <Text span css={{color: '$red600'}} size={'$xs'}>
                  Transactions
               </Text>
            </Flex>
            <Flex css={{gap: '$12'}} align={'center'}>
               <Box>
                  <Text
                     span
                     size={'$xs'}
                     css={{color: '$red600'}}
                     weight={'semibold'}
                  >
                     {'↑'}
                  </Text>
                  <Text span size={'$xs'} css={{color: '$white'}}>
                     Pending Payouts
                  </Text>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};
