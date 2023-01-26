import { Button } from '@rneui/themed';
import i18n from 'languages';
import React from 'react';

type Props = {
  title: string;
  errors: Record<string, string>;
  handleSubmit: () => void;
};

export function SubmitButtonForm({ title, handleSubmit, errors }: Props) {
  return (
    <Button
      containerStyle={{ borderRadius: 50, marginBottom: 50 }}
      buttonStyle={{
        padding: 20,
      }}
      titleStyle={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
      }}
      title={i18n.t(title)}
      onPress={() => {
        handleSubmit();
      }}
      disabled={Object.keys(errors).length > 0}
    />
  );
}
