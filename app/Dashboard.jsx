import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTransactions from '../hooks/useTransactions';
import { CATEGORIES } from '../constants/categories';
import { COLORS } from '../constants/theme';

function formatAmount(amount) {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard({ navigation }) {
  const {
    loading,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    todaySpending,
    recentTransactions,
  } = useTransactions();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  const isNegative = totalBalance < 0;

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <Ionicons name="person-circle-outline" size={36} color={COLORS.textMuted} />
        </TouchableOpacity>
      </Animated.View>

      {/* Balance Card */}
      <Animated.View style={[styles.balanceCard, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.cardCircle1} />
        <View style={styles.cardCircle2} />
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={[styles.balanceAmount, { color: isNegative ? COLORS.expense : COLORS.text }]}>
          {isNegative ? '-' : ''}
          <Text style={styles.balanceCurrency}>TND </Text>
          {formatAmount(Math.abs(totalBalance))}
        </Text>
        <View style={styles.balanceDivider} />
        <View style={styles.todayRow}>
          <View style={styles.todayPill}>
            <Ionicons name="today-outline" size={13} color={COLORS.accent} />
            <Text style={styles.todayLabel}>  Today's spending</Text>
          </View>
          <Text style={[styles.todayAmount, { color: todaySpending === 0 ? COLORS.textMuted : COLORS.expense }]}>
            {todaySpending === 0 ? 'Nothing yet' : `- TND ${formatAmount(todaySpending)}`}
          </Text>
        </View>
      </Animated.View>

      {/* Monthly Stats */}
      <Animated.View style={[styles.statsRow, { transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.statCard, styles.statCardIncome]}>
          <Ionicons name="arrow-down-circle" size={20} color={COLORS.income} />
          <Text style={styles.statLabel}>INCOME</Text>
          <Text style={[styles.statAmount, { color: COLORS.income }]}>
            TND {formatAmount(monthlyIncome)}
          </Text>
          <Text style={styles.statPeriod}>This month</Text>
        </View>
        <View style={[styles.statCard, styles.statCardExpense]}>
          <Ionicons name="arrow-up-circle" size={20} color={COLORS.expense} />
          <Text style={styles.statLabel}>EXPENSES</Text>
          <Text style={[styles.statAmount, { color: COLORS.expense }]}>
            TND {formatAmount(monthlyExpenses)}
          </Text>
          <Text style={styles.statPeriod}>This month</Text>
        </View>
      </Animated.View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💸</Text>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySubtitle}>Tap the Add tab to log your first one</Text>
          </View>
        ) : (
          recentTransactions.map((t, index) => {
            const cat = CATEGORIES[t.category] || CATEGORIES['Other'];
            const isIncome = t.type === 'income';
            return (
              <View
                key={t.id}
                style={[styles.txRow, index === recentTransactions.length - 1 && styles.txRowLast]}
              >
                <View style={[styles.txIcon, { backgroundColor: `${cat.color}18` }]}>
                  <Text style={styles.txEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txCategory}>{t.category}</Text>
                  <Text style={styles.txNote} numberOfLines={1}>
                    {t.note || formatDate(t.date)}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
                    {isIncome ? '+' : '-'} {formatAmount(t.amount)}
                  </Text>
                  <Text style={styles.txDate}>{formatDate(t.date)}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#0A0A0C" />
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120 },
  loadingContainer: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  avatarBtn: { padding: 4 },

  balanceCard: {
    backgroundColor: COLORS.card, borderRadius: 24, padding: 28,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  cardCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: `${COLORS.accent}08`, top: -60, right: -40 },
  cardCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: `${COLORS.income}06`, bottom: -30, left: -20 },
  balanceLabel: { fontSize: 10, letterSpacing: 3, color: COLORS.textMuted, fontWeight: '600', marginBottom: 8 },
  balanceAmount: { fontSize: 42, fontWeight: '800', color: COLORS.text, letterSpacing: -1 },
  balanceCurrency: { fontSize: 22, fontWeight: '600' },
  balanceDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 18 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  todayPill: { flexDirection: 'row', alignItems: 'center' },
  todayLabel: { fontSize: 12, color: COLORS.textMuted },
  todayAmount: { fontSize: 13, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, borderRadius: 20, padding: 18, borderWidth: 1, gap: 6 },
  statCardIncome: { backgroundColor: `${COLORS.income}0D`, borderColor: `${COLORS.income}25` },
  statCardExpense: { backgroundColor: `${COLORS.expense}0D`, borderColor: `${COLORS.expense}25` },
  statLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1.5, fontWeight: '600' },
  statAmount: { fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  statPeriod: { fontSize: 10, color: COLORS.textMuted },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.accent, fontWeight: '600' },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  txRowLast: { borderBottomWidth: 0 },
  txIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  txEmoji: { fontSize: 22 },
  txInfo: { flex: 1 },
  txCategory: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  txNote: { fontSize: 12, color: COLORS.textMuted },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  txDate: { fontSize: 11, color: COLORS.textMuted },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textMuted },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, opacity: 0.7 },

  fab: {
    position: 'absolute', bottom: 40, right: 20, width: 58, height: 58,
    borderRadius: 18, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
});