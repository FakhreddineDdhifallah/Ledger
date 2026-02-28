import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AddTransaction() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Transaction — coming next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  text: { color: COLORS.textMuted, fontSize: 16 },
});