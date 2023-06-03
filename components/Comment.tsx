import { useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Button, Card, Paragraph, IconButton } from 'react-native-paper';
import i18n from '@/languages';
import { PublicationComment } from '@/types/publications';
import useAxios from '@/hooks/useAxios';
import { getPublicationCommentReplies } from '@/api/publication';
import useToggle from '@/hooks/useToggle';
import Separator from './Separator';

type Props = {
  comment: PublicationComment;
  reply: (id: string) => void;
  myReplies: PublicationComment[];
};

export default function Comment({ comment, reply, myReplies }: Props) {
  const [showReplies, toggleReplies] = useToggle(false);

  const axiosRequest = useCallback(
    () => getPublicationCommentReplies(comment.publication, comment.id),
    [comment],
  );

  const { response, fetchData } = useAxios<PublicationComment[]>({
    axiosRequest,
    fetchOnMount: false,
  });

  useEffect(() => {
    if (showReplies) {
      fetchData();
    }
  }, [showReplies, fetchData]);

  const isRootComment = !comment.parent_comment;
  const myReplyId = comment.parent_comment || comment.id;
  const replies = [...(response?.data ?? []), ...myReplies];

  return (
    <Card mode={isRootComment ? 'elevated' : 'contained'}>
      <Card.Content>
        <Paragraph>{comment.text}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" icon="thumb-up">
          {comment.likes}
        </Button>
        <Button mode="text" icon="thumb-down">
          {comment.dislikes}
        </Button>
        <IconButton
          icon="message"
          onPress={() => {
            reply(myReplyId);
          }}
        />
      </Card.Actions>
      {comment.num_replies > 0 && (
        <Card.Actions>
          <Button mode="text" onPress={toggleReplies}>
            {i18n.t('publication.comments.see.replies', {
              count: comment.num_replies,
            })}
          </Button>
        </Card.Actions>
      )}
      {replies.length > 0 && (
        <Card.Content>
          {response && response.data.length > 0 && showReplies && (
            <FlatList
              scrollEnabled={false}
              data={response.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Comment comment={item} reply={reply} myReplies={[]} />
              )}
              ItemSeparatorComponent={Separator}
            />
          )}
          {myReplies.length > 0 && (
            <FlatList
              scrollEnabled={false}
              data={myReplies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Comment comment={item} reply={reply} myReplies={[]} />
              )}
              ItemSeparatorComponent={Separator}
            />
          )}
        </Card.Content>
      )}
    </Card>
  );
}
