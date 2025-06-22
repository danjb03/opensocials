
import React from 'react';
import SecurePendingDeals from './SecurePendingDeals';
import { LegacyDeal } from '@/types/deals';

interface PendingDealsProps {
  deals: LegacyDeal[];
}

const PendingDeals = ({ deals }: PendingDealsProps) => {
  return <SecurePendingDeals deals={deals} />;
};

export default PendingDeals;
