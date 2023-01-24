import { useState, PropsWithChildren, RefAttributes } from 'react';
import { Input, InputProps, useTheme } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export function FormInput({
  name,
  leftIconName,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldTouched,
  ...props
}: RefAttributes<PropsWithChildren<InputProps>> &
  InputProps & {
    name: string;
    leftIconName: string;
    values: Record<string, string>;
    touched: Record<string, boolean>;
    errors: Record<string, string>;
    handleChange: {
      (e: React.ChangeEvent<string>): void;
      <T = string | React.ChangeEvent<string>>(
        field: T,
      ): T extends React.ChangeEvent<string>
        ? void
        : (e: string | React.ChangeEvent<string>) => void;
    };
    handleBlur: {
      (e: React.FocusEvent<TextInputFocusEventData, Element>): void;
      <T = TextInputFocusEventData>(fieldOrEvent: T): T extends string
        ? (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
        : void;
    };
    setFieldTouched: (name: string) => void;
  }) {
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  return (
    <Input
      {...props}
      value={values[name]}
      errorMessage={touched[name] ? errors[name] : ''}
      onChangeText={handleChange(name)}
      onFocus={(e) => {
        setIsFocused(true);
        setFieldTouched(name);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        handleBlur(name)(e);
        props.onBlur?.(e);
      }}
      label={props.label || props.placeholder}
      placeholder={props.placeholder || (props.label as string)}
      leftIcon={
        <Icon name={leftIconName} size={20} color={theme.colors.black} />
      }
      containerStyle={{
        backgroundColor: isFocused ? theme.colors.searchBg : 'transparent',
        borderRadius: 25,
        marginBottom: 10,
      }}
      labelStyle={{
        paddingLeft: 25,
        fontSize: 12,
        color: values[name] ? theme.colors.black : 'transparent',
        fontWeight: 'bold',
      }}
      placeholderTextColor={theme.colors.black}
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
