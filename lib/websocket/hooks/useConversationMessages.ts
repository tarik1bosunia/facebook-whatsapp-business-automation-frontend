import { useEffect, useMemo } from "react";
import { useGetMessagesQuery } from "@/lib/redux/services/conversationApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { 
  setActiveConversation, 
  clearConversationNotifications 
} from "../../redux/features/chatSlice";

export default function useConversationMessages(conversationId?: string) {
  const dispatch = useAppDispatch();
  
  // Get messages from API
  const { 
    data: apiMessages, 
    isLoading, 
    isError,
    refetch
  } = useGetMessagesQuery(conversationId!, {
    skip: !conversationId,
  });
  
  // Get real-time messages from Redux
  const realTimeMessages = useAppSelector(state => 
    conversationId ? state.chat.messages[conversationId] || [] : []
  );
  
  // Combine API messages with real-time updates
  const messages = useMemo(() => {
    const apiMessageIds = new Set(apiMessages?.map(m => m.id) || []);
    const filteredRTMessages = realTimeMessages.filter(
      msg => !apiMessageIds.has(msg.id)
    );
    return [...(apiMessages || []), ...filteredRTMessages];
  }, [apiMessages, realTimeMessages]);
  
  // Set active conversation
  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
      dispatch(clearConversationNotifications(conversationId));
    }
    
    return () => {
      dispatch(setActiveConversation(null));
    };
  }, [conversationId, dispatch]);
  
  return {
    isLoading,
    isError,
    messages,
    refetch
  };
}