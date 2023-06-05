import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  Title,
  TextInput,
  MD3Theme,
  useTheme,
  Text,
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import { SigninSchema } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';
import { SnackbarState } from '@/types/ui';
import dimensions from '@/constants/dimensions';

function makeStyle(theme: MD3Theme, insets: EdgeInsets) {
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
      backgroundColor: theme.colors.surface,
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
    title: {
      position: 'absolute',
      top: 100,
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold',
      textShadowRadius: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
    },
    textImportant: { color: theme.colors.primary, fontWeight: 'bold' },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -20,
      marginTop: -20,
      zIndex: 1,
    },
  });
}

export default function SignIn() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(theme, insets), [theme, insets]);
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<AuthTabParams>>();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'error',
    duration: 3000,
  });

  const formik = useFormik({
    validateOnMount: true,
    validationSchema: SigninSchema,
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await signIn(values);
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: i18n.t('auth.signin.error'),
          type: 'error',
          duration: 3000,
        });
      }
    },
  });

  const { isValid, handleSubmit } = formik;

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={loading}
        hidesWhenStopped
        size="large"
        style={styles.loader}
      />
      <LinearGradient
        colors={['#aa74c2', '#deabe3']}
        style={{
          position: 'absolute',
          width: dimensions.screen.width,
          height: dimensions.screen.height,
        }}
      />
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Title>{i18n.t('auth.signin.title')}</Title>
      <TextInput
        label={i18n.t('form.username.field')}
        style={styles.input}
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
        autoCapitalize="none"
      />
      <TextInput
        label={i18n.t('form.password.field')}
        style={styles.input}
        onChangeText={formik.handleChange('password')}
        value={formik.values.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />
      <TouchableOpacity onPress={() => navigation.jumpTo('ForgotPassword')}>
        <Text variant="bodyLarge">{i18n.t('auth.signin.forgotPassword')}</Text>
      </TouchableOpacity>
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isValid || loading}
        onPress={() => handleSubmit()}
      >
        {i18n.t('auth.signin.button')}
      </Button>
      <View style={styles.row}>
        <Text variant="bodyLarge">{i18n.t('auth.signin.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignUp')}>
          <Text variant="bodyLarge" style={styles.textImportant}>
            {i18n.t('auth.signup.button')}
          </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbar.open}
        onDismiss={() => setSnackbar({ ...snackbar, open: false })}
        action={{
          label: 'OK',
          onPress: () => setSnackbar({ ...snackbar, open: false }),
        }}
        duration={snackbar.duration}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
