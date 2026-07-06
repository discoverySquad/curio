import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelectedChild } from '../../context/SelectedChildContext';
import colors from '../../constants/colors';
import { Lock } from 'lucide-react-native';
// const PARENT_ID = '6a15e296dd882ca29e6355ae'; // temp

const SelectChild = ({ navigation, route }) => {
    const [children, setChildren] = useState([]);

    useEffect(() => {
        ShowChildren();
    }, []);

    const getParentId = async () => {
        if (route?.params?.parentId) {
            return route.params.parentId;
        }

        const userStr = await SecureStore.getItemAsync('user');
        const user = userStr ? JSON.parse(userStr) : null;

        return user?.id || user?._id;
    };

    const ShowChildren = async () => {
        try {
            const parentId = await getParentId();

            if (!parentId) {
                Alert.alert('Error', 'Parent ID is missing. Please log in again.');
                return;
            }

            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/parent/${parentId}`);

            const parentData = await res.json();

            console.log('parentData =', parentData);
            console.log('childId =', parentData.childId);

            const childList = parentData.childId || [];

            const list = childList || [];
            //if API returned only IDs, fetch each child's details
            if (typeof list[0] === 'string') {
                try {
                    const newList = [];

                    for (let i = 0; i < list.length; i++) {
                        const id = list[i];

                        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/child/${id}`);

                        if (res.ok) {
                            const data = await res.json();
                            newList.push(data);
                        } else {
                            newList.push({ _id: id, name: id });
                        }
                    }

                    setChildren(newList);
                } catch (error) {
                    console.log('error:', error);
                    setChildren(list);
                }
            } else {
                setChildren(list);
            }
        } catch (error) {
            console.error('Failed loading children:', error);
        }
    };

    const { setSelectedChild } = useSelectedChild();

    const handleSelectChild = async (child) => {
        try {
            await AsyncStorage.setItem('selectedChild', JSON.stringify(child));
            console.log('saved child =', child);

            if (setSelectedChild) {
                setSelectedChild(child);
            }
        } catch (error) {
            console.error('Failed saving child:', error);
            Alert.alert('Error', 'Could not select child. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Who is exploring today?</Text>
            <Text style={styles.text}>Pick your adventurer to start the journey!</Text>
            <View style={styles.box}>
                {children.map((child) => {
                    const id = typeof child === 'string' ? child : child._id;
                    const name = typeof child === 'string' ? child : child.name;
                    const avatar = typeof child === 'string' ? null : child.avatar;
                    const avatars = [
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png',
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png',
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png',
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png',
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png',
                        'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png',
                    ];

                    let avatarSource = require('../../assets/avatar1.jpg');
                    const index = parseInt(avatar, 10);

                    if (!isNaN(index) && avatars[index]) {
                        avatarSource = { uri: avatars[index] };
                    } else if (typeof avatar === 'string' && avatar.startsWith('http')) {
                        avatarSource = { uri: avatar };
                    }
                    return (
                        <TouchableOpacity key={id} style={styles.profileItem} onPress={() => handleSelectChild(child)}>
                            <Image source={avatarSource} style={styles.avatar} />
                            <Text style={styles.name}>{name}</Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity style={styles.profileItem}>
                    <View style={styles.avatar}>
                        <TouchableOpacity
                            onPress={async () => {
                                const parentId = await getParentId();

                                navigation.navigate('CreateChild', {
                                    parentId,
                                });
                            }}
                        >
                            <Image style={styles.addBtn} source={require('../../assets/add.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>Add{'\n'}Profile</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.settingFlex}
                onPress={() =>
                    navigation.navigate("EditParentAccount")}
            >
                <Lock size={16}/>
                <Text style={styles.settingText}>Parent Settings</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SelectChild;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16
    },
    title: {
        fontSize: 30,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 38,
        color: colors.neutralInk
    },
    text: {
        textAlign: 'center',
        marginBottom: 24,
        color: colors.neutralInk
    },
    box: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 16
    },
    profileItem: {
        width: '35%',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16
    },
    name: {
        fontSize: 20,
        fontWeight: 700,
        textAlign: 'center',
        color: colors.neutral
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#b0b0b0'
    },
    addBtn: {
        width: 100,
        height: 100
    },
    settingFlex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    settingText: {
        textAlign: 'center',
        fontSize: 16
    }
});

