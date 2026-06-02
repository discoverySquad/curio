import {NavigationContainer} from "@react-navigation/native";
import{createNativeStackNavigator} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import Test from "../screens/Test";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Test" component={Test} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;