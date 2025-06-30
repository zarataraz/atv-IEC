import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NovaTarefaScreen from './screens/NovaTarefaScreen';
import EditarTarefaScreen from './screens/EditarTarefaScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NovaTarefa" component={NovaTarefaScreen} />
        <Stack.Screen name="EditarTarefa" component={EditarTarefaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

