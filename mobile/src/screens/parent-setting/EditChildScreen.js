import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../../services/api.js';
import CustomButton from '../../components/CustomButton.js';

export default function EditChildScreen({ navigation, route }){
  const { childId } = route.params;

  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [saving, setSaving] = useState(false);

  const grade = [
    { key: '1', value: 'Kindergarten' },
    { key: '2', value: 'Grade1' },
    { key: '3', value: 'Grade2' },
  ];
  const avatars = [
        require('../../assets/avatar1.jpg'),
        require('../../assets/avatar2.jpg'),
        require('../../assets/avatar3.jpg'),
        require('../../assets/avatar4.jpg'),
        require('../../assets/avatar5.jpg'),
        require('../../assets/avatar6.jpg')
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

    return(
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
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
                <Image source={avatar} style={styles.avatar}/>
                </TouchableOpacity>
              ))}
            </View>
        </View>
        <CustomButton
          label="Save Changes"
          onPress={handleSaveChanges}
        />
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  box: {
    backgroundColor: 'white',
    width: 340,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECEEEB',
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
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: '#777',
    borderRadius: 40,
    padding: 2,
  },
  selectedAvatar: {
    borderColor: '#000',
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});