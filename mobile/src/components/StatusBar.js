import React from 'react';
import { StatusBar as NativeStatusBar } from 'react-native';

const StatusBar = (props) => {
  return (
    <NativeStatusBar
      barStyle={'light-content'}
      backgroundColor={'#F4F4F4'}
      animated
      {...props}
    />
  );
};

export default StatusBar;
