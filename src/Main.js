import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqFkBZ2hUHAMreFtE0LSC9nV1SVDSMAkI",
  authDomain: "willyml-41614.firebaseapp.com",
  projectId: "willyml-41614",
  storageBucket: "willyml-41614.firebasestorage.app",
  messagingSenderId: "335741101614",
  appId: "1:335741101614:web:59249721ac748fa3c2e1bf",
  measurementId: "G-7CE8VF5GL0"
};

export default function Main({ navigation }) {
  const swiperRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [swipedAll, setSwipedAll] = useState(false);
  const handleArchive = id => setCards(prev => prev.filter(card => card.email_id !== id));

  useEffect(() => {
    // Initialize Firebase app with web config
    const appFirebase = initializeApp(firebaseConfig);
    const db = getFirestore(appFirebase);
    // Fetch specific Firestore document and map into cards
    const fetchDocField = async () => {
      try {
        const docRef = doc(db, 'collection', 'document');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Parse the JSON string stored in 'field'
          let parsed;
          try {
            parsed = JSON.parse(data.field);
          } catch (e) {
            console.error('Invalid JSON:', e);
            return;
          }
          // Validate and map results
          const resultsArray = Array.isArray(parsed.results) ? parsed.results : null;
          if (!resultsArray) {
            console.error('Parsed JSON missing results array', parsed);
            return;
          }
          if (resultsArray.length === 0) {
            console.log("No results to display");
            return;
          }
          setCards(
            resultsArray.map((item, idx) => ({
              id: idx + 1,
              email_id: item.email_id,
              summarytext: item.summary,
              fulltext: item.full_email,
              uri: item.uri || null,
              responses: Array.isArray(item.responses)
                ? item.responses.map(resp => ({
                    email: resp.email,
                    intention: resp.intention_tone || resp['intention_tone'] || '',
                  }))
                : [],
            }))
          );
        } else {
          console.log('No document found!');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
      }
    };
    fetchDocField();
  }, []);

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

  // Wait until cards are loaded
  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading emails…</Text>
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
              {card.responses.map((resp, i) => (
                <View key={i} style={styles.responseBlock}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Response', { response: resp.email, summary: card.summarytext, email_id: card.email_id, onGoBack: handleArchive })}
                    style={styles.responseButton}
                  >
                    <Text style={styles.responseButtonText}>{resp.intention}</Text>
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
            title: 'SNOOZE UNTIL TOMORROW',
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
