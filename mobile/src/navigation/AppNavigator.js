import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from "../screens/HomeScreen.js";
import JournalScreen from "../screens/Journal.js";
import Test from "../screens/Test.js";
import TryAgain from "../screens/TryAgain.js";
import Feedback from "../screens/Feedback.js";
import ScreenTime from "../screens/parent-setting/ScreenTime.js";
import SelectCategory from "../screens/SelectCategory.js";

//screen name
const homeName = 'Home';
const journalName = 'Journal';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="TryAgain" component={TryAgain} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="ScreenTime" component={ScreenTime} />
      <Stack.Screen name="SelectCategory" component={SelectCategory} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Journal" component={JournalScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;