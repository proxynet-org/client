import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
} from 'react-native-paper';
import { useFormik } from 'formik';
import { View } from '@/components/Themed';
import i18n from '@/languages';
import { AuthTabParams } from '@/routes/params';
import { SigninSchema } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';
import { SnackbarState } from '@/types/ui';

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
    },
    button: {
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 28,
    },
  });
}

export default function SignIn() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyle(theme, insets), [theme, insets]);
  const { signIn } = useAuth();

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
        await signIn(values);
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
      <Title>{i18n.t('auth.signin.title')}</Title>
      <TextInput
        label={i18n.t('form.username.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
        autoCapitalize="none"
      />
      <TextInput
        label={i18n.t('form.password.field')}
        style={styles.input}
        mode="outlined"
        onChangeText={formik.handleChange('password')}
        value={formik.values.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />
      <TouchableOpacity onPress={() => navigation.jumpTo('ForgotPassword')}>
        <Text>{i18n.t('auth.signin.forgotPassword')}</Text>
      </TouchableOpacity>
      <Button
        style={styles.button}
        mode="contained"
        disabled={!isValid}
        onPress={() => handleSubmit()}
      >
        {i18n.t('auth.signin.button')}
      </Button>
      <View style={styles.row}>
        <Text>{i18n.t('auth.signin.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.jumpTo('SignUp')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
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
