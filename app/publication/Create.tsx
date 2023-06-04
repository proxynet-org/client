import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  MD3Theme,
  TextInput,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import * as yup from 'yup';
import { View } from '@/components/Themed';
import Gallery from '@/components/Gallery';
import useFormikMultiStep from '@/hooks/useFormikMultiStep';
import { RootStackParams } from '@/routes/params';
import { Media } from '@/types/gallery';
import { createPublication } from '@/api/publication';
import { PublicationPayload } from '@/types/publications';
import { SnackbarState } from '@/types/ui';
import i18n from '@/languages';

export const CreatePublicationSchema = [
  yup.object().shape({
    image: yup.mixed().required('form.required'),
  }),
  yup.object().shape({
    title: yup.string().required('form.required'),
  }),
];

const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      gap: 10,
      padding: 10,
    },
    textInput: {
      flex: 1,
    },
    image: {
      width: 50,
      aspectRatio: 1,
      borderRadius: 5,
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -20,
      marginTop: -20,
    },
  });

export default function Create() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  const formik = useFormikMultiStep<PublicationPayload>({
    validateOnMount: true,
    steps: CreatePublicationSchema,
    initialValues: {
      title: '',
      text: '',
      image: {
        id: '',
        uri: '',
        type: '',
        name: '',
      },
    },
    onSubmit: async (values) => {
      setSending(true);
      try {
        const res = await createPublication({ ...values });
        navigation.replace('PublicationPreview', { publication: res.data });
      } catch (error) {
        setSnackbar({
          open: true,
          message: i18n.t('publication.create.error'),
          type: 'error',
          duration: 3000,
        });
      }
      setSending(false);
    },
  });

  const { step, setFieldValue, isValid } = formik;

  const HeaderRight = useCallback(() => {
    if (!isValid) {
      return null;
    }
    return (
      <IconButton
        onPress={() => formik.handleSubmit()}
        icon={step === 0 ? 'arrow-right' : 'check'}
        disabled={sending}
      />
    );
  }, [formik, step, isValid, sending]);

  const HeaderLeft = useCallback(() => {
    return (
      <IconButton
        onPress={() => (step === 0 ? navigation.goBack() : formik.previous())}
        icon={step === 0 ? 'close' : 'arrow-left'}
      />
    );
  }, [formik, navigation, step]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
      headerLeft: HeaderLeft,
    });
  }, [HeaderLeft, HeaderRight, navigation]);

  const onGalleryChange = useCallback(
    (image: Media) => {
      setFieldValue('image', image);
    },
    [setFieldValue],
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={sending}
        hidesWhenStopped
        size="large"
        style={styles.loader}
      />
      {step === 0 && (
        <Gallery onChange={onGalleryChange} value={formik.values.image} />
      )}
      {step === 1 && (
        <View style={styles.row}>
          <Image
            source={{
              uri: formik.values.image.uri,
            }}
            style={styles.image}
          />
          <TextInput
            label="Title"
            style={styles.textInput}
            onChangeText={formik.handleChange('title')}
            value={formik.values.title}
          />
        </View>
      )}
      <Snackbar
        duration={snackbar.duration}
        visible={snackbar.open}
        onDismiss={() => setSnackbar({ ...snackbar, open: false })}
        action={{
          label: 'Close',
          onPress: () => setSnackbar({ ...snackbar, open: false }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
