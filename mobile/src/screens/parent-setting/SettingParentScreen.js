import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../../components/CustomButton.js'
import { useSelectedChild } from '../../context/SelectedChildContext';

const PARENT_ID = '6a15e296dd882ca29e6355ae';
const CHILD_ID  = '6a28f66e68e34f4224b78383';

export default function SettingParentScreen({ navigation }) {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationOn, setNotificationOn] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);   
    // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const { selectedChild } = useSelectedChild();
    const currentChildId = selectedChild?._id;

    useEffect(() => {
        loadChildren();
    }, []);

    const loadSelectedChild = async() => {
        const saveChild = await AsyncStorage.getItem("selectedChild");
        if(saveChild){
            const child = JSON.parse(savedChild);
            setCurrentChildId(child._id);
        }
    };

    const loadChildren = async () => {
        try{
            const parentRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`);
            const parentData= await parentRes.json();

            setNotificationOn(parentData.notification); 

        const childList = parentData.childId || [];

        if (childList.length > 0 && typeof childList[0] === 'string') {
          const detailedChildren = [];

          for (const childId of childList) {
            const childRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`);
            if (childRes.ok) {
              detailedChildren.push(await childRes.json());
            }
          }

          setChildren(detailedChildren);
        } else {
          setChildren(childList);
        }

        const currentChild = childList.find((child) => child._id === CHILD_ID);
            if(currentChild){
                setTimeLimit(currentChild.timeLimit);
            }
            }catch(error){
            console.error("Failed loading children:", error);
           }finally{
            setLoading(false);
           }
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
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`, {
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

    const handleLogout = () => {
        console.log("logout");
    }

    const handleArchive = async() => {
    try{
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}/archive`, {
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
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`, {
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
                onPress={() => {
                    Alert.alert(
                        "Account Options",
                        "",
                        [
                            { text: "Archive Account", onPress: handleArchive },
                            { text: "Delete Account", onPress: handleDelete, style: "destructive" },
                            { text: "Cancel", style: "cancel" },
                        ]
                    );
                }}
                style={{ marginRight: 4 }}
            >
                <Text style={{ color: '#000', fontSize: 22 }}>⋮</Text>
            </TouchableOpacity>
          ),
        });
    }, [navigation, handleArchive, handleDelete]);


    if(loading){
        return (
            <Text>Loading...</Text>
        );
    }

    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Switch Profile</Text>

                {/* implement navigation when edit page is ready */}
                {/* <TouchableOpacity onPress={handleTempClick}>
                    <Image source={require('../../assets/pencil.png')} style={styles.pencilSmall} />
                </TouchableOpacity> */}
            </View>
            
            <View style={styles.profilesGrid}>
            {children.map((child, index) => (
              <View key={child._id ?? index} style={styles.profileItem}>
                <TouchableOpacity
                  style={styles.profilePressArea}
                  onPress={() => {
                    if(editMode) return;

                    navigation.navigate("MainTabs", {
                        screen: "HomeTab",
                        params: {
                            screen: "Home",
                            params: {
                                childId: child._id,
                            },
                        },
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.avatarWrapper}>
                    <View style={[
                      styles.profileAvatar,
                      editMode && styles.profileAvatarEditMode
                    ]} />
                    {editMode && (
                  <TouchableOpacity
                    style={styles.editChildIcon}
                    onPress={() => navigation.navigate("EditChild", { childId: child._id })}
                    hitSlop={8}
                  >
                    <Image
                      source={require("../../assets/pencil.png")}
                      style={styles.editChildPencil}
                    />
                  </TouchableOpacity>
                )}
                  </View>
                  <Text style={styles.profileName}>{child.name}</Text>
                </TouchableOpacity>
                
              </View>
            ))}
                <TouchableOpacity style={styles.profileItem} onPress={() => navigation.navigate("CreateChild")}>
                    <View style={[styles.profileAvatar, styles.addBtn]}>
                    <Text style={styles.addBtnText}>+</Text>
                    </View>
                    <Text style={styles.profileName}>Add Profile</Text>
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
                    <TouchableOpacity onPress={() => navigation.navigate("ScreenTime")}>
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

            {/* <View style={styles.card}>
                <View style={styles.row}>
                        <Text style={styles.label}>Notification</Text>
                        <Switch
                        value={notificationOn}
                        onValueChange={handleNotificationToggle}
                        trackColor={{false: "#ccc", true: "#000000"}}
                        thumbColor="#fff"
                        />
                </View>
            </View> */}

            <CustomButton label="Log Out" onPress={handleLogout} />

            {/* <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
                <Text style={styles.deleteLink}>Delete Account</Text>
            </TouchableOpacity>

            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType='fade'
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalText}>This will remove the child profile and its saved progress. You cannot recover achievements, badges, or points after this action.</Text>
                        <CustomButton label="Delete Account" onPress={handleDelete}></CustomButton>
                    <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                    
                </View>
            </Modal> */}

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
    fontSize: 16,
    fontWeight: '600' 
},
  profilesGrid: {
     flexDirection: 'row', 
     flexWrap: 'wrap', 
     justifyContent: 'center', 
     gap: 16, 
     marginBottom: 16 
},
  profileItem: { 
    alignItems: 'center',
    gap: 4 
},
  profilePressArea: {
    alignItems: 'center',
    gap: 4,
  },
  profileAvatar: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#b0b0b0' 
},
  addBtn: { 
    backgroundColor: '#fff', 
    borderWidth: 2, borderColor: '#b0b0b0', 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center' 
},
  addBtnText: { 
    fontSize: 24, 
    color: '#b0b0b0' 
},
  profileName: { 
    fontSize: 12, 
    color: '#666' 
},
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 10, 
    paddingHorizontal: 16, 
    paddingVertical: 14, borderWidth: 0.5, 
    borderColor: '#e0e0e0' 
},
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
},
  label: { 
    fontSize: 14, 
    fontWeight: '600' 
},
  sub: { 
    fontSize: 11, 
    color: '#888', 
    marginTop: 2 
},
  pencil: { 
    width: 18, 
    height: 18, 
    tintColor: '#888' 
},
  pencilSmall: { 
    width: 16, 
    height: 16, 
    tintColor: '#555' 
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
    backgroundColor: "#888",
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
  width: 60,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
},
profileAvatarEditMode: {
  opacity: 0.4,
},
editChildIcon: {
  position: 'absolute',
  width: "100%",
  height: "100%",
  borderRadius: 30,
  backgroundColor: "#777",
  justifyContent: "center",
  alignItems: "center",
  opacity: 1,
  zIndex: 3,
},
editChildPencil: {
  width: 16,
  height: 16,
  tintColor: '#333',
},
editProfile: {
  width: '100%',
  alignItems: 'center',
  marginTop: 4,
},
});