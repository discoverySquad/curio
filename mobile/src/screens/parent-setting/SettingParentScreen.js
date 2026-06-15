import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import CustomButton from '../../components/CustomButton.js'

const PARENT_ID = '6a15e296dd882ca29e6355ae';
const CHILD_ID  = '6a28f66e68e34f4224b78383';

export default function SettingParentScreen({ navigation }) {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationOn, setNotificationOn] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        try{
            const parentRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`);
            const parentData= await parentRes.json();
            const childIds = parentData.childId;
            setNotificationOn(parentData.notification); 

            const childrenData = [];
            for(const id of childIds){
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${id}`);
                const data = await res.json();
                childrenData.push(data);
            }
            setChildren(childrenData);
            
            const currentChild = childrenData.find((child) => child._id === CHILD_ID); //temporary ID
            if(currentChild){
                setTimeLimit(currentChild.timeLimit);
            }
            }catch(error){
            console.error("Failed loading children: ". error);
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

    const handleDelete = () => {
        console.log("Delete Account")
    }

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
                <TouchableOpacity onPress={handleTempClick}>
                    <Image source={require('../../assets/pencil.png')} style={styles.pencilSmall} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.profilesGrid}>
            {children.map((child) => (
                <TouchableOpacity
                key={child._id}
                style={styles.profileItem}
                onPress={() => navigation.navigate('Home', {
                    screen: 'Home',
                    params: { childId: child._id }
                })}
                >
                <View style={styles.profileAvatar} />
                <Text style={styles.profileName}>{child.name}</Text>
                </TouchableOpacity>
            ))}
                <TouchableOpacity style={styles.profileItem}>
                    <View style={[styles.profileAvatar, styles.addBtn]}>
                    <Text style={styles.addBtnText}>+</Text>
                    </View>
                    <Text style={styles.profileName}>Add{'\n'}Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Screen Time</Text>
                <Text style={styles.sub}>
                    {loading
                    ? "Loading..."
                    : `Daily limit: ${timeLimit ?? "--"} minutes`}
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.editRow}>
                    <Text style={styles.label}>Edit parent account</Text>
                    <Image source={require('../../assets/pencil.png')} style={styles.pencilSmall} />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.row}>
                        <Text style={styles.label}>Notification</Text>
                        <Switch
                        value={notificationOn}
                        onValueChange={handleNotificationToggle}
                        trackColor={{false: "#ccc", true: "#000000"}}
                        thumbColor="#fff"
                        />
                </View>
            </View>

            <CustomButton label="Log Out" onPress={handleLogout} />

            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
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
});