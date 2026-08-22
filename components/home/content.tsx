import React, { useEffect, useState } from 'react';
import { Text, Link, Spinner } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { TableWrapper } from '../table/table';
import { CardBalance1 } from './card-balance1';
import { CardBalance2 } from './card-balance2';
import { CardBalance3 } from './card-balance3';
import adminService from '../../services/admin';

const Chart = dynamic(
   () => import('../charts/steam').then((mod) => mod.Steam),
   { ssr: false }
);

const unwrap = (data: any) =>
   data && data.success && data.data ? data.data : data;

const todayLabel = () =>
   new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
   });

export const Content = () => {
   const [stats, setStats] = useState<any>(null);
   const [growth, setGrowth] = useState<any>(null);
   const [chartLoading, setChartLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await adminService.getDashboardStats();
            if (data) setStats(unwrap(data));
         } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
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
      <Box
         css={{
            width: '100%',
            px: '$12',
            py: '$10',
            '@xsMax': { px: '$8' },
         }}
      >
         {/* Page header */}
         <Flex
            justify="between"
            align="end"
            wrap="wrap"
            css={{ gap: '$6', mb: '$10' }}
         >
            <Box>
               <Text
                  h3
                  css={{ m: 0, fontSize: '22px', letterSpacing: '-0.01em' }}
               >
                  Overview
               </Text>
               <Text css={{ m: 0, mt: '2px', fontSize: '13px', color: '$accents7' }}>
                  Platform totals and growth · {todayLabel()}
               </Text>
            </Box>
         </Flex>

         {/* Stat tiles */}
         <Flex wrap="wrap" css={{ gap: '$8', mb: '$10' }}>
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
         </Flex>

         {/* Growth chart */}
         <Box css={{ mb: '$12' }}>
            {chartLoading ? (
               <Flex
                  align="center"
                  justify="center"
                  css={{
                     height: '404px',
                     background: '$backgroundContrast',
                     border: '1px solid $border',
                     borderRadius: '16px',
                  }}
               >
                  <Spinner size="lg" />
               </Flex>
            ) : (
               <Chart
                  categories={growth?.categories}
                  teachers={growth?.teachers}
                  students={growth?.students}
                  teacherDelta={growth?.teacherDelta}
                  studentDelta={growth?.studentDelta}
               />
            )}
         </Box>

         {/* Latest users */}
         <Flex justify="between" align="end" wrap="wrap" css={{ gap: '$4', mb: '$4' }}>
            <Box>
               <Text
                  css={{ m: 0, fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}
               >
                  Latest users
               </Text>
               <Text css={{ m: 0, mt: '2px', fontSize: '13px', color: '$accents7' }}>
                  Most recently created accounts
               </Text>
            </Box>
            <NextLink href="/accounts" legacyBehavior>
               <Link block color="primary" css={{ fontSize: '13px', fontWeight: 600 }}>
                  View all
               </Link>
            </NextLink>
         </Flex>
         <Box
            css={{
               background: '$backgroundContrast',
               border: '1px solid $border',
               borderRadius: '16px',
               px: '$6',
               py: '$4',
               overflow: 'hidden',
            }}
         >
            <TableWrapper />
         </Box>
      </Box>
   );
};
