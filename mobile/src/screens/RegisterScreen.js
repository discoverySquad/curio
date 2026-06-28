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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const handleRegister = async () => {
        setFormError('');

        if (!name.trim()) {
            setFormError('Please enter your name.');
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

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        if (!acceptedTerms) {
            setFormError('Please agree to the terms before creating an account.');
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest('/api/auth/register', 'POST', {
                fullName: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            if (!data.token || !data.user) {
                setFormError(data.message || 'Registration failed. Please try again.');
                return;
            }

            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('user', JSON.stringify(data.user));

            setUser(data.user, 'register');
        } catch (error) {
            setFormError(error.message || 'Registration failed. Please try again.');
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

                        <Text style={styles.subtitle}>Create a parent account to manage your children's discovery journey.</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Heather"
                            value={name}
                            onChangeText={(value) => {
                                setName(value);
                                setFormError('');
                            }}
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="heather@curio.com"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setFormError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Create Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setFormError('');
                            }}
                            secureTextEntry
                            returnKeyType="next"
                        />

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setFormError('');
                            }}
                            secureTextEntry
                            returnKeyType="done"
                        />

                        <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms(!acceptedTerms)}>
                            <View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]} />
                            <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy.</Text>
                        </Pressable>

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <View style={styles.buttonSection}>
                            <CustomButton label={loading ? 'Creating...' : 'Create Account'} onPress={handleRegister} />
                        </View>

                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Already have an account? Log in</Text>
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
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 28,
        color: '#111111',
        lineHeight: 20,
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
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#111111',
        borderRadius: 4,
    },
    checkboxSelected: {
        backgroundColor: '#2F6F2F',
    },
    termsText: {
        flex: 1,
        fontSize: 12,
        color: '#111111',
        lineHeight: 17,
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
