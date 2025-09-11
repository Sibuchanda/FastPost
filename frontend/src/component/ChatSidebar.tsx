import { useState } from "react";
import type { User } from "../context/AppContext";
import {
  CornerDownRight,
  CornerUpLeft,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

const ChatSidebar = ({
  sidebarOpen,
  setShowAllUsers,
  setSidebarOpen,
  showAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  createChat,
  onlineUsers,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      {/* header */}
      <div className="p-6 border-b border-gray-200">
        <div className="sm:hidden flex justify-end mb-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="rounded-xl bg-white w-10 h-10 shadow-sm border border-gray-200"
              src="/appLogo.png"
              alt="App Logo"
            />
            <h2 className="text-xl font-bold text-gray-800">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>

          <button
            className={`p-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm ${
              showAllUsers
                ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            }`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden px-4 py-2 bg-gray-50">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            {/* search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Users..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* users list */}
            <div className="space-y-2 overflow-y-auto h-full pb-4 custom-scroll">
              {users
                ?.filter(
                  (u) =>
                    u._id !== loggedInUser?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((u) => (
                  <button
                    key={u._id}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                    onClick={() => createChat(u)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserCircle className="w-7 h-7 text-gray-500" />
                        {onlineUsers.includes(u._id) && (
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer">
                        <span className="font-medium text-gray-800">{u.name}</span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4 custom-scroll">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount || 0;

              if (!chat.user) return null;

              return (
                <button
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all shadow-sm ${
                    isSelected
                      ? "bg-blue-100 border border-blue-300"
                      : "border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircle className="w-7 h-7 text-gray-500" />
                      </div>
                      {onlineUsers.includes(chat.user._id) && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-semibold truncate ${
                            isSelected ? "text-gray-900" : "text-gray-800"
                          }`}
                        >
                          {chat.user.name}
                        </span>
                        {unseenCount > 0 && (
                          <div className="bg-green-500 text-white text-xs font-bold rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-2">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </div>
                        )}
                      </div>

                      {latestMessage && (
                        <div className="flex items-center gap-2">
                          {isSentByMe ? (
                            <CornerUpLeft size={14} className="text-blue-400 shrink-0" />
                          ) : (
                            <CornerDownRight size={14} className="text-green-400 shrink-0" />
                          )}
                          <span className="text-sm text-gray-500 truncate flex-1">
                            {latestMessage.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No conversation yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="p-4 border-t border-gray-200 space-y-2 bg-white">
        <Link
          to={"/profile"}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <UserCircle className="w-4 h-4 text-gray-600" />
          </div>
          <span className="font-medium text-gray-700">Profile</span>
        </Link>
      </div>
    </aside>
  );
};

export default ChatSidebar;
