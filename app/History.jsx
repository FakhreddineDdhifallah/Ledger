import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History — coming next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  text: { color: COLORS.textMuted, fontSize: 16 },
});