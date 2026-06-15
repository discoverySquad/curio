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
import ParentDashboardScreen from '../screens/parent-setting/ParentDashboardScreen.js';
import CreateChildScreen from '../screens/parent-setting/CreateChildScreen.js';
import SettingParentScreen from '../screens/parent-setting/SettingParentScreen.js';
import EditParentAccount from '../screens/parent-setting/EditParentAccount.js';
import SelectChild from '../screens/parent-setting/SelectChild.js';

// Scan Screens
import ScanScreen from '../screens/ScanScreen.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = ({ setUser }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">{(props) => <LoginScreen {...props} setUser={setUser} />}</Stack.Screen>

            <Stack.Screen name="Register">{(props) => <RegisterScreen {...props} setUser={setUser} />}</Stack.Screen>
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
            <Stack.Screen name="Feedback" component={Feedback} options={{ title: 'Result' }} />
        </Stack.Navigator>
    );
};

const ParentStack = ({ user }) => {
    const hasChildren = user?.childId?.length > 0;

    return (
        <Stack.Navigator initialRouteName={hasChildren ? 'SelectChild' : 'CreateChild'}>
            <Stack.Screen name="ParentDashboard" options={{ title: 'Parent Dashboard' }}>
                {(props) => (
                    <ParentDashboardScreen
                        {...props}
                        route={{
                            ...props.route,
                            params: {
                                ...(props.route.params || {}),
                                user,
                            },
                        }}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen
                name="CreateChild"
                component={CreateChildScreen}
                initialParams={{ parentId: user?.id }}
                options={{ title: 'Create Child Profile' }}
            />

            <Stack.Screen name="SelectChild" component={SelectChild} initialParams={{ parentId: user?.id }} options={{ title: 'Select Child' }} />

            <Stack.Screen name="SettingParent" component={SettingParentScreen} options={{ title: 'Explore the World!' }} />
            <Stack.Screen name="ScreenTime" component={ScreenTime} />
            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="EditParentAccount" component={EditParentAccount} />
        </Stack.Navigator>
    );
};

const MainTabs = ({ user }) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Scan" component={ScanStack} />
            <Tab.Screen name="Journal" component={JournalScreen} />
            <Tab.Screen name="Parent">{() => <ParentStack user={user} />}</Tab.Screen>
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const [user, setUser] = useState(null);

    return <NavigationContainer>{user ? <MainTabs user={user} /> : <AuthStack setUser={setUser} />}</NavigationContainer>;
};

export default AppNavigator;
