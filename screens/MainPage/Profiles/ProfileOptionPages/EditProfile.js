import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from 'react-native-paper';
import { useUser } from '../../../../context/UserContext';
import Footer from '../../../../components/Footer';
import PhotoSlider from '../PhotoSlider';
import { genderOptions, orientationOptions } from '../../../../data/options';
import ModalPicker from '../../../ModalPicker';
import { updateUserProfileAPI } from '../../../../api';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Function to parse date from "DD/MM/YYYY" format
const parseDob = (dobString) => {
  const [day, month, year] = dobString
    .split('/')
    .map((value) => parseInt(value, 10));
  return { day, month, year };
};

// Function to calculate age based on DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob.year, dob.month - 1, dob.day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const EditProfile = ({ navigation, route }) => {
  const { colors, fonts } = useTheme();
  const { userData, updateUser } = useUser();
  const { fetchData } = route.params;

  const [photos, setPhotos] = useState(userData.photos || []);
  const [name, setName] = useState(userData.name || '');
  const [dob, setDob] = useState(parseDob(userData.dob || ''));
  const [age, setAge] = useState(
    userData.dob ? calculateAge(parseDob(userData.dob)) : ''
  );
  const [editingDob, setEditingDob] = useState(false); // Toggle for editing DOB
  const [gender, setGender] = useState('');
  const [orientation, setOrientation] = useState('');
  const [bio, setBio] = useState(userData.bio || '');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [orientationModalVisible, setOrientationModalVisible] = useState(false);

  // Map keys from userData to their respective labels
  useEffect(() => {
    const genderLabel =
      genderOptions.find((option) => option.id === userData.gender)?.label ||
      '';
    const orientationLabel =
      orientationOptions.find((option) => option.id === userData.orientation)
        ?.label || '';
    setGender(genderLabel);
    setOrientation(orientationLabel);
  }, [userData.gender, userData.orientation]);

  const handleDoneDob = () => {
    const updatedAge = calculateAge(dob);
    setAge(updatedAge);
    setEditingDob(false);
  };

  const handleSave = async () => {
    if (
      !name.trim() ||
      !dob.day ||
      !dob.month ||
      !dob.year ||
      !gender.trim() ||
      !orientation.trim()
    ) {
      Alert.alert('Error', 'All fields are required to proceed.');
      return;
    }

    // Convert selected labels back to keys for saving
    const genderKey =
      genderOptions.find((option) => option.label === gender)?.id || '';
    const orientationKey =
      orientationOptions.find((option) => option.label === orientation)?.id ||
      '';

    const updatedData = {
      photos,
      name,
      dob: `${dob.day.toString().padStart(2, '0')}/${dob.month
        .toString()
        .padStart(2, '0')}/${dob.year}`,
      gender: genderKey,
      orientation: orientationKey,
      bio,
    };

    try {
      await updateUserProfileAPI(userData.userId, updatedData);
      updateUser(updatedData);

      if (fetchData) {
        await fetchData();
      }

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PhotoSlider photos={photos} />

        {/* Name */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          My Feeld Name
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.placeholder}
        />

        {/* Date of Birth */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          Date of Birth
        </Text>
        {editingDob ? (
          <View style={styles.dobInputs}>
            <TextInput
              style={[
                styles.dobInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={dob.day?.toString()}
              onChangeText={(value) =>
                setDob({ ...dob, day: parseInt(value, 10) || '' })
              }
              placeholder="DD"
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={[
                styles.dobInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={dob.month?.toString()}
              onChangeText={(value) =>
                setDob({ ...dob, month: parseInt(value, 10) || '' })
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={[
                styles.dobInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={dob.year?.toString()}
              onChangeText={(value) =>
                setDob({ ...dob, year: parseInt(value, 10) || '' })
              }
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity onPress={handleDoneDob}>
              <Text style={[styles.doneButton, { color: colors.primary }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditingDob(true)}>
            <Text style={[styles.dobDisplay, { color: colors.text }]}>
              {`${months[dob.month - 1]} ${dob.day}, ${dob.year} (Age: ${age})`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Gender */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          Gender
        </Text>
        <TouchableOpacity onPress={() => setGenderModalVisible(true)}>
          <Text
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          >
            {gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>

        {/* Orientation */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          Orientation
        </Text>
        <TouchableOpacity onPress={() => setOrientationModalVisible(true)}>
          <Text
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          >
            {orientation || 'Select Orientation'}
          </Text>
        </TouchableOpacity>

        {/* Bio */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          About
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder="Write something about yourself"
          placeholderTextColor={colors.placeholder}
          multiline
        />
      </ScrollView>

      {/* Reusable Modals */}
      <ModalPicker
        heading="Select Gender"
        options={genderOptions}
        visible={genderModalVisible}
        setVisible={setGenderModalVisible}
        selectedValue={gender}
        setSelectedValue={setGender}
      />

      <ModalPicker
        heading="Select Orientation"
        options={orientationOptions}
        visible={orientationModalVisible}
        setVisible={setOrientationModalVisible}
        selectedValue={orientation}
        setSelectedValue={setOrientation}
      />

      <Footer
        buttonText="Save"
        onPress={handleSave}
        disabled={
          !name.trim() ||
          !dob.day ||
          !dob.month ||
          !dob.year ||
          !gender.trim() ||
          !orientation.trim()
        }
        buttonStyle={{
          backgroundColor: colors.primary,
        }}
        textStyle={{
          color: colors.onPrimary,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dobInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dobInput: {
    width: '25%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  dobDisplay: {
    fontSize: 16,
    marginBottom: 10,
  },
  doneButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EditProfile;
