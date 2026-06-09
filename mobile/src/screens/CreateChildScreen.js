import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiRequest } from '../services/api.js';

export default function CreateChildScreen({ navigation }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [saving, setSaving] = useState(false);

    const handleCreateChild = async () => {
        if (!name.trim()) {
            Alert.alert('Missing name', 'Please enter a child name.');
            return;
        }

        try {
            setSaving(true);
            const data = await apiRequest('/api/child', 'POST', {
                name: name.trim(),
                age: Number(age) || undefined,
                timeLimit: Number(timeLimit) || undefined,
            });

            if (data?.message && !data?._id) {
                Alert.alert('Error', data.message);
                return;
            }

            navigation.navigate('SelectChild');
        } catch (error) {
            Alert.alert('Error', 'Could not create child profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Child Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="Child name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Daily time limit in minutes"
                value={timeLimit}
                onChangeText={setTimeLimit}
                keyboardType="number-pad"
            />

            <Button
                title={saving ? 'Saving...' : 'Create Profile'}
                onPress={handleCreateChild}
                disabled={saving}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
});
