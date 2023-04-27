import { Platform } from 'react-native';
import { Post, PostComment, PostPayload } from '@/types/post';
import api from './api';

export const POSTS_ENDPOINT = '/posts';
export const COMMENTS_ENDPOINT = '/comments';

export function getPosts() {
  console.log('Getting posts...');
  return api.get(POSTS_ENDPOINT);
}

export function getPost(id: string) {
  console.log('Getting post...', id);
  return api.get(POSTS_ENDPOINT, {
    params: {
      id,
    },
  });
}

export function createPost(post: PostPayload) {
  console.log('Creating post...');
  const data = new FormData();

  data.append('media', {
    name: post.media.name,
    type: `${post.media.type}/${post.media.uri.split('.').pop()}`,
    uri:
      Platform.OS === 'ios'
        ? post.media.uri?.replace('file://', '')
        : post.media.uri,
  } as any);

  data.append('title', post.title);
  data.append('latitude', post.coordinates.latitude.toString());
  data.append('longitude', post.coordinates.longitude.toString());

  return api.post<Post>(POSTS_ENDPOINT, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function getPostComments(postId: string) {
  console.log('Getting post comments...', postId);
  return api.get(COMMENTS_ENDPOINT, {
    params: {
      postId,
    },
  });
}

export function getPostCommentReplies(postId: string, id: string) {
  console.log('Getting post comment replies...', postId, id);
  return api.get(COMMENTS_ENDPOINT, {
    params: {
      postId,
      parentId: id,
    },
  });
}

export function createPostComment(
  postId: string,
  text: string,
  parentId?: string,
) {
  console.log('Creating post comment...', postId, text, parentId);
  return api.post<PostComment>(`/comments`, {
    postId,
    parentId,
    text,
    replies: 0,
    likes: 0,
    dislikes: 0,
  });
}
