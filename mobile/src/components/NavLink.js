import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableRipple, withTheme } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

const NavLink = ({ navigation, text, routeName, disabled, theme }) => {
  return (
    <TouchableRipple
      disabled={disabled}
      onPress={() => navigation.navigate(routeName)}
    >
      <Text style={{ ...styles.link, color: theme.colors.primary }}>
        {text}
      </Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  link: {
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default withNavigation(withTheme(NavLink));
