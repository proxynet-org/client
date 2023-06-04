import { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MD3Theme, useTheme, Card, Button } from 'react-native-paper';

import { View } from '@/components/Themed';
import { RootStackParams } from '@/routes/params';
import i18n from '@/languages';
import dimensions from '@/constants/dimensions';
import { Reaction } from '@/types/publications';
import { getPublication, reactPublication } from '@/api/publication';
import positionSubject, { PositionObserver } from '@/events/PositionSubject';
import { distanceInMeters } from '@/utils/distanceInMeters';
import { RANGE_METERS } from '@/constants/rules';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'PublicationPreview'>>();

  const { publication } = route.params;

  const navigateToComments = useCallback(() => {
    navigation.replace('PublicationComments', { publication });
  }, [navigation, publication]);

  const [updatedPublication, setUpdatedPublication] = useState(publication);

  useEffect(() => {
    getPublication(publication.id).then((lastPublication) =>
      setUpdatedPublication(lastPublication.data),
    );
  }, [publication]);

  async function sendReaction(newReaction: Reaction) {
    await reactPublication(publication.id, newReaction);

    setUpdatedPublication((oldPublication) => {
      const newPublication = { ...oldPublication };

      switch (oldPublication.reaction) {
        case Reaction.LIKE:
          newPublication.num_likes -= 1;
          break;
        case Reaction.DISLIKE:
          newPublication.num_dislikes -= 1;
          break;
        default:
          break;
      }

      if (oldPublication.reaction === newReaction) {
        newPublication.reaction = Reaction.NONE;
        return newPublication;
      }

      switch (newReaction) {
        case Reaction.LIKE:
          newPublication.num_likes += 1;
          break;
        case Reaction.DISLIKE:
          newPublication.num_dislikes += 1;
          break;
        default:
          break;
      }

      newPublication.reaction = newReaction;
      return newPublication;
    });
  }

  useEffect(() => {
    const positionObserver: PositionObserver = (position) => {
      const distance = distanceInMeters(position, publication.coordinates);
      if (distance > RANGE_METERS) {
        navigation.goBack();
      }
    };

    positionSubject.subscribe(positionObserver);

    return () => {
      positionSubject.unsubscribe(positionObserver);
    };
  }, [publication, navigation]);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: publication.image }} style={styles.image} />
        <Card.Title title={publication.title} />
        <Card.Actions>
          <Button
            icon="thumb-up"
            mode={
              updatedPublication.reaction === Reaction.LIKE
                ? 'contained'
                : 'outlined'
            }
            onPress={() => sendReaction(Reaction.LIKE)}
          >
            {updatedPublication.num_likes}
          </Button>
          <Button
            icon="thumb-down"
            mode={
              updatedPublication.reaction === Reaction.DISLIKE
                ? 'contained'
                : 'outlined'
            }
            onPress={() => sendReaction(Reaction.DISLIKE)}
          >
            {updatedPublication.num_dislikes}
          </Button>
          <Button icon="message" mode="contained" onPress={navigateToComments}>
            {updatedPublication.num_comments}
          </Button>
        </Card.Actions>
        <Card.Actions>
          <Button mode="text" onPress={navigateToComments}>
            {i18n.t('publication.comments.see', {
              count: updatedPublication.num_comments,
            })}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
