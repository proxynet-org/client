import { Button, Text, useTheme } from '@rneui/themed';
import { FormInput, View } from 'components';
import { AuthTabParams } from 'navigation';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import i18n from 'languages';
import { SignupSchema } from 'schemas';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function SignupScreen() {
  const navigation = useNavigation<NavigationProp<AuthTabParams>>();

  const { theme } = useTheme();

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="flex-1 items-center justify-center p-5">
        <View className="w-full p-5">
          <Text h1>{i18n.t('Signup')}</Text>
          <Text>Please signup to continue.</Text>
        </View>
        <Formik
          initialValues={{
            fullName: '',
            birthDate: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={(values) => console.log(values)}
          validationSchema={SignupSchema}
          validateOnMount={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldTouched,
            touched,
            values,
            errors,
          }) => (
            <View className="w-full items-center justify-center">
              <FormInput
                name="fullName"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                leftIconName="account-outline"
                placeholder="FULL NAME"
              />
              <FormInput
                name="birthDate"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                leftIconName="cake-variant-outline"
                placeholder="BIRTH DATE"
                onFocus={(e) => {
                  e.currentTarget.blur();
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    onChange: (e, date) =>
                      date &&
                      handleChange('birthDate')(date.toLocaleDateString()),
                    mode: 'date',
                  });
                }}
              />
              <FormInput
                name="phone"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                leftIconName="phone-outline"
                placeholder="PHONE"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
              <FormInput
                name="email"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                placeholder="EMAIL"
                leftIconName="email-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
              />
              <FormInput
                name="password"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                placeholder="PASSWORD"
                secureTextEntry
                leftIconName="lock-outline"
              />
              <FormInput
                name="confirmPassword"
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldTouched={setFieldTouched}
                placeholder="CONFIRM PASSWORD"
                secureTextEntry
                leftIconName="lock-outline"
              />
              <Button
                buttonStyle={{
                  width: 250,
                  height: 75,
                }}
                containerStyle={{ borderRadius: 50 }}
                title={i18n.t('Signup')}
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
        <View className="flex-row items-end">
          <Text>Already have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
