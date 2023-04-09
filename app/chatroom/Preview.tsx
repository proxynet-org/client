import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {
  Badge,
  Card,
  MD3Theme,
  useTheme,
  Paragraph,
  Text,
  IconButton,
  Title,
  Chip,
} from 'react-native-paper';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import useToggleScreen from '@/hooks/useToggleScreen';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    image: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    title: {
      ...theme.fonts.titleLarge,
    },
    body: {
      ...theme.fonts.bodyLarge,
    },
    subTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: 'transparent',
      gap: 5,
    },
  });
}

export default function Preview() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'ChatPreview'>>();
  useToggleScreen({ hideOnBlur: true });

  const { chat } = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: chat.media }} style={styles.image} />
        <Card.Title
          title={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                backgroundColor: 'transparent',
                gap: 5,
              }}
            >
              <Title>{chat.name}</Title>
              <Chip icon="check-decagram" mode="flat">
                verified
              </Chip>
            </View>
          }
          subtitle={
            <View style={styles.subTitle}>
              <Badge
                size={10}
                style={{
                  backgroundColor: 'green',
                  alignSelf: 'center',
                }}
              />
              <Text>{chat.people} Online</Text>
            </View>
          }
        />
        <Card.Content>
          <Paragraph>{chat.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <IconButton
            mode="contained-tonal"
            icon="message"
            onPress={() => navigation.navigate('ChatRoom', { chat })}
          />
        </Card.Actions>
      </Card>
    </View>
  );
}
