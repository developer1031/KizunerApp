import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ExploreScreen from 'screens/Explore';
import ExploreMapScreen from 'screens/ExploreMap';
// import HangoutDetailScreen from 'screens/HangoutDetail';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: true}}>
    <Stack.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        stackAnimation: 'fade',
      }}
    />
    <Stack.Screen
      name="ExploreMap"
      component={ExploreMapScreen}
      options={{
        stackAnimation: 'fade',
      }}
    />
    {/* <Stack.Screen
      name="HangoutDetail"
      component={HangoutDetailScreen}
      options={{stackAnimation: 'fade'}}
    /> */}
  </Stack.Navigator>
);
