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
      buttonStyle={{
        width: 250,
        height: 75,
      }}
      containerStyle={{ borderRadius: 50 }}
      title={i18n.t(title)}
      titleProps={{ style: { fontWeight: 'bold', fontSize: 20 } }}
      onPress={() => {
        handleSubmit();
      }}
      disabled={Object.keys(errors).length > 0}
    />
  );
}
