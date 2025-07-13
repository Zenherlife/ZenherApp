import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

interface CallIconProps {
  isDark: boolean;
  focused: boolean;
  size?: number;
}

const ShopIcon = ({ isDark, focused, size = 24 }: CallIconProps) => {
  const gradientColors = focused
    ? isDark
      ? ['#8b92f4', '#A78BFA']
      : ['#b6aaf7', '#D8B4FE']
    : isDark
    ? ['#6B7280', '#6B7280']
    : ['#dbdae8', '#dbdae8'];

  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Defs>
        <LinearGradient id="callGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={gradientColors[0]} />
          <Stop offset="100%" stopColor={gradientColors[1]} />
        </LinearGradient>
      </Defs>

      <G>
        <Path
          d="M18.6,23H5.4a3,3,0,0,1-2.98-3.37l1.25-10A3.01,3.01,0,0,1,6.65,7H7v3a1,1,0,0,0,2,0V7h6v3a1,1,0,0,0,2,0V7h.35a3.01,3.01,0,0,1,2.98,2.63l1.25,10A3,3,0,0,1,18.6,23Z"
          fill="url(#callGradient)"
        />
        <Path
          d="M17,5H15A3,3,0,0,0,9,5H7A5,5,0,0,1,17,5Z"
          fill="url(#callGradient)"
        />
      </G>
    </Svg>
  );
};

export default ShopIcon;
