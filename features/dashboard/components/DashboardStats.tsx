
import {
  MessageSquare,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown,
  Facebook,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

interface ChannelCardProps {
  title: string;
  conversations: number;
  responseMins: number;
  conversionRate: number;
  icon: React.ReactNode;
  gradient: string;
}

export const statCards: StatCardProps[] = [
  {
    title: "Total Conversations",
    value: "1,259",
    change: 12,
    trend: "up",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-blue-500"
  },
  {
    title: "New Customers",
    value: "324",
    change: 8,
    trend: "up",
    icon: <Users className="h-5 w-5" />,
    color: "bg-indigo-500"
  },
  {
    title: "Total Orders",
    value: "842",
    change: 5,
    trend: "up",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "bg-green-500"
  },
  {
    title: "Response Rate",
    value: "94%",
    change: 2,
    trend: "down",
    icon: <Send className="h-5 w-5" />,
    color: "bg-amber-500"
  }
];


export const channelCards: ChannelCardProps[] = [
  {
    title: "Facebook Messenger",
    conversations: 756,
    responseMins: 3.2,
    conversionRate: 8.4,
    icon: <Facebook className="h-6 w-6 text-blue-600" />,
    gradient: "from-blue-50 to-blue-100 border-blue-200"
  },
  {
    title: "WhatsApp Business",
    conversations: 503,
    responseMins: 4.5,
    conversionRate: 9.2,
    icon: <MessageSquare className="h-6 w-6 text-green-600" />,
    gradient: "from-green-50 to-green-100 border-green-200"
  }
];



const DashboardStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {
        statCards.map((statCard, idx) => (
          <StatCard
            key={idx}
            {...statCard}
          />
        ))
      }

      <Card className="col-span-full shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">

            {channelCards.map((channel, idx) => (
              <ChannelCard key={idx} {...channel} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => {
  return (
    <Card className="shadow-md overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-full p-2 ${color} bg-opacity-10`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs flex items-center mt-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{change}% from last month</span>
        </p>
      </CardContent>
    </Card>
  );
};



const ChannelCard = ({ title, conversations, responseMins, conversionRate, icon, gradient }: ChannelCardProps) => {
  return (
    <div className={`border rounded-lg p-5 shadow-sm bg-gradient-to-r ${gradient}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-white p-2 rounded-full shadow-sm">
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white bg-opacity-70 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Chats</p>
          <p className="font-bold text-lg">{conversations}</p>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Avg. Response</p>
          <p className="font-bold text-lg">{responseMins}m</p>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Conversion</p>
          <p className="font-bold text-lg">{conversionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
