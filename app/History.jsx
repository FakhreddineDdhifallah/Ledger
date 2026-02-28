import { View, Text, StyleSheet } from 'react-native';

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0C', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#F0F0F5', fontSize: 16 },
});