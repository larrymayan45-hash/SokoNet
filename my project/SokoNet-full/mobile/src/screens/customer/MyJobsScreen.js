/**
 * My Jobs Screen
 * Displays customer's posted jobs in mobile app
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function MyJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/my-jobs');
      setJobs(res.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetail', { jobId: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <View style={styles.jobMeta}>
        <Text style={styles.metaText}>KES {item.budget?.max}</Text>
        <Text style={styles.metaText}>{item.city}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Jobs</Text>
        <Text style={styles.subheading}>Track your ongoing service requests.</Text>
      </View>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading your jobs...</Text>
        </View>
      ) : jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No jobs posted yet.</Text>
        </View>
      )}
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  status: {
    fontSize: 14,
    color: '#2563eb',
  },
  jobDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});