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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from '../services/api.js';

const LOGO_URL = 'https://curio4985-bucket.s3.us-east-1.amazonaws.com/CurioLogo_Large_Green.png';
const LEAF_BACKGROUND_URL = 'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Leaf_White_Vertical.jpg';

export default function RegisterScreen({ navigation, setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            await AsyncStorage.setItem('hasLoggedInBefore', 'true');

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
                    <Image source={{ uri: LEAF_BACKGROUND_URL }} style={styles.backgroundPattern} resizeMode="cover" />

                    <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />

                    <View style={styles.card}>
                        <Text style={styles.subtitle}>Create a parent account to manage your children's discovery journey.</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Heather"
                            placeholderTextColor="#3D332E"
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
                            placeholder="Heather@curio.com"
                            placeholderTextColor="#3D332E"
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
                        <View style={styles.passwordWrap}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="********"
                                placeholderTextColor="#3D332E"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    setFormError('');
                                }}
                                secureTextEntry={!showPassword}
                                returnKeyType="next"
                            />

                            <Pressable style={styles.eyeButton} onPress={() => setShowPassword((current) => !current)} hitSlop={10}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#3D332E" />
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            placeholderTextColor="#3D332E"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setFormError('');
                            }}
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                        />

                        <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms(!acceptedTerms)}>
                            <View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}>
                                {acceptedTerms ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                            </View>
                            <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy.</Text>
                        </Pressable>

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <Pressable style={[styles.primaryButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
                            <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.loginLinkButton} onPress={() => navigation.navigate('Login')}>
                        <View style={styles.loginInlineRow}>
                            <Text style={styles.loginLinkText}>Already have an account? </Text>
                            <Text style={styles.loginActionText}>Log in</Text>
                            <Ionicons name="log-in-outline" size={15} color="#3D332E" />
                        </View>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: '#F9FBF7',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 30,
        backgroundColor: '#F9FBF7',
    },
    backgroundPattern: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.28,
    },
    logo: {
        width: 178,
        height: 82,
        alignSelf: 'center',
        marginBottom: 6,
    },
    card: {
        width: '100%',
        maxWidth: 390,
        minHeight: 620,
        alignSelf: 'center',
        backgroundColor: '#F4BE79',
        borderRadius: 28,
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 24,
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 20,
        color: '#3D332E',
        lineHeight: 18,
        fontWeight: '500',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
        color: '#3D332E',
    },
    input: {
        height: 50,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 18,
        borderRadius: 26,
        marginBottom: 18,
        fontSize: 14,
        color: '#111111',
    },
    passwordWrap: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 26,
        marginBottom: 18,
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        height: '100%',
        fontSize: 14,
        color: '#111111',
        paddingLeft: 18,
        paddingRight: 52,
        paddingVertical: 0,
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        width: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 4,
        marginBottom: 22,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#3D332E',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#316828',
        borderColor: '#316828',
    },
    termsText: {
        flex: 1,
        fontSize: 11,
        color: '#111111',
        lineHeight: 15,
    },
    errorText: {
        fontSize: 13,
        marginBottom: 12,
        color: '#111111',
        textAlign: 'center',
        fontWeight: '600',
    },
    primaryButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: '#316828',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },
    loginLinkButton: {
        marginTop: 18,
        alignItems: 'center',
    },
    loginInlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginLinkText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#3D332E',
    },
    loginActionText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#3D332E',
        textDecorationLine: 'underline',
        marginRight: 4,
    },
});
