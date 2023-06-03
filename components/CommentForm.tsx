import { useEffect, useMemo, useRef } from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { TextInput, Button, MD3Theme, useTheme } from 'react-native-paper';
import { useFormik } from 'formik';
import { View } from './Themed';
import i18n from '@/languages';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    helper: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.colors.tertiaryContainer,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
}

type Props = {
  onSubmit: (text: string) => void;
  replyId?: string;
  cancelReply: () => void;
};

export default function CommentForm({ onSubmit, replyId, cancelReply }: Props) {
  const inputRef = useRef<RNTextInput>(null);
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values) => {
      onSubmit(values.text);
      formik.setFieldValue('text', '');
      inputRef.current?.blur();
      cancelReply();
    },
  });

  useEffect(() => {
    if (replyId) {
      inputRef.current?.blur();
      inputRef.current?.focus();
    }
  }, [replyId]);

  return (
    <View>
      {replyId && (
        <View style={styles.helper}>
          <Button icon="close-circle" onPress={cancelReply}>
            replying...
          </Button>
        </View>
      )}
      <TextInput
        ref={inputRef}
        value={formik.values.text}
        onChangeText={formik.handleChange('text')}
        mode="flat"
        placeholder={i18n.t('publication.comments.placeholder')}
        multiline
        right={
          <TextInput.Icon icon="send" onPress={() => formik.handleSubmit()} />
        }
      />
    </View>
  );
}

CommentForm.defaultProps = {
  replyId: undefined,
};
