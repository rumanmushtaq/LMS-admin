import React from 'react';
import { Community } from '../icons/community';
import { StatTile } from './stat-tile';

export const CardBalance1 = ({
   totalTutors,
   activeUsers,
   teacherDelta,
   loading,
}: {
   totalTutors?: number;
   activeUsers?: number;
   teacherDelta?: number;
   loading?: boolean;
}) => (
   <StatTile
      label="Total teachers"
      caption="Registered on the platform"
      value={totalTutors || 0}
      delta={{ value: teacherDelta ?? 0, period: 'this month' }}
      hint={{ text: `${activeUsers || 0} active platform users`, tone: 'good' }}
      accent="purple"
      icon={<Community color="#6D4AE8" />}
      loading={loading}
   />
);
