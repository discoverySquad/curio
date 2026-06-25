import { useState } from 'react';
import {Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../constants/colors.js';

// Existing Screens
import HomeScreen from '../screens/HomeScreen.js';
import JournalScreen from '../screens/Journal.js';
import Test from '../screens/Test.js';
import ActivityDescription from '../screens/ActivityDescription.js';
import TryAgain from '../screens/TryAgain.js';
import Feedback from '../screens/Feedback.js';
import SelectCategory from '../screens/SelectCategory.js';
import ScreenTime from '../screens/parent-setting/ScreenTime.js';

// Auth Screens
import LoginScreen from '../screens/LoginScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';

// Parent Screens
import ParentDashboardScreen from '../screens/parent-setting/ParentDashboardScreen.js';
import CreateChildScreen from '../screens/parent-setting/CreateChildScreen.js';
import SelectChild from '../screens/parent-setting/SelectChild.js';
import EditParentAccount from '../screens/parent-setting/EditParentAccount.js';
import SettingParentScreen from '../screens/parent-setting/SettingParentScreen.js';
import EditChildScreen from '../screens/parent-setting/EditChildScreen.js';

// Scan Screens
import ScanScreen from '../screens/ScanScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} options={{ title: 'Explore the World!' }}/>
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
                <View style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
                    height:60
                }} />
            ),
        }}
        >
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="ScanCamera" component={ScanScreen} options={{ title: 'Scan' }} />
            <Stack.Screen name="Feedback" component={Feedback} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="TryAgain" component={TryAgain} options={{ title: 'Try Again' }} />
        </Stack.Navigator>
    );
};

const ParentStack = () => {
    return (
        <Stack.Navigator screenOptions={{ 
            headerBackButtonDisplayMode: 'minimal',
            headerStyle: { backgroundColor: colors.primary },  
            headerTintColor:  colors.surface,
            headerButtonStyle: { backgroundColor: 'transparent' }
        }}>
            <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: 'Parent Dashboard' }} />
            <Stack.Screen name="CreateChild" component={CreateChildScreen} options={{ title: 'Create Child Profile' }} />
            <Stack.Screen name="SelectChild" component={SelectChild} options={{ title: 'Select Child' }} />
            {/* <Stack.Screen name="UpdateChild" component={EditChildScreen} options={{ title: 'Edit Profile' }} /> */}
            <Stack.Screen name="EditChild" component={EditChildScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="ScreenTime" component={ScreenTime} />
      <Stack.Screen name="SelectCategory" component={SelectCategory} />
      <Stack.Screen name='EditParentAccount' component={EditParentAccount} />
      <Stack.Screen name='SettingParentScreen' component={SettingParentScreen} options={{ title: 'Settings'}}  />

    </Stack.Navigator>
    );
};

const HomeIcon = require('../assets/home_icon.png');
const JournalIcon = require('../assets/journal_icon.png');

const MainTabs = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: colors.surface,
            tabBarInactiveTintColor: colors.surface,
            tabBarStyle:{
                backgroundColor: colors.primary,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                // position: 'absolute',
                borderTopWidth: 0,
                height: 100,
                paddingTop: 8,
                justifyContent: 'center', 
                paddingLeft: 70,
            },
            tabBarItemStyle:{
                flex: 0, 
                width: 60,
            },
            tabBarItemStyle:{
                fontSize: 16,
                fontWeight: '700',
            },
        }}>
            <Tab.Screen name="HomeTab" component={HomeStack} 
            options={{
                tabBarIcon: ({ color }) => (
                  <Image 
                    source={HomeIcon} 
                    style={{ width: 22, height: 22, tintColor: color }} 
                    resizeMode="contain"
                  />
                ),
            }}
            listeners={({navigation}) => ({
                tabPress: (e) => {
                    navigation.navigate("HomeTab", { screen: "Home"});
                },
            })}
            />
            <Tab.Screen name="Scan" component={ScanStack} options={{ tabBarButton: () => null }}/>
            <Tab.Screen name="Journal" component={JournalScreen} options={{
                tabBarIcon: ({ color }) => (
                  <Image 
                    source={JournalIcon} 
                    style={{ width: 22, height: 22, tintColor: color }} 
                    resizeMode="contain"
                  />
                ),
            }}/>
            <Tab.Screen name="Parent" component={ParentStack} options={{ tabBarButton: () => null }}/>
        </Tab.Navigator>
    );
};

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SelectChildStart"
        component={SelectChild}
        options={{ title: "Select Child" }}
      />

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
    // Temporary:
    // false = show Login/Register
    // true = skip auth and show main app
    const [isLoggedIn] = useState(true);

    return <NavigationContainer>{isLoggedIn ? <RootStack /> : <AuthStack />}</NavigationContainer>;
};

export default AppNavigator;
