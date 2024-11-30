import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // For picking ticket URI (image)

export default function ExpandedPostView({ onClose }) {
  const [gate, setGate] = useState("");
  const [row, setRow] = useState("");
  const [seat, setSeat] = useState("");
  const [price, setPrice] = useState("");
  const [auctionEnabled, setAuctionEnabled] = useState(false);
  const [startingPrice, setStartingPrice] = useState("");
  const [ticketUri, setTicketUri] = useState(null);

  // Handler for picking ticket URI (image)
  const pickTicketUri = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setTicketUri(result.uri);
    }
  };

  // Handler for submitting the ticket
  const handleSubmit = () => {
    if (!gate || !row || !seat || !price || !ticketUri) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    if (auctionEnabled && !startingPrice) {
      Alert.alert("Missing Starting Price", "Please enter a starting price for the auction.");
      return;
    }

    // Prepare the ticket data
    const ticketData = {
      gate,
      row,
      seat,
      price: parseFloat(price),
      auctionEnabled,
      startingPrice: auctionEnabled ? parseFloat(startingPrice) : null,
      ticketUri,
    };

    // Here, you would typically send this data to your backend or proceed with further actions
    console.log("Ticket Data:", ticketData);

    Alert.alert("Ticket Posted", "Your ticket has been posted successfully!", [
      { text: "OK", onPress: onClose },
    ]);
  };

  return (
    <BlurView intensity={80} tint="dark" style={styles.expandedPostView}>
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post a Ticket</Text>

        {/* Gate Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gate</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Gate"
            placeholderTextColor="#8e8e93"
            value={gate}
            onChangeText={setGate}
          />
        </View>

        {/* Row Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Row</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Row"
            placeholderTextColor="#8e8e93"
            value={row}
            onChangeText={setRow}
          />
        </View>

        {/* Seat Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Seat #</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Seat Number"
            placeholderTextColor="#8e8e93"
            value={seat}
            onChangeText={setSeat}
          />
        </View>

        {/* Price Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            placeholderTextColor="#8e8e93"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Auction Toggle */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Auction within 24 hours</Text>
          <Switch
            value={auctionEnabled}
            onValueChange={setAuctionEnabled}
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={auctionEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Starting Price Input */}
        {auctionEnabled && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Starting Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Starting Price"
              placeholderTextColor="#8e8e93"
              keyboardType="numeric"
              value={startingPrice}
              onChangeText={setStartingPrice}
            />
          </View>
        )}

        {/* Ticket URI Picker */}
        <TouchableOpacity style={styles.uriPicker} onPress={pickTicketUri}>
          <Ionicons name="image-outline" size={24} color="white" />
          <Text style={styles.uriPickerText}>
            {ticketUri ? "Ticket Image Selected" : "Add Ticket Image"}
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  expandedPostView: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  container: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "System",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#8e8e93",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  uriPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  uriPickerText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});