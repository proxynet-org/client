import { useCallback, useEffect, useMemo } from 'react';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { Image, StyleSheet } from 'react-native';
import { IconButton, MD3Theme, TextInput, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import * as yup from 'yup';
import { View } from '@/components/Themed';
import Gallery from '@/components/Gallery';
import useFormikMultiStep from '@/hooks/useFormikMultiStep';
import { RootStackParams } from '@/routes/params';
import { Media } from '@/types/gallery';
import { createPost } from '@/api/post';
import { PostPayload } from '@/types/post';
import useToggleScreen from '@/hooks/useToggleScreen';

export const CreatePostSchema = [
  yup.object().shape({
    media: yup.mixed().required('form.required'),
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
  });

export default function Create() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useToggleScreen({
    hideOnBlur: true,
    onBlur: () => {
      navigation.dispatch((state) => {
        // Remove the create route from the stack
        const routes = state.routes.filter((r) => r.name !== 'PostCreate');

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },
  });

  const formik = useFormikMultiStep<PostPayload>({
    validateOnMount: true,
    steps: CreatePostSchema,
    initialValues: {
      title: '',
      media: {
        id: '',
        uri: '',
        type: '',
        name: '',
      },
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    onSubmit: async (values) => {
      const location = await Location.getCurrentPositionAsync();
      const res = await createPost({ ...values, coordinates: location.coords });
      navigation.navigate('PostPreview', { post: res.data });
    },
  });

  const { step, setFieldValue, isValid } = formik;

  const HeaderRight = useCallback(() => {
    if (!isValid) return null;
    return (
      <IconButton
        onPress={() => formik.handleSubmit()}
        icon={step === 0 ? 'arrow-right' : 'check'}
      />
    );
  }, [formik, step, isValid]);

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
      setFieldValue('media', image);
    },
    [setFieldValue],
  );

  return (
    <View style={styles.container}>
      {step === 0 && (
        <Gallery onChange={onGalleryChange} value={formik.values.media} />
      )}
      {step === 1 && (
        <View style={styles.row}>
          <Image
            source={{
              uri: formik.values.media.uri,
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
    </View>
  );
}
