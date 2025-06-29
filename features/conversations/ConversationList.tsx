
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Facebook, MessageSquare } from "lucide-react";
import { formatDjangoDateTime } from "@/lib/utils";

import { Conversation } from "@/types/conversation";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState<"all" | "facebook" | "whatsapp">("all");

  const filteredConversations = conversations.filter(
    (conversation) =>
      (filterChannel === "all" || conversation.channel === filterChannel) &&
      conversation.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterChannel === "all" ? "default" : "outline"}
            onClick={() => setFilterChannel("all")}
            className="flex-1"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filterChannel === "facebook" ? "default" : "outline"}
            onClick={() => setFilterChannel("facebook")}
            className="flex-1 text-blue-600"
          >
            <Facebook className="h-4 w-4 mr-1" />
            Facebook
          </Button>
          <Button
            size="sm"
            variant={filterChannel === "whatsapp" ? "default" : "outline"}
            onClick={() => setFilterChannel("whatsapp")}
            className="flex-1 text-green-600"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No conversations found</p>
            {(searchTerm || filterChannel !== "all") && (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterChannel("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              onSelect={() => onSelectConversation(conversation)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

const ConversationItem = ({ conversation, isSelected, onSelect }: ConversationItemProps) => {
  return (
    <div
      className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
        isSelected ? "bg-primary/10" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={conversation.customer.avatar} />
            <AvatarFallback>
              {conversation.customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {conversation.channel === "facebook" ? (
            <Badge className="absolute -bottom-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-500">
              <Facebook className="h-3 w-3" />
            </Badge>
          ) : (
            <Badge className="absolute -bottom-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-500">
              <MessageSquare className="h-3 w-3" />
            </Badge>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className="font-medium truncate">{conversation.customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDjangoDateTime.toFullString(conversation?.lastMessage.time)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              {conversation.lastMessage.text}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
