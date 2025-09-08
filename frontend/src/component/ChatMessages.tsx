import type { User } from "../context/AppContext";
import type { Message } from "../chat/ChatApp";
import { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
}: ChatMessagesProps) => {
  // -- Set up the page when there is many messages
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Seen Feature ------
  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) {
        return false;
      }
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);
  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll custom-scroll">
        {!selectedUser ? (
          <p className="text-gray-400 text-center mt-20">
            Please select a user to start chatting 📩
          </p>
        ) : (
          <>
            {uniqueMessages.map((e, i) => {
              const isSentByMe = e.sender === loggedInUser?._id;
              const uniqueKey = `${e._id}-${i}`;
              return (
                <div
                  className={`flex flex-col gap-1 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                  key={uniqueKey}
                >
                  {/* Chat Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-sm shadow-md ${
                      isSentByMe
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {e.messageType === "image" && e.image && (
                      <div className="relative group">
                        <img
                          src={e.image.url}
                          alt="shared image"
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    {e.text && <p className="mt-1 text-sm">{e.text}</p>}
                  </div>

                  {/* Time + Seen */}
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      isSentByMe
                        ? "text-blue-400 pr-2 flex-row-reverse"
                        : "text-gray-400 pl-2"
                    }`}
                  >
                    <span>{moment(e.createdAt).format("hh:mm A · MMM D")}</span>
                    {isSentByMe && (
                      <div className="flex items-center ml-1">
                        {e.seen ? (
                          <div className="flex items-center gap-1 text-blue-400">
                            <CheckCheck className="w-3 h-3" />
                            {e.seenAt && (
                              <span>{moment(e.seenAt).format("hh:mm A")}</span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
