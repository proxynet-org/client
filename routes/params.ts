import { Chatroom } from '@/types/chatroom';
import { Publication } from '@/types/publications';

export type RootStackParams = {
  Auth: undefined;

  Chat: undefined;
  Map: undefined;

  PublicationCreate: undefined;
  PublicationPreview: { publication: Publication };
  PublicationComments: { publication: Publication };

  ChatCreate: undefined;
  ChatPreview: { chatroom: Chatroom };
  ChatRoom: { chatroom: Chatroom };

  Settings: undefined;
};

export type AuthTabParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
