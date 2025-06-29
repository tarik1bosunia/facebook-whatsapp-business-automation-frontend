
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquare, Package, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const RecentActivity = () => {
  return (
    <Card className="col-span-full shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          <ActivityItem
            type="conversation"
            title="New conversation from Sarah Wilson"
            time="10 minutes ago"
            description="Asked about product return policy"
            source="Facebook"
          />
          <ActivityItem
            type="order"
            title="New order #1234 received"
            time="45 minutes ago"
            description="2 items: Blue T-shirt, Black Jeans - $89.97"
            source="WhatsApp"
          />
          <ActivityItem
            type="faq"
            title="FAQ updated: Shipping Policy"
            time="2 hours ago"
            description="Admin Jane Doe updated the shipping policy FAQ"
          />
          <ActivityItem
            type="conversation"
            title="New conversation from Mike Peterson"
            time="3 hours ago"
            description="Asked about product availability"
            source="Facebook"
          />
          <ActivityItem
            type="order"
            title="New order #1233 received"
            time="5 hours ago"
            description="1 item: Red Dress - $49.99"
            source="WhatsApp"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  type: "conversation" | "order" | "faq";
  title: string;
  time: string;
  description: string;
  source?: "Facebook" | "WhatsApp";
}

const ActivityItem = ({ type, title, time, description, source }: ActivityItemProps) => {
  const getIcon = () => {
    switch (type) {
      case "conversation":
        return <MessageSquare className="h-10 w-10 p-2 bg-blue-100 text-blue-700 rounded-full" />;
      case "order":
        return <Package className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full" />;
      case "faq":
        return <FileText className="h-10 w-10 p-2 bg-amber-100 text-amber-700 rounded-full" />;
    }
  };

  const getSourceBadge = () => {
    if (!source) return null;
    
    return (
      <Badge variant="outline" className={source === "Facebook" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
        {source}
      </Badge>
    );
  };

  return (
    <div className="flex gap-5 p-5 hover:bg-slate-50 transition-colors">
      {getIcon()}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <h4 className="font-medium text-base">{title}</h4>
          <div className="flex items-center gap-2">
            {getSourceBadge()}
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

export default RecentActivity;
