"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ContactPage = () => {
  const { user, isLoaded } = useUser();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      setLoadingTickets(true);
      const response = await axios.get("/api/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/api/tickets", {
        ...formData,
        userEmail: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
        userName: user?.fullName || "Guest User",
      });
      
      toast.success("Ticket submitted successfully!");
      setFormData({ subject: "", message: "", priority: "medium" });
      
      if (user) {
        fetchUserTickets();
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "resolved":
      case "closed":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendReply = async (ticketId) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSendingReply(true);
    try {
      const response = await axios.post("/api/tickets/messages", {
        ticketId,
        message: replyMessage,
        senderName: user?.fullName || "User",
        isAdmin: false,
      });
      
      toast.success("Reply sent successfully!");
      
      // Update the tickets state with the new message
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                messages: [...(ticket.messages || []), response.data],
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );
      
      setReplyMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
      const errorMessage = error.response?.data?.error || "Failed to send reply";
      toast.error(errorMessage);
    } finally {
      setSendingReply(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-10 md:px-36 lg:px-48">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black font-orbitron mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg">We&apos;re here to help! Send us a message and we&apos;ll respond as soon as possible.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold font-orbitron">New Ticket</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full font-orbitron"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Ticket History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold font-orbitron">Your Tickets</h2>
            </div>

            {!isLoaded ? (
              <p className="text-gray-500">Loading...</p>
            ) : !user ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Sign in to view your ticket history</p>
              </div>
            ) : loadingTickets ? (
              <p className="text-gray-500">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tickets yet</p>
                <p className="text-sm text-gray-400">Submit a ticket to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      ticket.status === "closed" ? "opacity-75 bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket.id === selectedTicket ? null : ticket.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold line-clamp-1 flex items-center gap-2">
                        {ticket.subject}
                        {ticket.status === "closed" && (
                          <span className="text-xs text-gray-500">(Closed)</span>
                        )}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status.replace("_", " ")}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
                      {new Date(ticket.createdAt).toLocaleTimeString()}
                    </p>

                    {selectedTicket === ticket.id && (
                      <div 
                        className="mt-4 pt-4 border-t"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                          {ticket.messages && ticket.messages.length > 0 ? (
                            ticket.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.isAdmin
                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                    : "bg-gray-50 border-l-4 border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {msg.senderName}
                                    {msg.isAdmin && (
                                      <Badge className="ml-2 bg-blue-600 text-white text-xs">Admin</Badge>
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No messages yet</p>
                          )}
                        </div>

                        {/* Reply Section - Only show if ticket is not closed */}
                        {ticket.status !== "closed" && (
                          <div 
                            className="space-y-3 pt-3 border-t"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Reply to this ticket</span>
                            </div>
                            <Textarea
                              placeholder="Type your reply here..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendReply(ticket.id);
                              }}
                              disabled={sendingReply || !replyMessage.trim()}
                              size="sm"
                              className="w-full"
                            >
                              {sendingReply ? (
                                "Sending..."
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-2" />
                                  Send Reply
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Closed Ticket Message */}
                        {ticket.status === "closed" && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg text-center">
                            <p className="text-sm text-gray-600">
                              This ticket has been closed. You cannot reply to closed tickets.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
