import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import CarouselComponent from './CarouselComponent';
import ChipList from '../../../components/ChipList';
import ProfileDetails from '../../../components/ProfileDetails';
import BlockReportButton from '../../../components/BlockReportButton';
import QuestionnaireAnswers from '../../../components/QuestionnaireAnswers'; // Import the new component

const ProfileScreen = ({ profile }) => {
  const { colors } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <ScrollView
      contentContainerStyle={[styles.card, { backgroundColor: colors.surface }]}
    >
      {profile.photos?.length > 0 ? (
        <CarouselComponent
          photos={profile.photos}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={{ color: colors.secondaryText }}>
            No photos available
          </Text>
        </View>
      )}

      <ProfileDetails profile={profile} />

      {profile.desires?.length > 0 && (
        <ChipList title="Desires" items={profile.desires} />
      )}
      {profile.interests?.length > 0 && (
        <ChipList title="Interests" items={profile.interests} />
      )}

      {/* Add QuestionnaireAnswers Component */}
      {profile.questionnaire && (
        <QuestionnaireAnswers questionnaire={profile.questionnaire} />
      )}

      <BlockReportButton />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  placeholderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
