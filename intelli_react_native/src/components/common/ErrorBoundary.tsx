import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    Logger.error('BOUNDARY', 'Caught React component render error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred while displaying this screen.
          </Text>

          <Pressable style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>

          {__DEV__ && this.state.error && (
            <ScrollView style={styles.debugBox}>
              <Text style={styles.debugTitle}>Debug Details (__DEV__ only):</Text>
              <Text style={styles.debugText}>{this.state.error.toString()}</Text>
              <Text style={styles.debugStack}>{this.state.errorInfo?.componentStack}</Text>
            </ScrollView>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  debugBox: {
    marginTop: 24,
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
  },
  debugTitle: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 6,
  },
  debugText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  debugStack: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
  },
});
