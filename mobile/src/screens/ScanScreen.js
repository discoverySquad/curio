import { useRef, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { apiRequest } from '../services/api.js';

const DUMMY_CHILD_ID = '6a15ddc0752c37728664b230';

export default function ScanScreen({ navigation, route }) {
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null);

    const childId = route.params?.childId || DUMMY_CHILD_ID;

    if (!permission) {
        return <View />;
    }

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

            if (!cameraRef.current) {
                Alert.alert('Camera Error', 'Camera is not ready yet.');
                return;
            }

            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.4,
            });

            const data = await apiRequest('/api/ai/scan', 'POST', {
                imageBase64: photo.base64,
                childId,
            });

            if (data.safe === false) {
                setWarning(data);
                return;
            }

            navigation.navigate('Result', {
                result: data,
                childId,
            });
        } catch (error) {
            Alert.alert('Scan failed', error.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />

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
    container: { flex: 1 },
    camera: { flex: 1 },
    controls: { padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
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
