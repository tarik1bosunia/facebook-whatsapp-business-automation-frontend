
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

const ToggleAutoReplyButton = () => {
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);

  const toggleAutoReply = () => {
    setIsAutoReplyEnabled(!isAutoReplyEnabled);
  };

  return (
    <Button 
      onClick={toggleAutoReply}
      variant={isAutoReplyEnabled ? "default" : "outline"}
      size="sm"
      className={isAutoReplyEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
    >
      <Bot className="w-4 h-4 mr-2" />
      {isAutoReplyEnabled ? (
        <Badge variant="secondary" className="ml-1">ON</Badge>
      ) : (
        "Auto Reply"
      )}
    </Button>
  );
};

export default ToggleAutoReplyButton;