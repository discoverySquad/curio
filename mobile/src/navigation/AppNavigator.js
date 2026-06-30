import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import colors from '../constants/colors.js';
import { useSelectedChild } from '../context/SelectedChildContext';

import HomeScreen from '../screens/HomeScreen.js';
import JournalScreen from '../screens/Journal.js';
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

import ScanScreen from '../screens/ScanScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeIcon = require('../assets/home_icon.png');
const JournalIcon = require('../assets/journal_icon.png');



const AuthStack = ({ setUser }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">{(props) => <LoginScreen {...props} setUser={setUser} />}</Stack.Screen>

            <Stack.Screen name="Register">{(props) => <RegisterScreen {...props} setUser={setUser} />}</Stack.Screen>
        </Stack.Navigator>
    );
};

const SetupStack = ({ user, setUser, initialRouteName = 'SelectChild' }) => {
    const parentId = user?.id || user?._id;

    return (
        <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen name="SelectChild" options={{ title: 'Select Child' }}>
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
            <Stack.Screen name='ParentDashboard' options={{ title: "Parent Dashborad"}}>
                {(props) => <ParentDashboardScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
                name="SettingParentScreen"
                component={SettingParentScreen}
                options={{ title: 'Settings' }}
            />
        </Stack.Navigator>
    );
};

const HomeStack = ({ onLogout }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home"  options={{}}>
                {(props) => <HomeScreen {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} />
            <Stack.Screen name="TryAgain" component={TryAgain} />
            <Stack.Screen name="Feedback" component={Feedback} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
        </Stack.Navigator>
    );
};

const ScanStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: colors.surface,
                headerButtonStyle: { backgroundColor: 'transparent' },
                headerBackground: () => (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.primary,
                            borderBottomLeftRadius: 32,
                            borderBottomRightRadius: 32,
                            height: 60,
                        }}
                    />
                ),
            }}
        >
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="ScanCamera" component={ScanScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Feedback" component={Feedback} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="TryAgain" component={TryAgain} options={{ title: 'Try Again' }} />
        </Stack.Navigator>
    );
};

const ParentStack = ({user, onLogout }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackButtonDisplayMode: 'minimal',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.surface,
                headerButtonStyle: { backgroundColor: 'transparent' },
            }}
        >
            
            <Stack.Screen name="ParentDashboard" options={{ title: 'Parent Dashboard' }}>
                {(props) => <ParentDashboardScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="CreateChild" component={CreateChildScreen} options={{ title: 'Create Child Profile' }} />
            <Stack.Screen name="SelectChild" component={SelectChild} options={{ title: 'Select Child' }} />
            <Stack.Screen name="EditChild" component={EditChildScreen} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="ScreenTime" component={ScreenTime} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="EditParentAccount" component={EditParentAccount} />
            <Stack.Screen name="SettingParentScreen" options={{ title: 'Settings' }} >
                {(props) => <SettingParentScreen {...props} user={user} onLogout={onLogout} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const MainTabs = ({user, onLogout}) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.surface,
                tabBarInactiveTintColor: colors.surface,
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderTopWidth: 0,
                    height: 100,
                    paddingTop: 8,
                    justifyContent: 'center',
                    paddingLeft: 70,
                },
                tabBarItemStyle: {
                    flex: 0,
                    width: 60,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                options={{
                    tabBarIcon: ({ color }) => <Image source={HomeIcon} style={{ width: 22, height: 22, tintColor: color }} resizeMode="contain" />,
                }}
            >
                {(props) => <HomeStack {...props} onLogout={onLogout} />}
            </Tab.Screen>

            <Tab.Screen name="Scan" component={ScanStack} options={{ tabBarButton: () => null }} />

            <Tab.Screen
                name="Journal"
                component={JournalScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={JournalIcon} style={{ width: 22, height: 22, tintColor: color }} resizeMode="contain" />
                    ),
                }}
            />

            <Tab.Screen name="Parent" options={{ tabBarButton: () => null }}>
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

    return (
        <NavigationContainer>
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
