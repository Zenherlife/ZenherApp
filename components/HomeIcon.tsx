import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

interface HomeIconProps {
  isDark: boolean;
  focused: boolean;
  size?: number;
}

const HomeIcon = ({ isDark, focused, size = 24 }: HomeIconProps) => {
  const gradientColors = focused
    ? isDark
      ? ['#8b92f4', '#A78BFA']
      : ['#b6aaf7', '#D8B4FE']
    : isDark
      ? ['#6B7280', '#6B7280']
      : ['#dbdae8', '#dbdae8']

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="homeGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={gradientColors[0]} />
          <Stop offset="100%" stopColor={gradientColors[1]} />
        </LinearGradient>
      </Defs>
      <G transform="scale(1.08) translate(-1.08, -1.08)">
        <Path
          d="M21.12,9.79l-7-7a3.08,3.08,0,0,0-4.24,0l-7,7A3,3,0,0,0,2,11.91v7.18a3,3,0,0,0,3,3H9v-6a3,3,0,0,1,6,0v6h4a3,3,0,0,0,3-3V11.91A3,3,0,0,0,21.12,9.79Z"
          fill="url(#homeGradient)"
        />
      </G>
    </Svg>
  );
};

export default HomeIcon;
