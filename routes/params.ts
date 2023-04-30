import { Chatroom } from '@/types/chatroom';
import { Publication } from '@/types/publications';

export type RootStackParams = {
  Auth: undefined;

  Chat: undefined;
  Map: undefined;

  PostCreate: undefined;
  PostPreview: { post: Publication };
  PostComments: { post: Publication };

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
