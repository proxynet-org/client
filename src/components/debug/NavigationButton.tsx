import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { RootStackParams, AuthTabParams } from 'navigation';

type Props = {
  name: keyof RootStackParams | keyof AuthTabParams;
};

export function NavigationButton({ name }: Props) {
  const navigation =
    useNavigation<NavigationProp<RootStackParams & AuthTabParams>>();
  return <Button onPress={() => navigation.navigate(name)} title={name} />;
}
