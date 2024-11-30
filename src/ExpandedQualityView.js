import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function ExpandedQualityView({ selectedQuality, onClose, eventDate }) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [timeUntilEvent, setTimeUntilEvent] = useState(null);
  const [tickets, setTickets] = useState([
    { id: 1, gate: "A", row: "12", seat: "5", price: 10 },
    { id: 2, gate: "B", row: "15", seat: "8", price: 10 },
    { id: 3, gate: "C", row: "10", seat: "3", price: 10 },
    { id: 4, gate: "D", row: "18", seat: "7", price: 10 },
    { id: 5, gate: "E", row: "20", seat: "2", price: 10 },
  ]);
  const [bidInputs, setBidInputs] = useState({});
  const [currentUserId] = useState("user123"); // Mock current user ID

  // Calculate time until event
  useEffect(() => {
    const calculateTimeUntilEvent = () => {
      const now = new Date();
      const eventDateTime = new Date(eventDate);
      const timeDiff = eventDateTime - now;
      setTimeUntilEvent(timeDiff);
    };

    calculateTimeUntilEvent();

    const timer = setInterval(calculateTimeUntilEvent, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, [eventDate]);

  const isAuctionTime = timeUntilEvent !== null && timeUntilEvent <= 24 * 60 * 60 * 1000;

  // Update ticket prices when auction starts
  useEffect(() => {
    if (isAuctionTime) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => ({
          ...ticket,
          price: Math.max(ticket.price, 1), // Ensure price doesn't drop below $1
          currentBidder: ticket.currentBidder || null,
        }))
      );
    }
  }, [isAuctionTime]);

  // Handler for incrementing bid by $1
  const increaseBid = (ticketId) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            price: ticket.price + 1,
            currentBidder: currentUserId,
          };
        }
        return ticket;
      })
    );
  };

  // Handler for custom bid input
  const setCustomBid = (ticketId) => {
    const bidAmount = bidInputs[ticketId];
    const bid = parseFloat(bidAmount);
    const ticket = tickets.find((t) => t.id === ticketId);

    if (isNaN(bid) || bid <= ticket.price) {
      Alert.alert("Invalid Bid", "Please enter a bid higher than the current price.");
      return;
    }

    setTickets((prevTickets) =>
      prevTickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            price: bid,
            currentBidder: currentUserId,
          };
        }
        return t;
      })
    );
    // Clear the input
    setBidInputs((prev) => ({ ...prev, [ticketId]: "" }));
    Keyboard.dismiss();
  };

  // Handler for bid input change
  const handleBidInputChange = (ticketId, text) => {
    setBidInputs((prev) => ({ ...prev, [ticketId]: text }));
  };

  // Handler for completing purchase
  const handlePurchase = () => {
    if (selectedTicketId) {
      const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);
      if (!isAuctionTime || selectedTicket.currentBidder === currentUserId) {
        Alert.alert(
          "Purchase Confirmation",
          `You have purchased Seat ${selectedTicket.seat} in Row ${selectedTicket.row}, Gate ${selectedTicket.gate} for $${selectedTicket.price}.`,
          [{ text: "OK", onPress: () => {} }]
        );
        // Here, you can add navigation or other purchase logic
      } else {
        Alert.alert(
          "Cannot Purchase",
          "You are not the highest bidder for this ticket.",
          [{ text: "OK", onPress: () => {} }]
        );
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <BlurView intensity={80} tint="dark" style={styles.expandedQuality}>
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Quality Title */}
        <Text style={styles.expandedQualityTitle}>{selectedQuality} Quality Tickets</Text>

        {/* Tickets List */}
        <ScrollView contentContainerStyle={styles.ticketsContainer}>
          {tickets.map((ticket) => (
            <View
              key={ticket.id}
              style={[
                styles.ticket,
                selectedTicketId === ticket.id && styles.selectedTicket,
                ticket.currentBidder === currentUserId && styles.currentUserBid,
              ]}
            >
              {/* Ticket Details */}
              <TouchableOpacity
                onPress={() => setSelectedTicketId(ticket.id)}
                style={styles.ticketInfo}
              >
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>
                    Seat {ticket.seat}, Row {ticket.row}
                  </Text>
                  <Text style={styles.ticketPrice}>${ticket.price.toFixed(2)}</Text>
                </View>
                <View style={styles.ticketSubInfo}>
                  <Text style={styles.ticketGate}>Gate {ticket.gate}</Text>
                  {ticket.currentBidder === currentUserId && (
                    <View style={styles.highestBidderTag}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.highestBidderText}>Highest Bidder</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Auction Controls */}
              {isAuctionTime && (
                <View style={styles.auctionControls}>
                  {/* $1 Bid Button */}
                  <TouchableOpacity
                    onPress={() => increaseBid(ticket.id)}
                    style={styles.bidButton}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text style={styles.bidButtonText}>Bid +$1</Text>
                  </TouchableOpacity>
                  {/* Custom Bid Input and Place Bid Button */}
                  <View style={styles.bidInputContainer}>
                    <TextInput
                      style={styles.bidInput}
                      keyboardType="numeric"
                      placeholder="Enter Amount"
                      placeholderTextColor="#8e8e93"
                      value={bidInputs[ticket.id] || ""}
                      onChangeText={(text) => handleBidInputChange(ticket.id, text)}
                    />
                    <TouchableOpacity
                      onPress={() => setCustomBid(ticket.id)}
                      style={styles.placeBidButton}
                    >
                      <Text style={styles.placeBidButtonText}>Place Bid</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Complete Purchase Button */}
        {selectedTicketId && (
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <Text style={styles.purchaseButtonText}>Complete Purchase</Text>
          </TouchableOpacity>
        )}
      </BlurView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  expandedQuality: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  expandedQualityTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  ticketsContainer: {
    paddingVertical: 10,
  },
  ticket: {
    backgroundColor: "rgba(28, 28, 30, 0.85)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedTicket: {
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  currentUserBid: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
  },
  ticketInfo: {
    marginBottom: 10,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  ticketPrice: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "700",
  },
  ticketSubInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ticketGate: {
    color: "#aaa",
    fontSize: 14,
    marginRight: 10,
  },
  highestBidderTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highestBidderText: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: 5,
  },
  auctionControls: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 10,
  },
  bidButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e", // Darker background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bidButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  bidInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bidInput: {
    flex: 1,
    backgroundColor: "#1c1c1e", // Apple's dark gray
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "white",
    marginRight: 10,
  },
  placeBidButton: {
    backgroundColor: "#2c2c2e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  placeBidButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  purchaseButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  purchaseButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});