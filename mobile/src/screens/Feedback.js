import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';

import CustomButton from '../components/CustomButton.js';

const TEST_CHILD_ID = '6a15ddc0752c37728664b230';

const Feedback = ({ navigation, route }) => {
    const result = route.params?.result;
    const childId = route.params?.childId || TEST_CHILD_ID;
    const facts = result?.facts || [];

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Mission Complete!</Text>

            <View style={styles.imgContainer}>
                <Text style={styles.imageText}>Captured image comes here</Text>
            </View>

            <Text style={styles.message}>Nice exploring! Keep looking around. The world is full of surprises.</Text>

            <View style={styles.resultContainer}>
                <Text style={styles.label}>You scanned:</Text>
                <Text style={styles.objectName}>{result?.objectName || 'Unknown object'}</Text>

                <Text style={styles.factTitle}>3 Fun Facts</Text>

                {facts.length > 0 ? (
                    facts.slice(0, 3).map((fact, index) => (
                        <Text key={`${fact}-${index}`} style={styles.fact}>
                            {index + 1}. {fact}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.fact}>Fun facts will show here after facts are connected.</Text>
                )}
            </View>

            <View style={styles.buttonSection}>
                <CustomButton
                    label="Try Again"
                    onPress={() =>
                        navigation.navigate('ScanCamera', {
                            childId,
                        })
                    }
                />
            </View>

            <Pressable
                style={styles.changeCategoryBtn}
                onPress={() =>
                    navigation.navigate('Home', {
                        screen: 'SelectCategory',
                    })
                }
            >
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
        backgroundColor: '#fff',
    },
    h1: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
    },
    imgContainer: {
        height: 190,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a6a5a5',
        borderRadius: 16,
        marginBottom: 18,
    },
    imageText: {
        fontSize: 14,
        color: '#222',
    },
    message: {
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 18,
    },
    resultContainer: {
        width: '100%',
        backgroundColor: '#e8e8e8',
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    objectName: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 4,
        marginBottom: 16,
    },
    factTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    fact: {
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 21,
    },
    buttonSection: {
        width: 318,
    },
    changeCategoryBtn: {
        marginTop: 12,
    },
    changeCategoryBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Feedback;
