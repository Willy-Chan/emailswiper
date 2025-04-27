import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
// Firebase imports
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
// Firebase config (same as Main.js)
const firebaseConfig = {
  apiKey: "AIzaSyCqFkBZ2hUHAMreFtE0LSC9nV1SVDSMAkI",
  authDomain: "willyml-41614.firebaseapp.com",
  projectId: "willyml-41614",
  storageBucket: "willyml-41614.firebasestorage.app",
  messagingSenderId: "335741101614",
  appId: "1:335741101614:web:59249721ac748fa3c2e1bf",
  measurementId: "G-7CE8VF5GL0"
};
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

export default function ResponseScreen({ route }) {
  const { response, summary, email_id, onGoBack } = route.params;
  const navigation = useNavigation();

  console.log(email_id)
  const [message, setMessage] = useState(response);
  const [ccTags, setCcTags] = useState([]);
  const [ccInput, setCcInput] = useState('');
  const [bccTags, setBccTags] = useState([]);
  const [bccInput, setBccInput] = useState('');
  const addCcTag = () => { if (ccInput.trim()) { setCcTags([...ccTags, ccInput.trim()]); setCcInput(''); } };
  const addBccTag = () => { if (bccInput.trim()) { setBccTags([...bccTags, bccInput.trim()]); setBccInput(''); } };
  // Handler to send response to Firestore
  const handleSend = async () => {
    try {
      await addDoc(collection(db, 'collection2'), {
        email_id,
        response: message,
      });
      console.log('Response saved');
      // Call archive callback then pop back
      if (onGoBack) onGoBack(email_id);
      navigation.goBack();
    } catch (err) {
      console.error('Error saving response:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {summary && (
        <Text style={styles.summaryText}>{summary}</Text>
      )}
      <View style={styles.tagSection}>
        <Text style={styles.tagLabel}>CC:</Text>
        <View style={styles.tagsContainer}>
          {ccTags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          <TextInput
            style={styles.tagInput}
            placeholder="Add CC"
            value={ccInput}
            onChangeText={setCcInput}
            onSubmitEditing={addCcTag}
            blurOnSubmit={false}
          />
        </View>
      </View>
      <View style={styles.tagSection}>
        <Text style={styles.tagLabel}>BCC:</Text>
        <View style={styles.tagsContainer}>
          {bccTags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          <TextInput
            style={styles.tagInput}
            placeholder="Add BCC"
            value={bccInput}
            onChangeText={setBccInput}
            onSubmitEditing={addBccTag}
            blurOnSubmit={false}
          />
        </View>
      </View>
      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  responseText: {
    fontSize: 24,
    textAlign: 'center',
  },
  tagSection: {
    width: '100%',
    marginBottom: 12,
  },
  tagLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
  },
  tagInput: {
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  messageInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  sendButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
