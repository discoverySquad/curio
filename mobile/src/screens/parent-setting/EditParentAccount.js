import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import colors from '../../constants/colors';

const EditParentAccount = () => {
  const PARENT_ID = '6a15e296dd882ca29e6355ae';// temporary

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      loadChildren();
    }, []);

  const loadChildren = async() => {
    try{
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`);
      const data = await res.json();

      setName(data.name);
      setEmail(data.email);
    }catch(error){
      console.error("Fail loading parent: ", error);
    }finally{
      setLoading(false);
    }
  };

  const handleParentProfileChange = async() => {
    try{
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,
          email
        }),
      });
      const data = res.json();
      console.log("updated parent: ", data);

      if(!res.ok){
        throw new Error("Fail updating parent profile");
      }
    }catch(error){
      console.log
    }
  };

  const handleParentPasswordChange = () => {
    console.log("change password")
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text>EditParentAccount</Text>
         <Text style={styles.label}>Name</Text>
         <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} />

         <Text style={styles.label}>Email Address</Text>
         <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none' 
         />

         <CustomButton style={styles.changePassword} label="Change Password" onPress={handleParentPasswordChange} />
      </View>
      <CustomButton label="Confirm Changes" onPress={handleParentProfileChange} />
    </ScrollView>
  );
};

export default EditParentAccount

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
    },
    changeButton: {
    borderColor: colors.tertiary,
    borderRadius: 30,
    paddingVertical: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    },
    changePassword: {
      borderColor:colors.tertiary,
      backgroundColor: "#FFF"
    },
    input: {
        height: 56,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 8,
        marginVertical: 4,
        marginHorizontal: 8,
    },
})