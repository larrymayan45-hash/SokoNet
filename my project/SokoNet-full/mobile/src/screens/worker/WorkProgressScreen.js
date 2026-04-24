/**
 * Work Progress Screen
 * Worker updates job progress
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function WorkProgressScreen() {
  const route = useRoute();
  const { jobId } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/details/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.error('Error fetching job progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progress) => {
    try {
      await axios.put(`/api/jobs/${jobId}/status`, {
        status: progress === 100 ? 'completed' : 'in-progress',
        progressPercentage: progress,
        notes: `Progress updated to ${progress}%`
      });
      fetchJob();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Loading progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Work Progress</Text>
        <Text style={styles.subheading}>Update the job completion percentage.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subheading}>Current progress: {job?.progressPercentage || 0}%</Text>
        {[25, 50, 75, 100].map((value) => (
          <TouchableOpacity
            key={value}
            style={styles.actionButton}
            onPress={() => updateProgress(value)}
          >
            <Text style={styles.actionText}>Mark {value}% Complete</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
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