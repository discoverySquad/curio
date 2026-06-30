import { View, Text, StyleSheet, Pressable, Button, ScrollView, Image } from 'react-native'
import React from 'react'

import CustomButton from '../components/CustomButton.js'
import { typography } from '../constants/fonts';

const TryAgain = ({ navigation, route }) => {

    const childId = route?.params?.childId;
    const categoryName = route?.params?.categoryName;
    const taskName = route?.params?.taskName;
    const activityId = route?.params?.activityId;
    const activityDescription = route?.params?.activityDescription;

    const avator = [
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_1.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_2.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Mascot_Wrong_Answer_3.png"
    ]
    const randomAvatar = avator[Math.floor(Math.random() * avator.length)];

    const tryAgain = () => {
        navigation.navigate('ScanCamera', {
            childId,
            categoryName,
            taskName,
            activityId,
            activityTitle: taskName,
            activityDescription,
        });
    };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.h2, typography.h2]}>Not quite what we’re looking for...</Text>

        <View style={styles.imgContainer}>
             <Image style={styles.avator} source={{ uri: randomAvatar }} />
        </View>

        <View style={styles.tipBox}>
            <Image style={styles.infoIcon} source={require('../assets/Background_icon.png')} />
            <Text style={[styles.tipText, typography.section]}>Need a hand? Ask an adult to help you hind a matching pattern!</Text>
        </View>

        <View style={styles.buttonSection}>
          <CustomButton label="Try Again" onPress={tryAgain} />
        </View>

        {/* <Pressable style={styles.tryAgainBtn} onPress={() => navigation?.navigate('')}>
            <Text style={styles.tryAgainBtnText}>Try Again</Text>
        </Pressable> */}

        <Pressable style={[styles.changeActivityBtn, typography.section]} onPress={() => navigation?.navigate('SelectCategory')}>
            <Text style={styles.changeActivityBtnText}>Change Activity</Text>
        </Pressable>

      
    </ScrollView>
  )
};

const styles= StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        fontFamily:""
    },
    content:{
        alignItems: "center",
        marginHorizontal: 42
    },

    h2:{
    //   fontSize: 28,
      textAlign:"center",
      marginTop:24
    //   color:"#574239"
    },
    imgContainer:{
        // height:318,
        // width:318,
        justifyContent:"center",
        // backgroundColor:"#a6a5a5",
        marginTop:40,
        marginBottom:40
    },
    avator:{
        width: 318,
        height: 318,
        resizeMode: 'contain'
    },
    tipBox: {
        flex:1,
        flexDirection:'row',
        gap:24,
        backgroundColor: '#F0BA7A',
        width: 358,
        height: 144,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
        paddingHorizontal: 20,
        marginBottom: 94,
    },
    infoIcon:{
        width:80,
        height:80
    },
    tipText: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000000',
        width:206,
        lineHeight:24
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
    changeActivityBtn: {
      
    },
    changeActivityBtnText: {
      color: '#3D332E',
      fontSize: 16,
      fontWeight: '600',
      marginVertical:18
    }
})

export default TryAgain
