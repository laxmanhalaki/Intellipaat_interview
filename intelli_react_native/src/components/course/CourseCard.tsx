import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Course } from '../../types/course';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
  onContinue: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onContinue }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>{course.instructor}</Text>

      <View style={styles.progressSection}>
        <ProgressBar progress={course.progress} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.lessonsCount}>{course.lessons} lessons</Text>
        <Pressable
          style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}
          onPress={() => onContinue(course)}
          accessibilityRole="button"
          accessibilityLabel={`Continue course ${course.title}`}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 14,
  },
  progressSection: {
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  lessonsCount: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  continueButtonPressed: {
    backgroundColor: '#1D4ED8',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
