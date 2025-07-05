import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

interface CallIconProps {
  isDark: boolean;
  focused: boolean;
  size?: number;
}

const ConsultIcon = ({ isDark, focused, size = 24 }: CallIconProps) => {
  const gradientColors = focused
    ? isDark
      ? ['#8b92f4', '#A78BFA']
      : ['#b6aaf7', '#D8B4FE']
    : isDark
      ? ['#6B7280', '#6B7280']
      : ['#dbdae8', '#dbdae8']

  return (
    <Svg viewBox="0 0 256 256" width={size} height={size} fill="none">
      <Defs>
        <LinearGradient id="callGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={gradientColors[0]} />
          <Stop offset="100%" stopColor={gradientColors[1]} />
        </LinearGradient>
      </Defs>
      <G transform="scale(1.1) translate(-1.1, -1.1)">
        <Path
          d="M222,158.4l-46.9-20a15.6,15.6,0,0,0-15.1,1.3l-25.1,16.7a76.5,76.5,0,0,1-35.2-35h0L116.3,96a15.9,15.9,0,0,0,1.4-15.1L97.6,34a16.3,16.3,0,0,0-16.7-9.6A56.2,56.2,0,0,0,32,80c0,79.4,64.6,144,144,144a56.2,56.2,0,0,0,55.6-48.9A16.3,16.3,0,0,0,222,158.4Z"
          fill="url(#callGradient)"
        />
      </G>
    </Svg>
  );
};

export default ConsultIcon;
