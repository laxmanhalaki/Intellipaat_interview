import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../../context/NetworkContext';

export const OfflineBanner: React.FC = () => {
  const { isConnected } = useNetwork();

  // If connected, hide banner
  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️ Offline Mode — Showing cached courses (SQLite)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#374151',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
});
