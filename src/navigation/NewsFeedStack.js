import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import NewsFeedScreen from 'screens/NewsFeed';
// import HangoutDetailScreen from 'screens/HangoutDetail';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: true}}>
    <Stack.Screen
      name="NewsFeed"
      component={NewsFeedScreen}
      options={{stackAnimation: 'fade'}}
    />
    {/* <Stack.Screen
      name="HangoutDetail"
      component={HangoutDetailScreen}
      options={{stackAnimation: 'fade'}}
    /> */}
  </Stack.Navigator>
);
