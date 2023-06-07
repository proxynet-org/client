import { BASE_URL_API } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  Appbar,
  Button,
  HelperText,
  Text,
  TextInput,
} from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import { ForgotPasswordSchema } from '@/schemas/auth';
import { forgotPassword } from '@/api/auth';
import dimensions from '@/constants/dimensions';
import themes from '@/themes';

function makeStyle(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: insets.top,
      gap: 10,
    },
    input: {
      width: '80%',
      backgroundColor: themes.light.paper.colors.surface,
    },
    button: {
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 28,
      backgroundColor: 'transparent',
    },
    appBar: {
      width: '100%',
      top: insets.top,
      position: 'absolute',
      backgroundColor: 'transparent',
    },
    textImportant: {
      color: themes.light.paper.colors.primary,
      fontWeight: 'bold',
    },
  });
}

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(insets), [insets]);

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: ForgotPasswordSchema,
    initialValues: {
      email: '',
    },
    onSubmit: (values) => forgotPassword(values.email),
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isValid,
    touched,
  } = formik;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#aa74c2', '#deabe3']}
        style={{
          position: 'absolute',
          width: dimensions.screen.width,
          height: dimensions.screen.height,
        }}
      />
      <Appbar style={styles.appBar} theme={themes.light.paper}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => navigation.jumpTo('SignIn')}
        />
        <Appbar.Content title={i18n.t('auth.signin.title')} />
      </Appbar>
      <Text theme={themes.light.paper} variant="titleLarge">
        {i18n.t('auth.forgotPassword.title')}
      </Text>
      <TextInput
        label={i18n.t('form.email.field')}
        style={styles.input}
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        value={values.email}
        error={Boolean(errors.email && touched.email)}
        theme={themes.light.paper}
      />
      {errors.email && touched.email && (
        <HelperText
          type="error"
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: '10%',
          }}
        >
          {i18n.t(errors.email)}
        </HelperText>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => handleSubmit()}
        disabled={!isValid}
        theme={themes.light.paper}
      >
        {i18n.t('auth.forgotPassword.button')}
      </Button>
      <View style={styles.row}>
        <Text variant="bodyLarge" theme={themes.light.paper}>
          {i18n.t('auth.forgotPassword.contact')}{' '}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await Linking.openURL(BASE_URL_API.replace('/api', ''));
          }}
        >
          <Text variant="bodyLarge" style={styles.textImportant}>
            {BASE_URL_API.replace('/api', '')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
