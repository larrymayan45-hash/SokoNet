/**
 * Earnings Screen
 * Worker earnings summary for mobile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

export default function EarningsScreen() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/dashboard/income');
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error('Error fetching earnings dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Loading earnings data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Earnings Summary</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.value}>KES {dashboard?.totalEarnings || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.value}>KES {dashboard?.thisMonthEarnings || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Escrow Balance</Text>
        <Text style={styles.value}>KES {dashboard?.escrowBalance || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Completed Jobs</Text>
        <Text style={styles.value}>{dashboard?.completedJobs || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Average Rating</Text>
        <Text style={styles.value}>{dashboard?.averageRating?.toFixed(1) || '0.0'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#6b7280',
    fontSize: 16,
  },
});