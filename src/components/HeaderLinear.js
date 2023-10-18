import React, {ReactNode} from 'react';
import {Text} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import {ViewStyle, RegisteredStyle, RecursiveArray} from 'react-native';

// interface HeaderLinearProps {
//   style?:
//     | boolean
//     | ViewStyle
//     | RegisteredStyle<ViewStyle>
//     | RecursiveArray<false | ViewStyle | RegisteredStyle<ViewStyle>>;
//   colors?: (string | number)[];
//   start?: {x: number, y: number};
//   end?: {x: number, y: number};
//   iconLeft?: ReactNode;
//   iconRight?: ReactNode;
//   textStyles?: any;
//   title: any;
// }

export const HeaderLinear = (props) => {
  return (
    <LinearGradient
      style={props.style}
      colors={props.colors}
      start={props.start}
      end={props.end}>
      {props.iconLeft}
      <Text variant="header" style={props.textStyles}>
        {props.title}
      </Text>
      {props.iconRight}
    </LinearGradient>
  );
};
