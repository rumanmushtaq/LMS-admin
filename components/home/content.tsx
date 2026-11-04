import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Text, Link, Spinner } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Receipt, MonitorPlay, ShoppingBag } from 'lucide-react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { TableWrapper } from '../table/table';
import { CardBalance1 } from './card-balance1';
import { CardBalance2 } from './card-balance2';
import { CardBalance3 } from './card-balance3';
import { StatTile } from './stat-tile';
import adminService from '../../services/admin';
import paymentsService from '../../services/payments';
import { getAllClasses } from '../../services/classes';
import { formatMinor } from '../../utils/formatMoney';

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
   // Each tile loads on its own, so a slow or failing source only holds up
   // its own card. Errors are logged and the card falls back to zero.
   const { data: stats = null, isPending: statsLoading } = useQuery({
      queryKey: ['dashboard', 'stats'],
      queryFn: async () => {
         try {
            const data = await adminService.getDashboardStats();
            return data ? unwrap(data) : null;
         } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            throw error;
         }
      },
   });
   const { data: growth = null, isPending: chartLoading } = useQuery({
      queryKey: ['dashboard', 'growth', 12],
      queryFn: async () => {
         try {
            const data = await adminService.getGrowthAnalytics(12);
            return data ? unwrap(data) : null;
         } catch (error) {
            console.error('Failed to fetch growth analytics', error);
            throw error;
         }
      },
   });
   const { data: txnSummary = null, isPending: txnLoading } = useQuery({
      queryKey: ['dashboard', 'transactions-summary'],
      queryFn: async () => {
         try {
            const data = await paymentsService.getSummary({});
            return data ?? null;
         } catch (error) {
            console.error('Failed to fetch transaction summary', error);
            throw error;
         }
      },
   });
   const { data: classesCount = null, isPending: classesLoading } = useQuery({
      queryKey: ['dashboard', 'classes-count'],
      queryFn: async (): Promise<number> => {
         try {
            const res = await getAllClasses();
            const list = res?.data?.data ?? res?.data ?? res;
            return Array.isArray(list) ? list.length : list?.total ?? 0;
         } catch (error) {
            console.error('Failed to fetch classes', error);
            throw error;
         }
      },
   });
   const { data: productsCount = null, isPending: productsLoading } = useQuery({
      queryKey: ['dashboard', 'products-count'],
      queryFn: async (): Promise<number> => {
         try {
            const res = await adminService.getProducts({ page: 1, limit: 1 });
            const payload = res?.data ?? res;
            return payload?.totalCount ?? 0;
         } catch (error) {
            console.error('Failed to fetch products', error);
            throw error;
         }
      },
   });

   const paid = txnSummary?.byStatus?.paid;
   const paidCount = paid?.count ?? 0;
   const paidRevenueMinor = paid?.grossMinor ?? 0;

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
               loading={statsLoading}
               href="/teachers"
            />
            <CardBalance2
               totalStudents={stats?.totalStudents || 0}
               pendingUsers={stats?.pendingUsers || 0}
               studentDelta={growth?.studentDelta || 0}
               loading={statsLoading}
               href="/students"
            />
            <StatTile
               label="Transactions"
               caption="Paid across the platform"
               value={paidCount}
               hint={{
                  text: `${formatMinor(paidRevenueMinor, 'USD')} paid revenue`,
                  tone: 'good',
               }}
               accent="purple"
               icon={<Receipt size={20} />}
               loading={txnLoading}
               href="/transactions"
            />
            <StatTile
               label="Classes"
               caption="Scheduled and past"
               value={classesCount ?? 0}
               accent="teal"
               icon={<MonitorPlay size={20} />}
               loading={classesLoading}
               href="/classes"
            />
            <StatTile
               label="Products"
               caption="Listed in the shop"
               value={productsCount ?? 0}
               accent="amber"
               icon={<ShoppingBag size={20} />}
               loading={productsLoading}
               href="/shop"
            />
            <CardBalance3
               totalTransactions={stats?.recentSignups || 0}
               loading={statsLoading}
               href="/students"
            />
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
            <NextLink href="/students" legacyBehavior>
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
