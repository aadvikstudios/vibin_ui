import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Modal, Text, TextInput, Button, useTheme } from 'react-native-paper';

const PingModal = ({
  visible,
  onClose,
  onSendPing,
  pingNote,
  setPingNote,
  isLoading,
  currentProfile,
}) => {
  const { colors } = useTheme();
  const profilePhoto = currentProfile?.photos?.[0]; // Get the first photo

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: colors.surface }, // Dynamically set background
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: colors.border }]} />
      {profilePhoto && (
        <Image source={{ uri: profilePhoto }} style={styles.avatar} />
      )}
      <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
        Send a Ping
      </Text>
      <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
        Let {currentProfile?.name || 'this user'} know they caught your eye. Add
        a note if you'd like.
      </Text>
      <TextInput
        mode="outlined"
        style={[
          styles.textInput,
          {
            borderColor: colors.primary,
            backgroundColor: colors.surfaceVariant,
            color: colors.primaryText,
          },
        ]}
        placeholder="Add a note..."
        placeholderTextColor={colors.placeholder}
        value={pingNote}
        onChangeText={setPingNote}
        multiline
      />
      <Button
        mode="contained"
        onPress={onSendPing}
        loading={isLoading}
        disabled={isLoading || !pingNote.trim()}
        style={[styles.sendButton, { backgroundColor: colors.liked }]}
        labelStyle={[styles.sendButtonText, { color: colors.onLiked }]}
      >
        Send Ping
      </Button>
      <Button
        mode="text"
        onPress={onClose}
        labelStyle={[styles.cancelButtonText, { color: colors.danger }]}
      >
        Cancel
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    elevation: 10,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 8,
  },
  sendButton: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PingModal;
