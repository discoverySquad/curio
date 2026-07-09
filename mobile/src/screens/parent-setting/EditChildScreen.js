import { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../../services/api.js';
import CustomButton from '../../components/CustomButton.js';
import colors from '../../constants/colors.js';
import { typography } from '../../constants/fonts.js';

export default function EditChildScreen({ navigation, route }){
  const { childId } = route.params;

  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [saving, setSaving] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false); 

  const grade = [
    { key: '1', value: 'Kindergarten' },
    { key: '2', value: 'Grade1' },
    { key: '3', value: 'Grade2' },
  ];
  const avatars = [
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png",
        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png"
    ];
    useEffect(() => {
      const loadChild = async() => {
        try{
          const token = await SecureStore.getItemAsync("token");
          const child = await apiRequest(
            `/api/child/${childId}`,
            "GET",
            null,
            token
          );

          setName(child.name || "");
          setSelected(child.grade || "");
          setSelectedAvatar(child.avatar || 0);
        }catch(error){
          Alert.alert("Error", "Could not load child profile");
        }
      };
      loadChild();
    }, [childId]);

    useLayoutEffect(() => {
    navigation.setOptions({
      // headerRightContainerStyle: { backgroundColor: colors.primary },
        headerRight: () => (
            <TouchableOpacity onPress={() => setArchiveModalVisible(true)}>
                <Image 
                    source={require('../../assets/Delete-Profile-Icon.png')}
                    style={{ width: 32, height: 26, }}
                />
            </TouchableOpacity>
        ),
    });
}, [navigation]);


    const handleSaveChanges = async() => {
      if(!name.trim()){
        Alert.alert("Missing name", "Please enter a child name");
        return;
      }
      if(!selected){
        Alert.alert("Missing grade", "Please enter a child grade");
        return;
      }
      try{
        setSaving(true);
        const token = await SecureStore.getItemAsync("token");
        await apiRequest(
          `/api/child/${childId}`,
          "PATCH",
          {
            name: name.trim(),
            grade: selected,
            avatar: selectedAvatar,
          },
          token
        );
        Alert.alert("Success", "Child profile saved");
        navigation.goBack();
      }catch(error){
        Alert.alert("Error", "Could not update child profile");
      }finally{
        setSaving(false);
      }
    };

    const handleArchive = async() => {
    try{
        const token = await SecureStore.getItemAsync("token");
        await apiRequest(
            `/api/child/${childId}/archive`,
            "PATCH",
            null,
            token
        );
        setArchiveModalVisible(false); 
        Alert.alert("Archived", "Child profile archived");
        navigation.navigate("SelectChildStart");
      }catch(error){
        Alert.alert("Error", "Could not archive child profile");
      } 
    };

    return(
      <View style={styles.container}>

        <View style={styles.box}>
          <Text style={styles.label}>First name or nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Leo the Lion"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Grade</Text>
          <SelectList 
            boxStyles={styles.selectBox}
            dropdownStyles={styles.dropdown}
            data={grade}
            setSelected={(val) => setSelected(val)}
            save='value'
            search={false}
            defaultOption={
              selected ? {key: selected, value: selected }
              : undefined
            }/>

            <Text style={styles.label}>Choose an Avatar</Text>
              
            <View style={styles.avatarContainer}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedAvatar(index)}
                  style={[
                    styles.avatarWrapper,
                    selectedAvatar === index && styles.selectedAvatar,
                  ]}>
                <Image source={{ uri: avatar }} style={styles.avatar}/>
                </TouchableOpacity>
              ))}
            </View>
        </View>
        <CustomButton
          label="Save Changes"
          onPress={handleSaveChanges}
        />

        <Modal
          visible={archiveModalVisible}
          transparent={true}
          animationType='fade'
        >
          <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                  <Text style={[styles.modalTitle, typography.h2]}>Are you sure?</Text>
                  <Text style={[styles.modalText, typography.body]}>This will remove the child profile and its saved progress. You cannot recover achievements or activities after this action.</Text>
                  <TouchableOpacity
                    style={styles.archiveButton}
                    onPress={handleArchive}
                    activeOpacity={0.8}
                  >
                  <Text style={[styles.archiveButtonText, typography.h3]}>Archive Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setArchiveModalVisible(false)}>
                      <Text style={[styles.cancelText, typography.section]}>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    // marginBottom: 30,
  },
  box: {
    backgroundColor: 'white',
    width: 340,
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
    backgroundColor: colors.tertiary,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F2F4F0',
    backgroundColor: '#F2F4F0',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#F2F4F0',
    backgroundColor: '#F2F4F0',
    borderRadius: 20,
    marginBottom: 12,
  },
  dropdown: {
    borderColor: '#F2F4F0',
    backgroundColor: '#F2F4F0',
    marginBottom: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  avatarWrapper: {
    // borderWidth: 2,
    // borderColor: '#777',
    borderRadius: 40,
    padding: 2,
  },
  selectedAvatar: {
    borderColor: '#000',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 35,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
archiveLink: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#88888888",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    paddingVertical: 21,
    paddingHorizontal: 34
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color:"#574239"
  },
  modalText: {
    color: '#3D332E',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight:24
  },
  archiveButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 32,
    backgroundColor: '#A64D3F', 
    alignItems: 'center',
    marginBottom: 20,
  },
  archiveButtonText:{
    color:"#F9FBF7",
  },
  cancelText: {
    paddingVertical:18,
    color:"#3D332E"
  },
});
