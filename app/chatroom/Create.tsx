import { useCallback, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  TextInput,
  useTheme,
  MD3Theme,
  Text,
  IconButton,
  Card,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useNavigation,
  NavigationProp,
  CommonActions,
} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from '@/components/Themed';
import Slider from '@/components/Slider';
import { RootStackParams } from '@/routes/params';
import i18n from '@/languages';
import Gallery from '@/components/Gallery';
import { Media } from '@/types/gallery';
import useToggleScreen from '@/hooks/useToggleScreen';
import { createChatroom } from '@/api/chatroom';
import CreateChatroomSchema from '@/schemas/chatroom';
import useToggle from '@/hooks/useToggle';

const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    sliderView: {
      padding: 10,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.onBackground,
      borderRadius: 5,
      marginTop: 5,
    },
    sliderText: {
      width: theme.fonts.labelLarge.fontSize * 2,
      ...theme.fonts.labelLarge,
      textAlign: 'right',
    },
  });

function SliderText(value: number) {
  const styles = makeStyle(useTheme());
  return <Text style={styles.sliderText}>{value === 0 ? '∞' : value}</Text>;
}

export default function Create() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useToggleScreen({
    hideOnBlur: true,
    onBlur: () => {
      navigation.dispatch((state) => {
        // Remove the create route from the stack
        const routes = state.routes.filter((r) => r.name !== 'ChatCreate');

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },
  });

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: CreateChatroomSchema,
    initialValues: {
      media: {
        id: '',
        uri: '',
        name: '',
        type: '',
      },
      name: '',
      description: '',
      lifetime: 24,
      capacity: 0,
    },
    onSubmit: async (values) => {
      const res = await createChatroom(values);
      navigation.navigate('ChatRoom', { chat: res.data });
    },
  });

  const { setFieldValue, handleSubmit, isValid, values } = formik;
  const [openGallery, toggleGallery] = useToggle(false);

  const headerRight = useCallback(
    () =>
      isValid ? (
        <IconButton
          icon="check"
          onPress={() => {
            if (openGallery) {
              toggleGallery();
              return;
            }
            handleSubmit();
          }}
        />
      ) : null,
    [isValid, handleSubmit, openGallery, toggleGallery],
  );

  const headerLeft = useCallback(
    () => (
      <IconButton
        icon={openGallery ? 'close' : 'arrow-left'}
        onPress={() => {
          if (openGallery) {
            toggleGallery();
            return;
          }
          navigation.goBack();
        }}
      />
    ),
    [openGallery, toggleGallery, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight,
      headerLeft,
    });
  }, [navigation, headerRight, headerLeft]);

  const onLifetimeChange = useCallback(
    (value: number) => {
      setFieldValue('lifetime', value);
    },
    [setFieldValue],
  );

  const onCapacityChange = useCallback(
    (value: number) => {
      setFieldValue('capacity', value);
    },
    [setFieldValue],
  );

  const onGalleryChange = useCallback(
    (image: Media) => {
      setFieldValue('media', image);
    },
    [setFieldValue],
  );

  if (openGallery) {
    return <Gallery onChange={onGalleryChange} value={values.media as Media} />;
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View>
        <TouchableOpacity onPress={toggleGallery}>
          <Card.Cover
            source={{ uri: values.media?.uri || 'https://picsum.photos/500' }}
          />
        </TouchableOpacity>
        <TextInput
          label={i18n.t('form.name.field')}
          mode="outlined"
          onChangeText={formik.handleChange('name')}
          value={values.name}
        />
        <TextInput
          label={i18n.t('form.description.field')}
          mode="outlined"
          multiline
          numberOfLines={5}
          onChangeText={formik.handleChange('description')}
          value={values.description}
          right={<TextInput.Affix text={`${values.description.length}/100`} />}
        />
        <Slider
          label={i18n.t('form.lifetime.field')}
          sliderProps={{
            minimumValue: 1,
            maximumValue: 72,
            step: 1,
            value: values.lifetime,
            onSlidingComplete: onLifetimeChange,
          }}
          viewStyle={styles.sliderView}
          labelProps={{
            children: '',
            variant: 'labelLarge',
          }}
          left={
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="black"
            />
          }
          right={SliderText}
        />
        <Slider
          label={i18n.t('form.capacity.field')}
          sliderProps={{
            minimumValue: 0,
            maximumValue: 100,
            step: 1,
            value: values.capacity,
            onSlidingComplete: onCapacityChange,
          }}
          viewStyle={styles.sliderView}
          labelProps={{
            children: '',
            variant: 'labelLarge',
          }}
          left={
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color="black"
            />
          }
          right={SliderText}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
