import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Time from '../components/Time.js';



const HomeScreen = ({ navigation }) => {

  const CHILD_ID = "6a15ddc0752c37728664b230"; // for temporary test

  const [child, setChild] = useState(null);

useEffect(() => {
  const getChild = async() => {
    try{
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/child/${CHILD_ID}`;

const response = await fetch(url);

      const data = await response.json();
      setChild(data);
    }catch(error){
      console.log(error)
    }
  };
  getChild();
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Home Screen
      </Text>

      <Button
        title="Test Page"
        onPress={() => navigation.navigate("Test")}
      />

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  }
});


export default HomeScreen;