import { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Pressable,
    Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

import { apiRequest } from '../services/api.js';

const DUMMY_CHILD_ID = '6a28f66e68e34f4224b78383';

export default function ScanScreen({ navigation, route }) {
    const cameraRef = useRef(null);
    const focusScale = useRef(new Animated.Value(1)).current;

    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);

    const childId = route.params?.childId || DUMMY_CHILD_ID;
    const taskName = route.params?.taskName || route.params?.activityTitle;
    const categoryName = route.params?.categoryName || route.params?.category || 'Nature';
    console.log('route.params:', JSON.stringify(route.params));
    const activityTitle = route.params?.activityTitle || 'Scan Activity';

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
            ])
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

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.4,
            });
            setPhotoUri(photo.uri);

            const resizedPhoto = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 640 } }],
                {
                    compress: 0.5,
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true,
                }
            );

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

            //Calling /api/activity/verify (Amy)

            if (taskName && categoryName) {
                const verifyData = await apiRequest('/api/activity/verify', 'POST', {
                    imageBase64: resizedPhoto.base64,
                    taskName,
                    categoryName,
                    childId,
                });

                console.log('verifyData:', verifyData); 

                if (!verifyData.isMatch) {
                    navigation.navigate('TryAgain', {
                        childId,
                        categoryName,
                        taskName,
                    });
                    return;
                }
            }
            //end here

                const factsData = await apiRequest('/api/ai/facts', 'POST', {
                    objectName: scanData.objectName,
                });

            await apiRequest('/api/journal', 'POST', {
                childId,
                category: categoryName,
                activityTitle: activityTitle || taskName || '',
                objectName: scanData.objectName,
                facts: factsData.facts || [],
                correct: scanData.correct !== false,
            });

            await apiRequest('/api/gamification/task', 'POST', {
                childId,
                correct: scanData.correct !== false,
                wasRetry: false,
                categoryKey: categoryName.toLowerCase(),
            });

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
                activityTitle: activityTitle || taskName || '',
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
                <CameraView ref={cameraRef} style={styles.camera} facing="back" />

                <View pointerEvents="none" style={styles.focusOverlay}>
                    <Animated.View
                        style={[
                            styles.focusBox,
                            {
                                transform: [{ scale: focusScale }],
                            },
                        ]}
                    >
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />
                    </Animated.View>
                </View>
            </View>

            <View style={styles.controls}>
                <Pressable
                    style={[styles.scanButtonOuter, loading && styles.scanButtonDisabled]}
                    onPress={handleScan}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#4D4D4D" />
                    ) : (
                        <View style={styles.scanButtonInner} />
                    )}
                </Pressable>
            </View>

            <Modal visible={!!warning} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, warning?.severity === 'high' && styles.highWarning]}>
                        <Text style={styles.warningTitle}>
                            {warning?.severity === 'high' ? 'Safety Alert' : 'Try Something Else'}
                        </Text>

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
        backgroundColor: '#FFFFFF',
    },
    cameraFrame: {
        width: '86%',
        aspectRatio: 3 / 4,
        alignSelf: 'center',
        marginTop: 40,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#111111',
        backgroundColor: '#000000',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    focusOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusBox: {
        width: 220,
        height: 220,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 42,
        height: 42,
        borderColor: '#FFFFFF',
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 5,
        borderLeftWidth: 5,
        borderTopLeftRadius: 18,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderTopRightRadius: 18,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderBottomLeftRadius: 18,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderBottomRightRadius: 18,
    },
    controls: {
        alignItems: 'center',
        paddingTop: 24,
    },
    scanButtonOuter: {
        width: 78,
        height: 78,
        borderRadius: 39,
        borderWidth: 4,
        borderColor: '#4D4D4D',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonInner: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#4D4D4D',
    },
    scanButtonDisabled: {
        opacity: 0.7,
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
        backgroundColor: '#4D4D4D',
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