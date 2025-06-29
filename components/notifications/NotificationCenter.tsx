'use client'

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks/reduxHooks';
import { markNotificationRead } from '@/lib/redux/slices/chatSlice';
import { FiBell, FiX } from 'react-icons/fi';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.chat.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    dispatch(markNotificationRead(id));
    setIsOpen(false);
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <FiBell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-gray-50' : 'bg-white'
                    }`}
                >
                  <div className="flex items-start">
                    {!notification.read && (
                      <div className="mt-1.5 mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {notification.meta?.priority === 'high' && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}