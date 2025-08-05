import { useEffect, useState } from "react";
import { useAppData, type User } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../verify/Loading";
import ChatSidebar from "../component/ChatSidebar";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const ChatApp = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();
  const navigateTo = useNavigate();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (!isAuth && !loading) {
      navigateTo("/login");
    }
  }, [isAuth, navigateTo, loading]);

  const handleLogout = () => logoutUser();

  if (loading) return <Loading />;
  return (
    <>
      <ChatSidebar
        sidebarOpen={siderbarOpen}
        setSidebarOpen={setSiderbarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default ChatApp;
