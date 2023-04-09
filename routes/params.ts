import { Chatroom } from '@/types/chatroom';
import { Post } from '@/types/post';

export type RootStackParams = {
  Map: undefined;
  PostCreate: undefined;
  ChatCreate: undefined;
  PostPreview: { post: Post };
  ChatPreview: { chat: Chatroom };
  PostComments: { post: Post };
  ChatRoom: { chat: Chatroom };
  Auth: undefined;
  Settings: undefined;
};

export type AuthTabParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
