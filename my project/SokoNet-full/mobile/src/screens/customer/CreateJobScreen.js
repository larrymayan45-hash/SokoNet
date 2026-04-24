/**
 * Create Job Screen
 * Mobile screen for customers to create new job requests
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export default function CreateJobScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    urgency: 'medium',
    requiredSkills: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'plumbing', 'cleaning', 'delivery', 'handyman',
    'beauty', 'tutoring', 'transport', 'custom'
  ];

  const urgencies = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { title, description, category, budgetMin, budgetMax, address, city } = formData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a job description');
      return false;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!budgetMin || !budgetMax) {
      Alert.alert('Error', 'Please enter budget range');
      return false;
    }
    if (parseInt(budgetMin) >= parseInt(budgetMax)) {
      Alert.alert('Error', 'Minimum budget must be less than maximum');
      return false;
    }
    if (!address.trim() || !city.trim()) {
      Alert.alert('Error', 'Please enter location details');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: {
          min: parseInt(formData.budgetMin),
          max: parseInt(formData.budgetMax)
        },
        urgency: formData.urgency,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        location: {
          latitude: 0, // Would get from GPS in real app
          longitude: 0,
          address: formData.address,
          city: formData.city
        }
      };

      const res = await axios.post('/api/jobs', jobData);

      Alert.alert(
        'Success',
        'Job created successfully! Workers will start bidding soon.',
        [
          {
            text: 'View Job',
            onPress: () => navigation.navigate('JobDetail', { jobId: res.data.job._id })
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Job creation error:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Job</Text>
        <Text style={styles.headerSubtitle}>Post a job and get bids from workers</Text>
      </View>

      <View style={styles.form}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Fix leaking faucet"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Describe what needs to be done..."
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  formData.category === cat && styles.categoryButtonActive
                ]}
                onPress={() => handleInputChange('category', cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  formData.category === cat && styles.categoryButtonTextActive
                ]}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Range (KES) *</Text>
          <View style={styles.budgetContainer}>
            <TextInput
              style={[styles.textInput, styles.budgetInput]}
              placeholder="Min"
              value={formData.budgetMin}
              onChangeText={(value) => handleInputChange('budgetMin', value)}
              keyboardType="numeric"
            />
            <Text style={styles.budgetSeparator}>-</Text>
            <TextInput
              style={[styles.textInput, styles.budgetInput]}
              placeholder="Max"
              value={formData.budgetMax}
              onChangeText={(value) => handleInputChange('budgetMax', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Urgency */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyContainer}>
            {urgencies.map(urgency => (
              <TouchableOpacity
                key={urgency.value}
                style={[
                  styles.urgencyButton,
                  formData.urgency === urgency.value && styles.urgencyButtonActive
                ]}
                onPress={() => handleInputChange('urgency', urgency.value)}
              >
                <Text style={[
                  styles.urgencyButtonText,
                  formData.urgency === urgency.value && styles.urgencyButtonTextActive
                ]}>
                  {urgency.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Required Skills */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Required Skills (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., plumbing, electrical, painting"
            value={formData.requiredSkills}
            onChangeText={(value) => handleInputChange('requiredSkills', value)}
          />
          <Text style={styles.helperText}>Separate skills with commas</Text>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Address"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />
          <TextInput
            style={[styles.textInput, { marginTop: 10 }]}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleInputChange('city', value)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating Job...' : 'Create Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
  },
  budgetSeparator: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#666',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  urgencyButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  urgencyButtonText: {
    fontSize: 14,
    color: '#666',
  },
  urgencyButtonTextActive: {
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});