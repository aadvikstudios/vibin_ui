import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import { useUser } from '../../../context/UserContext';
import { sendActionToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';

const LikesScreen = ({ likes, loading, onRefresh }) => {
  const { colors, fonts } = useTheme();
  const { userData } = useUser();
  const navigation = useNavigation();

  const handleAction = async (action, item) => {
    try {
      console.log('Processing action:', userData.emailId, item.emailId, action);
      const response = await sendActionToBackendAPI(
        userData.emailId,
        item.emailId,
        action
      );

      console.log('Response:', response);

      if (response?.isMatch) {
        Alert.alert(
          'Match Found!',
          `You matched with ${response.matchedProfile.name}!`
        );
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error sending action:', error);
      Alert.alert('Error', 'Failed to process action. Please try again.');
    }
  };

  const handleViewProfile = (emailId) => {
    navigation.navigate('ViewProfileScreen', {
      email: userData.emailId,
      targetEmail: emailId,
    });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollContainer}
      >
        {item.photos?.length ? (
          item.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.profileImage}
            />
          ))
        ) : (
          <View
            style={[
              styles.skeletonContainer,
              { backgroundColor: colors.disabled },
            ]}
          >
            <View
              style={[styles.skeleton, { backgroundColor: colors.placeholder }]}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.rowContainer}>
        <Text
          style={[
            styles.userName,
            { color: colors.primaryText, ...fonts.displaySmall },
          ]}
        >
          {item.name}
        </Text>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleViewProfile(item.emailId)}
          >
            <Icon name="eye-outline" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => handleAction('disliked', item)}
          >
            <Icon name="minus" size={20} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAction('liked', item)}
          >
            <Icon name="heart" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return loading ? (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ) : (
    <FlatList
      data={likes}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 10,
      }}
      ListEmptyComponent={
        <EmptyStateView
          title="Likes are in the air"
          subtitle="Finding Connections can take time. Let the community discover you."
          primaryActionText="Get seen quicker with Uplift"
          secondaryActionText="Edit search settings"
          onPrimaryAction={() => console.log('Uplift pressed')}
          onSecondaryAction={() => console.log('Edit settings pressed')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  skeletonContainer: {
    width: 100,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeleton: {
    width: '80%',
    height: '80%',
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 5,
    borderWidth: 1,
  },
});

export default LikesScreen;
