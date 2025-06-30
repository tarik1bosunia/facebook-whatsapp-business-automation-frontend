import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/lib/redux/services/conversationApi";
import { Message } from "@/types/conversation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { socketManager } from "./websoketService";

export default function useConversationMessages(conversationId?: string) {
  const {
    data: fetchedMessages,
    isLoading,
    isError,
  } = useGetMessagesQuery(conversationId!, {
    skip: !conversationId,
  });

  const messagesFromChatSlice = useSelector((state: RootState) =>
    conversationId ? state.chat.messages[conversationId] || [] : []
  );
  console.log("Messages from ChatSlice-> ", messagesFromChatSlice);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  console.log("fetchedMessages", fetchedMessages);
  console.log("conversationId", conversationId);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket once; it appends messages to allMessages
  // const { newMessages } = useWebSocketMessages();

  // Filter WebSocket messages for this conversation
  // const filteredNewMessages = useMemo(() => {
  //   return newMessages.filter((msg) => msg.conversation_id === conversationId);
  // }, [newMessages, conversationId]);

  // const allMessages = useMemo(() => {
  //     return [...(fetchedMessages || []), ...filteredNewMessages];
  //   }, [fetchedMessages, filteredNewMessages]);

  const mergedMessages: Message[] = useMemo(() => {
    if (!fetchedMessages) return messagesFromChatSlice;

    return [...(fetchedMessages || []), ...messagesFromChatSlice];
  }, [fetchedMessages, messagesFromChatSlice]);

  /* ======================== WEBSOCKET ================================ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages]);

  // TODO: I can completely remove it & sent message using websocket in future
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    const messageToSend = newMessage.trim();
    setNewMessage("");

    // TODO : send message using  websocket from here

    const message = {
      type: "new_message", // This should match what your server expects
      payload: {
        conversation_id: "your-conversation-id",
        text: "Hello, this is my message!",
        // Include any other required fields like:
        // media_id, media_url, media_type, contacts if needed
      },
    };
    socketManager.send(message);

    try {
      await sendMessage({
        conversation: Number(conversationId),
        message: messageToSend,
      }).unwrap();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return {
    isLoading,
    isError,
    isSending,
    messages: mergedMessages,
    newMessage,
    setNewMessage,
    messagesEndRef,
    handleSendMessage,
  };
}
