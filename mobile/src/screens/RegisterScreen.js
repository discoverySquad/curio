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

export default function RegisterScreen({ navigation, setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    };

    const handleRegister = async () => {
        setFormError('');

        if (!name.trim()) {
            setFormError('Please enter your full name.');
            return;
        }

        if (!email.trim()) {
            setFormError('Please enter your email.');
            return;
        }

        if (!isValidEmail(email)) {
            setFormError('Please enter a valid email address.');
            return;
        }

        if (!password.trim()) {
            setFormError('Please create a password.');
            return;
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.');
            return;
        }

        try {
            const data = await apiRequest('/api/auth/register', 'POST', {
                fullName: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            if (data.token) {
                const secureStoreAvailable = await SecureStore.isAvailableAsync();

                if (secureStoreAvailable) {
                    await SecureStore.setItemAsync('token', data.token);
                    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
                }

                setUser(data.user);
            } else {
                setFormError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setFormError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Create Parent Account</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={(value) => {
                                setName(value);
                                setFormError('');
                            }}
                            returnKeyType="next"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setFormError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />

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
                            <CustomButton label="Register" onPress={handleRegister} />
                        </View>

                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Already have an account? Login</Text>
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
    container: {
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111111',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 14,
        marginBottom: 12,
        color: '#111111',
    },
    buttonSection: {
        marginTop: 4,
        marginBottom: 16,
    },
    linkText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#111111',
    },
});
