import { Text, useTheme } from '@rneui/themed';
import { InputForm, SafeAreaView, SubmitButtonForm, View } from 'components';
import { AuthTabParams } from 'navigation';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import i18n from 'languages';
import { SignupSchema } from 'schemas';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from 'hooks';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export function SignupScreen() {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<AuthTabParams>>();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldTouched,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      fullName: '',
      birthDate: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: signUp,
    validationSchema: SignupSchema,
    validateOnMount: true,
  });

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View style={{ marginBottom: 28 }}>
          <Text h1>{i18n.t('auth.signup.title')}</Text>
          <Text>{i18n.t('auth.signup.subTitle')}</Text>
        </View>

        <InputForm
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
        <InputForm
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
                date && handleChange('birthDate')(date.toLocaleDateString()),
              mode: 'date',
            });
          }}
        />
        <InputForm
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
        <InputForm
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
        <InputForm
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
        <InputForm
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
        <SubmitButtonForm
          title="auth.signup.button"
          handleSubmit={handleSubmit}
          errors={errors}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <Text>{i18n.t('auth.signup.already')} </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.jumpTo('SigninStack', {
                screen: 'SigninScreen',
              })
            }
          >
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {i18n.t('auth.signin.button')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
