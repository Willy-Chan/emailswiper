import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryScreen({ route }) {
  const { summary } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
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
  summaryText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
