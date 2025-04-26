import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');

const cards = [
  { id: 1, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍕 Pizza', uri: 'https://placekitten.com/400/600' },
  { id: 2, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍣 Sushi', uri: 'https://placekitten.com/401/600' },
  { id: 3, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍣 Sushi', uri: 'https://placekitten.com/401/600' },
  { id: 4, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍣 Sushi', uri: 'https://placekitten.com/401/600' },
  { id: 5, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍣 Sushi', uri: 'https://placekitten.com/401/600' },
  { id: 6, summarytext: 'Willy is asking if you would be free to meet next Saturday at 8PM for dinner.', fulltext: 'SUPER LONG TEXT SHIT HERE', text: '🍣 Sushi', uri: 'https://placekitten.com/401/600' },
];

export default function Main({ navigation }) {
  const swiperRef = useRef(null);
  const responses = [
    'Sounds good, see you then!',
    "Sorry, I can't make it.",
    "Sorry, I can't make it.",
    "Sorry, I can't make it.",
    "Sorry, I can't make it."
  ];

  const [swipedAll, setSwipedAll] = useState(false);

  // When all cards are gone, set flag
  const handleSwipedAll = () => {
    setSwipedAll(true);
  };

  // If we’ve swiped everything, show the “empty” view
  if (swipedAll) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneText}>You're done for the day! ✅</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => {
            setSwipedAll(false);
          }}
        >
          <Text>Review Older Emails</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={cards}
        stackSize={3}
        cardIndex={0}
        animateCardOpacity
        verticalSwipe={false}
        onSwipedLeft={(cardIndex) => console.log('Nope:', cards[cardIndex].text)}
        onSwipedRight={(cardIndex) => console.log('Like:', cards[cardIndex].text)}
        renderCard={(card) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('Summary', { summary: card.fulltext })}>
              <Text style={styles.summaryofemailtext}>{card.summarytext}</Text>
            </TouchableOpacity>
            <View style={styles.responseContainer}>
              {responses.map((resp, i) => (
                <View key={i} style={styles.responseBlock}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Response', { response: resp, summary: card.summarytext })}
                    style={styles.responseButton}
                  >
                    <Text style={styles.responseButtonText}>{resp}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {/* <Image source={{ uri: card.uri }} style={styles.image} /> */}
            {/* <Text style={styles.text}>{card.text}</Text> */}
          </View>
        )}
        onSwipedAll={handleSwipedAll}
        overlayLabels={{
          left: {
            title: 'ARCHIVE',
            style: {
              label: { color: 'white', fontSize: 48 },
              wrapper: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }
            }
          },
          right: {
            title: 'SHOW ME TOMORROW',
            style: {
              label: { color: 'white', fontSize: 48 },
              wrapper: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: 'rgba(0, 140, 255, 0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }
            }
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '85%' },
  responseContainer: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  responseBlock: { marginBottom: 12 },
  responseButton: {
    backgroundColor: '#eee', padding: 12, borderRadius: 8
  },
  responseButtonText: { fontSize: 16 },
  dropdownContent: {
    backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginTop: 4
  },
  dropdownText: { fontSize: 14, marginBottom: 8 },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  summaryofemailtext: { 
    fontSize: 24, 
    padding: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    },
  text: { 
    fontSize: 24, 
    padding: 16 
    },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  doneText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  checkmark: {
    fontSize: 64,
    textAlign: 'center',
  },
});
