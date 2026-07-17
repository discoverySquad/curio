import { useEffect, useState } from 'react';
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
import { fonts } from '../constants/fonts.js';
import { apiRequest } from '../services/api.js';

const LOGO_URL = 'https://curio4985-bucket.s3.us-east-1.amazonaws.com/CurioLogo_Large_Green.png';
const LEAF_BACKGROUND_URL = 'https://curio4985-bucket.s3.us-east-1.amazonaws.com/Leaf_White_Vertical.jpg';

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false);
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkReturningUser = async () => {
            const value = await AsyncStorage.getItem('hasLoggedInBefore');
            setHasLoggedInBefore(value === 'true');
        };

        checkReturningUser();
    }, []);

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
            await AsyncStorage.setItem('hasLoggedInBefore', 'true');

            setUser(data.user, 'login');
        } catch (error) {
            setFormError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image source={{ uri: LEAF_BACKGROUND_URL }} style={styles.backgroundPattern} resizeMode="cover" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    

                    <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />

                    <View style={styles.card}>
                        {hasLoggedInBefore ? <Text style={styles.welcomeTitle}>Welcome back!</Text> : null}

                        <Text style={[styles.subtitle, !hasLoggedInBefore && styles.firstTimeSubtitle]}>Your child's next adventure is waiting</Text>

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="explorer@curio.com"
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

                        <Text style={styles.label}>Password</Text>
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
                                returnKeyType="done"
                            />

                            <Pressable style={styles.eyeButton} onPress={() => setShowPassword((current) => !current)} hitSlop={10}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#3D332E" />
                            </Pressable>
                        </View>

                        <Pressable style={styles.forgotButton}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </Pressable>

                        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                        <Pressable style={[styles.primaryButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
                            <Text style={styles.primaryButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Don't have an account?</Text>
                            <Text style={styles.linkStrong}>Create one</Text>
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
        backgroundColor: '#F9FBF7',
        position: 'relative',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 34,
        // backgroundColor: '#F9FBF7',
    },
    backgroundPattern: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 1,
    },
    logo: {
        width: 178,
        height: 82,
        alignSelf: 'center',
        marginBottom: 8,
    },
    card: {
        width: '100%',
        maxWidth: 390,
        minHeight: 500,
        alignSelf: 'center',
        backgroundColor: '#F4BE79',
        borderRadius: 28,
        paddingHorizontal: 28,
        paddingTop: 32,
        paddingBottom: 28,
    },
    welcomeTitle: {
        fontFamily: 'Quicksand_700Bold',
        fontSize: 22,
        lineHeight: 30,
        textAlign: 'center',
        color: '#3D332E',
        marginBottom: 26,
    },
    subtitle: {
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 30,
        color: '#3D332E',
    },
    firstTimeSubtitle: {
        marginTop: 8,
        marginBottom: 34,
    },
    label: {
        fontFamily: 'Quicksand_700Bold',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 8,
        color: '#3D332E',
    },
    input: {
        height: 54,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        borderRadius: 28,
        marginBottom: 22,
        fontFamily: 'Quicksand_400Regular',
        fontSize: 14,
        color: '#111111',
    },
    passwordWrap: {
        height: 54,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        marginBottom: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        height: '100%',
        fontFamily: 'Quicksand_400Regular',
        fontSize: 14,
        color: '#111111',
        paddingLeft: 20,
        paddingRight: 52,
        paddingVertical: 0,
    },
    eyeButton: {
        position: 'absolute',
        right: 18,
        top: 0,
        bottom: 0,
        width: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        fontFamily: 'Quicksand_700Bold',
        fontSize: 12,
        lineHeight: 16,
        color: '#111111',
    },
    errorText: {
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
        color: '#111111',
        textAlign: 'center',
    },
    primaryButton: {
        height: 58,
        borderRadius: 32,
        backgroundColor: '#2F6F2D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontFamily: 'Quicksand_700Bold',
        color: '#FFFFFF',
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.75)',
        marginVertical: 24,
    },
    linkText: {
        fontFamily: 'Quicksand_400Regular',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 18,
        color: '#111111',
    },
    linkStrong: {
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 18,
        color: '#111111',
        marginTop: 2,
        textDecorationLine: 'underline',
    },
});