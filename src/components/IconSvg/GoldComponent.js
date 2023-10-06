import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

function GoldComponent(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M14.5 24h4v6h-4v-6z" fill="#FEC123" />
      <Path
        d="M10 29.5c0-.828.776-1.5 1.733-1.5h9.534c.957 0 1.733.672 1.733 1.5s-.776 1.5-1.733 1.5h-9.534C10.776 31 10 30.328 10 29.5z"
        fill="url(#prefix__paint0_linear)"
      />
      <Path
        d="M29.667 6.453H24.8v9.35h2.471c.781 0 1.471-.508 1.702-1.254l1.97-6.366a1.336 1.336 0 00-1.276-1.73z"
        fill="url(#prefix__paint1_linear)"
      />
      <Path
        d="M2.337 6.453h4.867v9.35H4.732c-.78 0-1.47-.508-1.701-1.254l-1.97-6.366a1.336 1.336 0 011.276-1.73z"
        fill="url(#prefix__paint2_linear)"
      />
      <Path
        d="M5 3.77C5 2.791 5.792 2 6.77 2h19.46c.978 0 1.77.792 1.77 1.77v9.73C28 19.851 22.851 25 16.5 25S5 19.851 5 13.5V3.77z"
        fill="url(#prefix__paint3_linear)"
      />
      <Path
        d="M14.863 16.307c.11 0 .27.006.479.017.215.005.386.008.514.008 0-.168-.003-.334-.009-.497V13.02c0-.167.012-.373.035-.618.029-.244.055-.49.078-.74a4.636 4.636 0 01-.931.74 7.292 7.292 0 01-1.123.554 1.483 1.483 0 01-.601-.505 1.755 1.755 0 01-.305-.724c.778-.418 1.393-.838 1.846-1.261a5.21 5.21 0 001.088-1.392c.186-.027.374-.046.566-.057a8.006 8.006 0 011.019 0c.174.011.354.03.54.057v6.266c0 .163-.003.328-.01.496v.497a25.768 25.768 0 001.054-.025h.801c.035.12.058.255.07.407a3.864 3.864 0 010 .88 2.136 2.136 0 01-.07.406h-6.277a3.451 3.451 0 01-.105-.846c0-.31.035-.592.105-.847h1.236z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={16.5}
          y1={28}
          x2={16.5}
          y2={31}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDB2D" />
          <Stop offset={1} stopColor="#FFA41C" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={30.366}
          y1={10.683}
          x2={25.468}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDB2D" />
          <Stop offset={1} stopColor="#FFA41C" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={1.638}
          y1={10.683}
          x2={6.536}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDB2D" />
          <Stop offset={1} stopColor="#FFA41C" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={5}
          y1={2}
          x2={29.99}
          y2={30.308}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FBEE00" />
          <Stop offset={0.862} stopColor="#FEB820" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default GoldComponent;
