import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

function WrapLeftComponent(props) {
  return (
    <Svg
      width={111}
      height={162}
      viewBox="0 0 111 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M20.627 0H111v17H0L20.627 0z" fill="#FAC6C6" />
      <Path d="M0 17h111v145H0V17z" fill="url(#prefix__paint0_linear)" />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={116.814}
          y1={105.871}
          x2={-43.179}
          y2={116.064}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FAA9A9" />
          <Stop offset={1} stopColor="#FFF1F1" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default WrapLeftComponent;
