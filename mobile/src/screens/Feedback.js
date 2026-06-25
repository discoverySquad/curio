import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

import { useSelectedChild } from '../context/SelectedChildContext';
import { apiRequest } from '../services/api.js';
import CustomButton from '../components/CustomButton.js';
import { typography } from '../constants/fonts';

// const TEST_CHILD_ID = '6a28f66e68e34f4224b78383';

const Feedback = ({ navigation, route }) => {
    const result = route.params?.result || {};
    // const childId = route.params?.childId || TEST_CHILD_ID;
    const { selectedChild } = useSelectedChild();
    const childId = selectedChild?._id;
    const categoryName = route.params?.categoryName || route.params?.category || 'Nature';

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const objectName = result?.objectName || 'Unknown object';
    const facts = Array.isArray(result?.facts) ? result.facts.slice(0, 3) : [];
    const imageUri = route.params?.imageUri || result?.imageUri || result?.photoUri;

    useEffect(() => {
        if (facts.length > 0 && childId) {
        apiRequest('/api/gamification/fact', 'POST', { childId, count: facts.length }).catch((e) => console.log('viewFact failed:', e.message || e));
        }
        return () => {
            Speech.stop();
            setIsSpeaking(false);
        };
    }, []);

    const getSpeechMessage = () => {
        const factsText = facts.length > 0 ? facts.join(' ') : 'Keep exploring to learn more fun facts.';
        return `Mission complete! You scanned ${objectName}. ${factsText}`;
    };

    const toggleSpeech = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        Speech.stop();
        setIsSpeaking(true);

        Speech.speak(getSpeechMessage(), {
            language: 'en-US',
            rate: 0.85,
            pitch: 1.05,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    const goToNextActivity = () => {
        Speech.stop();
        setIsSpeaking(false);

        navigation.navigate('HomeTab', {
            screen: 'ActivityDescription',
            params: {
                childId,
                categoryName,
            },
        });
    };

    const goToChangeCategory = () => {
        Speech.stop();
        setIsSpeaking(false);

        navigation.navigate('HomeTab', {
            screen: 'SelectCategory',
            params: {
                childId,
            },
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={[styles.h2, typography.h2]}>Mission Complete!</Text>

            <View style={styles.imgContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.scannedImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imageText}>Scanned object</Text>
                    </View>
                )}
            </View>

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
                    source={
                        isSpeaking
                        ? require('../assets/State=Pressed.png')
                        : require('../assets/State=Default.png')
                    }
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                />
                </Pressable>
            </View>

            <Text style={[styles.message, typography.body]}>Nice exploring! Keep looking around - The world is full of surprises.</Text>

            <View style={styles.resultContainer}>
                {/* <Text style={styles.label}>You scanned:</Text> */}
                <Text style={styles.objectName}>{objectName}</Text>

                {/* <Text style={styles.factTitle}>3 Fun Facts</Text> */}

                {facts.length > 0 ? (
                    facts.map((fact, index) => (
                        <Text key={`${fact}-${index}`} style={styles.fact}>
                            {index + 1}. {fact}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.fact}>Fun facts will show here after the scan is complete.</Text>
                )}
            </View>

            <View style={styles.buttonSection}>
                <CustomButton
                    label="Next Activity"
                    onPress={goToNextActivity}
                />
            </View>

            {/* <Pressable style={styles.changeCategoryBtn} onPress={SelectCategory}>
                <Text style={styles.changeCategoryBtnText}>Change Category</Text>
            </Pressable> */}

            <Pressable
                style={styles.changeActivityBtn}
                onPress={goToChangeCategory}
            >
                <Text style={[styles.changeActivityBtnText,typography.body]}>Change Activity</Text>
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
    },
    h2: {
        width: '100%',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 40,
        color: '#111111',
    },
    imgContainer: {
        height: 318,
        width: 318,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 41,
        backgroundColor: '#A6A5A5',
    },
    scannedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageText: {
        fontSize: 14,
        color: '#222222',
        fontWeight: '600',
    },
    soundRow: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    speakerButton: {
        width: 42,
        height: 42,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4D4D4D',
    },
    message: {
        // width: '100%',
        textAlign: 'left',
        // fontSize: 15,
        lineHeight: 24,
        marginBottom: 41,
        color: '#3D332E',
    },
    resultContainer: {
        width: '100%',
        backgroundColor: '#F0BA7A',
        borderRadius: 16,
        padding: 18,
        marginBottom: 41,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    objectName: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 4,
        marginBottom: 16,
        color: '#111111',
    },
    factTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: '#111111',
    },
    fact: {
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 21,
        color: '#222222',
    },
    buttonSection: {
        width: '100%',
        marginBottom: 10,
    },
    changeActivityBtn: {
        marginVertical: 18,
    },
    changeActivityBtnText: {
        // fontSize: 16,
        // fontWeight: '600',
        color: '#3D332E',
        // marginVertical: 18
    },
});

export default Feedback;
