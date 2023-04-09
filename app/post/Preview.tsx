import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { MD3Theme, useTheme, Card, Button } from 'react-native-paper';
import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import i18n from '@/languages';
import useToggleScreen from '@/hooks/useToggleScreen';
import dimensions from '@/constants/dimensions';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    image: {
      height: dimensions.screen.width,
      aspectRatio: 1,
    },
    title: {
      ...theme.fonts.titleLarge,
      paddingLeft: 10,
    },
    banner: {
      overflow: 'hidden',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: theme.colors.primaryContainer,
    },
    row: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: theme.colors.primary,
      textAlign: 'right',
      paddingRight: 15,
    },
  });
}

export default function Preview() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'PostPreview'>>();
  useToggleScreen({ hideOnBlur: true });

  const { post } = route.params;

  const navigateToComments = useCallback(() => {
    navigation.navigate('PostComments', { post });
  }, [navigation, post]);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: post.media }} style={styles.image} />
        <Card.Title title={post.title} />
        <Card.Actions>
          <Button icon="thumb-up" mode="contained" onPress={() => {}}>
            {post.likes}
          </Button>
          <Button icon="thumb-down" mode="contained" onPress={() => {}}>
            {post.dislikes}
          </Button>
          <Button icon="message" mode="contained" onPress={navigateToComments}>
            {post.comments}
          </Button>
        </Card.Actions>
        <Card.Actions>
          <Button mode="text" onPress={navigateToComments}>
            {i18n.t('post.comments.see', { count: post.comments })}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
