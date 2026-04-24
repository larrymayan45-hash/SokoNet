/**
 * Signup Screen - Mobile
 * Email or phone registration with password
 */

import React, { useState } from 'react';
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

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Email or phone is required');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        password,
        firstName,
        lastName,
        userType
      };
      if (identifier.includes('@')) {
        payload.email = identifier;
      } else {
        payload.phone = identifier;
      }

      const res = await axios.post('http://localhost:5000/api/users/register', payload);
      await AsyncStorage.setItem('userToken', res.data.token);
      await AsyncStorage.setItem('userType', res.data.user.userType);

      Alert.alert('Success', 'Account created successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: res.data.user.userType === 'worker' ? 'WorkerApp' : 'CustomerApp' }]
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register with email or phone and password</Text>

          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email or Phone</Text>
            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="you@example.com or +254 700 123456"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create password"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleOption, userType === 'customer' && styles.toggleOptionActive]}
                onPress={() => setUserType('customer')}
              >
                <Text style={userType === 'customer' ? styles.toggleTextActive : styles.toggleText}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, userType === 'worker' && styles.toggleOptionActive]}
                onPress={() => setUserType('worker')}
              >
                <Text style={userType === 'worker' ? styles.toggleTextActive : styles.toggleText}>Worker</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
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
    width: '92%',
    alignItems: 'center'
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#E0E7FF',
    marginBottom: 24,
    textAlign: 'center'
  },
  form: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16
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
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 14
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginHorizontal: 4,
    alignItems: 'center'
  },
  toggleOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  toggleText: {
    color: '#1f2937',
    fontWeight: '600'
  },
  toggleTextActive: {
    color: '#FFF',
    fontWeight: '600'
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
  linkText: {
    color: '#fff',
    marginTop: 14,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});
