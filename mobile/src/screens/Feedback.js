import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { useAudioPlayer } from 'expo-audio';

import { useSelectedChild } from '../context/SelectedChildContext';
import { apiRequest } from '../services/api.js';
import CustomButton from '../components/CustomButton.js';
import { typography } from '../constants/fonts.js';

const Feedback = ({ navigation, route }) => {
    const result = route.params?.result || {};
    const { selectedChild } = useSelectedChild();
    const childId = selectedChild?._id;
    const categoryName = route.params?.categoryName || route.params?.category || 'Nature';

    const [isSpeaking, setIsSpeaking] = useState(false);
    const successSound = useAudioPlayer(require('../assets/sounds/success.mp3'));

    const objectName = result?.objectName || 'what you found';
    const facts = Array.isArray(result?.facts) ? result.facts.slice(0, 3) : [];
    const imageUri = route.params?.imageUri || result?.imageUri || result?.photoUri;

    useEffect(() => {
        successSound.seekTo(0);
        successSound.play();

        if (facts.length > 0 && childId) {
            apiRequest('/api/gamification/fact', 'POST', { childId, count: facts.length }).catch((error) =>
                console.log('viewFact failed:', error.message || error),
            );
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, typography.h2]}>Mission Complete!</Text>

            <View style={styles.imageCard}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.scannedImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imageText}>Scanned object</Text>
                    </View>
                )}
            </View>

            <Pressable style={styles.soundButton} onPress={toggleSpeech}>
                <Image source={require('../assets/Sound Button.png')} style={styles.soundIcon} resizeMode="contain" />
            </Pressable>

            <Text style={styles.message}>Nice Exploring! You scanned {objectName}. Keep looking around--the world is full of surprises.</Text>

            <Text style={[styles.objectName, typography.h2]}>{objectName}</Text>

            <View style={styles.factsSection}>
                {facts.length > 0 ? (
                    facts.map((fact, index) => (
                        <View key={`${fact}-${index}`} style={styles.factCard}>
                            <Text style={styles.factText}>{fact}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.factCard}>
                        <Text style={styles.factText}>Fun facts will show here after the scan is complete.</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonSection}>
                <CustomButton label="Next Activity" onPress={goToNextActivity} />
            </View>

            <Pressable style={styles.changeActivityBtn} onPress={goToChangeCategory}>
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
        paddingHorizontal: 28,
        paddingTop: 34,
        paddingBottom: 38,
    },
    title: {
        width: '100%',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 40,
        color: '#574239',
        alignSelf: 'stretch',
        lineHeight:36
    },
    imageCard: {
        width: '100%',
        maxWidth: 318,
        aspectRatio: 1,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: '#D6CEC9',
        marginBottom: 26,
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
        color: '#3D332E',
        fontWeight: '700',
    },
    soundButton: {
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    soundIcon: {
        width: 44,
        height: 44,
    },
    objectName: {
        color: '#3D332E',
        marginVertical: 41,
        textAlign:"center"
    },
    message: {
        width: '100%',
        maxWidth: 318,
        fontSize: 14,
        lineHeight: 20,
        color: '#3D332E',
        // marginBottom: 28,
    },
    factsSection: {
        width: '100%',
        maxWidth: 358,
        gap: 18,
        marginBottom: 28,
    },
    factCard: {
        width: '100%',
        minHeight: 96,
        backgroundColor: '#F4BE79',
        borderRadius: 24,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
        marginBottom: 24,
    },
    factText: {
        fontSize: 15,
        lineHeight: 23,
        color: '#3D332E',
        fontWeight: '600',
    },
    buttonSection: {
        width: '100%',
        maxWidth: 318,
        // marginBottom: 12,
    },
    changeActivityBtn: {
        marginTop: 35,
        width: '100%',
        height: 67,
        paddingVertical: 17,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#F0BA7A',
        backgroundColor: '#F9FBF7',
        alignItems: 'center',
        marginBottom: 48,
    },
    changeActivityBtnText: {
        color: '#3D332E',
    },
});

export default Feedback;
