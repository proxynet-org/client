import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { RootStackParams } from 'navigation';

type Props = {
  name: keyof RootStackParams;
};

export function NavigationButton({ name }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  return <Button onPress={() => navigation.navigate(name)} title={name} />;
}
