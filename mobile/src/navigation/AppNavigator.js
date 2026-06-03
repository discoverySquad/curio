import {NavigationContainer} from "@react-navigation/native";
import{createNativeStackNavigator} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import Test from "../screens/Test";
import TryAgain from "../screens/TryAgain";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="TryAgain" component={TryAgain} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;