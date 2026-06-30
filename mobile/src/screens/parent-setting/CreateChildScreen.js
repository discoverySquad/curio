import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelectedChild } from '../../context/SelectedChildContext';

import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../../services/api.js';

export default function CreateChildScreen({ navigation, route }) {
    const [name, setName] = useState('');
    const [selected, setSelected] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [saving, setSaving] = useState(false);
    const { setSelectedChild } = useSelectedChild();

    const data = [
        { key: '1', value: 'Kindergarten' },
        { key: '2', value: 'Grade1' },
        { key: '3', value: 'Grade2' },
    ];

    const avatars = [
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png',
    ];

    const getParentId = async () => {
        if (route?.params?.parentId) {
            return route.params.parentId;
        }

        const userStr = await SecureStore.getItemAsync('user');
        const user = userStr ? JSON.parse(userStr) : null;

        return user?.id || user?._id;
    };

const handleCreateChild = async () => {
    console.log('response:', data);

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

        const token = await SecureStore.getItemAsync('token');
        const parentId = await getParentId();

        if (!parentId) {
            Alert.alert('Error', 'parentId is missing. Please log in again.');
            return;
        }

        const createdChild = await apiRequest(
            '/api/child',
            'POST',
            {
                name: name.trim(),
                grade: selected,
                avatar: selectedAvatar,
                parentId,
                timeLimit: 0,
            },
            token,
        );

        console.log('API_URL check start');
        console.log('payload:', {
            name: name.trim(),
            grade: selected,
            avatar: selectedAvatar,
            parentId,
        });

        await AsyncStorage.setItem('selectedChild', JSON.stringify(createdChild));
        setSelectedChild(createdChild);

        const userStr = await SecureStore.getItemAsync('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
            const updatedUser = {
                ...user,
                childId: [...(user.childId || []), createdChild._id],
            };

            await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
        }
    } catch (error) {
        console.log('Create child error:', error);
        Alert.alert('Error', error.message || 'Could not create child profile.');
    } finally {
        setSaving(false);
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Profile</Text>
            <Text style={styles.text}> Setting up a new adventure for your little explorer.</Text>

            <View style={styles.box}>
                <Text style={styles.label} aria-label="Label for Username" nativeID="labelUsername">
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

                <Text style={styles.label}>Choose an Avatar</Text>
                <View style={styles.avatarContainer}>
                    {avatars.map((avatar, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedAvatar(index)}
                            style={[styles.avatarWrapper, selectedAvatar === index && styles.selectedAvatar]}
                        >
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleCreateChild} disabled={saving}>
                <Text style={styles.btnText}>{saving ? 'Saving...' : 'Create Profile'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    box: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 340,
        border: '2px',
        borderColor: '#ECEEEB',
        padding: 20,
        borderRadius: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    text: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#F2F4F0',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        marginBottom: 6,
    },
    selectBox: {
        borderWidth: 1,
        borderColor: '#F2F4F0',
        borderRadius: 20,
        marginBottom: 12,
    },
    avatarContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    avatarWrapper: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 40,
        padding: 2,
    },
    selectedAvatar: {
        borderColor: '#000000',
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    btn: {
        width: 340,
        height: 50,
        backgroundColor: 'grey',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    btnText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
});
