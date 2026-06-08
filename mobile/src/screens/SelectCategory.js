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

       {/* selection 3 */}     
       
       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Colours</Text>
          <Text style={styles.textContent}>Find beautiful reds, blues, and every colour in between!</Text>
        </View>
       </TouchableOpacity>

       {/* selection 4 */}     
       
       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Textures</Text>
          <Text style={styles.textContent}>Discover things that are fuzzy, smooth, or bumpy!</Text>
        </View>
       </TouchableOpacity>

       {/* selection 5 */}  

       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Animals</Text>
          <Text style={styles.textContent}>Can you spot birds, buts, or furry friends?</Text>
        </View>
       </TouchableOpacity>

       {/* selection 6 */}  

       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.textContent}>Food</Text>
          <Text style={styles.textContent}>Look for yummy fruits, vegetables and snacks!</Text>
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
    padding: 36,
    justifyContent: 'center',
    boxShadow: '0px 5px 25px -5px #D9D9D9',
  },
  textContent: {
    textAlign: 'center',
  }
});



export default SelectCategory