import { View, Text, StyleSheet, Pressable, Button } from 'react-native'
import React from 'react'

import CustomButton from '../components/CustomButton.js'

const ActivityDescription = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.h1}>Tasks show here</Text>

        
        <View style={styles.tipContainer}>
            <Text>Explore safety and ask an adult if needed.</Text>
        </View>
        <View style={styles.buttonSection}>
          <CustomButton label="Start Activity" onPress={() => navigation?.navigate('Scan')} />
        </View>


        <Pressable style={styles.changeActivityBtn} onPress={() => navigation?.navigate('SelectCategory')}>
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
    imgContainer:{
        height:200,
        justifyContent:"center",
        backgroundColor:"#a6a5a5"
    },
    tipBox:{
        marginVertical:20
    },
    buttonSection:{
        width:318
    },
    // tryAgainBtn: {
    //     borderRadius: 32,
    //   backgroundColor: '#111111',
    //   paddingVertical: 14,
    //   paddingHorizontal: 24,
    //   width: 318,
    //   alignItems: 'center',
    //   marginBottom: 12,
    // },
    // tryAgainBtnText: {
    //   color: '#FFFFFF',
    //   fontSize: 16,
    //   fontWeight: '600',
    // },

    tipContainer:{
        backgroundColor:"#D9D9D9",
        width:358,
        height:132,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:32
    },
    
    changeActivityBtnText: {
      color: '#111111',
      fontSize: 10,
      fontWeight: '600',
    }
})

export default ActivityDescription
