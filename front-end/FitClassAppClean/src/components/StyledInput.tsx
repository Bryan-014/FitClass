import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';


type StyledInputProps = TextInputProps;

const StyledInput: React.FC<StyledInputProps> = ({ style, ...rest }) => {
  
  return (
    <TextInput
      style={[styles.input, style]} 
      placeholderTextColor="#888"   
      {...rest}                     
    />
  );
};


const styles = StyleSheet.create({
  input: {
    backgroundColor: '#4A4A4A',
    color: '#FFF', 
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    margin: 4,
  },
});

export default StyledInput;