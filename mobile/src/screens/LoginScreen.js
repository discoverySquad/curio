import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../services/api.js';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const data = await apiRequest('/api/auth/login', 'POST', {
            email,
            password,
        });

        if (data.token) {
            const secureStoreAvailable = await SecureStore.isAvailableAsync();

            if (secureStoreAvailable) {
                await SecureStore.setItemAsync('token', data.token);
                await SecureStore.setItemAsync('user', JSON.stringify(data.user));
            }

            navigation.replace('ParentDashboard', { user: data.user });
        } else {
            Alert.alert('Error', data.message || 'Login failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Curio</Text>
            <Text style={styles.subtitle}>Parent Login</Text>

            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />

            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <Button title="Login" onPress={handleLogin} />

            <Button title="Create Parent Account" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 38, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 18, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
});
