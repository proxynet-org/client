import { Button, Text, useTheme } from '@rneui/themed';
import { FormInput, View } from 'components';
import { AuthTabParams } from 'navigation';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import i18n from 'languages';
import { SignupSchema } from 'schemas';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export function SignupScreen() {
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
        <Text h1>{i18n.t('Signup')}</Text>
        <Text>Please signup to continue.</Text>
      </View>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          birthDate: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={SignupSchema}
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
              placeholder="FIRST NAME"
              value={values.firstName}
              errorMessage={errors.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              leftIconName="account-outline"
            />
            <FormInput
              placeholder="LAST NAME"
              value={values.lastName}
              errorMessage={errors.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              leftIconName="account-outline"
            />
            <FormInput
              placeholder="BIRTH DATE"
              value={values.birthDate}
              errorMessage={errors.birthDate}
              onChangeText={handleChange('birthDate')}
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
              onBlur={handleBlur('birthDate')}
              leftIconName="cake-variant-outline"
            />
            <FormInput
              placeholder="PHONE"
              value={values.phone}
              errorMessage={errors.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              leftIconName="phone-outline"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
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
            <FormInput
              placeholder="CONFIRM PASSWORD"
              secureTextEntry={true}
              value={values.confirmPassword}
              errorMessage={errors.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text>Already have an account ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
