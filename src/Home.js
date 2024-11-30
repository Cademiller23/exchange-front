import React, { useRef } from 'react';
import { View, ScrollView, Dimensions, Text, TouchableOpacity, Image, StyleSheet, Button, Animated} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

// Mock event data
const events = [
  {
    id: 1,
    title: "Wiz Khalifa",
    subtitle: "Performing at TIME Nightclub Costa Mesa",
    image: require('../assets/WizKhalifa.png'),
    icon: "https://nextui.org/images/breathing-app-icon.jpeg",
    footerText: "Don't miss out on the event.",
    date: new Date("2024-12-01"),
  },
  {
    id: 2,
    title: "Contribute to the Planet",
    subtitle: "Plant a tree",
    image: "https://nextui.org/images/card-example-3.jpeg",
    icon: "https://nextui.org/images/breathing-app-icon.jpeg",
    footerText: "Join us to make a difference",
    date: new Date("2024-12-05"),
  },
  {
    id: 3,
    title: "Creates Beauty Like a Beast",
    subtitle: "Supercharged",
    image: "https://nextui.org/images/card-example-2.jpeg",
    icon: "https://nextui.org/images/breathing-app-icon.jpeg",
    footerText: "Experience next-level beauty",
    date: new Date("2024-11-29"),
  },
  // Add more mock events as needed
];

// Sort events by date
events.sort((a, b) => a.date - b.date);

export default function Home() {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animation value for scale
  const screenHeight = Dimensions.get('window').height;
  const translateYAnim = useRef(new Animated.Value(0)).current; // Vertical position animation
  const opacityAnim = useRef(new Animated.Value(1)).current; 

 const handlePress = (event) => {
    // Start the animations
  
      // Navigate to the next page once the animation is complete
      navigation.navigate("EventPage", {
        event: {
          ...event,
          date: event.date.toISOString(), // Convert the date to a string
        },
      });
      // Reset animations for the next interaction
  
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {events.map((event) => (
            <Animated.View
            key={event.id}
            style={[
              styles.card,
              {
                width: screenWidth * 0.9,
                height: screenWidth * 1.2,
                transform: [
                  { scale: scaleAnim },
                ],
                opacity: opacityAnim, // Fade other elements
              },
            ]}>
           <Image 
  source={typeof event.image === 'string' ? { uri: event.image } : event.image} 
  style={styles.cardImage} 
/>
            <View style={styles.cardContent}>
              <Text style={styles.subtitle}>{event.subtitle.toUpperCase()}</Text>
              <Text style={styles.title}>{event.title}</Text>
            </View>
            {/* Blurred Footer */}
            <BlurView intensity={50} tint="dark" style={styles.blurFooter}>
              <View style={styles.footerContent}>
                <Image source={{ uri: event.icon }} style={styles.footerIcon} />
                <View style={styles.footerTextContainer}>
                  <Text style={styles.footerTitle}>{event.footerText}</Text>
                  <Text style={styles.footerSubtext}>Get started today!</Text>
                  <TouchableOpacity onPress={() => handlePress(event)} style={styles.accessEvent}> <Text style={styles.buttonText}>Buy Now</Text></TouchableOpacity>
                </View>
              </View>
            </BlurView>
            </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: "black", // Completely fills the screen with no white space
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: "center", // Center cards horizontally
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
  },
  blurFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  footerSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  accessEvent: {
    backgroundColor: "#3c3c43", // Matches the dark gray background
    borderRadius: 16, // Rounded corners
    paddingVertical: 8, // Adds vertical padding
    paddingHorizontal: 16, // Adds horizontal padding
    alignSelf: "flex-start", // Ensures the button doesn't stretch
    marginTop: 10, // Adds some space above the button
  },
  buttonText: {
    color: "white", // Matches the white text color
    fontSize: 14, // Font size
    fontWeight: "500", // Matches medium weight
    textAlign: "center", // Centers the text
  }
  
});
