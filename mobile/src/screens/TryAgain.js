import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

const TryAgain = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Not quite what we’re looking for...</Text>

      <View style={styles.tipBox}>
        <Text>Need a hand? Ask an adult to help you hind a matching pattern!</Text>
      </View>

      <Pressable style={styles.tryAgainBtn} onPress={() => navigation?.navigate('')}>
        <Text style={styles.tryAgainBtnText}>Try Again</Text>
      </Pressable>

      <Pressable style={styles.changeActivityBtn} onPress={() => navigation?.navigate('')}>
        <Text style={styles.changeActivityBtnText}>Change Activity</Text>
      </Pressable>

      
    </View>
  )
};

const styles= StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 42
    },

    h1:{
      fontSize: 28,
      textAlign:"center"
    },
    tipBox:{
        marginVertical:20
    },
    tryAgainBtn: {
        borderRadius: 32,
      backgroundColor: '#111111',
      paddingVertical: 14,
      paddingHorizontal: 24,
      width: 318,
      alignItems: 'center',
      marginBottom: 12,
    },
    tryAgainBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    changeActivityBtn: {
      
    },
    changeActivityBtnText: {
      color: '#111111',
      fontSize: 10,
      fontWeight: '600',
    }
})

export default TryAgain