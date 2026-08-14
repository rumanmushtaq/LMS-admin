import React, { useEffect, useState } from 'react';
import {Text, Link} from '@nextui-org/react';
import {Box} from '../styles/box';
import dynamic from 'next/dynamic';
import {Flex} from '../styles/flex';
import {TableWrapper} from '../table/table';
import NextLink from 'next/link';
import {CardBalance1} from './card-balance1';
import {CardBalance2} from './card-balance2';
import {CardBalance3} from './card-balance3';
import {CardAgents} from './card-agents';
import {CardTransactions} from './card-transactions';
import adminService from '../../services/admin';
import { Spinner } from '@nextui-org/react';

const Chart = dynamic(
   () => import('../charts/steam').then((mod) => mod.Steam),
   {
      ssr: false,
   }
);

export const Content = () => {
   const [stats, setStats] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await adminService.getDashboardStats();
            if (data && data.success && data.data) {
               setStats(data.data);
            } else if (data) { // If it returns the object directly
               setStats(data);
            }
         } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
         } finally {
            setLoading(false);
         }
      };
      fetchStats();
   }, []);

   return (
   <Box css={{overflow: 'hidden', height: '100%'}}>
      <Flex
         css={{
            'gap': '$8',
            'pt': '$5',
            'height': 'fit-content',
            'flexWrap': 'wrap',
            '@lg': {
               flexWrap: 'nowrap',
            },
            '@sm': {
               pt: '$10',
            },
         }}
         justify={'center'}
      >
         <Flex
            css={{
               'px': '$12',
               'mt': '$8',
               '@xsMax': {px: '$10'},
               'gap': '$12',
            }}
            direction={'column'}
         >
            {/* Card Section Top */}
            <Box>
               <Text
                  h3
                  css={{
                     'textAlign': 'center',
                     '@sm': {
                        textAlign: 'inherit',
                     },
                  }}
               >
                  Available Balance
               </Text>
               <Flex
                  css={{
                     'gap': '$10',
                     'flexWrap': 'wrap',
                     'justifyContent': 'center',
                     '@sm': {
                        flexWrap: 'nowrap',
                     },
                  }}
                  direction={'row'}
               >
                  <CardBalance1 totalTutors={stats?.totalTutors || 0} activeUsers={stats?.activeUsers || 0} />
                  <CardBalance2 totalStudents={stats?.totalStudents || 0} pendingUsers={stats?.pendingUsers || 0} />
                  <CardBalance3 totalTransactions={stats?.recentSignups || 0} />
               </Flex>
            </Box>

            {/* Chart */}
            <Box>
               <Text
                  h3
                  css={{
                     'textAlign': 'center',
                     '@lg': {
                        textAlign: 'inherit',
                     },
                  }}
               >
                  Statistics
               </Text>
               <Box
                  css={{
                     width: '100%',
                     backgroundColor: '$accents0',
                     boxShadow: '$lg',
                     borderRadius: '$2xl',
                     px: '$10',
                     py: '$10',
                  }}
               >
                  <Chart />
               </Box>
            </Box>
         </Flex>

         {/* Left Section */}
         <Box
            css={{
               'px': '$12',
               'mt': '$8',
               'height': 'fit-content',
               '@xsMax': {px: '$10'},
               'gap': '$6',
               'overflow': 'hidden',
            }}
         >
            <Text
               h3
               css={{
                  'textAlign': 'center',
                  '@lg': {
                     textAlign: 'inherit',
                  },
               }}
            >
               Section
            </Text>
            <Flex
               direction={'column'}
               justify={'center'}
               css={{
                  'gap': '$8',
                  'flexDirection': 'row',
                  'flexWrap': 'wrap',
                  '@sm': {
                     flexWrap: 'nowrap',
                  },
                  '@lg': {
                     flexWrap: 'nowrap',
                     flexDirection: 'column',
                  },
               }}
            >
               <CardAgents />
               <CardTransactions />
            </Flex>
         </Box>
      </Flex>

      {/* Table Latest Users */}
      <Flex
         direction={'column'}
         justify={'center'}
         css={{
            'width': '100%',
            'py': '$10',
            'px': '$10',
            'mt': '$8',
            '@sm': {px: '$20'},
         }}
      >
         <Flex justify={'between'} wrap={'wrap'}>
            <Text
               h3
               css={{
                  'textAlign': 'center',
                  '@lg': {
                     textAlign: 'inherit',
                  },
               }}
            >
               Latest Users
            </Text>
            <NextLink href="/accounts" legacyBehavior>
               <Link
                  block
                  color="primary"
                  css={{
                     'textAlign': 'center',
                     '@lg': {
                        textAlign: 'inherit',
                     },
                  }}
               >
                  View All
               </Link>
            </NextLink>
         </Flex>
         <TableWrapper />
      </Flex>
   </Box>
   );
};
