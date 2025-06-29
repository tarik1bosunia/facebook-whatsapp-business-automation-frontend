import { useAppSelector } from '@/lib/redux/hooks/reduxHooks';

export default function NotificationBadge() {
  const unreadCount = useAppSelector(state => 
    state.chat.notifications.filter(n => !n.read).length
  );

  if (unreadCount === 0) return null;

  return (
    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}