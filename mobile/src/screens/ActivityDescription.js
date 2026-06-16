import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton.js';

const ActivityDescription = ({ navigation, route }) => {
    const categoryName = route?.params?.categoryName;
    const childId = route?.params?.childId;

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRandomTask();

        return () => {
            Speech.stop();
        };
    }, [categoryName]);

    const speakActivity = () => {
        const taskText = task?.task || 'your activity';
        const descriptionText = task?.description || '';

        Speech.stop();
        Speech.speak(`${taskText}. ${descriptionText}`, {
            language: 'en-US',
            rate: 0.85,
            pitch: 1.05,
        });
    };

    const fetchRandomTask = async () => {
        try {
            setLoading(true);
            setError('');

            if (!categoryName) {
                setError('No category selected.');
                return;
            }

            const url = `${process.env.EXPO_PUBLIC_API_URL}/api/category/name/${categoryName}`;

            const res = await fetch(url);
            const text = await res.text();

            if (!res.ok) {
                throw new Error(text || 'Could not load activity.');
            }

            const data = JSON.parse(text);
            const items = data?.categoryItem || [];

            if (items.length === 0) {
                setError('No activities found for this category.');
                return;
            }

            const randomItem = items[Math.floor(Math.random() * items.length)];
            setTask(randomItem);
        } catch (error) {
            console.error('Error:', error);
            setError('Could not load activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startActivity = () => {
        navigation.navigate('Scan', {
            screen: 'ScanCamera',
            params: {
                childId,
                categoryName,
                activityId: task?._id,
                activityTitle: task?.task,
                activityDescription: task?.description,
                expectedObject: task?.expectedObject,
            },
        });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#111111" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>

                <View style={styles.buttonSection}>
                    <CustomButton label="Try Again" onPress={fetchRandomTask} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{task?.task}</Text>

            {task?.img ? <Image source={{ uri: task.img }} style={styles.taskImage} /> : null}

            <Text style={styles.description}>{task?.description}</Text>

            <View style={styles.soundRow}>
                <Pressable style={styles.speakerButton} onPress={speakActivity}>
                    <Ionicons name="volume-high" size={22} color="#FFFFFF" />
                </Pressable>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipText}>Explore safely and ask an adult if needed.</Text>
            </View>

            <View style={styles.buttonSection}>
                <CustomButton label="Start Activity" onPress={startActivity} />
            </View>

            <Pressable
                style={styles.changeActivityBtn}
                onPress={() =>
                    navigation.navigate('SelectCategory', {
                        childId,
                    })
                }
            >
                <Text style={styles.changeActivityBtnText}>Change Activity</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 40,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: '#FFFFFF',
    },
    h1: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#111111',
    },
    taskImage: {
        width: 300,
        height: 300,
        borderRadius: 16,
        marginVertical: 16,
    },
    description: {
        width: '100%',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        color: '#222222',
        marginBottom: 12,
    },
    soundRow: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    speakerButton: {
        width: 42,
        height: 42,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4D4D4D',
    },
    tipContainer: {
        backgroundColor: '#D9D9D9',
        width: '100%',
        minHeight: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tipText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#111111',
    },
    buttonSection: {
        width: '100%',
        marginBottom: 12,
    },
    changeActivityBtn: {
        marginTop: 4,
    },
    changeActivityBtnText: {
        color: '#111111',
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#111111',
        marginBottom: 20,
    },
});

export default ActivityDescription;
