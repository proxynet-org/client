import { useCallback, useState, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme, MD3Theme } from 'react-native-paper';
import { View } from '@/components/Themed';
import { PublicationComment } from '@/types/publications';
import useAxios from '@/hooks/useAxios';
import {
  createPublicationComment,
  getPublicationComments,
} from '@/api/publication';
import { RootStackParams } from '@/routes/params';
import Separator from '@/components/Separator';
import Comment from '@/components/Comment';
import CommentForm from '@/components/CommentForm';
import Empty from '@/components/Empty';

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

  const [myReplies, setMyReplies] = useState<PublicationComment[]>([]);
  const [replyId, setReplyId] = useState<string>();

  const axiosRequest = useCallback(
    () => getPublicationComments(route.params.publication.id),
    [route],
  );
  const { response } = useAxios<PublicationComment[]>({ axiosRequest });

  const cancelReply = useCallback(() => {
    setReplyId(undefined);
  }, []);

  const handleReply = useCallback((id: string) => {
    setReplyId(id);
  }, []);

  const handleSubmit = useCallback(
    async (text: string) => {
      const res = await createPublicationComment(
        route.params.publication.id,
        text,
        replyId,
      );
      setMyReplies((prev) => [...prev, res.data]);
    },
    [route, replyId],
  );

  const rootComments = [...myReplies, ...(response?.data ?? [])].filter(
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
          <Comment
            comment={item}
            reply={handleReply}
            myReplies={myReplies.filter(
              (reply) => reply.parent_comment === item.id,
            )}
          />
        )}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={Separator}
        ListFooterComponent={Separator}
        ListEmptyComponent={Empty}
      />
      <CommentForm
        onSubmit={handleSubmit}
        replyId={replyId}
        cancelReply={cancelReply}
      />
    </View>
  );
}
