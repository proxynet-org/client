import { useCallback, useMemo, useState } from 'react';
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
import { Reaction } from '@/types/publications';
import { reactPublication } from '@/api/publication';

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
  const route = useRoute<RouteProp<RootStackParams, 'PublicationPreview'>>();
  useToggleScreen({ hideOnBlur: true });

  const { publication } = route.params;

  const navigateToComments = useCallback(() => {
    navigation.navigate('PublicationComments', { publication });
  }, [navigation, publication]);

  const [likes, setLikes] = useState<number>(publication.num_likes);
  const [dislikes, setDislikes] = useState<number>(publication.num_dislikes);
  const [reaction, setReaction] = useState<Reaction>(publication.reaction);

  async function sendReaction(newReaction: Reaction) {
    await reactPublication(publication.id, newReaction);

    setReaction((oldReaction) => {
      switch (oldReaction) {
        case Reaction.LIKE:
          setLikes(likes - 1);
          break;
        case Reaction.DISLIKE:
          setDislikes(dislikes - 1);
          break;
        default:
          break;
      }

      if (oldReaction === newReaction) {
        return Reaction.NONE;
      }

      switch (newReaction) {
        case Reaction.LIKE:
          setLikes(likes + 1);
          break;
        case Reaction.DISLIKE:
          setDislikes(dislikes + 1);
          break;
        default:
          break;
      }

      return newReaction;
    });
  }

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: publication.image }} style={styles.image} />
        <Card.Title title={publication.title} />
        <Card.Actions>
          <Button
            icon="thumb-up"
            mode={reaction === Reaction.LIKE ? 'contained' : 'outlined'}
            onPress={() => sendReaction(Reaction.LIKE)}
          >
            {likes}
          </Button>
          <Button
            icon="thumb-down"
            mode={reaction === Reaction.DISLIKE ? 'contained' : 'outlined'}
            onPress={() => sendReaction(Reaction.DISLIKE)}
          >
            {dislikes}
          </Button>
          <Button icon="message" mode="contained" onPress={navigateToComments}>
            {publication.num_comments}
          </Button>
        </Card.Actions>
        <Card.Actions>
          <Button mode="text" onPress={navigateToComments}>
            {i18n.t('publication.comments.see', {
              count: publication.num_comments,
            })}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
