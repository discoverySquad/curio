import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
import ParentDashboardScreen from '../screens/ParentDashboardScreen.js';
import CreateChildScreen from '../screens/CreateChildScreen.js';
import SelectChildScreen from '../screens/SelectChildScreen.js';

// Scan Screens
import ScanScreen from '../screens/ScanScreen.js';
import ResultScreen from '../screens/ResultScreen.js';

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
            <Stack.Screen name="ActivityDescription" component={ActivityDescription} />
            <Stack.Screen name="TryAgain" component={TryAgain} />
            <Stack.Screen name="Feedback" component={Feedback} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
        </Stack.Navigator>
    );
};

const ScanStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ScanCamera" component={ScanScreen} options={{ title: 'Scan' }} />
            <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
    );
};

const ParentStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: 'Parent Dashboard' }} />
            <Stack.Screen name="CreateChild" component={CreateChildScreen} options={{ title: 'Create Child Profile' }} />
            <Stack.Screen name="SelectChild" component={SelectChildScreen} options={{ title: 'Select Child' }} />
          <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="ScreenTime" component={ScreenTime} />
      <Stack.Screen name="SelectCategory" component={SelectCategory} />
    </Stack.Navigator>
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Scan" component={ScanStack} />
            <Tab.Screen name="Journal" component={JournalScreen} />
            <Tab.Screen name="Parent" component={ParentStack} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    // Temporary:
    // false = show Login/Register
    // true = skip auth and show main app
    const [isLoggedIn] = useState(true);

    return <NavigationContainer>{isLoggedIn ? <MainTabs /> : <AuthStack />}</NavigationContainer>;
};

export default AppNavigator;
