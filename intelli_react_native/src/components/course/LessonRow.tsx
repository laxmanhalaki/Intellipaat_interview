import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lesson } from '../../types/course';

interface LessonRowProps {
  lesson: Lesson;
  index: number;
}

export const LessonRow: React.FC<LessonRowProps> = ({ lesson, index }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.statusCircle,
            lesson.completed ? styles.statusCircleCompleted : styles.statusCirclePending,
          ]}
        >
          <Text
            style={[
              styles.statusIcon,
              lesson.completed ? styles.statusIconCompleted : styles.statusIconPending,
            ]}
          >
            {lesson.completed ? '✓' : '○'}
          </Text>
        </View>
        <Text style={[styles.title, lesson.completed && styles.titleCompleted]}>
          {index + 1}. {lesson.title}
        </Text>
      </View>
      <View
        style={[
          styles.badge,
          lesson.completed ? styles.badgeCompleted : styles.badgePending,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            lesson.completed ? styles.badgeTextCompleted : styles.badgeTextPending,
          ]}
        >
          {lesson.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusCircleCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusCirclePending: {
    backgroundColor: '#F3F4F6',
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusIconCompleted: {
    color: '#059669',
  },
  statusIconPending: {
    color: '#9CA3AF',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  titleCompleted: {
    color: '#4B5563',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeCompleted: {
    backgroundColor: '#ECFDF5',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextCompleted: {
    color: '#059669',
  },
  badgeTextPending: {
    color: '#6B7280',
  },
});
