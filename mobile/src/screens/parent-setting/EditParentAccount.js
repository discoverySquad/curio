import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import colors from '../../constants/colors';

const EditParentAccount = ({route, user}) => {
  // const PARENT_ID = '6a15e296dd882ca29e6355ae';// temporary
  const parentId = user?.id || user?._id || route?.params?.parentId;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      loadChildren();
    }, []);

  const loadChildren = async() => {
    try{
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`);
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
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,
          email
        }),
      });

      if(!res.ok){
        throw new Error("Fail updating parent profile");
      }

      const data = await res.json();
      console.log("updated parent: ", data);
      setShowModal(true)
      
    }catch(error){
    console.error("Update error:", error); 
    Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleParentPasswordChange = () => {
    navigation.navigate("ChangePassword", { user });
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

         <CustomButton label="Confirm Changes" onPress={handleParentProfileChange} />

         <CustomButton style={styles.changePassword} label="Change Password" onPress={handleParentPasswordChange} />
      </View>
      

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Changes Saved
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>  // ← 修正: ButtonをTouchableOpacityに変更
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    formContainer: {
      marginTop: 24,
      marginBottom: 24.
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      width: "80%",
      backgroundColor: "#fff",
      borderRadius:24,
      padding: 24,
     alignItems: "center",
    },
    modalText: {
      fontSize: 12,
      color: '#555',
},
})