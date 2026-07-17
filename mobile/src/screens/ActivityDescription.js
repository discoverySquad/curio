import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../constants/fonts.js';
import CustomButton from '../components/CustomButton.js';

const ActivityDescription = ({ navigation, route }) => {
    const categoryName = route?.params?.categoryName;
    const childId = route?.params?.childId;

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        fetchRandomTask();

        return () => {
            Speech.stop();
            setIsSpeaking(false);
        };
    }, [categoryName]);

    const toggleSpeech = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        const taskText = task?.task || 'your activity';
        const descriptionText = task?.description || '';

        Speech.stop();
        setIsSpeaking(true);

        Speech.speak(`${taskText}. ${descriptionText}`, {
            language: 'en-US',
            rate: 0.85,
            pitch: 1.05,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    const fetchRandomTask = async () => {
        try {
            setLoading(true);
            setError('');
            Speech.stop();
            setIsSpeaking(false);

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
        Speech.stop();
        setIsSpeaking(false);

        navigation.navigate('Scan', {
            screen: 'ScanCamera',
            params: {
                childId,
                categoryName,
                activityId: task?._id,
                activityTitle: task?.task,
                activityDescription: task?.description,
                expectedObject: task?.expectedObject,
                taskName: task?.task,
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.h1}>{task?.task}</Text>

            {task?.img ? <Image source={{ uri: task.img }} style={styles.taskImage} /> : null}

            

            {/* <View style={styles.soundRow}>
                <Pressable style={styles.speakerButton} onPress={toggleSpeech}>
                    <Ionicons name={isSpeaking ? 'volume-mute' : 'volume-high'} size={22} color="#FFFFFF" />
                </Pressable>
            </View> */}

            <View style={styles.soundRow}>
                <Pressable
                    onPress={toggleSpeech}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                >

                <Image
                    source={require('../assets/Sound Button.png')}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                />
                </Pressable>
            </View>

            <Text style={styles.description}>{task?.description}</Text>

            <View style={styles.tipContainer}>
                <Image style={styles.infoIcon} source={require('../assets/Background_icon.png')} />
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
                <Text style={[styles.changeActivityBtnText, typography.h3]}>Change Activity</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 40,
        paddingBottom: 40,
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
        color: '#574239',
    },
    taskImage: {
        width: 318,
        height: 318,
        borderRadius: 35,
        // marginVertical: 16,
        marginTop:40,
    },
    description: {
        width: '100%',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'left',
        color: '#222222',
        marginBottom: 41,
    },
    soundRow: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginTop:41
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
        flex:1,
        flexDirection:'row',
        gap:24,
        backgroundColor: '#F0BA7A',
        width: 358,
        minHeight: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
        paddingHorizontal: 24,
        paddingVertical:24,
        marginBottom: 41,
    },
    infoIcon:{
        width:80,
        height:80
    },
    tipText: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000000',
        width:206,
        lineHeight:24,
        fontWeight:500
    },
    buttonSection: {
        width: '100%',
        // marginBottom: 12,
    },
    changeActivityBtn: {
        marginTop: 35,
        width: '100%',
        paddingVertical: 17,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#F0BA7A', // Sandy Brown
        backgroundColor: '#F9FBF7', // Soft Ivory
        alignItems: 'center',
        marginBottom: 12,
    },
    changeActivityBtnText: {
        color: '#3D332E',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#111111',
        marginBottom: 20,
    },
});

export default ActivityDescription;
