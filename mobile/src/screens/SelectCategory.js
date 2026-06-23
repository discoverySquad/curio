import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import colors from "../constants/colors.js";

const SelectCategory = ({navigation}) => {

  const handlePress = (categoryName) => {
    navigation.navigate('ActivityDescription', { categoryName });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      <Text style={styles.mainText}>Choose your adventure!</Text>
      <Text style={styles.subText}>What do you want to find today?</Text>

      {/* selection 1 */}
      
      <TouchableOpacity onPress={() => handlePress('nature')} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Nature.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Nature</Text>
          <Text style={styles.textContent}>Find bugs, and hidden treasures!</Text>
        </View>
      </TouchableOpacity>
      

       {/* selection 2 */}     
       
       <TouchableOpacity onPress={() => handlePress('shapes')} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Shapes.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Shapes</Text>
          <Text style={styles.textContent}>Spot circles, squares, and stars all around you!</Text>
        </View>
       </TouchableOpacity>

       {/* selection 3 */}     
       
       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Colours.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Colours</Text>
          <Text style={styles.textContent}>Find beautiful reds, blues, and every colour in between!</Text>
        </View>
       </TouchableOpacity>

       {/* selection 4 */}     
       
       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Textures.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Textures</Text>
          <Text style={styles.textContent}>Discover things that are fuzzy, smooth, or bumpy!</Text>
        </View>
       </TouchableOpacity>

       {/* selection 5 */}  

       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Animals.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Animals</Text>
          <Text style={styles.textContent}>Can you spot birds, buts, or furry friends?</Text>
        </View>
       </TouchableOpacity>

       {/* selection 6 */}  

       <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Image 
            source={{ uri: "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Food.png"}}
            style={styles.cardImage}
            resizeMode='contain'
            />
          <Text style={styles.textTitle}>Food</Text>
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
  alignItems: 'center',
},
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 0,
  },
  subText: {
    fontSize: 18,
    marginBottom: 16,
  },
  card: {
    width: 280,
    height:270,
    backgroundColor:colors.tertiary,
    borderRadius: 20,
    padding: 36,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: "center",
    boxShadow: '0px 10px 30px -5px #D6D6D6',
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700,
    marginTop: 4,
    marginBottom: 8,
  },
  textContent: {
    textAlign: 'center',
  },
  cardImage: {
    width: 150,
    height: 150,
    alignItems: "center",
  },
});



export default SelectCategory
