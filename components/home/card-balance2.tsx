import React from 'react';
import { Community } from '../icons/community';
import { StatTile } from './stat-tile';

export const CardBalance2 = ({
   totalStudents,
   pendingUsers,
   studentDelta,
}: {
   totalStudents?: number;
   pendingUsers?: number;
   studentDelta?: number;
}) => (
   <StatTile
      label="Total students"
      caption="Registered on the platform"
      value={totalStudents || 0}
      delta={{ value: studentDelta ?? 0, period: 'this month' }}
      hint={{
         text: `${pendingUsers || 0} pending verification`,
         tone: (pendingUsers || 0) > 0 ? 'warning' : 'neutral',
      }}
      accent="teal"
      icon={<Community color="#0EA5A4" />}
   />
);
