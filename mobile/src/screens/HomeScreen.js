import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Time from '../components/Time.js';
import CustomButton from '../components/CustomButton.js'



const HomeScreen = ({ navigation }) => {

  const CHILD_ID = "6a15ddc0752c37728664b230"; // for temporary test

  const [child, setChild] = useState(null);

useEffect(() => {
  console.log('useEffect fired'); // test
  const getChild = async() => {
    try{
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/child/${CHILD_ID}`;
      console.log('url:', url);

      const response = await fetch(url);

      const data = await response.json();
      console.log('child data:', data);  // test
      setChild(data);
    }catch(error){
      console.log(error)
    }
  };
  getChild();
}, []);

  const handleStartActivity = () => {
    console.log('Start Activity pressed'); // add function when ready
  };


  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.text}>
        Home Screen
      </Text>

      <Button
        title="Test Page"
        onPress={() => navigation.navigate("Test")}
      />
      <Button
        title="Try Again Page"
        onPress={() => navigation.navigate("TryAgain")}
      />
      <Button
        title="Feedback Page"
        onPress={() => navigation.navigate("Feedback")}
      />

      {/* card1 */}
      <View style={styles.card}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Hi {child?.name}!</Text>
        </View>
        <View style={styles.buttonSection}>
          <CustomButton label="Start Activity" onPress={handleStartActivity} />
        </View> 
      </View>

      {/* card2 */}
      <View style={styles.card}>
        <View style={styles.goalHeader}>
          <Text style={styles.cardTitle}>Today's Goal</Text>
        </View>
        <View style={styles.progressBar}>
          <Text> 2/5 mission done</Text>
        </View>
      </View>

      {/* card3 */}
      <View style={styles.card}>
        <View style={styles.exploration}>
          {child ? (
          <Time
            childId={CHILD_ID}
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
  content:{
    padding: 20,
    gap: 16,
  },
  card: {
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