import React, { useState } from 'react';
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
  pendingInvites = [],
  onAcceptInvite = () => {},
  onRejectInvite = () => {},
}) => {
  const { colors, roundness, fonts } = useTheme();
  const [localInvites, setLocalInvites] = useState(pendingInvites);

  // ✅ Remove invite from UI after action
  const handleRemoveInvite = (groupId) => {
    setLocalInvites((prevInvites) =>
      prevInvites.filter((invite) => invite.groupId !== groupId)
    );
  };

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

          {localInvites.length > 0 ? (
            <FlatList
              data={localInvites}
              keyExtractor={(item, index) => item.groupId || `invite-${index}`}
              renderItem={({ item }) => (
                <NotificationItem
                  inviterHandle={item.inviterHandle}
                  inviteeHandle={item.inviteeHandle}
                  inviteeProfile={item.inviteeProfile}
                  groupId={item.groupId}
                  approverHandle={item.approverHandle}
                  onAccept={() => {
                    onAcceptInvite(item.groupId);
                    handleRemoveInvite(item.groupId);
                  }}
                  onReject={() => {
                    onRejectInvite(item.groupId);
                    handleRemoveInvite(item.groupId);
                  }}
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
