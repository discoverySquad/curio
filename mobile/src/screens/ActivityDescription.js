import { View, Text, StyleSheet, Pressable, Button, Image} from 'react-native'
import {useEffect, useState} from 'react'
import React from 'react'

import CustomButton from '../components/CustomButton.js'

const ActivityDescription = ({ navigation, route }) => {
  const categoryName = route?.params?.categoryName;
    const [task, setTask] = useState(null);

    useEffect(() => {
        fetchRandomTask();
    }, []);


  const fetchRandomTask = async () => {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/api/category/name/${categoryName}`;
    console.log('url:', url);
    console.log('categoryName:', categoryName);

    const res = await fetch(url);
    console.log('status:', res.status);

    const text = await res.text();
    console.log('response:', text); 

    const data = JSON.parse(text);
    const items = data.categoryItem;
    console.log('items:', JSON.stringify(items)); 
    console.log('items.length:', items.length); 

    const randomItem = items[Math.floor(Math.random() * items.length)];
    console.log('randomItem:', randomItem);   

    setTask(randomItem);

  } catch (error) {
    console.error('Error:', error); // ← 必ずエラーを表示
  }
};

  return (
    <View style={styles.container}>
        <Text style={styles.h1}>{task?.task}</Text>
        {task?.img ? (<Image source={{ uri: task.img }} style={styles.taskImage}/>) : null}
        <Text>{task?.description}</Text>
        
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
    taskImage: {
        width: 300,
        height: 300,
        borderRadius: 16,
        marginVertical: 16,
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
