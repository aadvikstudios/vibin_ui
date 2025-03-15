import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
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
  console.log(localInvites);

  // ✅ Remove invite from UI after action
  const handleRemoveInvite = (groupId) => {
    setLocalInvites((prevInvites) =>
      prevInvites.filter((invite) => invite.groupId !== groupId)
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay (Closes Modal on Tap) */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Dropdown Content (Does NOT close on tap) */}
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
                groupName={item.groupName} // ✅ Pass groupName
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
            contentContainerStyle={{ paddingBottom: 20 }} // ✅ Prevents last item from cutting off
            showsVerticalScrollIndicator={false} // ✅ Hides scrollbar for cleaner UI
          />
        ) : (
          <Text style={[styles.emptyMessage, { color: colors.secondaryText }]}>
            No pending invites 🚀
          </Text>
        )}
      </View>
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
    maxHeight: 300, // ✅ Increased max height for better scrolling
    minHeight: 150, // ✅ Ensures dropdown is visible even with few items
    width: '100%',
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
    paddingVertical: 20, // ✅ Better spacing when empty
  },
});

export default NotificationDropdown;
