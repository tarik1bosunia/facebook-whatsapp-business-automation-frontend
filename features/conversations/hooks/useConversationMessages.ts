import {
  useGetMessagesQuery,
} from "@/lib/redux/services/conversationApi";
import { Message } from "@/types/conversation";
import { useEffect, useMemo, useRef, useState } from "react";
import { addMessage, addMessages, selectAllMessages } from "../../../lib/redux/features/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { socketManager } from "@/lib/websocket/websocketManager";

export default function useConversationMessages(conversationId?: string) {
  const {
    data: fetchedMessages = [],
    isLoading,
    isError,
  } = useGetMessagesQuery(conversationId!, {
    skip: !conversationId,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (conversationId && fetchedMessages.length > 0) {
      dispatch(addMessages({ conversationId, messages: fetchedMessages }));
    }
  }, [conversationId, fetchedMessages, dispatch]);

  const messagesFromChatSlice = useAppSelector(selectAllMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Create WebSocket message
    const wsMessage = {
      type: "new_message",
      payload: {
        conversation_id: Number(conversationId),
        text: messageToSend,
        time: new Date().toISOString(),
        // Include any additional fields your backend expects
        // media_id: null,
        // media_url: null,
        // media_type: null,
        // contacts: [],
      },
    };

    socketManager.send(wsMessage);

    dispatch(addMessage({conversationId, message: {
      id: `ws-${Date.now()}`,
      text: messageToSend,
      time: `${Date.now()}`,
      sender: "business"
    }}))

  };

  return {
    isLoading,
    isError,
    messages: messagesFromChatSlice,
    newMessage,
    setNewMessage,
    messagesEndRef,
    handleSendMessage,
  };
}
