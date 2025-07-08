
import React from 'react';
import { motion } from 'framer-motion';
import ProfileOverviewPanel from './ProfileOverviewPanel';
import AccountMetricsPanel from './AccountMetricsPanel';
import ConnectedSocialsPanel from './ConnectedSocialsPanel';
import PerformanceSnapshotPanel from './PerformanceSnapshotPanel';

const CreatorDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <ProfileOverviewPanel />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AccountMetricsPanel />
          </motion.div>
        </div>

        {/* Connected Socials Row */}
        <motion.div variants={itemVariants}>
          <ConnectedSocialsPanel />
        </motion.div>

        {/* Performance Row */}
        <motion.div variants={itemVariants}>
          <PerformanceSnapshotPanel />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreatorDashboard;
