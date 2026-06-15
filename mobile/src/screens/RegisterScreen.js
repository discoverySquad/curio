import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiRequest } from '../services/api.js';

export default function RegisterScreen({ navigation, setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const data = await apiRequest('/api/auth/register', 'POST', {
            fullName: name,
            email,
            password,
        });

        if (data.token) {
            Alert.alert('Success', 'Account created successfully');
            setUser(data.user);
        } else {
            Alert.alert('Error', data.message || 'Registration failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Parent Account</Text>

            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />

            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />

            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <Button title="Register" onPress={handleRegister} />

            <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
});
