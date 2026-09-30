interface Message {
  sender: string;
  message: string;
  sender_id: number;
  timestamp: string;
}

interface TicketReplySectionProps {
  messages: Message[];
}

const TicketReplySection = ({ messages }: TicketReplySectionProps) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
      {/* Fixed Header */}
      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      {/* Messages Area: Scrollable with fixed height */}
      <div className="flex-1 overflow-y-auto mb-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs rounded-lg p-4 shadow-md ${
                  msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <p className="font-semibold">{msg.sender === "user" ? "User" : "Support"}:</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Input Section */}
      <div className="p-4 bg-gray-100 border-t">
        <textarea
          className="w-full h-24 p-2 border rounded-md resize-none"
          placeholder="Type your reply here..."
        />
        <button className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md">
          Reply
        </button>
      </div>
    </div>
  );
};

export default TicketReplySection;
