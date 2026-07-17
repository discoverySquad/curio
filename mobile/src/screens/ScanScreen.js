import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Modal, StyleSheet, ActivityIndicator, Alert, Pressable, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from '../services/api.js';
import { useSelectedChild } from '../context/SelectedChildContext';

export default function ScanScreen({ navigation, route }) {
    const cameraRef = useRef(null);
    const focusScale = useRef(new Animated.Value(1)).current;

    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    useFocusEffect(
        useCallback(() => {
            return () => {
                setTorchOn(false);
            };
        }, []),
    );

    const { selectedChild, setSelectedChild } = useSelectedChild();
    const childId = selectedChild?._id;

    const taskName = route.params?.taskName || route.params?.activityTitle;
    const categoryName = route.params?.categoryName || route.params?.category || 'Nature';
    const activityTitle = route.params?.activityTitle || taskName || 'Scan Activity';

    useEffect(() => {
        if (!loading) {
            focusScale.stopAnimation();
            focusScale.setValue(1);
            return;
        }

        const bounceAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(focusScale, {
                    toValue: 1.08,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(focusScale, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
        );

        bounceAnimation.start();

        return () => {
            bounceAnimation.stop();
        };
    }, [loading, focusScale]);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>Curio needs camera access to scan objects.</Text>

                <Pressable style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Allow Camera</Text>
                </Pressable>
            </View>
        );
    }

    const handleScan = async () => {
        try {
            setLoading(true);

            if (!childId) {
                Alert.alert('Select child', 'Please select a child before scanning.');
                return;
            }

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.4,
            });

            setTorchOn(false);
            
            const resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 640 } }], {
                compress: 0.5,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true,
            });

            const scanData = await apiRequest('/api/ai/scan', 'POST', {
                imageBase64: resizedPhoto.base64,
                childId,
                categoryName,
                activityId: route.params?.activityId,
            });

            if (scanData.safe === false) {
                setWarning(scanData);
                return;
            }

            if (taskName && categoryName) {
                const verifyData = await apiRequest('/api/activity/verify', 'POST', {
                    imageBase64: resizedPhoto.base64,
                    taskName,
                    categoryName,
                    childId,
                });

                if (!verifyData.isMatch) {
                    setTorchOn(false);
                    navigation.navigate('TryAgain', {
                        childId,
                        categoryName,
                        taskName,
                    });
                    return;
                }
            }

            const factsData = await apiRequest('/api/ai/facts', 'POST', {
                objectName: scanData.objectName,
                childId,
            });

            await apiRequest('/api/journal', 'POST', {
                childId,
                category: categoryName,
                activityTitle,
                objectName: scanData.objectName,
                facts: factsData.facts || [],
                correct: scanData.correct !== false,
            });

            try {
                await apiRequest('/api/gamification/scan', 'POST', {
                    childId,
                });
            } catch (error) {
                console.log('completeScan failed:', error.message || error);
            }

            const gamificationResp = await apiRequest('/api/gamification/task', 'POST', {
                childId,
                correct: scanData.correct !== false,
                wasRetry: false,
                categoryKey: categoryName.toLowerCase(),
            });

            try {
                if (gamificationResp?.child) {
                    const updatedChild = gamificationResp.child;

                    if (setSelectedChild) {
                        setSelectedChild(updatedChild);
                    }

                    await AsyncStorage.setItem('selectedChild', JSON.stringify(updatedChild));
                }
            } catch (error) {
                console.log('Failed to update selectedChild from gamification response', error);
            }

            setTorchOn(false);
            
            navigation.navigate('Feedback', {
                result: {
                    ...scanData,
                    facts: factsData.facts || [],
                    message: factsData.message,
                    imageUri: resizedPhoto.uri,
                },
                imageUri: resizedPhoto.uri,
                childId,
                categoryName,
                activityTitle,
            });
        } catch (error) {
            Alert.alert('Scan failed', error.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cameraFrame}>
                <CameraView ref={cameraRef} style={styles.camera} facing="back" enableTorch={torchOn} autofocus="on" animateShutter />

                <Pressable style={styles.flashButton} onPress={() => setTorchOn((current) => !current)}>
                    <Ionicons name={torchOn ? 'flash' : 'flash-outline'} size={20} color="#FFFFFF" />
                </Pressable>

                <Pressable
                    style={styles.helpButton}
                    onPress={() => Alert.alert('Scan Tip', 'Place the object inside the white corners, then tap the circle button.')}
                >
                    <Ionicons name="help" size={22} color="#FFFFFF" />
                </Pressable>

                <View pointerEvents="none" style={styles.focusOverlay}>
                    <Animated.View style={[styles.focusBox, { transform: [{ scale: focusScale }] }]}>
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />
                    </Animated.View>
                </View>

                <View style={styles.bottomControls}>
                    <Pressable style={[styles.scanButtonOuter, loading && styles.scanButtonDisabled]} onPress={handleScan} disabled={loading}>
                        {loading ? <ActivityIndicator size="large" color="#7A6A62" /> : <View style={styles.scanButtonInner} />}
                    </Pressable>
                </View>
            </View>

            <Modal visible={!!warning} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, warning?.severity === 'high' && styles.highWarning]}>
                        <Text style={styles.warningTitle}>{warning?.severity === 'high' ? 'Safety Alert' : 'Try Something Else'}</Text>
                        <Text style={styles.warningText}>{warning?.message}</Text>

                        <Pressable style={styles.modalButton} onPress={() => setWarning(null)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    cameraFrame: {
        flex: 1,
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'relative',
        marginTop: -28,
    },
    camera: {
        flex: 1,
    },
    flashButton: {
        position: 'absolute',
        top: 62,
        left: 22,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(61, 51, 46, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4,
    },
    helpButton: {
        position: 'absolute',
        top: 62,
        right: 22,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(61, 51, 46, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4,
    },
    focusOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusBox: {
        width: 230,
        height: 230,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 62,
        height: 62,
        borderColor: '#FFFFFF',
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 5,
        borderLeftWidth: 5,
        borderTopLeftRadius: 22,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderTopRightRadius: 22,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderBottomLeftRadius: 22,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderBottomRightRadius: 22,
    },
    bottomControls: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 52,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    scanButtonOuter: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.75)',
        backgroundColor: 'rgba(61, 51, 46, 0.28)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#7A6A62',
    },
    scanButtonDisabled: {
        opacity: 0.85,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
        color: '#111111',
    },
    permissionButton: {
        backgroundColor: '#2F6F2F',
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 24,
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBox: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'orange',
    },
    highWarning: {
        borderColor: 'red',
    },
    warningTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#111111',
    },
    warningText: {
        fontSize: 16,
        marginBottom: 20,
        color: '#222222',
    },
    modalButton: {
        backgroundColor: '#111111',
        borderRadius: 24,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
