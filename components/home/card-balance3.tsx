import { Card, Text } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const CardBalance3 = ({
   totalTransactions,
}: {
   totalTransactions?: number;
}) => {
   return (
      <Card
         css={{
            width: '100%',
            borderRadius: '$2xl',
            border: 'none',
            background:
               'linear-gradient(135deg, #17C964 0%, #12A150 55%, #0E8043 100%)',
            boxShadow: '0 12px 30px -12px rgba(23,201,100,0.5)',
            transition: 'transform .25s ease, box-shadow .25s ease',
            '&:hover': {
               transform: 'translateY(-4px)',
               boxShadow: '0 20px 40px -14px rgba(23,201,100,0.55)',
            },
         }}
      >
         <Card.Body css={{ p: '$10' }}>
            <Flex justify={'between'} align={'start'}>
               <Flex direction={'column'} css={{ gap: '$1' }}>
                  <Text
                     span
                     css={{ color: 'rgba(255,255,255,0.82)' }}
                     size={'$sm'}
                     weight={'medium'}
                  >
                     Total Transactions
                  </Text>
                  <Text span css={{ color: 'rgba(255,255,255,0.62)' }} size={'$xs'}>
                     {totalTransactions || 0} This Week
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
                  {totalTransactions || 0}
               </Text>
               <Box
                  css={{
                     display: 'inline-flex',
                     alignItems: 'center',
                     px: '$4',
                     py: '$1',
                     borderRadius: '$pill',
                     background: 'rgba(255,255,255,0.2)',
                     mb: '4px',
                  }}
               >
                  <Text span size={'$xs'} css={{ color: 'rgba(255,255,255,0.9)' }}>
                     New signups
                  </Text>
               </Box>
            </Flex>

            <Flex css={{ gap: '$3', mt: '$5' }} align={'center'}>
               <Box
                  css={{
                     width: '7px',
                     height: '7px',
                     borderRadius: '$pill',
                     background: '#FEE2E2',
                  }}
               />
               <Text span size={'$xs'} css={{ color: 'rgba(255,255,255,0.85)' }}>
                  Pending Payouts
               </Text>
            </Flex>
         </Card.Body>
      </Card>
   );
};
