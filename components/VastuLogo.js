import React from 'react';
import { View, Platform } from 'react-native';

export default function VastuLogo({ size = 30 }) {
  if (Platform.OS === 'web') {
    return (
      <svg width={size} height={size * (31/44)} viewBox="0 0 44 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.825 11.829 18.797.805a2.75 2.75 0 0 0-3.89 0L.806 14.9a2.75 2.75 0 0 0 0 3.89l11.028 11.023a2.75 2.75 0 0 0 3.89 0l14.1-14.094a2.75 2.75 0 0 0 0-3.889" fill="#d4d4d8"/>
        <path d="M42.892 11.829 31.863.805a2.75 2.75 0 0 0-3.89 0L13.873 14.9a2.75 2.75 0 0 0 0 3.89L24.9 29.811a2.75 2.75 0 0 0 3.89 0l14.1-14.094a2.75 2.75 0 0 0 0-3.889" fill="#27272a"/>
      </svg>
    );
  }

  // Native mobile fallback drawing rotated diamonds using safe React Native styling
  const boxSize = size * 0.52;
  const heightOffset = (size * (31/44) - boxSize) / 2;
  return (
    <View style={{ width: size, height: size * (31/44), position: 'relative' }}>
      <View 
        style={{
          position: 'absolute',
          left: 0,
          top: heightOffset,
          width: boxSize,
          height: boxSize,
          backgroundColor: '#d4d4d8',
          borderRadius: 2,
          transform: [{ rotate: '45deg' }]
        }} 
      />
      <View 
        style={{
          position: 'absolute',
          left: size * 0.35,
          top: heightOffset,
          width: boxSize,
          height: boxSize,
          backgroundColor: '#27272a',
          borderRadius: 2,
          transform: [{ rotate: '45deg' }]
        }} 
      />
    </View>
  );
}
