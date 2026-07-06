import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StatusBar, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import colors from '../constants/colors.js';
import { useSelectedChild } from '../context/SelectedChildContext';

import HomeScreen from '../screens/HomeScreen.js';
import JournalScreen from '../screens/Journal.js';
import ChangeAvatar from '../screens/ChangeAvatar.js';
import Test from '../screens/Test.js';
import ActivityDescription from '../screens/ActivityDescription.js';
import TryAgain from '../screens/TryAgain.js';
import Feedback from '../screens/Feedback.js';
import SelectCategory from '../screens/SelectCategory.js';
import ScreenTime from '../screens/parent-setting/ScreenTime.js';

import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';

import ParentDashboardScreen from '../screens/parent-setting/ParentDashboardScreen.js';
import CreateChildScreen from '../screens/parent-setting/CreateChildScreen.js';
import SelectChild from '../screens/parent-setting/SelectChild.js';
import EditParentAccount from '../screens/parent-setting/EditParentAccount.js';
import SettingParentScreen from '../screens/parent-setting/SettingParentScreen.js';
import EditChildScreen from '../screens/parent-setting/EditChildScreen.js';
import ChangePassword from '../screens/parent-setting/ChangePassword.js';

import ScanScreen from '../screens/ScanScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeIcon = require('../assets/home_icon.png');
const JournalIcon = require('../assets/journal_icon.png');

const getFindTitle = (route) => {
    const rawTitle = route?.params?.activityTitle || route?.params?.taskName || route?.params?.task || 'Object';
    const title = String(rawTitle).trim();

    if (title.toLowerCase().startsWith('find ')) {
        return title;
    }

    return `Find a ${title}`;
};

