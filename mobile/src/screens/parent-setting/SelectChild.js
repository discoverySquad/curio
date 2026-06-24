import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Button, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelectedChild } from '../../context/SelectedChildContext';

const PARENT_ID = '6a15e296dd882ca29e6355ae'; // temp

const SelectChild = ({ navigation }) => {
    const [children, setChildren] = useState([]);

    useEffect(() => {
        ShowChildren();
    }, []);

    const ShowChildren = async () => {
        try {
            const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/parent/${PARENT_ID}`
            );

            const parentData = await res.json();

            console.log("parentData =", parentData);
            console.log("childId =", parentData.childId);

            const childList = parentData.childId || [];

            const list = childList || [];
            //if API returned only IDs, fetch each child's details
            if (typeof list[0] === 'string') {

                try {
                    const newList = [];

                    for (let i = 0; i < list.length; i++) {
                        const id = list[i];

                        const res = await fetch(
                            `${process.env.EXPO_PUBLIC_API_URL}/api/child/${id}`
                        );

                        if (res.ok) {
                            const data = await res.json();
                            newList.push(data);
                        } else {
                            newList.push({ _id: id, name: id });
                        }
                    }

                    setChildren(newList);

                } catch (error) {
                    console.log("error:", error);
                    setChildren(list);
                }

            } else {
                setChildren(list);
            }

        } catch (error) {
            console.error("Failed loading children:", error);
        }
    };

    const { setSelectedChild } = useSelectedChild();

    const handleSelectChild = async (child) => {
        try {
            await AsyncStorage.setItem('selectedChild', JSON.stringify(child));
            console.log('saved child =', child);
            if (setSelectedChild) setSelectedChild(child);

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'MainTabs',
                        params: { screen: 'HomeTab', params: { childId: child._id } }
                    }
                ]
            });
        } catch (error) {
            console.error('Failed saving child or navigating:', error);
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
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Fox.png",
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Eagle.png",
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Beaver.png",
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Moose.png",
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Wolf.png",
                        "https://curio4985-bucket.s3.us-east-1.amazonaws.com/Bear.png"
                    ];

                    let avatarSource = require('../../assets/avatar1.jpg');
                    const index = parseInt(avatar, 10);

                    if (!isNaN(index) && avatars[index]) {
                        avatarSource = { uri: avatars[index]};
                    } else if (typeof avatar === 'string' && avatar.startsWith('http')) {
                        avatarSource = { uri: avatar };
                    }
                    return (
                        <TouchableOpacity
                            key={id} style={styles.profileItem}
                            onPress={() => handleSelectChild(child)}
                        >
                            <Image source={avatarSource} style={styles.avatar} />
                            <Text style={styles.name}>{name}</Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity style={styles.profileItem}>
                    <View style={[styles.avatar, styles.addBtn]}>
                        <Button
                            title="+"
                            onPress={() => navigation.navigate('MainTabs', {
                                screen: 'Parent',
                                params: {
                                    screen: 'CreateChild',
                                },
                            }
                            )}
                            style={styles.addBtnText}
                        >
                        </Button>
                    </View>
                    <Text style={styles.name}>Add{'\n'}Profile</Text>
                </TouchableOpacity>
            </View>

            <Button title='Parent Settings' onPress={() => navigation.navigate('MainTabs', {
                screen: 'Parent',
                params: {
                    screen: 'SettingParentScreen',
                },
            })
            }
            />

        </ScrollView>
    )
}

export default SelectChild;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    text: {
        textAlign: 'center',
        marginBottom: 24
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
        fontSize: 12,
        color: '#000000'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#b0b0b0'
    },
    addBtn: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addBtnText: {
        fontSize: 24,
        color: '#000000'
    },
});

