import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import Time from '../components/Time.js';
import CustomButton from '../components/CustomButton.js'
import { useSelectedChild } from '../context/SelectedChildContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from "../constants/colors.js";
import {fonts} from "../constants/fonts.js";
import { Lock } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';

const HomeScreen = ({ navigation, route, onLogout }) => {

  // const childId = route?.params?.childId;
  // const CHILD_ID = "6a28f66e68e34f4224b78383"; // for temporary test

  const [child, setChild] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const childIdFromRoute = route?.params?.childId;
  const { selectedChild, setSelectedChild } = useSelectedChild();
  const [todayMissionCount, setTodayMissionCount] = useState(0);
  const goalTotal = 5;


  useFocusEffect(
    React.useCallback(() => {
      const loadChild = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          let id = route?.params?.childId || selectedChild?._id;

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

          const missionRes = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/scan-records/today/${data._id}`
          );

          if (missionRes.ok) {
            const missionData = await missionRes.json();
            setTodayMissionCount(missionData.count);
          }

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
    }, [route?.params?.childId, selectedChild?._id])
  );

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

  const displayCount =
    todayMissionCount > goalTotal ? goalTotal : todayMissionCount;

  const percentage = Math.round((displayCount / goalTotal) * 100);


  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      {/* card1 */}
      <View style={styles.homeCard}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Hi {child?.name}!{"\n"}
            Ready for {"\n"}
            Today's adventure?
          </Text>
          <Text style={styles.text1}>Look around you... what will you find today?</Text>
        </View>
        <View style={styles.buttonSection}>
          <CustomButton label="Start Activity" onPress={handleStartActivity} />
        </View>
      </View>

      {/* card2 */}
      <View style={styles.homeCard}>
         <View style={styles.goalHeader}>
            <Text style={styles.cardTitle}>Today's Goal</Text>
            <Image source={require("../assets/cup.png")} style={styles.cupIcon} />
        </View>
        <View style={styles.goalRow}>
            <Text style={styles.text}>
              {displayCount}/{goalTotal} missions done
            </Text>
            <Text style={styles.text}>{percentage}%</Text>
         </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%` },
            ]}
          />
        </View>

        <Text style={styles.text3}>
          Keep going, {child?.name}! You are doing great explorer work!
        </Text>
      </View>

      {/* card3 */}
      <View style={styles.homeCard}>
        <View style={styles.explorationTime}>
          <View style={styles.circle}>
            <Image style={styles.timeCircle} source={require('../assets/watch.png')} />
          </View>
          <View style={styles.timeLeftBox}>
            <View>
              <Text style={styles.cardTitle}>Exploration Time</Text>
            </View>
            <View style={styles.exploration}>
              {child ? (
                
                <Time
                
                  childId={child._id}
                  timeLimit={child.timeLimit}
                  usageTimeToday={child.usageTimeToday}
                  onTimeUp={onLogout}
                />
                
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
            <View>
              <Text style={styles.break}>Great for breaks!</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.settingFlex}
        onPress={() =>
          navigation.navigate("Parent", {
            screen: "ParentDashboard",
          })}
      >
        <Lock size={16} />
        <Text style={styles.settingText}>Parent Settings</Text>
      </TouchableOpacity>
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
    backgroundColor: colors.tertiary,
    borderRadius: 20,
    padding: 24,
  },
  goalHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
    fontFamily: fonts.heading,
  },
  text: {
    color: colors.neutral,
  },
  text1: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 20,
  },
  text2: {
    fontSize: 14,
    fontWeight: 500,
  },
  text3: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
 },
cupIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
} ,
  explorationTime: {
    flexDirection: 'row',
    gap: 28

  },
  timeLeftBox: {
    justifyContent: 'center',

  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 700,
    paddingBottom: 10,
    fontFamily: fonts.heading,
    color: colors.neutral,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: 16,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.neutralClay,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  break: {
    fontSize: 14,
    fontWeight: 600,
    paddingTop: 5,
    color: colors.neutral,
  },
  settingFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 40
  },
  settingText: {
    textAlign: 'center',
    fontSize: 16
  }
});


export default HomeScreen;