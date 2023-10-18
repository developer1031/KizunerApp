import React from 'react';
import {View} from 'react-native';
import {Touchable, Text} from 'components';
import Loading from './Loading';

// export interface ButtonProps {
//   /* The `onPress: any;` in the `ButtonCustom` component's props is specifying the type of the
//   `onPress` prop. In this case, it is allowing any type to be passed as the `onPress` prop. */
//   onPress: any;
//   /* The `style: any;` in the `ButtonCustom` component's props is specifying that the `style` prop can
//   be of any type. It is not enforcing any specific type for the `style` prop. */
//   style: any;
//   /* The `isLoading: any;` in the `ButtonCustom` component's props is specifying that the `isLoading`
//   prop can be of any type. It is not enforcing any specific type for the `isLoading` prop. */
//   isLoading: any;
//   /* The `titleStyle: any;` in the `ButtonCustom` component's props is specifying that the `titleStyle`
//   prop can be of any type. It is not enforcing any specific type for the `titleStyle` prop. This
//   means that the `titleStyle` prop can accept values of any type, such as objects, arrays, strings,
//   numbers, booleans, etc. */
//   titleStyle: any;
//   /* The `title: any;` in the `ButtonCustom` component's props is specifying that the `title` prop can
//   be of any type. It is not enforcing any specific type for the `title` prop. This means that the
//   `title` prop can accept values of any type, such as strings, numbers, booleans, objects, etc. */
//   title: any;
//   /* The line `isDisable: Boolean;` is declaring a prop called `isDisable` in the `ButtonCustom`
//   component's props. The `Boolean` type is used to specify that the `isDisable` prop should be a
//   boolean value. This means that the prop can only accept `true` or `false` as its value. */
//   isDisable: Boolean;
// }

export const ButtonCustom = (props) => {
  if (props.isDisable) {
    return (
      <View style={[props.style, {opacity: 0.3}]}>
        {props.isLoading ? (
          <Loading size={undefined} dark={undefined} fullscreen={undefined} />
        ) : (
          <Text style={props.titleStyle}>{props.title}</Text>
        )}
      </View>
    );
  }
  return (
    <Touchable
      disabled={props.isLoading}
      onPress={props.onPress}
      style={props.style}>
      {props.isLoading ? (
        <Loading size={undefined} dark={undefined} fullscreen={undefined} />
      ) : (
        <Text style={props.titleStyle}>{props.title}</Text>
      )}
    </Touchable>
  );
};
