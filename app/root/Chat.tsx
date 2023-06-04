import ChatView from '@/components/ChatView';

export default function Chat() {
  return <ChatView chatEndpoint="/all" messagesEndpoint="/messages" />;
}
