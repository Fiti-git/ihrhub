interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  user: {
    username: string;
    email: string;
  } | null;  // Make sure the user is nullable
  reference_object: {
    job_title: string;
    department: string;
    job_status: string;
  };
  assigned_to_details: {
    username: string;
  } | null;
  created_at: string;
}

interface TicketDetailsSectionProps {
  ticket: Ticket;
}

const TicketDetailsSection = ({ ticket }: TicketDetailsSectionProps) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!ticket) return <div>Loading...</div>;

  // Check if user data is available
  const user = ticket.user || { username: "Unknown", email: "Not provided" };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
      <div>
        <strong>Customer:</strong> {user.username} {/* Fallback for undefined user */}
      </div>
      <div>
        <strong>Email:</strong> {user.email} {/* Fallback for undefined user */}
      </div>
      <div>
        <strong>Ticket ID:</strong> #{ticket.id}
      </div>
      <div>
        <strong>Category:</strong> {ticket.reference_object?.job_title || "Not Available"}
      </div>
      <div>
        <strong>Created:</strong> {formatDate(ticket.created_at)}
      </div>
      <div>
        <strong>Status:</strong>
        <span
          className={`ml-2 text-sm ${
            ticket.status === "open" ? "text-blue-500" : "text-green-500"
          }`}
        >
          {ticket.status}
        </span>
      </div>
      <div>
        <strong>Assigned To:</strong> {ticket.assigned_to_details?.username || "Unassigned"}
      </div>
    </div>
  );
};

export default TicketDetailsSection;
