
import { useState } from "react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { markNotificationRead } from "@/lib/redux/slices/chatSlice";

import { RoleLabels } from '@/types/role'
import { UserProfile } from "@/types/user";

import useLogout from '@/lib/hooks/use-logout'
import { cn } from "@/lib/utils/twMerge";

interface HeaderProps {
  user: UserProfile
  businessName?: string;
}

const Header = ({ user, businessName = "ConvoBiz Pilot" }: HeaderProps) => {
  const { handleLogout, isLoading } = useLogout()

  // const [notifications] = useState(5);
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(state => state.chat.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    dispatch(markNotificationRead(id));
    // setIsOpen(false);
    // Add navigation logic here
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        dispatch(markNotificationRead(notification.id));
      }
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 px-4 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between">
      <div className="md:hidden">
        <h2 className="font-bold text-lg text-brand-600">{businessName}</h2>
      </div>

      <div className="hidden md:block">
        <h2 className="text-lg font-medium">{businessName}</h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="max-h-80 overflow-y-auto">
              {
                notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No notifications
                  </div>) :
                  notifications.map((notification, index) => (
                    <NotificationItem
                      key={index}
                      title={notification.title}
                      description={notification.content}
                      time={notification.timestamp}
                    />
                  ))


              }

              {/* <NotificationItem
                title="New message from John Doe"
                description="Hey, when will my order be ready?"
                time="5 minutes ago"
              />
              <NotificationItem
                title="New order received"
                description="Order #1234 has been placed"
                time="10 minutes ago"
              />
              <NotificationItem
                title="FAQ update required"
                description="Please review and update the shipping FAQ"
                time="1 hour ago"
              /> */}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center font-medium">
              View all notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer justify-center font-medium">

              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar ?? `https://i.pravatar.cc/150?u=${user?.email || 'default'}`}
                  alt={user?.first_name ?? 'User'}
                />
                <AvatarFallback className="bg-brand-100 text-brand-700">
                  {user.first_name?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.first_name ?? 'first name'}{user?.last_name ?? 'last name'}
                  </p>
    
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {RoleLabels[user.role]}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-red-500">


                <LogOut className="mr-2 h-4 w-4" />

                <span className="ml-2">Logout</span>
   
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
}

const NotificationItem = ({ title, description, time }: NotificationItemProps) => {
  return (
    <div className="px-4 py-3 hover:bg-muted/50 cursor-pointer">
      <div className="flex justify-between">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {description}
      </p>
    </div>
  );
};

export default Header;
