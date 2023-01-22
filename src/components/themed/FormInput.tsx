import { useState } from 'react';
import { Input, InputProps, useTheme } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function FormInput({
  placeholder,
  value,
  errorMessage,
  onChangeText,
  onBlur,
  secureTextEntry,
  leftIconName,
}: InputProps & {
  leftIconName: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  return (
    <Input
      secureTextEntry={secureTextEntry}
      value={value}
      errorMessage={errorMessage}
      onChangeText={onChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      label={placeholder}
      placeholder={placeholder}
      leftIcon={
        <Icon name={leftIconName} size={20} color={theme.colors.black} />
      }
      containerStyle={{
        backgroundColor: isFocused ? theme.colors.searchBg : 'transparent',
        borderRadius: 25,
      }}
      placeholderTextColor="white"
      labelStyle={{
        paddingLeft: 25,
        fontSize: 12,
        color: value ? theme.colors.black : 'transparent',
        fontWeight: 'bold',
      }}
      inputContainerStyle={{
        height: 25,
        borderBottomWidth: 0,
      }}
      errorStyle={{
        paddingLeft: 25,
        margin: 0,
        color: theme.colors.error,
      }}
      inputStyle={{ color: theme.colors.black, fontWeight: 'bold' }}
    />
  );
}

export default FormInput;
