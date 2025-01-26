import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { Modal, Portal, IconButton, useTheme } from 'react-native-paper';

const ModalPicker = ({
  heading,
  options,
  visible,
  setVisible,
  selectedValue,
  setSelectedValue,
}) => {
  const { colors, fonts } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={[
          styles.modalContent,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Header with Title and Close Icon */}
        <View style={styles.modalHeader}>
          <Text
            style={[
              styles.modalTitle,
              { color: colors.primaryText, ...fonts.headlineSmall },
            ]}
          >
            {heading}
          </Text>
          <IconButton
            icon="close"
            onPress={() => setVisible(false)}
            size={20}
            iconColor={colors.primaryText}
          />
        </View>

        {/* Options List */}
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionContainer,
                item.label === selectedValue && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => {
                setSelectedValue(item.label);
                setVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOption,
                  {
                    color:
                      item.label === selectedValue
                        ? colors.onPrimary
                        : colors.primaryText,
                    ...fonts.bodyLarge,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  modalOption: {
    fontSize: 16,
  },
});

export default ModalPicker;
