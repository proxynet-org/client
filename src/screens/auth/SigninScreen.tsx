import { Button, Text, useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthTabParams } from 'navigation';
import { Formik } from 'formik';

import { SigninSchema } from 'schemas';
import { FormInput, View } from 'components';
import i18n from 'languages';

export function SigninScreen() {
  const navigation = useNavigation<NavigationProp<AuthTabParams>>();

  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          width: '100%',
          padding: 20,
        }}
      >
        <Text h1>{i18n.t('Signin')}</Text>
        <Text bold>Please signin to continue.</Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => console.log(values)}
        validationSchema={SigninSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormInput
              placeholder="EMAIL"
              value={values.email}
              errorMessage={errors.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              leftIconName="email-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <FormInput
              placeholder="PASSWORD"
              secureTextEntry={true}
              value={values.password}
              errorMessage={errors.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              leftIconName="lock-outline"
            />
            <Button
              buttonStyle={{
                width: 250,
                height: 75,
              }}
              containerStyle={{ borderRadius: 50 }}
              title={i18n.t('Signin')}
              titleProps={{ style: { fontWeight: 'bold', fontSize: 20 } }}
              onPress={() => {
                handleSubmit();
              }}
              disabled={Object.keys(errors).length > 0}
            />
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary }}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Text>Don&apos;t have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
