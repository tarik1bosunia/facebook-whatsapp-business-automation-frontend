'use client'


import { useState } from "react";
import ConversationList from "@/features/conversations/ConversationList";
import ConversationView from "@/features/conversations/ConversationView";
import { useGetConversationsQuery } from "@/lib/redux/services/conversationApi";
import { Conversation } from "@/types/conversation";

export default function ConversationsPage() {
  const { data: conversations, isLoading, isError } = useGetConversationsQuery();
  console.log("conversations", conversations)
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };
  
  if (isLoading) return <div>Loading conversations...</div>;
  if (isError || !conversations) return <div>Error fetching conversations</div>;

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="grid md:grid-cols-[350px_1fr] h-full">
        <ConversationList 
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
        <ConversationView conversation={selectedConversation} />
      </div>
    </div>
  );
};

