import { useState, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme, MD3Theme } from 'react-native-paper';

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

function makeStyle(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backdrop,
    },
    list: {
      flex: 1,
      paddingHorizontal: 10,
    },
  });
}

export default function Comments() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyle(theme), [theme]);
  const route = useRoute<RouteProp<RootStackParams, 'PublicationComments'>>();
  const [comments, setComments] = useState<Map<string, PublicationComment>>(
    new Map(),
  );
  const [replyingTo, setReplyingTo] = useState<string>();

  const { publication } = route.params;

  useEffect(() => {
    getPublicationComments(publication.id).then((res) => {
      if (res) {
        const newReplies = new Map(
          res.data.map((comment) => [comment.id, comment]),
        );
        setComments(newReplies);
      }
    });
  }, [publication]);

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

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={rootComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Comment comment={item} replyTo={replyTo} comments={comments} />
        )}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={Separator}
        ListFooterComponent={Separator}
        ListEmptyComponent={Empty}
      />
      <CommentForm
        onSubmit={submitReply}
        replyId={replyingTo}
        cancelReply={cancelReply}
      />
    </View>
  );
}
