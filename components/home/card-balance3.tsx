import React from 'react';
import { Community } from '../icons/community';
import { StatTile } from './stat-tile';

/**
 * Fed `recentSignups`, so it is labelled as signups — the old "Total
 * Transactions" title described a number this card never showed.
 */
export const CardBalance3 = ({
   totalTransactions,
}: {
   totalTransactions?: number;
}) => (
   <StatTile
      label="New signups"
      caption="Accounts created this week"
      value={totalTransactions || 0}
      accent="amber"
      icon={<Community color="#C98500" />}
   />
);
