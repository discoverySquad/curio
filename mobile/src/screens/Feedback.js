import { View, Text, StyleSheet, Pressable, Button } from 'react-native'
import React from 'react'

import CustomButton from '../components/CustomButton.js'


const Feedback = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.h1}>Mission Complete!</Text>

        <View style={styles.imgContainer}>
            <Text>Captured image comes here</Text>
        </View>

        <Text>Nice Exploring! Keep looking around—the world is full of surprises.</Text>

        <View style={styles.funFactContainer}>
            <Text>Fun facts come here</Text>
        </View>

        <View style={styles.buttonSection}>
          <CustomButton label="Try Again" onPress={() => navigation?.navigate('TryAgain')} />
        </View>

        {/* <Pressable style={styles.nextActivityBtn} onPress={() => navigation?.navigate('')}>
            <Text style={styles.nextActivityBtnText}>Next Activity</Text>
        </Pressable> */}
      
        <Pressable style={styles.changeCategoryBtn} onPress={() => navigation?.navigate('SelectCategory')}>
            <Text style={styles.changeCategoryBtnText}>Change Category</Text>
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
    h1: {
        fontSize:28
    },
    imgContainer:{
        height:200,
        justifyContent:"center",
        backgroundColor:"#a6a5a5"
    },
    funFactContainer: {
        height:100,
        justifyContent:"center",
        backgroundColor:"#a6a5a5",
        margin:20
    },
    buttonSection:{
        width:318
    },
    // nextActivityBtn:{
    //     borderRadius: 32,
    //   backgroundColor: '#111111',
    //   paddingVertical: 14,
    //   paddingHorizontal: 24,
    //   width: 318,
    //   alignItems: 'center',
    //   marginBottom: 12,
    // },
    // nextActivityBtnText: {
    //   color: '#FFFFFF',
    //   fontSize: 16,
    //   fontWeight: '600',
    // }
})

export default Feedback
