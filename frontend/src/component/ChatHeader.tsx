import { Menu, UserCircle } from 'lucide-react'
import type { User } from '../context/AppContext';


interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}


const ChatHeader = ({user, setSidebarOpen, isTyping, onlineUsers}:ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
return (
    <>
      {/* Mobile toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg hover:opacity-90 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                  <UserCircle className="w-8 h-8 text-gray-500" />
                </div>
                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-70"></span>
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{user.name}</h2>
                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-blue-500 font-medium">typing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isOnlineUser ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      <span
                        className={`font-medium ${
                          isOnlineUser ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {isOnlineUser ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                <UserCircle className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-600">Select a conversation</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;