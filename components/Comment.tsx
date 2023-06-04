import { useState } from 'react';
import { FlatList } from 'react-native';
import { Button, Card, Paragraph, IconButton } from 'react-native-paper';
import i18n from '@/languages';
import { PublicationComment, Reaction } from '@/types/publications';
import Separator from './Separator';
import {
  getPublicationCommentReplies,
  reactPublicationComment,
} from '@/api/publication';

type Props = {
  comment: PublicationComment;
  comments: Map<string, PublicationComment>;
  replyTo: (id?: string) => void;
};

export default function Comment({ comment, comments, replyTo }: Props) {
  const [replies, setReplies] = useState<Map<string, PublicationComment>>(
    new Map(),
  );
  const [updatedComment, setUpdatedComment] = useState(comment);
  const [showReplies, setShowReply] = useState(false);

  const isRootComment = !comment.parent_comment;
  const replyId = isRootComment ? comment.id : comment.parent_comment;
  const commentReplies = Array.from(comments.values()).filter(
    (c) => c.parent_comment === replyId,
  );
  const allReplies = Array.from(replies.values()).concat(commentReplies);
  const replyCount = Math.max(allReplies.length, comment.num_replies);

  const handleShowReplies = async () => {
    const res = await getPublicationCommentReplies(
      comment.publication,
      comment.id,
    );
    if (res) {
      const newReplies = new Map(
        res.data
          .filter((reply) => !comments.get(reply.id))
          .map((reply) => [reply.id, reply]),
      );
      setReplies(newReplies);
      setShowReply(true);
    }
  };

  const toggleShowReplies = () => {
    if (showReplies) {
      setShowReply(false);
    } else {
      handleShowReplies();
    }
  };

  async function sendReaction(newReaction: Reaction) {
    await reactPublicationComment(comment.publication, comment.id, newReaction);

    setUpdatedComment((oldComment) => {
      const newComment = { ...oldComment };

      switch (oldComment.reaction) {
        case Reaction.LIKE:
          newComment.num_likes -= 1;
          break;
        case Reaction.DISLIKE:
          newComment.num_dislikes -= 1;
          break;
        default:
          break;
      }

      if (oldComment.reaction === newReaction) {
        newComment.reaction = Reaction.NONE;
        return newComment;
      }

      switch (newReaction) {
        case Reaction.LIKE:
          newComment.num_likes += 1;
          break;
        case Reaction.DISLIKE:
          newComment.num_dislikes += 1;
          break;
        default:
          break;
      }

      newComment.reaction = newReaction;
      return newComment;
    });
  }

  return (
    <Card mode={isRootComment ? 'elevated' : 'contained'}>
      <Card.Content>
        <Paragraph>{comment.text}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          icon="thumb-up"
          mode={
            updatedComment.reaction === Reaction.LIKE ? 'contained' : 'outlined'
          }
          onPress={() => sendReaction(Reaction.LIKE)}
        >
          {updatedComment.num_likes}
        </Button>
        <Button
          icon="thumb-down"
          mode={
            updatedComment.reaction === Reaction.DISLIKE
              ? 'contained'
              : 'outlined'
          }
          onPress={() => sendReaction(Reaction.DISLIKE)}
        >
          {updatedComment.num_dislikes}
        </Button>
        <IconButton
          icon="message"
          onPress={() => {
            replyTo(replyId);
          }}
        />
      </Card.Actions>
      {replyCount > 0 && (
        <Card.Actions>
          <Button mode="text" onPress={toggleShowReplies}>
            {i18n.t('publication.comments.see.replies', {
              count: replyCount,
            })}
          </Button>
        </Card.Actions>
      )}
      {allReplies.length > 0 && showReplies && (
        <Card.Content>
          <FlatList
            scrollEnabled={false}
            data={allReplies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Comment comment={item} replyTo={replyTo} comments={new Map()} />
            )}
            ItemSeparatorComponent={Separator}
          />
        </Card.Content>
      )}
    </Card>
  );
}
