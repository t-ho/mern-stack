import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

const DismissKeyboardHoc = (WrappedComponent) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <WrappedComponent {...props}>{children}</WrappedComponent>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView = DismissKeyboardHoc(View);
