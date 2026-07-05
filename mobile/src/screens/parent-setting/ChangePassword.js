import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../../components/CustomButton'
import colors from '../../constants/colors';

const ChangePassword = ({ route, user }) => {

  // const user = route?.params?.user;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSavePassword = async() => {

    if(!currentPassword || !newPassword || !confirmPassword){
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if(newPassword !== confirmPassword){
      Alert.alert("Error", "New password do not match");
      return;
    }
    
    try{
      const verifyRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, password: currentPassword }),
      });

      if(!verifyRes.ok){
        Alert.alert("Error", "Current password is not correct");
        return;
      }

      const updateRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/parent/${user?.id || user?._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if(!updateRes.ok){
        Alert.alert("Error", "Failed to update password");
        return;
      }

      Alert.alert("Success", "Password updated successfully")
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
    }catch(error){
      console.error("Change password error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const PasswordInput = ({ label, value, onChangeText, show, onToggle }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
        />
        <TouchableOpacity onPress={onToggle} style={styles.eyeButton}>
          <Ionicons
            name={show ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          show={showCurrent}
          onToggle={() => setShowCurrent(!showCurrent)}
        />
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />
        
        <View style={styles.buttonContainer}>
          <CustomButton label="Save Changes" onPress={handleSavePassword} />
        </View>
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  eyeButton: {
    paddingLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 8,
  },
})

export default ChangePassword