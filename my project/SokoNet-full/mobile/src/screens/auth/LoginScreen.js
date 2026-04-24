/**
 * Login Screen - Mobile
 * Supports password login and OTP login by email or phone
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('password');
  const [loading, setLoading] = useState(false);
  const [hasSavedLogin, setHasSavedLogin] = useState(false);

  useEffect(() => {
    const checkSavedToken = async () => {
      const savedToken = await AsyncStorage.getItem('userToken');
      setHasSavedLogin(!!savedToken);
    };
    checkSavedToken();
  }, []);

  const handlePasswordLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Identifier and password are required');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        identifier,
        password
      });

      await AsyncStorage.setItem('userToken', res.data.token);
      await AsyncStorage.setItem('userType', res.data.user.userType);
      Alert.alert('Success', 'Logged in successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: res.data.user.userType === 'worker' ? 'WorkerApp' : 'CustomerApp' }]
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Email or phone number is required for OTP');
      return;
    }

    setLoading(true);

    try {
      const payload = identifier.includes('@') ? { email: identifier } : { phone: identifier };
      await axios.post('http://localhost:5000/api/users/send-otp', payload);
      navigation.navigate('OTP', { contact: identifier, contactType: identifier.includes('@') ? 'email' : 'phone' });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedLogin = async () => {
    const savedToken = await AsyncStorage.getItem('userToken');
    const savedType = await AsyncStorage.getItem('userType');
    if (savedToken && savedType) {
      navigation.reset({
        index: 0,
        routes: [{ name: savedType === 'worker' ? 'WorkerApp' : 'CustomerApp' }]
      });
    } else {
      Alert.alert('Info', 'No saved login available');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>SokoNet</Text>
          <Text style={styles.subtitle}>Secure marketplace access</Text>

          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'password' && styles.activeModeButton]}
              onPress={() => setMode('password')}
            >
              <Text style={[styles.modeText, mode === 'password' && styles.activeModeText]}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'otp' && styles.activeModeButton]}
              onPress={() => setMode('otp')}
            >
              <Text style={[styles.modeText, mode === 'otp' && styles.activeModeText]}>OTP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email or Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com or +254 700 123456"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={mode === 'otp' ? 'email-address' : 'default'}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            {mode === 'password' && (
              <>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={mode === 'password' ? handlePasswordLogin : handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>{mode === 'password' ? 'Login' : 'Send OTP'}</Text>
              )}
            </TouchableOpacity>
          </View>

          {hasSavedLogin && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSavedLogin}>
              <Text style={styles.secondaryText}>Login with saved device access</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
            <Text style={styles.linkText}>Create new account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '90%',
    alignItems: 'center'
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 30,
    textAlign: 'center'
  },
  modeSwitcher: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-between'
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 5,
    alignItems: 'center'
  },
  activeModeButton: {
    backgroundColor: '#1d4ed8'
  },
  modeText: {
    color: '#1f2937',
    fontWeight: '600'
  },
  activeModeText: {
    color: '#fff'
  },
  form: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  secondaryText: {
    color: '#FFF',
    fontWeight: '600'
  },
  linkButton: {
    marginTop: 18
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline'
  }
});
