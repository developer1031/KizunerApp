import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

function CopperComponent(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M14.5 24h4v6h-4v-6z" fill="#E7895D" />
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
        d="M17.5 14.984c0-.347-.11-.632-.33-.856-.216-.23-.515-.344-.896-.344a1.76 1.76 0 00-.767.176c-.175-.096-.34-.261-.496-.496a2.295 2.295 0 01-.3-.64v-.008h.007l1.369-1.376c.12-.112.278-.25.473-.416.196-.17.344-.296.444-.376l-.045-.064c-.116.021-.271.043-.466.064-.191.016-.384.03-.58.04-.19.005-.335.008-.436.008h-1.616a2.445 2.445 0 01-.128-.752c0-.123.01-.267.03-.432.025-.17.07-.341.136-.512h4.842c.1.192.19.405.27.64.08.235.12.432.12.592 0 .304-.14.592-.42.864l-.858.872a6.756 6.756 0 01-.631.552c.651.07 1.193.328 1.624.776.436.443.654 1.03.654 1.76 0 .64-.153 1.179-.459 1.616-.3.432-.696.763-1.188.992a3.675 3.675 0 01-1.556.336c-.571 0-1.1-.088-1.587-.264-.486-.181-.89-.408-1.21-.68.045-.24.14-.49.286-.752.145-.261.32-.467.526-.616.266.197.551.357.857.48.306.117.61.176.91.176.411 0 .75-.115 1.015-.344.27-.235.406-.573.406-1.016z"
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
          <Stop stopColor="#EFC188" />
          <Stop offset={1} stopColor="#E7895D" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={30.366}
          y1={10.683}
          x2={25.468}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDD29D" />
          <Stop offset={1} stopColor="#E48A60" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={1.638}
          y1={10.683}
          x2={6.536}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDD29D" />
          <Stop offset={1} stopColor="#E6956F" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={5}
          y1={2}
          x2={29.99}
          y2={30.308}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDD29D" />
          <Stop offset={0.862} stopColor="#E7895D" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default CopperComponent;
