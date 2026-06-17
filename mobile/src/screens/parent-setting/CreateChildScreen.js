import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../../services/api.js';

export default function CreateChildScreen({ navigation, route }) {
    const parentId = route?.params?.parentId;

    const [name, setName] = useState('');
    const [selected, setSelected] = useState("");
    // const [timeLimit, setTimeLimit] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [saving, setSaving] = useState(false);

    const data = [
        { key: '1', value: 'Kindergarten' },
        { key: '2', value: 'Grade1' },
        { key: '3', value: 'Grade2' },
    ]

    const avatars = [
        require('../../assets/avatar1.jpg'),
        require('../../assets/avatar2.jpg'),
        require('../../assets/avatar3.jpg'),
        require('../../assets/avatar4.jpg'),
        require('../../assets/avatar5.jpg'),
        require('../../assets/avatar6.jpg')
    ]
    const handleCreateChild = async () => {
    if (!parentId) {
        Alert.alert("Error", "parentId is missing");
        return;
    }

    console.log("response:", data);
        if (!name.trim()) {
            Alert.alert('Missing name', 'Please enter a child name.');
            return;
        }

        if (!selected) {
            Alert.alert('Missing grade', 'Please select a grade.');
            return;
        }

        try {
            setSaving(true);

            // get 'token' and 'user' from SecureStore
            const token = await SecureStore.getItemAsync('token');
            const userStr = await SecureStore.getItemAsync('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const parentId = user?._id || user?.id;
            const data = await apiRequest('/api/child', 'POST', {
                name: name.trim(),
                grade: selected,
                avatar: selectedAvatar,
                parentId,
                timeLimit: 0
                // timeLimit: Number(timeLimit) || undefined,
            }, token);

            console.log("API_URL check start");
            console.log("payload:", {
                name: name.trim(),
                grade: selected,
                avatar: selectedAvatar,
                parentId
            });

            if (data?.message && !data?._id) {
                Alert.alert('Error', data.message);
                return;
            }

            navigation.navigate('SelectChild');
        } catch (error) {
            Alert.alert('Error', 'Could not create child profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Profile</Text>
            <Text style={styles.text}> Setting up a new adventure for your little
                explorer.</Text>

            <View style={styles.box}>
                <Text style={styles.label}
                    aria-label="Label for Username" nativeID="labelUsername"
                >
                    First name or nickname
                </Text>
                <TextInput
                    style={styles.input}
                    aria-label="input"
                    aria-labelledby="labelUsername"
                    placeholder="e.g. Leo"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Grade</Text>
                <SelectList
                    boxStyles={styles.selectBox}
                    dropdownStyles={styles.dropdown}
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    search={false}
                />

                {/* <TextInput
                style={styles.input}
                placeholder="Daily time limit in minutes"
                value={timeLimit}
                onChangeText={setTimeLimit}
                keyboardType="number-pad"
            /> */}

                <Text style={styles.label}>Choose an Avatar</Text>
                <View style={styles.avatarContainer}>
                    {avatars.map((avatar, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedAvatar(index)}
                            style={[
                                styles.avatarWrapper,
                                selectedAvatar === index && styles.selectedAvatar
                            ]}
                        >
                            <Image
                                source={avatar}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.btn}
                onPress={handleCreateChild}
                disabled={saving}
            >
                <Text style={styles.btnText}>
                    {saving ? 'Saving...' : 'Create Profile'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24
    },
    box: {
        alignSelf: 'center', backgroundColor: 'white', width: 340, border: '2px', borderColor: '#ECEEEB', padding: 20, borderRadius: 20
    },
    title: {
        fontSize: 26, fontWeight: 'bold'
    },
    text: {
        marginBottom: 20
    },
    input: {
        borderWidth: 1, borderColor: '#F2F4F0', padding: 12, borderRadius: 20, marginBottom: 12
    },
    label: {
        fontSize: 12, marginBottom: 6
    },
    selectBox: {
        borderWidth: 1, borderColor: '#F2F4F0', borderRadius: 20, marginBottom: 12
    },
    avatarContainer: {
        justifyContent: 'space-evenly', flexDirection: 'row', flexWrap: 'wrap', gap: 5,
    },
    avatarWrapper: {
        borderWidth: 2, borderColor: 'transparent', borderRadius: 40, padding: 2,
    },
    selectedAvatar: {
        borderColor: '#000000',
    },
    avatar: {
        width: 75, height: 75, borderRadius: 50,
    },
    btn: {
        width: 340, height: 50, backgroundColor: 'grey', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 50
    },
    btnText: {
        fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: 'white'
    }
});