const GreenHeader = ({ navigation, route, options, back }) => {
    const title = options?.title ?? route.name;
    const showBackButton = back || options?.showBackButton;
    const screenBackgroundColor = options?.screenBackgroundColor || '#FFFFFF';

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }

        navigation.getParent()?.navigate('HomeTab');
    };

    return (
        <View style={{ backgroundColor: screenBackgroundColor }}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.primary }}>
                <View style={{ backgroundColor: screenBackgroundColor }}>
                    <View
                        style={{
                            height: 76,
                            backgroundColor: colors.primary,
                            borderBottomLeftRadius: 28,
                            borderBottomRightRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 62,
                            overflow: 'hidden',
                            elevation: 0,
                            shadowOpacity: 0,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        }}
                    >
                        {showBackButton ? (
                            <Pressable
                                onPress={handleBack}
                                hitSlop={16}
                                android_ripple={null}
                                style={{
                                    position: 'absolute',
                                    left: 10,
                                    width: 48,
                                    height: 48,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <Ionicons name="chevron-back" size={30} color={colors.surface} />
                            </Pressable>
                        ) : null}

                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.surface,
                                fontSize: 17,
                                fontWeight: '700',
                                textAlign: 'center',
                            }}
                        >
                            {title}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const greenHeaderOptions = {
    header: (props) => <GreenHeader {...props} />,
    headerShadowVisible: false,
    contentStyle: {
        backgroundColor: '#FFFFFF',
    },
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const hiddenRoutes = ['Scan', 'Parent'];
    const currentRoute = state.routes[state.index];

    if (hiddenRoutes.includes(currentRoute.name)) {
        return null;
    }

    const visibleRoutes = state.routes.filter((route) => !hiddenRoutes.includes(route.name));

    return (
        <View style={{ backgroundColor: '#FFFFFF' }}>
            <View
                style={{
                    height: 70,
                    backgroundColor: colors.primary,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 44,
                    overflow: 'hidden',
                    elevation: 0,
                    shadowOpacity: 0,
                    shadowColor: 'transparent',
                    borderTopWidth: 0,
                }}
            >
                {visibleRoutes.map((route) => {
                    const actualIndex = state.routes.findIndex((item) => item.key === route.key);
                    const isFocused = state.index === actualIndex;
                    const label = descriptors[route.key]?.options?.title || route.name;
                    const iconSource = route.name === 'HomeTab' ? HomeIcon : JournalIcon;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            android_ripple={null}
                            style={{
                                width: 78,
                                height: 56,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <Image
                                source={iconSource}
                                resizeMode="contain"
                                style={{
                                    width: 28,
                                    height: 28,
                                    tintColor: colors.surface,
                                }}
                            />

                            <Text
                                style={{
                                    color: colors.surface,
                                    fontSize: 12,
                                    fontWeight: '700',
                                    marginTop: 4,
                                }}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.primary }}>
                <View style={{ height: 0, backgroundColor: colors.primary }} />
            </SafeAreaView>
        </View>
    );
};

const AuthStack = ({ setUser }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="Login">{(props) => <LoginScreen {...props} setUser={setUser} />}</Stack.Screen>
            <Stack.Screen name="Register">{(props) => <RegisterScreen {...props} setUser={setUser} />}</Stack.Screen>
        </Stack.Navigator>
    );
};

const SetupStack = ({ user, setUser, initialRouteName = 'SelectChild' }) => {
    const parentId = user?.id || user?._id;

    return (
        <Stack.Navigator initialRouteName={initialRouteName} screenOptions={greenHeaderOptions}>
            <Stack.Screen name="SelectChild" options={{ title: 'Select Profile' }}>
                {(props) => (
                    <SelectChild
                        {...props}
                        route={{
                            ...props.route,
                            params: {
                                ...(props.route.params || {}),
                                parentId,
                            },
                        }}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="CreateChild" options={{ title: 'Create Child Profile' }}>
                {(props) => (
                    <CreateChildScreen
                        {...props}
                        setUser={setUser}
                        route={{
                            ...props.route,
                            params: {
                                ...(props.route.params || {}),
                                parentId,
                            },
                        }}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="ParentDashboard" options={{ title: 'Settings', showBackButton: true }}>
                {(props) => <ParentDashboardScreen {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="SettingParentScreen" options={{ title: 'Settings' }}>
                {(props) => <SettingParentScreen {...props} user={user} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const HomeStack = ({ onLogout }) => {
    return (
        <Stack.Navigator screenOptions={greenHeaderOptions}>
            <Stack.Screen name="Home" options={{ title: 'Explore the World!' }}>
                {(props) => <HomeScreen {...props} onLogout={onLogout} />}
            </Stack.Screen>

            <Stack.Screen name="Test" component={Test} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="TryAgain" component={TryAgain} options={{ title: 'Try Again' }} />
            <Stack.Screen name="Feedback" component={Feedback} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} options={{ title: 'Choose Activity' }} />
        </Stack.Navigator>
    );
};

const JournalStack = () => {
    return (
        <Stack.Navigator screenOptions={greenHeaderOptions}>
            <Stack.Screen name="JournalHome" component={JournalScreen} options={{ title: 'Journal' }} />
            <Stack.Screen name="AvatarChange" component={ChangeAvatar} options={{ title: '' }}/>
        </Stack.Navigator>
    );
};

const ScanStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                ...greenHeaderOptions,
                contentStyle: {
                    backgroundColor: '#FFFFFF',
                },
            }}
        >
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} options={{ title: 'Choose Activity' }} />

            <Stack.Screen
                name="ScanCamera"
                component={ScanScreen}
                options={({ route }) => ({
                    title: getFindTitle(route),
                    showBackButton: true,
                    screenBackgroundColor: '#000000',
                    contentStyle: {
                        backgroundColor: '#000000',
                    },
                })}
            />

            <Stack.Screen
                name="Feedback"
                component={Feedback}
                options={{
                    title: 'Explore the World!',
                    screenBackgroundColor: '#FFFFFF',
                    contentStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />

            <Stack.Screen
                name="TryAgain"
                component={TryAgain}
                options={{
                    title: 'Try Again',
                    screenBackgroundColor: '#FFFFFF',
                    contentStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            />
        </Stack.Navigator>
    );
};

const ParentStack = ({ user, onLogout }) => {
    return (
        <Stack.Navigator screenOptions={greenHeaderOptions}>
            <Stack.Screen name="ParentDashboard" options={{ title: 'Settings', showBackButton: true }}>
                {(props) => <ParentDashboardScreen {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="CreateChild" component={CreateChildScreen} options={{ title: 'Create Child Profile' }} />
            <Stack.Screen name="SelectChild" component={SelectChild} options={{ title: 'Select Child' }} />
            <Stack.Screen name="EditChild" component={EditChildScreen} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="ScreenTime" component={ScreenTime} options={{ title: 'Screen Time' }} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} options={{ title: 'Choose Activity' }} />
            <Stack.Screen name="EditParentAccount" options={{ title: 'Edit Account' }} >
                {(props) => <EditParentAccount {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="SettingParentScreen" options={{ title: 'Settings' }}>
                {(props) => <SettingParentScreen {...props} user={user} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen name="ChangePassword" options={{ title: 'Change Password' }} >
                {(props) => <ChangePassword {...props} user={user} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const MainTabs = ({ user, onLogout }) => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneContainerStyle: {
                    backgroundColor: '#FFFFFF',
                },
            }}
        >
            <Tab.Screen name="HomeTab" options={{ title: 'Home' }}>
                {(props) => <HomeStack {...props} onLogout={onLogout} />}
            </Tab.Screen>

            <Tab.Screen name="Scan" component={ScanStack} options={{ title: 'Scan' }} />

            <Tab.Screen name="Journal" component={JournalStack} options={{ title: 'Journal' }} />

            <Tab.Screen name="Parent" options={{ title: 'Parent' }}>
                {(props) => <ParentStack {...props} user={user} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const LoadingScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

const AppNavigator = () => {
    const [user, setUserState] = useState(null);
    const [setupStartRoute, setSetupStartRoute] = useState('SelectChild');
    const [loading, setLoading] = useState(true);
    const { selectedChild, setSelectedChild } = useSelectedChild();

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        await AsyncStorage.removeItem('selectedChild');

        setSelectedChild(null);
        setUserState(null);
    };

    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('user');
                await AsyncStorage.removeItem('selectedChild');

                setUserState(null);
                setSelectedChild(null);
            } catch (error) {
                console.log('Load user error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStoredUser();
    }, []);

    const setUser = async (nextUser, authType = 'login') => {
        setUserState(nextUser);
        setSelectedChild(null);
        await AsyncStorage.removeItem('selectedChild');

        if (authType === 'register') {
            setSetupStartRoute('CreateChild');
        } else {
            setSetupStartRoute('SelectChild');
        }
    };

    if (loading) {
        return (
            <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
                <LoadingScreen />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {!user ? (
                <AuthStack setUser={setUser} />
            ) : !selectedChild ? (
                <SetupStack user={user} setUser={setUserState} initialRouteName={setupStartRoute} />
            ) : (
                <MainTabs user={user} onLogout={logout} />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
