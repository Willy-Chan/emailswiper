import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from './src/LoginScreen';
import Main from './src/Main';
import ResponseScreen from './src/ResponseScreen';
import SummaryScreen from './src/SummaryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Main} options={{ title: 'Inbox', headerShown: false }} />
          <Stack.Screen name="Response" component={ResponseScreen} options={({ navigation }) => ({
            title: 'Response',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15, paddingVertical: 15,  paddingHorizontal: 15, }}>
                <Text>Back</Text>
              </TouchableOpacity>
            ),
          })} />
          <Stack.Screen name="Summary" component={SummaryScreen} options={({ navigation }) => ({
            title: 'Summary',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15, paddingVertical: 15,  paddingHorizontal: 15, }}>
                <Text>Back</Text>
              </TouchableOpacity>
            ),
          })} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
