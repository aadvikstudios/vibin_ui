import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import QuickProfileModal from './QuickProfileModal';
import { approveOrDeclineInviteAPI } from '../../../api'; // ✅ API Call

const NotificationItem = ({
  inviterHandle,
  inviteeHandle,
  inviteeProfile,
  groupId,
  approverHandle,
  onAccept,
  onReject,
}) => {
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { colors, fonts, roundness } = useTheme();

  // ✅ Handle Accept & Reject actions
  const handleInviteAction = async (status) => {
    try {
      setLoading(true);
      await approveOrDeclineInviteAPI(
        approverHandle,
        inviterHandle,
        inviteeHandle,
        status
      );
      if (status === 'approved' && typeof onAccept === 'function') {
        onAccept();
      } else if (status === 'declined' && typeof onReject === 'function') {
        onReject();
      } else {
        console.warn(`⚠️ No handler found for status: ${status}`);
      }
    } catch (error) {
      console.error(`Error processing ${status} action:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.notificationItem,
        {
          backgroundColor: colors.surface,
          borderRadius: roundness,
          shadowColor: colors.border,
        },
      ]}
    >
      {/* Invite Message */}
      <Text
        style={[
          styles.inviteText,
          {
            color: colors.primaryText,
            fontFamily: fonts.displaySmall.fontFamily,
          },
        ]}
      >
        🎉{' '}
        <Text style={[styles.bold, { color: colors.primary }]}>
          {inviterHandle}
        </Text>{' '}
        invited you to join a group with{' '}
        <Text style={[styles.bold, { color: colors.secondary }]}>
          {inviteeProfile.name}
        </Text>
        .
      </Text>

      {/* Action Buttons (View Profile / Accept / Reject) */}
      <View style={styles.actionContainer}>
        {/* 👁️ View Profile Button */}
        <TouchableOpacity
          onPress={() => setProfileVisible(true)}
          style={[
            styles.viewProfileButton,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          <Icon name="person-circle-outline" size={32} color={colors.primary} />
          <Text style={[styles.viewProfileText, { color: colors.primaryText }]}>
            View
          </Text>
        </TouchableOpacity>

        {/* ✅ Accept Button */}
        <TouchableOpacity
          onPress={() => handleInviteAction('approved')}
          style={styles.acceptButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.success} />
          ) : (
            <>
              <Icon name="checkmark-circle" size={40} color={colors.success} />
              <Text style={[styles.buttonText, { color: colors.success }]}>
                Accept
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ❌ Reject Button */}
        <TouchableOpacity
          onPress={() => handleInviteAction('declined')}
          style={styles.rejectButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <>
              <Icon name="close-circle" size={40} color={colors.danger} />
              <Text style={[styles.buttonText, { color: colors.danger }]}>
                Reject
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 🔍 Invitee Quick Profile Modal */}
      <QuickProfileModal
        isVisible={isProfileVisible}
        onClose={() => setProfileVisible(false)}
        profile={inviteeProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 10,
    elevation: 2,
  },
  inviteText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  viewProfileButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '500',
  },
  acceptButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rejectButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default NotificationItem;
