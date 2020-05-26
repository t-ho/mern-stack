import React from 'react';
import { View } from 'react-native';

const Spacer = ({ children, vertical, horizontal, style }) => {
  return (
    <View
      style={[
        {
          marginVertical: vertical ? vertical : 8,
          marginHorizontal: horizontal ? horizontal : 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Spacer;
