import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelectedChild } from '../../context/SelectedChildContext';

import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../../services/api.js';

import { fonts } from '../../constants/fonts.js';
import colors from '../../constants/colors.js';

export default function CreateChildScreen({ navigation, route }) {
    const [name, setName] = useState('');
    const [selected, setSelected] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [saving, setSaving] = useState(false);
    const { setSelectedChild } = useSelectedChild();
    const source = route?.params?.source;

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

            // await AsyncStorage.setItem('selectedChild', JSON.stringify(createdChild));
            // setSelectedChild(createdChild);

            const userStr = await SecureStore.getItemAsync('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user) {
                const updatedUser = {
                    ...user,
                    childId: [...(user.childId || []), createdChild._id],
                };

                await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
            }
            Alert.alert(
                'Profile Created!',
                `${createdChild.name}'s profile is ready.`,
                [
                    {
                        text: "Let's Explore!",
                        onPress: async () => {
                            await AsyncStorage.setItem(
                                'selectedChild',
                                JSON.stringify(createdChild)
                            );

                            setSelectedChild(createdChild);

                            if (source === 'initialSetup') {
                                // Sign Up → Create Profile → Home
                                navigation.navigate('Home');
                                return;
                            }

                            // Switch Profile → Create Profile → Switch Profile
                            navigation.goBack();
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.log('Create child error:', error);
            Alert.alert('Error', error.message || 'Could not create child profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView>
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
                        inputStyles={styles.inputStyles}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontFamily: fonts.heading,
        fontSize: 36,
        fontWeight: 700,
        marginBottom: 10,
        textAlign: 'center'
    },
    text: {
        fontFamily: fonts.body,
        fontSize: 16,
        fontWeight: 400,
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: colors.surface,
        backgroundColor: colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 18,
        borderRadius: 30,
        marginBottom: 12,
    },
    label: {
        fontFamily: fonts.heading,
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 6,
    },
    box: {
        backgroundColor: colors.tertiary,
        borderRadius: 32,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    selectBox: {
        backgroundColor: colors.surface,
        borderColor: colors.surface,
        borderWidth: 1,
        borderRadius: 30,
        height: 50,
        marginBottom: 12
    },
    inputStyles: {
        fontSize: 16,
        paddingVertical: 0,
        marginTop: 5,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderColor: colors.surface,
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
        borderColor: colors.primary,
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    btn: {
        width: '100%',
        height: 67,
        backgroundColor: colors.primary,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    btnText: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        fontFamily: fonts.heading,
    },
});