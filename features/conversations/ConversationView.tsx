import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Send,
  Plus,
  MoreVertical,
  MessagesSquare,
  PackageOpen,
  MessageSquare,
  Facebook,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { formatDjangoDateTime } from "@/lib/utils";
import ToggleAutoReplyButton from "./ToggleAutoReply";
import { Conversation } from "@/types/conversation";
import useConversationMessages from "./hooks/useConversationMessages";
import ContactsMessage from "./ContactsMessage";


interface ConversationViewProps {
  conversation?: Conversation;
}

const ConversationView = ({ conversation }: ConversationViewProps) => {

  const conversationId = conversation?.id;
  const {
    isLoading, isError,
    isSending,
    messages,
    newMessage, setNewMessage,
    messagesEndRef,
    handleSendMessage
  } = useConversationMessages(conversationId)

  console.log("MESSEGES::", messages)

  const handleCreateOrder = () => {
    toast.success("Order created successfully");
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MessagesSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
        <p className="text-muted-foreground">
          Select a conversation from the list to view messages
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading messages...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load messages.
      </div>
    );
  }

  function getMediaComponent(mediaId?: string, mediaType?: string, mediaUrl?: string) {


  // If no media type or no media identifier at all, return null
  if (!mediaType || (!mediaId && !mediaUrl)) return null;

  // Determine the media URL
  const mediaURL = mediaUrl 
    ? mediaUrl 
    : mediaId
      ? `http://127.0.0.1:8000/api/messaging/media-proxy?media_id=${mediaId}`
      : null;

    if (!mediaURL) return null;  

    switch (mediaType) {
      case "image":
        return (
          <img
            src={mediaURL}
            alt="Image"
            className="rounded-lg max-h-64 object-contain"
          />
        );

      case "video":
        return (
          <video controls className="rounded-lg max-h-64 w-full">
            <source src={mediaURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
        return (
          <audio controls className="w-full mt-2">
            <source src={mediaURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );

      case "document":
        return (
          <a
            href={mediaURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-yellow-300 underline mt-2 block"
          >
            📄 Download Document
          </a>
        );

      default:
        return null;
    }
  }


  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center  max-h-screen overflow-y-scroll">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.customer.avatar} />
            <AvatarFallback>
              {conversation.customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              {conversation.customer.name}
              {conversation.channel === "facebook" ? (
                <Badge variant="outline" className="text-blue-600 bg-blue-50">
                  <Facebook className="h-3 w-3 mr-1" /> Facebook
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  <MessageSquare className="h-3 w-3 mr-1" /> WhatsApp
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last active {formatDjangoDateTime.toFullString(conversation.lastMessage?.time)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleAutoReplyButton id={conversation.id} currentAutoReply={conversation.auto_reply} />
          <Button variant="outline" size="sm" onClick={handleCreateOrder}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Create Order
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                View Customer Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PackageOpen className="h-4 w-4 mr-2" />
                View Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Mark as Spam
              </DropdownMenuItem>
              <DropdownMenuItem >
                <ToggleAutoReplyButton id={conversation.id} currentAutoReply={conversation.auto_reply} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 p-4 max-h-screen overflow-y-scroll space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"
              }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.sender === "customer"
                ? "bg-secondary text-secondary-foreground"
                : message.sender === "ai"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-primary text-primary-foreground"
                }`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center text-xs mb-1 gap-1 text-blue-600">
                  <MessageSquare className="h-3 w-3" />
                  AI Assistant
                </div>
              )}
              {
                getMediaComponent(message.media_id, message.media_type, message.media_url)
              }
              {message.contacts && <ContactsMessage contactsData={message.contacts} />}

              <p>{message.text}</p>
              <div className="text-xs opacity-70 text-right mt-1">

                {formatDjangoDateTime.toFullString(message.time)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
