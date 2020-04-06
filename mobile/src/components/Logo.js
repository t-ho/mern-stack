import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ style }) => {
  return (
    <Image
      style={[styles.logo, style]}
      resizeMode="contain"
      source={require('../../assets/logo.png')}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 45,
    marginBottom: 15,
  },
});

export default Logo;
