import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelTitle}>Progress</Text>
          <Text style={styles.labelPercent}>{clampedProgress}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress}%` }]} />
        <View style={styles.endDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  labelContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  labelPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  track: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  endDot: {
    position: 'absolute',
    right: 2,
    top: 1.5,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#2563EB',
  },
});
