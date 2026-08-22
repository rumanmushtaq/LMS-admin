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
import adminService from '../../services/admin';
import { Spinner } from '@nextui-org/react';

const Chart = dynamic(
   () => import('../charts/steam').then((mod) => mod.Steam),
   {
      ssr: false,
   }
);

const unwrap = (data: any) =>
   data && data.success && data.data ? data.data : data;

export const Content = () => {
   const [stats, setStats] = useState<any>(null);
   const [growth, setGrowth] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [chartLoading, setChartLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await adminService.getDashboardStats();
            if (data) setStats(unwrap(data));
         } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
         } finally {
            setLoading(false);
         }
      };
      const fetchGrowth = async () => {
         try {
            const data = await adminService.getGrowthAnalytics(12);
            if (data) setGrowth(unwrap(data));
         } catch (error) {
            console.error('Failed to fetch growth analytics', error);
         } finally {
            setChartLoading(false);
         }
      };
      fetchStats();
      fetchGrowth();
   }, []);

   return (
   <Box css={{overflow: 'hidden', height: '100%'}}>
      <Flex
         css={{
            'width': '100%',
            'pt': '$5',
            'height': 'fit-content',
            '@sm': {
               pt: '$10',
            },
         }}
      >
         <Flex
            css={{
               'width': '100%',
               'px': '$10',
               'mt': '$8',
               'gap': '$12',
               '@sm': {px: '$20'},
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
               <Box
                  css={{
                     'display': 'grid',
                     'gap': '$10',
                     'gridTemplateColumns': '1fr',
                     '@sm': {
                        gridTemplateColumns: 'repeat(3, 1fr)',
                     },
                  }}
               >
                  <CardBalance1
                     totalTutors={stats?.totalTutors || 0}
                     activeUsers={stats?.activeUsers || 0}
                     teacherDelta={growth?.teacherDelta || 0}
                  />
                  <CardBalance2
                     totalStudents={stats?.totalStudents || 0}
                     pendingUsers={stats?.pendingUsers || 0}
                     studentDelta={growth?.studentDelta || 0}
                  />
                  <CardBalance3 totalTransactions={stats?.recentSignups || 0} />
               </Box>
            </Box>

            {/* Chart */}
            <Box>
               <Flex
                  direction={'column'}
                  css={{
                     'alignItems': 'center',
                     'mb': '$4',
                     '@lg': { alignItems: 'flex-start' },
                  }}
               >
                  <Text h3 css={{ mb: '$0' }}>
                     Teachers vs Students Growth
                  </Text>
                  <Text
                     span
                     size={'$sm'}
                     css={{ color: '$accents7' }}
                  >
                     Cumulative registrations over the last 12 months
                  </Text>
               </Flex>
               <Box
                  css={{
                     width: '100%',
                     background: '$backgroundContrast',
                     boxShadow: '0 10px 40px -18px rgba(0,0,0,0.25)',
                     border: '1px solid $border',
                     borderRadius: '$2xl',
                     px: '$8',
                     py: '$8',
                  }}
               >
                  {chartLoading ? (
                     <Flex
                        align={'center'}
                        justify={'center'}
                        css={{ height: '425px' }}
                     >
                        <Spinner size={'lg'} />
                     </Flex>
                  ) : (
                     <Chart
                        categories={growth?.categories}
                        teachers={growth?.teachers}
                        students={growth?.students}
                     />
                  )}
               </Box>
            </Box>
         </Flex>
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
