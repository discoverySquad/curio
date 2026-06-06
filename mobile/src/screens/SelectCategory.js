import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

const SelectCategory = () => {

  const handlePress = async() => {
    console.log("Start Activity!")
  }
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      <Text style={styles.mainText}>Choose your adventure!</Text>
      <Text style={styles.subText}>What do you want to find today?</Text>

      {/* selection 1 */}
      
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Nature</Text>
          <Text style={styles.textContent}>Find bugs, and hidden treasures!</Text>
        </View>
      </TouchableOpacity>
      

       {/* selection 2 */}     
       
       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Shapes</Text>
          <Text style={styles.textContent}>Spot circles, squares, and stars all around you!</Text>
        </View>
       </TouchableOpacity>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
  padding: 20,
  gap: 16,
  alignItems: 'center',
},
  mainText: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  card: {
    width: 250,
    height:280,
    backgroundColor:'#E8E8E8',
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
  },
  textContent: {
    textAlign: 'center',
  }
});



export default SelectCategory