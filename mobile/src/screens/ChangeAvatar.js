import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Pressable } from 'react-native';

import colors from '../constants/colors';
import { useSelectedChild } from '../context/SelectedChildContext';


const ChangeAvatar = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(0);

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedChild, setSelectedChild } = useSelectedChild();
    const childId = route?.params?.childId || selectedChild?._id;

    const avatars = [
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png',
        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png',
    ];

    useEffect(() => {
        const loadCurrentAvatar = async () => {
            const storedAvatar = await AsyncStorage.getItem('selectedAvatar');
            const avatarFromChild = selectedChild?.avatar;

            if (avatarFromChild !== undefined && avatarFromChild !== null && avatarFromChild !== '') {
                const parsedAvatar = parseInt(avatarFromChild, 10);
                if (!isNaN(parsedAvatar)) {
                    setSelectedAvatar(parsedAvatar);
                    return;
                }
            }

            if (storedAvatar !== null) {
                setSelectedAvatar(parseInt(storedAvatar, 10));
            }
        };

        loadCurrentAvatar();
    }, [selectedChild]);

    const handleSelect = async (index) => {
        setSelectedAvatar(index);

        try {
            if (childId) {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ avatar: String(index) }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update avatar');
                }

                const updatedChild = await response.json();
                await AsyncStorage.setItem('selectedChild', JSON.stringify(updatedChild));

                if (setSelectedChild) {
                    setSelectedChild(updatedChild);
                }
            }

            await AsyncStorage.setItem('selectedAvatar', String(index));

            navigation.goBack();
        } catch (error) {
            console.error('Avatar update failed:', error);
            Alert.alert('Error', 'Could not update avatar. Please try again.');
        }
    };

    const handleSave = async () => {
        try {
            if (!childId) return;

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/child/${childId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        avatar: String(selectedAvatar),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update avatar');
            }

            const updatedChild = await response.json();

            await AsyncStorage.setItem('selectedChild', JSON.stringify(updatedChild));
            await AsyncStorage.setItem('selectedAvatar', String(selectedAvatar));

            setSelectedChild?.(updatedChild);

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not update avatar');
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Avatar</Text>

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
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    </TouchableOpacity>
                ))}
            </View>

            <Pressable style={styles.btn} onPress={handleSave}>
                <Text style={styles.btnText}>Save Changes</Text>
            </Pressable>
        </View>
    );
};

export default ChangeAvatar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 700,
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: colors.tertiary,
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderRadius: 30
    },
    avatarWrapper: {
        padding: 6,
        borderRadius: 50,
    },
    selectedAvatar: {
        borderWidth: 3,
        borderColor: colors.primary,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    btn: {
        width: 340,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    btnText: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        color: 'white',
    },
});