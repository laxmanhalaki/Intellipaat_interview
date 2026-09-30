import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { useCourses } from '../hooks/useCourses';
import { useNetwork } from '../context/NetworkContext';
import { CourseCard } from '../components/course/CourseCard';
import { LoadingView } from '../components/common/LoadingView';
import { Button } from '../components/common/Button';
import { Course } from '../types/course';
import { showToast } from '../utils/toast';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { status, courses, errorMessage, isRefreshing, refresh, retry } = useCourses();
  const { isConnected, isSimulatedOffline, toggleOfflineSimulation } = useNetwork();

  const effectiveIsOnline = isConnected ?? true;

  // Calculate safe top padding covering status bar, camera hole, and notches
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
    20
  );

  const handleToggleOffline = () => {
    toggleOfflineSimulation();
    if (!isSimulatedOffline) {
      showToast.info('Offline Mode', 'Simulation active: reading from SQLite cache');
    } else {
      showToast.success('Online Mode', 'Restored live network connectivity');
    }
  };

  const handleContinue = (course: Course) => {
    navigation.navigate('CourseDetails', {
      courseId: course.id,
      title: course.title,
    });
  };

  return (
    <View style={styles.container}>
      {/* Inline Header Bar with proper Safe Area padding */}
      <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
        <Text style={styles.headerTitle}>Courses</Text>
        <View style={styles.headerRight}>
          <Pressable
            style={[
              styles.statusBadge,
              effectiveIsOnline ? styles.onlineBadge : styles.offlineBadge,
            ]}
            onPress={handleToggleOffline}
            accessibilityRole="button"
            accessibilityLabel={`Connection status: ${effectiveIsOnline ? 'Online' : 'Offline'}. Tap to toggle simulation.`}
          >
            <Text style={[styles.statusDot, effectiveIsOnline ? styles.onlineDot : styles.offlineDot]}>
              ●
            </Text>
            <Text style={[styles.statusText, effectiveIsOnline ? styles.onlineText : styles.offlineText]}>
              {effectiveIsOnline ? 'Online' : 'Offline'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.refreshBtn, pressed && styles.refreshBtnPressed]}
            onPress={refresh}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Refresh course list"
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </Pressable>
        </View>
      </View>

      {status === 'loading' && <LoadingView message="Loading courses..." />}

      {status === 'error' && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Connection Problem</Text>
          <Text style={styles.errorMessage}>
            {errorMessage || 'Unable to load courses. Please check your connection.'}
          </Text>
          <Button title="Retry" onPress={retry} style={styles.retryButton} />
        </View>
      )}

      {status === 'empty' && (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No courses available</Text>
          <Text style={styles.emptySubtitle}>Check back later or pull down to refresh.</Text>
          <Button title="Refresh" onPress={refresh} style={styles.retryButton} />
        </View>
      )}

      {status === 'success' && (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CourseCard course={item} onContinue={handleContinue} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 16,
  },
  onlineBadge: {
    backgroundColor: '#EDF7ED',
  },
  offlineBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    fontSize: 10,
    marginRight: 6,
  },
  onlineDot: {
    color: '#2E7D32',
  },
  offlineDot: {
    color: '#DC2626',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  onlineText: {
    color: '#2E7D32',
  },
  offlineText: {
    color: '#DC2626',
  },
  refreshBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtnPressed: {
    opacity: 0.5,
  },
  refreshIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  listContent: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 140,
  },
});
