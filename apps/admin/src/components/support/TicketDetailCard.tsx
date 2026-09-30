// Add the "use client" directive at the top of the file
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// TicketDetailCard component to render ticket details passed as props
const TicketDetailCard = ({ ticket }: { ticket: any }) => {
  return (
    <div>
      <h1>{ticket.subject}</h1>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Created at: {new Date(ticket.created_at).toLocaleDateString()}</p>
      <p>Description: {ticket.description}</p>
      <p>Assigned to: {ticket.assigned_to_details?.username || "Unassigned"}</p>
    </div>
  );
};

export default TicketDetailCard;
