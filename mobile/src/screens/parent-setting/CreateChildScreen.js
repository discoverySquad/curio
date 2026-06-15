import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiRequest } from '../../services/api.js';

export default function CreateChildScreen({ navigation, route }) {
    const parentId = route.params?.parentId || route.params?.user?.id;

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [avatar, setAvatar] = useState('');
    const [readingLevel, setReadingLevel] = useState('beginner');
    const [timeLimit, setTimeLimit] = useState('60');
    const [saving, setSaving] = useState(false);

    const handleCreateChild = async () => {
        if (!parentId) {
            Alert.alert('Missing parent', 'Parent ID is missing. Please log in again.');
            return;
        }

        if (!name.trim()) {
            Alert.alert('Missing name', 'Please enter a child name.');
            return;
        }

        if (!age || Number(age) <= 0) {
            Alert.alert('Missing age', 'Please enter a valid age.');
            return;
        }

        try {
            setSaving(true);

            const child = await apiRequest('/api/child', 'POST', {
                parentId,
                name: name.trim(),
                age: Number(age),
                avatar: avatar.trim(),
                readingLevel: readingLevel.trim() || 'beginner',
                timeLimit: Number(timeLimit) || 60,
            });

            navigation.navigate('SelectChild', {
                parentId,
                child,
            });
        } catch (error) {
            Alert.alert('Error', error.message || 'Could not create child profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Child Profile</Text>

            <TextInput style={styles.input} placeholder="Child name" value={name} onChangeText={setName} />

            <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />

            <TextInput style={styles.input} placeholder="Avatar URL or emoji" value={avatar} onChangeText={setAvatar} />

            <TextInput style={styles.input} placeholder="Reading level" value={readingLevel} onChangeText={setReadingLevel} />

            <TextInput
                style={styles.input}
                placeholder="Daily time limit in minutes"
                value={timeLimit}
                onChangeText={setTimeLimit}
                keyboardType="number-pad"
            />

            <Button title={saving ? 'Saving...' : 'Create Profile'} onPress={handleCreateChild} disabled={saving} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});
