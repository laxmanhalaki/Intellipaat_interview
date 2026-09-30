import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { NetworkProvider } from './src/context/NetworkContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initGlobalErrorHandlers } from './src/utils/errorHandler';

import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  useEffect(() => {
    initGlobalErrorHandlers();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ErrorBoundary>
        <NetworkProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NetworkProvider>
      </ErrorBoundary>
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
