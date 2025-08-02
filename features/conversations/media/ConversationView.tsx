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
  Download,
  Play,
  Pause,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { formatDjangoDateTime } from "@/lib/utils";
import ToggleAutoReplyButton from "./ToggleAutoReplyButton";
import { Conversation } from "@/types/conversation";
import useConversationMessages from "@/features/conversations/hooks/useConversationMessages";
import ContactsMessage from "./ContactsMessage";
import MediaAttachmentMenu from "./MediaAttachmentMenu";
import { API_BASE_URL } from "@/constants";

interface ConversationViewProps {
  conversation?: Conversation;
}

const ConversationView = ({ conversation }: ConversationViewProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const conversationId = conversation?.id;
  const {
    isLoading,
    isError,
    messages,
    newMessage,
    setNewMessage,
    messagesEndRef,
    handleSendMessage
  } = useConversationMessages(conversationId);

  console.log("MESSAGES::", messages);

  const handleCreateOrder = () => {
    toast.success("Order created successfully");
  };

  const handleAudioPlay = (messageId: string) => {
    setPlayingAudio(playingAudio === messageId ? null : messageId);
  };

  const handleSendMessageWithTyping = async () => {
    if (!newMessage.trim()) return;
    
    setIsTyping(true);
    try {
      await handleSendMessage();
    } finally {
      setIsTyping(false);
    }
  };

  const handleAttachmentSelect = (type: string, data?: any) => {
    console.log("Selected attachment type:", type, data);
    
    if (data) {
      // Here you would typically send the media data to your backend
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ready to send`);
      
      // For now, just log the data for demonstration
      if (type === "contact") {
        console.log("Contact data:", data);
      } else if (type === "audio") {
        console.log("Audio data:", { duration: data.duration, type: data.type });
      } else if (type === "camera" || type === "photo" || type === "video" || type === "document") {
        console.log("File data:", { name: data.name, size: data.size, type: data.type });
      }
    } else {
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} attachment selected`);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Conversation Selected</h3>
            <p className="text-gray-500">Select a conversation from the list to view messages</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="text-gray-600">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-red-50">
        <div className="text-center space-y-2">
          <div className="text-red-600 font-semibold">Failed to load messages</div>
          <p className="text-red-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  function getMediaComponent(mediaId?: string, mediaType?: string, mediaUrl?: string) {
    if (!mediaType || (!mediaId && !mediaUrl)) return null;

    const mediaURL = mediaUrl 
      ? mediaUrl 
      : mediaId
        ? `${API_BASE_URL}/api/messaging/media-proxy?media_id=${mediaId}`
        : null;

    if (!mediaURL) return null;

    switch (mediaType) {
      case "image":
        return (
          <div className="relative max-w-xs">
            <img
              src={mediaURL}
              alt="Shared image"
              className="rounded-lg shadow-sm max-w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(mediaURL, '_blank')}
            />
          </div>
        );

      case "video":
        return (
          <div className="relative max-w-xs">
            <video
              controls
              className="rounded-lg shadow-sm max-w-full h-auto"
              preload="metadata"
            >
              <source src={mediaURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <Button
              size="sm"
              variant="ghost"
              className="p-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleAudioPlay(mediaId || mediaURL)}
            >
              {playingAudio === (mediaId || mediaURL) ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </Button>
            <audio
              src={mediaURL}
              className="hidden"
              onEnded={() => setPlayingAudio(null)}
              ref={(audio) => {
                if (audio && playingAudio === (mediaId || mediaURL)) {
                  audio.play();
                } else if (audio) {
                  audio.pause();
                }
              }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Voice Message</div>
              <div className="text-xs text-gray-500">Click to play</div>
            </div>
          </div>
        );

      case "document":
        return (
          <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs hover:bg-blue-100 transition-colors cursor-pointer"
               onClick={() => window.open(mediaURL, '_blank')}>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-700">Document</div>
              <div className="text-xs text-blue-500">Click to download</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  function ContactCard({ contact }: { contact: any }) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {contact.name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{contact.name || 'Unknown Contact'}</div>
            <div className="text-sm text-gray-500">Contact</div>
          </div>
        </div>
        
        {contact.phones?.length > 0 && (
          <div className="space-y-1 mb-2">
            {contact.phones.map((phone: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{phone.phone}</span>
                {phone.type && (
                  <Badge variant="outline" className="text-xs">{phone.type}</Badge>
                )}
              </div>
            ))}
          </div>
        )}
        
        {contact.emails?.length > 0 && (
          <div className="space-y-1">
            {contact.emails.map((email: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Mail className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{email.email}</span>
                {email.type && (
                  <Badge variant="outline" className="text-xs">{email.type}</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation.customer.avatar} />
            <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
              {conversation.customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.customer.name}</h2>
            <div className="flex items-center space-x-2">
              {conversation.channel === "facebook" ? (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Facebook className="w-3 h-3 mr-1" />
                  Facebook
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  WhatsApp
                </Badge>
              )}
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Last active {formatDjangoDateTime.toFullString(conversation.lastMessage?.time)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleCreateOrder} 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Create Order
          </Button>
          <ToggleAutoReplyButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                View Customer Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PackageOpen className="w-4 h-4 mr-2" />
                View Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Mark as Spam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "business" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end space-x-2 max-w-[70%]">
              {message.sender !== "business" && (
                <Avatar className="w-8 h-8 mb-1">
                  {message.sender === "ai" ? (
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                      AI
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                      {conversation.customer.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div
                className={`rounded-2xl px-4 py-2 shadow-sm ${
                  message.sender === "business"
                    ? "bg-green-600 text-white rounded-br-md"
                    : message.sender === "ai"
                    ? "bg-purple-100 text-purple-900 rounded-bl-md border border-purple-200"
                    : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="text-xs font-medium mb-1 text-purple-600">
                    AI Assistant
                  </div>
                )}
                
                <div className="space-y-2">
                  {getMediaComponent(message.media_id, message.media_type, message.media_url)}
                  
                  {message.contacts && message.contacts.length > 0 && (
                    <div className="space-y-2">
                      {message.contacts.map((contact, index) => (
                        <ContactCard key={index} contact={contact} />
                      ))}
                    </div>
                  )}
                  
                  {message.text && (
                    <div className="whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                  )}
                </div>
                
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "business"
                      ? "text-green-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatDjangoDateTime.toFullString(message.time)}
                </div>
              </div>
              
              {message.sender === "business" && (
                <Avatar className="w-8 h-8 mb-1">
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">Sending...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end space-x-3">
          <MediaAttachmentMenu onAttachmentSelect={handleAttachmentSelect} />
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessageWithTyping();
                }
              }}
              className="rounded-full border-gray-300 pr-12 py-3 resize-none min-h-[44px] focus:ring-green-600 focus:border-green-600"
              disabled={isTyping}
            />
          </div>
          
          <Button
            onClick={handleSendMessageWithTyping}
            disabled={!newMessage.trim() || isTyping}
            className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;