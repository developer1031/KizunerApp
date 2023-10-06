import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

function SilverComponent(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M14.5 24h4v6h-4v-6z" fill="#C9DCF4" />
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
        d="M13.124 11.186c.201-.606.589-1.122 1.162-1.548.58-.425 1.284-.638 2.112-.638.668 0 1.248.12 1.739.359.497.24.881.567 1.153.981.272.415.408.886.408 1.413 0 .547-.183 1.045-.55 1.492a6.79 6.79 0 01-1.277 1.197l-1.251.917c-.249.176-.488.356-.719.543-.23.186-.387.356-.47.51.438-.053.858-.093 1.26-.12a13.39 13.39 0 011.011-.047H20c0 .095-.003.223-.009.383a2.4 2.4 0 01-.044.399c-.119.648-.589.973-1.41.973h-4.73a3.436 3.436 0 01-.514-.543c-.195-.244-.293-.47-.293-.678 0-.393.19-.808.568-1.244a8.9 8.9 0 011.295-1.23l1.66-1.284c.248-.186.449-.385.602-.598.16-.218.24-.452.24-.702 0-.271-.1-.506-.302-.702-.195-.197-.461-.296-.798-.296-.367 0-.68.117-.94.351a2.246 2.246 0 00-.577.806 2.52 2.52 0 01-.95-.207c-.307-.138-.532-.3-.674-.487z"
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
          <Stop stopColor="#DEF1FF" />
          <Stop offset={1} stopColor="#B1CAE9" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={30.366}
          y1={10.683}
          x2={25.468}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F3FAFF" />
          <Stop offset={1} stopColor="#A7C3E6" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint2_linear"
          x1={1.638}
          y1={10.683}
          x2={6.536}
          y2={10.46}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F3FAFF" />
          <Stop offset={1} stopColor="#BDD9FD" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint3_linear"
          x1={5}
          y1={3.5}
          x2={26.5}
          y2={26.5}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FEFEFE" />
          <Stop offset={1} stopColor="#D1E2F8" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SilverComponent;
