import React from 'react';
import { StatusBar as NativeStatusBar } from 'react-native';

const StatusBar = (props) => {
  return (
    <NativeStatusBar
      barStyle={'light-content'}
      translucent
      backgroundColor={'transparent'}
      animated
      {...props}
    />
  );
};

export default StatusBar;
