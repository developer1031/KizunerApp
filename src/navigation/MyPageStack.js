import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MyPageScreen from 'screens/MyPage';
// import HangoutDetailScreen from 'screens/HangoutDetail';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: true}}>
    <Stack.Screen
      name="MyPage"
      component={MyPageScreen}
      options={{stackAnimation: 'fade'}}
    />
    {/* <Stack.Screen
      name="HangoutDetail"
      component={HangoutDetailScreen}
      options={{stackAnimation: 'fade'}}
      initialParams={{commentFocus: false, hangoutId: null}}
    /> */}
  </Stack.Navigator>
);
