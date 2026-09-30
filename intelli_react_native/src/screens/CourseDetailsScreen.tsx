import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { LessonRow } from '../components/course/LessonRow';
import { ProgressBar } from '../components/course/ProgressBar';
import { LoadingView } from '../components/common/LoadingView';
import { Button } from '../components/common/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetails'>;

export const CourseDetailsScreen: React.FC<Props> = ({ route }) => {
  const { courseId, title } = route.params;
  const { status, course, lessons, errorMessage, retry } = useCourseDetails(courseId);

  if (status === 'loading') {
    return <LoadingView message="Loading lessons..." />;
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Could not load course details</Text>
        <Text style={styles.errorMessage}>{errorMessage || 'Please try again.'}</Text>
        <Button title="Retry" onPress={retry} style={styles.retryButton} />
      </SafeAreaView>
    );
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const displayProgress = course ? course.progress : Math.round((completedCount / (lessons.length || 1)) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Course Header Summary */}
      <View style={styles.headerCard}>
        <Text style={styles.courseTitle}>{course ? course.title : title}</Text>
        {course?.instructor && (
          <Text style={styles.instructorText}>Instructor: {course.instructor}</Text>
        )}
        <View style={styles.progressContainer}>
          <ProgressBar progress={displayProgress} />
          <Text style={styles.statsText}>
            {completedCount} of {lessons.length} lessons completed
          </Text>
        </View>
      </View>

      {/* Lessons List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        <Text style={styles.sectionSubtitle}>(Read-Only)</Text>
      </View>

      {/* Lessons List */}
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <LessonRow lesson={item} index={index} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyLessons}>
            <Text style={styles.emptyLessonsText}>No lessons found for this course.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  instructorText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },
  progressContainer: {
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
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
  },
  retryButton: {
    minWidth: 140,
  },
  emptyLessons: {
    padding: 32,
    alignItems: 'center',
  },
  emptyLessonsText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
