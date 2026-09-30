import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { InputField } from '../components/common/InputField';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { normalizeError } from '../utils/errorHandler';
import { showToast } from '../utils/toast';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('secret123');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailBlur = () => {
    if (email.trim() !== '') {
      const err = validateEmail(email);
      setEmailError(err);
      if (err) {
        showToast.error('Invalid Email Format', err);
      }
    }
  };

  const handleLogin = async () => {
    setGeneralError(null);

    // Validate inputs
    const eError = validateEmail(email);
    const pError = validatePassword(password);

    setEmailError(eError);
    setPasswordError(pError);

    if (eError) {
      showToast.error('Invalid Email Format', eError);
      return;
    }

    if (pError) {
      showToast.error('Invalid Password', pError);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      showToast.success('Login Successful', 'Welcome back!');
      // Reset navigation stack to Dashboard so user cannot return to Login via back button
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (err) {
      const appErr = normalizeError(err, 'Invalid email or password');
      setGeneralError(appErr.userMessage);
      showToast.error('Login Failed', appErr.userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Enter your credentials to access your courses</Text>
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            <InputField
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(null);
                if (generalError) setGeneralError(null);
              }}
              onBlur={handleEmailBlur}
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(null);
                if (generalError) setGeneralError(null);
              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              error={passwordError}
            />

            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Demo Credentials:</Text>
              <Text style={styles.hintText}>student@example.com / secret123</Text>
            </View>

            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  hintBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  hintText: {
    fontSize: 12,
    color: '#2563EB',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  loginButton: {
    marginTop: 4,
  },
});
