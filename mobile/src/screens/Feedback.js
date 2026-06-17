import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton.js';

const TEST_CHILD_ID = '6a28f66e68e34f4224b78383';

const Feedback = ({ navigation, route }) => {
    const result = route.params?.result || {};
    const childId = route.params?.childId || TEST_CHILD_ID;
    const categoryName = route.params?.categoryName || route.params?.category || 'Nature';

    const [isSpeaking, setIsSpeaking] = useState(false);

    const objectName = result?.objectName || 'Unknown object';
    const facts = Array.isArray(result?.facts) ? result.facts.slice(0, 3) : [];
    const imageUri = route.params?.imageUri || result?.imageUri || result?.photoUri;

    useEffect(() => {
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

        navigation.navigate('Home', {
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

        navigation.navigate('Home', {
            screen: 'SelectCategory',
            params: {
                childId,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Mission Complete!</Text>

            <View style={styles.imgContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.scannedImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imageText}>Scanned object</Text>
                    </View>
                )}
            </View>

            <View style={styles.soundRow}>
                <Pressable style={styles.speakerButton} onPress={toggleSpeech}>
                    <Ionicons name={isSpeaking ? 'volume-mute' : 'volume-high'} size={22} color="#FFFFFF" />
                </Pressable>
            </View>

            <Text style={styles.message}>Nice exploring! Keep looking around. The world is full of surprises.</Text>

            <View style={styles.resultContainer}>
                <Text style={styles.label}>You scanned:</Text>
                <Text style={styles.objectName}>{objectName}</Text>

                <Text style={styles.factTitle}>3 Fun Facts</Text>

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
                <CustomButton label="Next Activity" onPress={goToNextActivity} />
            </View>

            <Pressable style={styles.changeCategoryBtn} onPress={goToChangeCategory}>
                <Text style={styles.changeCategoryBtnText}>Change Category</Text>
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
    h1: {
        width: '100%',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#111111',
    },
    imgContainer: {
        height: 190,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 14,
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
        marginBottom: 12,
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
        width: '100%',
        textAlign: 'left',
        fontSize: 15,
        lineHeight: 21,
        marginBottom: 18,
        color: '#222222',
    },
    resultContainer: {
        width: '100%',
        backgroundColor: '#E8E8E8',
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
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
    changeCategoryBtn: {
        marginTop: 4,
    },
    changeCategoryBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
    },
});

export default Feedback;
