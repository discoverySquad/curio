import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { apiRequest } from '../services/api.js';
import CustomButton from '../components/CustomButton.js';

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const handleLogin = async () => {
        setFormError('');

        if (!email.trim()) {
            setFormError('Please enter your email.');
            return;
        }

        if (!isValidEmail(email)) {
            setFormError('Please enter a valid email address.');
            return;
        }

        if (!password.trim()) {
            setFormError('Please enter your password.');
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest('/api/auth/login', 'POST', {
                email: email.trim().toLowerCase(),
                password,
            });

            if (!data.token || !data.user) {
                setFormError(data.message || 'Login failed. Please try again.');
                return;
            }

            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(data.user));

            setUser(data.user, 'login');
        } catch (error) {
            setFormError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={styles.logo}>Curio</Text>
                        <Text style={styles.title}>Welcome back!</Text>
                        <Text style={styles.subtitle}>Your child's next adventure is waiting.</Text>

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="explorer@curio.com"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setFormError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setFormError('');
                            }}
                            secureTextEntry
                            returnKeyType="done"
                        />

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <View style={styles.buttonSection}>
                            <CustomButton label={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} />
                        </View>

                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Don't have an account? Create one</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
    },
    logo: {
        fontSize: 42,
        fontWeight: '800',
        textAlign: 'center',
        color: '#2F6F2F',
        marginBottom: 28,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: '#111111',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 28,
        color: '#2F6F2F',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111111',
    },
    input: {
        backgroundColor: '#D8CEC9',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 24,
        marginBottom: 18,
        fontSize: 15,
        color: '#111111',
    },
    errorText: {
        fontSize: 14,
        marginBottom: 14,
        color: '#111111',
    },
    buttonSection: {
        marginTop: 4,
        marginBottom: 24,
    },
    linkText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#111111',
    },
});
