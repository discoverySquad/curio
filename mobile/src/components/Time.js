import React from "react";
import {useEffect, useState, useRef} from "react";
import {Text, StyleSheet, AppState} from "react-native";

// save time left in DB
const saveUsageTime = async (childId, usedSeconds) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}/usage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usageTimeToday: usedSeconds }),
    });
    const data = await response.json();
  } catch (error) {
    console.log("error", error); // test
  }
};

// time component
const Time =({ childId, timeLimit, usageTimeToday, onTimeUp }) => {
  // Type conversion and validation
  const timeLimitNum = Number(timeLimit) || 0;
  const usageTimeTodayNum = Number(usageTimeToday) || 0;

  const limitSeconds = timeLimitNum * 60;
  const initialSeconds = Math.max(limitSeconds - usageTimeTodayNum, 0); 

  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const remainingSecondsRef = useRef(initialSeconds);
  const limitSecondsRef = useRef(limitSeconds);

  // sync when data is changed
  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    remainingSecondsRef.current = initialSeconds;
    limitSecondsRef.current = limitSeconds;
  }, [initialSeconds]);

  // count per second
  useEffect(() => {
    if(remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(prev - 1, 0);
        remainingSecondsRef.current = next;
        return next;
      })
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const usedSeconds = limitSecondsRef.current - remainingSecondsRef.current;
      console.log("30sec save - usedSeconds:", usedSeconds);  //test
      saveUsageTime(childId, usedSeconds);
      console.log("unmount save - usedSeconds:", usedSeconds); //test
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // when app is in background, save remaining time on DB
  useEffect(() => {
    const handleAppStateChange = (state) => {
      if(state === "background" || state === "inactive"){
        const usedSeconds = limitSecondsRef.current - remainingSecondsRef.current;
        saveUsageTime(childId, usedSeconds);
      }
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove(); // clean old data
  }, []);

  // for auto logout
  useEffect(() => {
      if (remainingSeconds === 0 && onTimeUp) {
        onTimeUp();
      }
    }, [remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return(
    <Text style={styles.time}>
      {minutes} : {String(seconds).padStart(2, "0")} remaining
    </Text>
  );
};

const styles = StyleSheet.create({
  time:{
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Time;