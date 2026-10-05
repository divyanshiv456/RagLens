import React from 'react';
import HealthScoreRing from './HealthScoreRing';

export default function HealthScoreBadge({ score = 0, status = 'Healthy', size = 'normal' }) {
  return <HealthScoreRing score={score} status={status} size={size} />;
}
