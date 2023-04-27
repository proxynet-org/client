import { Chatroom } from '@/types/chatroom';
import { Post } from '@/types/post';

export type RootStackParams = {
  Auth: undefined;

  Chat: undefined;
  Map: undefined;

  PostCreate: undefined;
  PostPreview: { post: Post };
  PostComments: { post: Post };

  ChatCreate: undefined;
  ChatPreview: { chat: Chatroom };
  ChatRoom: { chat: Chatroom };

  Settings: undefined;
};

export type AuthTabParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
