/**
 * Rating Screen
 * Allows users to rate another party after a job
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function RatingScreen() {
  const route = useRoute();
  const { userId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    if (rating === 0) return;

    try {
      await axios.post('/api/ratings', {
        workerId: userId,
        rating,
        review
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  if (submitted) {
    return (
      <View style={styles.center}>
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.infoText}>Your rating has been recorded.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rate Worker</Text>
        <Text style={styles.subtitle}>Leave a star rating and feedback.</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => setRating(value)}>
              <Text style={[styles.star, value <= rating ? styles.starSelected : styles.starEmpty]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Review</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={review}
          onChangeText={setReview}
          style={styles.textArea}
          placeholder="How was the experience?"
        />
        <TouchableOpacity style={styles.button} onPress={submitRating}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 6,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 32,
    marginRight: 8,
  },
  starSelected: {
    color: '#f59e0b',
  },
  starEmpty: {
    color: '#d1d5db',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});