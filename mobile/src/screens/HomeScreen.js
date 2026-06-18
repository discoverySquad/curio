import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import Time from '../components/Time.js';
import CustomButton from '../components/CustomButton.js'
import { useSelectedChild } from '../context/SelectedChildContext';

import AsyncStorage from '@react-native-async-storage/async-storage';



const HomeScreen = ({ navigation, route }) => {

  // const childId = route?.params?.childId;
  // const CHILD_ID = "6a28f66e68e34f4224b78383"; // for temporary test

  const [child, setChild] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const childIdFromRoute = route?.params?.childId;
  const { selectedChild, setSelectedChild } = useSelectedChild();
  // const [timeLimit, setTimeLimit] = useState("");


  // useEffect(() => {
  //   console.log("route params =", route?.params);
  //   console.log("childId =", childId);

  //   if (!childId) return;

  //   const getChild = async () => {
  //     try {
  //       const url = `${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`;
  //       // const url = `${process.env.EXPO_PUBLIC_API_URL}/api/child/${CHILD_ID}`;
  //       console.log('url:', url);

  //       const response = await fetch(url);
  //       console.log('Response status:', response.status);

  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         console.error('API Error:', response.status, errorData);
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log('API response:', data);
  //       console.log('timeLimit:', data.timeLimit, 'type:', typeof data.timeLimit);
  //       console.log('usageTimeToday:', data.usageTimeToday, 'type:', typeof data.usageTimeToday);
  //       setChild(data);
  //     } catch (error) {
  //       console.log('Fetch error:', error)
  //     }
  //   };
  //   getChild();
  // }, [childId]);

    useEffect(() => {
    const loadChild = async () => {
      try {
          let id = route?.params?.childId || selectedChild?._id;

          // immediately reflect selectedChild in UI to avoid mismatch
          if (selectedChild) {
            setChild(selectedChild);
          }

          if (!id) {
            const saved = await AsyncStorage.getItem('selectedChild');
            if (saved) {
              id = JSON.parse(saved)._id;
            }
          }

          if (!id) return;

          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/child/${id}`
          );

          if (!response.ok) return;

          const data = await response.json();
          setChild(data);

          try {
            if (setSelectedChild && selectedChild?._id !== data._id) {
              setSelectedChild(data);
            }
            await AsyncStorage.setItem('selectedChild', JSON.stringify(data));
          } catch (e) {
            console.log('Failed to update selectedChild in HomeScreen', e);
          }

      } catch (error) {
        console.log('Home load error:', error);
      }
    };

    loadChild();
  }, [childIdFromRoute, selectedChild]);

  useFocusEffect(
    React.useCallback(() => {
      const loadLimit = async () => {
        const value = await AsyncStorage.getItem("screenTimeLimit");

        if (value) {
          setTimeLimit(Number(value));
        }
      };

      loadLimit();
    }, [childIdFromRoute])
  );

  const handleStartActivity = () => {
    navigation.navigate("SelectCategory");
  };


  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.text}>
        Home Screen
      </Text>

      {/* <Button
        title="Activity Description"
        onPress={() => navigation.navigate("ActivityDescription")}
      /> */}
      {/* <Button
        title="Try Again Page"
        onPress={() => navigation.navigate("TryAgain")}
      /> */}
      {/* <Button
        title="Feedback Page"
        onPress={() => navigation.navigate("Feedback")}
      /> */}

      {/* temporally put here, should be on parent setting page */}
      {/* <Button title='Screen Time' onPress={() => navigation.navigate("ScreenTime")} /> */}

      {/* card1 */}
      <View style={styles.homeCard}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Hi {child?.name}!</Text>
        </View>
        <View style={styles.buttonSection}>
          <CustomButton label="Start Activity" onPress={handleStartActivity} />
        </View>
      </View>

      {/* card2 */}
      <View style={styles.homeCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.cardTitle}>Today's Goal</Text>
        </View>
        <View style={styles.progressBar}>
          <Text> 2/5 mission done</Text>
        </View>
      </View>

      {/* card3 */}
      <View style={styles.homeCard}>
        <View style={styles.exploration}>
          {child ? (
            <Time
              childId={child._id}
              timeLimit={child.timeLimit}
              usageTimeToday={child.usageTimeToday}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  homeCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 24,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  }
});


export default HomeScreen;