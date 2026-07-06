import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

import CustomButton from '../../components/CustomButton.js'
import { useSelectedChild } from '../../context/SelectedChildContext';
import { typography } from '../../constants/fonts.js';
import colors from '../../constants/colors.js';
import {fonts} from '../../constants/fonts.js';


// const PARENT_ID = '6a15e296dd882ca29e6355ae';
// const CHILD_ID  = '6a28f66e68e34f4224b78383';

export default function SettingParentScreen({ navigation, route, user, onLogout }) {
    const parentId = user?.id || user?._id || route?.params?.parentId;

    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationOn, setNotificationOn] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);   
    // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const { selectedChild } = useSelectedChild();
    const currentChildId = selectedChild?._id;

    const [optionsModalVisible, setOptionsModalVisible] = useState(false);

    const avatars = [
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png',
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png',
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png',
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png',
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png',
    'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png',
];

    useFocusEffect(
    React.useCallback(() => {
        loadChildren();
    }, [])
);

    const loadSelectedChild = async() => {
        const saveChild = await AsyncStorage.getItem("selectedChild");
        if(saveChild){
            const child = JSON.parse(savedChild);
            setCurrentChildId(child._id);
        }
    };

    const loadChildren = async () => {

        try{
            const parentRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`);
            const parentData= await parentRes.json();

            // console.log("parentData:", JSON.stringify(parentData, null, 2)); //test

            setNotificationOn(parentData.notification); 

            const childList = parentData.childId || [];
            // setChildren(childList);

        // const childList = parentData.childId || [];

        if (childList.length > 0 && typeof childList[0] === 'string') {
          const detailedChildren = [];

          for (const childId of childList) {
            const childRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`);
            if (childRes.ok) {
              detailedChildren.push(await childRes.json());
            }
          }

          setChildren(detailedChildren);
          const currentChild = detailedChildren.find((child) => child._id === currentChildId);
            if (currentChild) {
                setTimeLimit(currentChild.timeLimit);
            }
        } else {
          setChildren(childList);
        }

        const currentChild = childList.find((child) => child._id === currentChildId);
            if(currentChild){
                setTimeLimit(currentChild.timeLimit);
            }
            }catch(error){
            console.error("Failed loading children:", error);
           }finally{
            setLoading(false);
           }
    };

    const handleLogout = async () => {
        await onLogout();
    };

    const handleSelectChild = (child) => {
        navigation.navigate('Scan', {
            childId: child._id,
            childName: child.name,
        });
    };

    const handleNotificationToggle = async(value) => {

        setNotificationOn(value);
        try{
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`, {
                method: "PATCH",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({notification: value}),
            });

            if(!res.ok){
                throw new Error("Failed updating notification");
            }
        }catch(error){
            setNotificationOn(!value);
            Alert.alert("Error", "Failed updating notification");
            console.error("Notification update error: ", error);
        }
    };

    const handleTempClick = () => {
        console.log("temp click");
    }

    const handleArchive = async() => {
    try{
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}/archive`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
        });
        if(!res.ok){
            Alert.alert("Error", "Failed to archive account");
            return;
        }
        // setDeleteModalVisible(false);
        await AsyncStorage.removeItem("selectedChild");
        Alert.alert("Archived", "Account archived");
        navigation.navigate("SelectChildStart");
    }catch(error){
        console.log(error);
        Alert.alert("Error", "Something went wrong");
    }
};

    const handleDelete = async() => {
    try{
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`, {
            method: "DELETE",
        });
        if(!res.ok){
            Alert.alert("Error", "Failed to delete account");
            return;
        }
        await AsyncStorage.removeItem("selectedChild");
        Alert.alert("Deleted", "Account deleted");
        navigation.navigate("SelectChildStart");
      }catch(error){
        console.log(error);
        Alert.alert("Error", "Something went wrong");
      }
    };

    useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity 
                onPress={() => setOptionsModalVisible(true)}
                style={{ marginRight: 4 }}
            >
                <Image 
                    source={require('../../assets/Delete-Profile-Icon-Parent.png')}
                    style={{ width: 32, height: 26 }}
                />
            </TouchableOpacity>
        ),
    });
}, [navigation]);


    if(loading){
        return (
            <Text>Loading...</Text>
        );
    }

    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, typography.h1]}>Switch Profile</Text>

            </View>
            
            <View style={styles.profilesGrid}>
            {children.map((child, index) => (
              <View key={child._id ?? index} style={styles.profileItem}>
                <TouchableOpacity
                  style={styles.profilePressArea}
                  onPress={() => {
                    if(editMode) return;

                    navigation.navigate("HomeTab", {
                      screen: "Home",
                      params: {
                        childId: child._id,
                       },
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={{uri: avatars[parseInt(child.avatar)]}}
                      style={[
                        styles.profileAvatar,
                        editMode && styles.profileAvatarEditMode
                      ]}
                      />
                      {editMode && (
                        <TouchableOpacity
                          style={styles.editChildIcon}
                          onPress={() => navigation.navigate("EditChild", {childId: child._id})}
                          hitSlop={8}>
                          <Image
                            source={require("../../assets/pencil.png")}
                            style={styles.editChildPencil}
                          />
                          </TouchableOpacity>
                      )}
                  </View>
                  <Text style={[styles.profileName, typography.h3]}>{child.name}</Text>
                </TouchableOpacity>
                
              </View>
            ))}
                <TouchableOpacity style={styles.profileItem} onPress={() => navigation.navigate("CreateChild")}>
                  <Image source={require('../../assets/add.png')} style={styles.addAvatar} resizeMode={"contain"} />
                  <Text style={[styles.profileName, typography.h3]}>Add Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.editProfile}
                    onPress={() => setEditMode(!editMode)}>
                    <Text>{editMode ? "Cancel" : "Edit Profile"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.editRow}>
                    <View>
                        <Text style={styles.label}>Screen Time</Text>
                        <Text style={styles.sub}>
                            {loading
                            ? "Loading..."
                            : `Daily limit: ${timeLimit} minutes`}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("ScreenTime", { childId: currentChildId })}>
                      <Image source={require('../../assets/pencil.png')} style={styles.pencilSmall} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.editRow}>
                    <Text style={styles.label}>Edit parent account</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("EditParentAccount")}>
                      <Image source={require('../../assets/pencil.png')} style={styles.pencilSmall} />
                    </TouchableOpacity>
                </View>
            </View>

            <CustomButton label="Log Out" onPress={handleLogout} />

              <Modal
            visible={optionsModalVisible}
            transparent={true}
            animationType='fade'
            >
    <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, typography.h2]}>Are you sure?</Text>
            
            <Text style={[styles.modalText, typography.body]}>This will archive the child profile. Achievements, badges, and points will be saved.</Text>
            <CustomButton
                style={[styles.archiveBtn,typography.heading]}
                label="Archive Account"
                onPress={() => {
                    setOptionsModalVisible(false);
                    handleArchive();
                }}
            />

            <CustomButton
                style={[styles.deleteBtn,typography.heading]}
                label="Delete Account"
                onPress={() => {
                    setOptionsModalVisible(false);
                    handleDelete();
                }}
            />

            <TouchableOpacity onPress={() => setOptionsModalVisible(false)}>
                <Text style={[styles.cancelText, typography.body]}>Cancel</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
    },
  centered:{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, marginVertical: 12 
},
  sectionTitle: { 
    marginVertical: 32,
    color: colors.neutral,
},
  profilesGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'center',
     alignItems: 'flex-start',
     gap: 16,
     marginBottom: 16,
  },
  profileItem: {
    width: '46%',
    alignItems: 'center',
    gap: 6,
    marginVertical: 8,
  },
  profilePressArea: {
    alignItems: 'center',
    gap: 4,
  },
  profileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#b0e6df',
  },
 addAvatar: {
    width: 80,
    height: 80,
    borderRadius: 46,
 },
  profileName: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 8,
    textAlign: 'center',
  },
  card: { 
    backgroundColor: colors.tertiary,
    borderRadius: 32, 
    marginBottom: 24, 
    paddingHorizontal: 16, 
    paddingVertical: 24, 
    borderWidth: 0.5, 
    borderColor: '#e0e0e0' 
},
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
},
  label: { 
    fontSize: 24, 
    fontWeight: '700', 
    fontFamily: fonts.heading,
},
  sub: { 
    fontFamily: fonts.heading,
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 2,
    color: colors.neutral,
},
  pencil: { 
    width: 18, 
    height: 18, 
    tintColor: '#888' 
},
  pencilSmall: { 
    width: 32, 
    height: 32, 
},
editRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
  deleteLink: { 
    textAlign: 'center', 
    fontSize: 12, 
    color: '#888', 
    marginTop: 10, 
    textDecorationLine: 'underline' 
},
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
     width: "80%",
     backgroundColor: "#fff",
     borderRadius: 24,
     padding: 24,
     alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
deleteButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '700',
},

cancelText: {
  fontSize: 12,
  color: '#555',
},
avatarWrapper: {
  position: 'relative',
  width: 92,
  height: 92,
  alignItems: 'center',
  justifyContent: 'center',
},
// profileAvatar is defined above (larger size)
profileAvatarEditMode: {
  opacity: 0.4,
},
editChildIcon: {
  position: 'absolute',
  width: "100%",
  height: "100%",
  borderRadius: 46,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
  opacity: 1,
  zIndex: 3,
},
editChildPencil: {
  width: 24,
  height: 24,
  // tintColor: '#fff',
},
editProfile: {
  width: '100%',
  alignItems: 'center',
  marginTop: 4,
},
modalText:{
  textAlign:"center",
  marginBottom: 10
},
deleteBtn:{
  marginBottom: 20
}
});