import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text } from 'react-native';

import SplashScreen from './app/SplashScreen';
import { COLORS } from './constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary inline screens until we build the real ones
const Dashboard = () => (
  <View style={{ flex: 1, backgroundColor: '#0A0A0C', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#F0F0F5' }}>Dashboard</Text>
  </View>
);
const AddTransaction = () => (
  <View style={{ flex: 1, backgroundColor: '#0A0A0C', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#F0F0F5' }}>Add Transaction</Text>
  </View>
);
const History = () => (
  <View style={{ flex: 1, backgroundColor: '#0A0A0C', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#F0F0F5' }}>History</Text>
  </View>
);

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.income,
    background: COLORS.bg,
    surface: COLORS.card,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: COLORS.income,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'History') iconName = focused ? 'list' : 'list-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Add" component={AddTransaction} options={{ title: 'Add' }} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}