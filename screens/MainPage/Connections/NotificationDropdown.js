import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({
  visible,
  onClose,
  pendingInvites,
  onAcceptInvite,
  onRejectInvite,
}) => {
  const { colors, roundness, fonts } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.notificationDropdown,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: roundness,
              borderTopRightRadius: roundness,
            },
          ]}
        >
          <Text
            style={[
              styles.notificationTitle,
              {
                color: colors.primaryText,
                fontFamily: fonts.displayMedium.fontFamily,
              },
            ]}
          >
            📩 Pending Invites
          </Text>

          {pendingInvites.length > 0 ? (
            <FlatList
              data={pendingInvites}
              keyExtractor={(item, index) => item.groupId || `invite-${index}`}
              renderItem={({ item }) => (
                <NotificationItem
                  inviterHandle={item.inviterHandle}
                  inviteeProfile={item.inviteeProfile}
                  groupId={item.groupId}
                  onAccept={onAcceptInvite}
                  onReject={onRejectInvite}
                />
              )}
            />
          ) : (
            <Text
              style={[styles.emptyMessage, { color: colors.secondaryText }]}
            >
              No pending invites 🚀
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  notificationDropdown: {
    padding: 15,
    maxHeight: 300,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NotificationDropdown;
