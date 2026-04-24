/**
 * Bids Screen
 * Displays all bids for a customer's job
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function BidsScreen() {
  const route = useRoute();
  const { jobId } = route.params || {};
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) fetchBids();
  }, [jobId]);

  const fetchBids = async () => {
    try {
      const res = await axios.get(`/api/bids/${jobId}`);
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await axios.put(`/api/bids/${bidId}/accept`);
      fetchBids();
    } catch (error) {
      console.error('Accept bid failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Bids</Text>
        <Text style={styles.subheading}>Select a bid to accept.</Text>
      </View>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading bids...</Text>
        </View>
      ) : bids.length > 0 ? (
        <FlatList
          data={bids}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.jobTitle}>KES {item.bidAmount}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.jobDescription}>{item.message || 'No message provided.'}</Text>
              <TouchableOpacity style={styles.actionButton} onPress={() => acceptBid(item._id)}>
                <Text style={styles.actionText}>Accept Bid</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bids yet.</Text>
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
    marginBottom: 12,
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
    marginBottom: 14,
  },
  actionButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
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