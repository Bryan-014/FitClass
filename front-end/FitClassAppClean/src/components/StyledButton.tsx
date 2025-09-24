import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface StyledButtonProps extends TouchableOpacityProps {
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'google'; 
  style?: StyleProp<ViewStyle>;
}

const StyledButton: React.FC<StyledButtonProps> = ({ children, variant = 'primary', style, ...rest }) => {
  const buttonStyle = [
    styles.button,
    styles[variant] 
  ];
  

  const textStyle = [
    styles.buttonText,
    styles[`${variant}Text` as keyof typeof styles] 
  ];

  return (
    <TouchableOpacity style={[buttonStyle, style]} {...rest}>
      {typeof children === 'string' ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primary: {
    backgroundColor: '#1E1E1E',
  },
  primaryText: {
    color: '#FFF',
  },
  
  secondary: {
    backgroundColor: '#1E1E1E',
  },
  secondaryText: {
    color: '#FFF',
  },
  
  google: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },

});

export default StyledButton;