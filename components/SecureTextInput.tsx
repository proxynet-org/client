import { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';

export default function SecureTextInput(props: TextInputProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <TextInput
      {...props}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      right={
        <TextInput.Icon
          icon={secureTextEntry ? 'eye' : 'eye-off'}
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
            return false;
          }}
        />
      }
    />
  );
}
