import { useRef, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiRequest } from '../services/api.js';

const DUMMY_CHILD_ID = '6a28f66e68e34f4224b78383';

export default function ScanScreen({ navigation, route }) {
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);

    const childId = route.params?.childId || DUMMY_CHILD_ID;

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Curio needs camera access to scan objects.</Text>
                <Button title="Allow Camera" onPress={requestPermission} />
            </View>
        );
    }

    const handleScan = async () => {
        try {
            setLoading(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.4,
            });

            const resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 640 } }], {
                compress: 0.5,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true,
            });

            const scanData = await apiRequest('/api/ai/scan', 'POST', {
                imageBase64: resizedPhoto.base64,
                childId,
            });

            if (scanData.safe === false) {
                setWarning(scanData);
                return;
            }

                const factsData = await apiRequest('/api/ai/facts', 'POST', {
                    objectName: scanData.objectName,
                });

                await apiRequest('/api/journal', 'POST', {
                    childId,
                    category: route.params?.category || 'Nature',
                    activityTitle: route.params?.activityTitle || 'Scan Activity',
                    objectName: scanData.objectName,
                    facts: factsData.facts || [],
                    correct: true,
                });

                await apiRequest('/api/gamification/task', 'POST', {
                    childId,
                    correct: true,
                    wasRetry: false,
                    categoryKey: route.params?.category || 'nature',
                });

        navigation.navigate('Feedback', {
            result: {
                ...scanData,
                facts: factsData.facts || [],
                message: factsData.message,
            },
            childId,
            categoryName: route.params?.categoryName,
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
                    <View style={styles.dimTop} />

                    <View style={styles.focusMiddle}>
                        <View style={styles.dimSide} />
                        <View style={styles.focusSquare} />
                        <View style={styles.dimSide} />
                    </View>

                    <View style={styles.dimBottom} />
                </View>
            </View>

            <View style={styles.controls}>{loading ? <ActivityIndicator size="large" /> : <Button title="Scan Object" onPress={handleScan} />}</View>

            <Modal visible={!!warning} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, warning?.severity === 'high' && styles.highWarning]}>
                        <Text style={styles.warningTitle}>{warning?.severity === 'high' ? 'Safety Alert' : 'Try Something Else'}</Text>
                        <Text style={styles.warningText}>{warning?.message}</Text>
                        <Button title="OK" onPress={() => setWarning(null)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cameraFrame: {
        width: '86%',
        aspectRatio: 3 / 4,
        alignSelf: 'center',
        marginTop: 40,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#111',
        backgroundColor: '#000',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    focusOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    dimTop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    focusMiddle: {
        flexDirection: 'row',
    },
    dimSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    dimBottom: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    focusSquare: {
        width: 220,
        height: 220,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 18,
        backgroundColor: 'transparent',
    },
    controls: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBox: {
        backgroundColor: 'white',
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
    },
    warningText: {
        fontSize: 16,
        marginBottom: 20,
    },
});
