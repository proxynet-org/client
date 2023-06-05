import { useState, useMemo, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTheme, MD3Theme, Card } from 'react-native-paper';

import { View } from '@/components/Themed';
import {
  getPublicationComments,
  postPublicationComment,
} from '@/api/publication';
import { RootStackParams } from '@/routes/params';
import Separator from '@/components/Separator';
import Comment from '@/components/Comment';
import CommentForm from '@/components/CommentForm';
import Empty from '@/components/Empty';
import { PublicationComment } from '@/types/publications';
import positionSubject, { PositionObserver } from '@/events/PositionSubject';
import { distanceInMeters } from '@/utils/distanceInMeters';
import { RANGE_METERS } from '@/constants/rules';
import dimensions from '@/constants/dimensions';

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    list: {
      flex: 1,
    },
    image: {
      backgroundColor: 'transparent',
      height: dimensions.screen.width,
      aspectRatio: 1,
    },
    itemContainer: { paddingHorizontal: 10, backgroundColor: 'transparent' },
  });
}

export default function Comments() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'PublicationComments'>>();
  const [comments, setComments] = useState<Map<string, PublicationComment>>(
    new Map(),
  );
  const [replyingTo, setReplyingTo] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  const { publication } = route.params;

  const fetchComments = useCallback(async () => {
    setRefreshing(true);
    const res = await getPublicationComments(publication.id);
    if (res) {
      const newReplies = new Map(
        res.data.map((comment) => [comment.id, comment]),
      );
      setComments(newReplies);
    }
    setRefreshing(false);
  }, [publication]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const replyTo = (id?: string) => {
    setReplyingTo(id);
  };

  const cancelReply = () => {
    setReplyingTo(undefined);
  };

  const submitReply = async (text: string) => {
    const res = await postPublicationComment(publication.id, text, replyingTo);
    if (res) {
      setComments((prev) => {
        const newReplies = new Map(prev);
        newReplies.set(res.data.id, res.data);
        return newReplies;
      });
    }
  };

  const rootComments = Array.from(comments.values()).filter(
    (comment) => !comment.parent_comment,
  );

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

  const Header = useMemo(() => {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <Card.Cover source={{ uri: publication.image }} style={styles.image} />
        <Separator />
      </View>
    );
  }, [publication, styles.image]);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={rootComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Comment comment={item} replyTo={replyTo} comments={comments} />
          </View>
        )}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={Header}
        ListFooterComponent={Separator}
        ListEmptyComponent={Empty}
        onRefresh={fetchComments}
        refreshing={refreshing}
      />
      <CommentForm
        onSubmit={submitReply}
        replyId={replyingTo}
        cancelReply={cancelReply}
      />
    </View>
  );
}
