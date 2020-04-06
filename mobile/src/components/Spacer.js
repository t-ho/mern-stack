import React from 'react';
import { View } from 'react-native';

const Spacer = ({ children, vertical, horizontal }) => {
  const style = {
    marginHorizontal: horizontal ? horizontal : 16,
    marginVertical: vertical ? vertical : 8,
  };
  return <View style={style}>{children}</View>;
};

export default Spacer;
