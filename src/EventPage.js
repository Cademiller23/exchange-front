import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import ExpandedQualityView from "./ExpandedQualityView"; // Adjust the path as necessary
import ExpandedPostView from "./ExpandedPostView";

export default function EventPage({ route }) {
  const { event } = route.params;
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedQuality, setSelectedQuality] = useState(null); // Track selected quality
  const [isPosting, setIsPosting] = useState(false); // State to manage ExpandedPostView
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  return (
    <ImageBackground
      source={typeof event.image === "string" ? { uri: event.image } : event.image}
      style={styles.container}
    >
      {/* Top Buttons */}
      <View style={styles.topPart}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{"< Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={() => setIsPosting(true)}>
          <Text style={styles.postButtonText}>{"Post"}</Text>
        </TouchableOpacity>
      </View>

      {/* Countdown Timer */}
      {!selectedQuality && !isPosting && (
        <BlurView intensity={50} tint="dark" style={styles.countdown}>
          <Text style={styles.countdownTitle}>Time Left Until Event:</Text>
          <Text style={styles.countdownText}>
            {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          </Text>
        </BlurView>
      )}

      {/* Expanded Quality or Regular Layout */}
      {isPosting ? (
        <ExpandedPostView onClose={() => setIsPosting(false)} />
      ) : selectedQuality ? (
        <ExpandedQualityView selectedQuality={selectedQuality} onClose={() => setSelectedQuality(null)} eventDate={event.date}/>
      ) : (
        <>
          {/* Ticket Options */}
          <View style={styles.ticketOptions}>
            {["Low", "Medium", "High"].map((quality, index) => (
              <TouchableOpacity
                key={quality}
                onPress={() => setSelectedQuality(quality)}
                style={styles.ticketTouchable}
              >
                <BlurView
                  intensity={40}
                  tint="dark"
                  style={[
                    styles.ticketQuality,
                    {
                      marginLeft: index === 0 ? 0 : 10,
                      width: screenWidth / 3.5,
                    },
                  ]}
                >
                  {/* Ticket Details */}
                  <Text style={styles.qualityText}>{quality} Quality</Text>
                  <Text style={styles.priceText}>
                    ${quality === "Low" ? "10" : quality === "Medium" ? "20" : "30"}
                  </Text>

                  {/* Gate and Row (Side by Side) */}
                  <View style={styles.horizontalDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.ticketLabel}>Gate</Text>
                      <Text style={styles.ticketValue}>5</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.ticketLabel}>Row</Text>
                      <Text style={styles.ticketValue}>5</Text>
                    </View>
                  </View>

                  {/* Seat (Below Gate and Row) */}
                  <View style={styles.detailItem}>
                    <Text style={styles.ticketLabel}>Seat</Text>
                    <Text style={styles.ticketValue}>5</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Event Details Section */}
          <BlurView intensity={50} tint="dark" style={styles.eventDetails}>
            <Text style={styles.detailsTitle}>Event Details</Text>
            <Text style={styles.detailsText}>{event.subtitle}</Text>
            <Text style={styles.detailsText}>
              Tickets available now. Don’t miss out!
            </Text>
          </BlurView>
        </>
      )}

     
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    padding: 20,
  },
  topPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 40,
  },
  postButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  countdown: {
    alignSelf: "center",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  countdownTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  countdownText: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  ticketOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Ensures equal spacing between items
    alignItems: "center", // Vertically centers the items
    marginTop: 20,
    marginBottom: 20,
  },
  ticketTouchable: {
    // Optional: Add any TouchableOpacity specific styles here
  },
  ticketQuality: {
    height: 180, // Adjusted height for better proportion
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: "hidden",
  },
  qualityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  horizontalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  ticketLabel: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "bold",
  },
  ticketValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  eventDetails: {
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  purchaseButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "black",
    width: "80%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});