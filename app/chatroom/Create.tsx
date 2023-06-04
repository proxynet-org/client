import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  TextInput,
  useTheme,
  MD3Theme,
  Text,
  IconButton,
  Card,
  ActivityIndicator,
  Snackbar,
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from '@/components/Themed';
import Slider from '@/components/Slider';
import { RootStackParams } from '@/routes/params';
import i18n from '@/languages';
import Gallery from '@/components/Gallery';
import { Media } from '@/types/gallery';
import { createChatroom, joinChatroom } from '@/api/chatroom';
import CreateChatroomSchema from '@/schemas/chatroom';
import useToggle from '@/hooks/useToggle';
import { SnackbarState } from '@/types/ui';

const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
      padding: 5,
    },
    content: { backgroundColor: 'transparent' },
    buttonContainer: {
      height: 200,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 5,
      borderWidth: 1,
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
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -20,
      marginTop: -20,
      zIndex: 1,
    },
  });

function SliderText(value: number) {
  const styles = makeStyle(useTheme());
  return <Text style={styles.sliderText}>{value === 0 ? '∞' : value}</Text>;
}

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

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: CreateChatroomSchema,
    initialValues: {
      image: {
        id: '',
        uri: '',
        name: '',
        type: '',
      },
      name: '',
      description: '',
      lifetime: 24,
      capacity: 100,
    },
    onSubmit: async (values) => {
      setSending(true);
      try {
        const res = await createChatroom(values);
        await joinChatroom(res.data.id);
        navigation.replace('ChatRoom', { chatroom: res.data });
      } catch (e) {
        setSnackbar({
          open: true,
          message: i18n.t('chatroom.create.error'),
          type: 'error',
          duration: 3000,
        });
      }
      setSending(false);
    },
  });

  const { setFieldValue, handleSubmit, isValid, values } = formik;
  const [openGallery, toggleGallery] = useToggle(false);

  const headerRight = useCallback(
    () =>
      isValid || openGallery ? (
        <IconButton
          disabled={sending}
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
    [isValid, handleSubmit, openGallery, toggleGallery, sending],
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
      setFieldValue('image', image);
    },
    [setFieldValue],
  );

  if (openGallery) {
    return <Gallery onChange={onGalleryChange} value={values.image as Media} />;
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator
          animating={sending}
          hidesWhenStopped
          size="large"
          style={styles.loader}
        />
        {values.image.uri ? (
          <TouchableOpacity onPress={toggleGallery}>
            <Card.Cover
              source={{
                uri: values.image.uri,
              }}
            />
          </TouchableOpacity>
        ) : (
          <Card.Content style={styles.buttonContainer}>
            <Button mode="outlined" onPress={toggleGallery}>
              <Text>{i18n.t('form.image.button')}</Text>
            </Button>
          </Card.Content>
        )}

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
              color={theme.colors.onBackground}
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
              color={theme.colors.onBackground}
            />
          }
          right={SliderText}
        />
      </View>
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
    </KeyboardAwareScrollView>
  );
}
