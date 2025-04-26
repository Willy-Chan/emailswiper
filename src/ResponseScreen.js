import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export default function ResponseScreen({ route }) {
  const { response, summary } = route.params;
  const [message, setMessage] = useState(response);
  const [ccTags, setCcTags] = useState([]);
  const [ccInput, setCcInput] = useState('');
  const [bccTags, setBccTags] = useState([]);
  const [bccInput, setBccInput] = useState('');
  const addCcTag = () => { if (ccInput.trim()) { setCcTags([...ccTags, ccInput.trim()]); setCcInput(''); } };
  const addBccTag = () => { if (bccInput.trim()) { setBccTags([...bccTags, bccInput.trim()]); setBccInput(''); } };

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
      <TouchableOpacity style={styles.sendButton}>
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
