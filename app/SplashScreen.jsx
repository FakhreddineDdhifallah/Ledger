import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

const { height, width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Logo starts at center (0) then moves up
  const logoY = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  // Title & tagline appear after logo moves up
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;

  // Decorative line under title
  const lineWidth = useRef(new Animated.Value(0)).current;

  // Loading bar
  const barWidth = useRef(new Animated.Value(0)).current;

  // Screen fade out
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo fades + scales in at center
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(300),

      // 2. Logo slides up smoothly
      Animated.spring(logoY, {
        toValue: -130,
        tension: 40,
        friction: 10,
        useNativeDriver: true,
      }),

      // 3. Title slides up + line expands
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(lineWidth, {
          toValue: 160,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),

      // 4. Tagline fades in
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(200),

      // 5. Loading bar fills
      Animated.timing(barWidth, {
        toValue: width * 0.45,
        duration: 900,
        useNativeDriver: false,
      }),

      Animated.delay(150),

      // 6. Fade out to Dashboard
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Main');
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

      {/* Ambient background glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Subtle horizontal lines for depth */}
      {[...Array(8)].map((_, i) => (
        <View
          key={i}
          style={[styles.gridLine, { top: `${12 * (i + 1)}%` }]}
          pointerEvents="none"
        />
      ))}

      {/* === MAIN STAGE === */}
      <View style={styles.stage}>

        {/* Title block — sits above logo visually after animation */}
        <Animated.View
          style={[
            styles.titleBlock,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
            },
          ]}
        >
          {/* Small label above */}
          <Text style={styles.eyebrow}>YOUR MONEY. YOUR RULES.</Text>

          {/* Main title */}
          <Text style={styles.appName}>LEDGER</Text>

          {/* Decorative line */}
          <Animated.View style={[styles.accentLine, { width: lineWidth }]} />
        </Animated.View>

        {/* Logo — starts center, slides up */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                { translateY: logoY },
                { scale: logoScale },
              ],
            },
          ]}
        >
          {/* Outer glow rings */}
          <View style={styles.glowRingOuter} />
          <View style={styles.glowRingInner} />

          {/* Logo card */}
          <View style={styles.logoCard}>
            <View style={styles.logoInner}>
              <Text style={styles.logoSymbol}>₿</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tagline — appears below logo after it settles */}
        <Animated.View
          style={[
            styles.taglineBlock,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            },
          ]}
        >
          <Text style={styles.tagline}>Track every coin.</Text>
          <Text style={styles.taglineAccent}>Build the habit.</Text>
        </Animated.View>

      </View>

      {/* Loading bar */}
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>

      {/* Version badge */}
      <Text style={styles.version}>MVP v1.0</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Ambient glows
  glowTop: {
    position: 'absolute',
    top: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#C8A96E12',
    alignSelf: 'center',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#00C89608',
    alignSelf: 'center',
  },

  // Grid lines
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF04',
  },

  // Stage holds everything in the center
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title block
  titleBlock: {
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: '#C8A96E',
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.85,
  },
  appName: {
    fontSize: 52,
    fontWeight: '900',
    color: '#F0F0F5',
    letterSpacing: 16,
    textShadowColor: '#C8A96E40',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  accentLine: {
    height: 2,
    backgroundColor: '#C8A96E',
    marginTop: 10,
    borderRadius: 2,
    opacity: 0.8,
  },

  // Logo
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  glowRingOuter: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1,
    borderColor: '#C8A96E18',
  },
  glowRingInner: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 1,
    borderColor: '#C8A96E30',
  },
  logoCard: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#18181C',
    borderWidth: 1.5,
    borderColor: '#C8A96E60',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C8A96E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: '#C8A96E14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    fontSize: 38,
    color: '#C8A96E',
    fontWeight: '700',
  },

  // Tagline
  taglineBlock: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#7A7A8C',
    letterSpacing: 1.5,
    fontWeight: '400',
  },
  taglineAccent: {
    fontSize: 16,
    color: '#C8A96E',
    letterSpacing: 1.5,
    fontWeight: '700',
    opacity: 0.9,
  },

  // Loading bar
  barTrack: {
    position: 'absolute',
    bottom: 80,
    height: 2,
    width: '45%',
    backgroundColor: '#2A2A30',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#C8A96E',
    borderRadius: 2,
  },

  // Version
  version: {
    position: 'absolute',
    bottom: 48,
    fontSize: 10,
    color: '#3A3A48',
    letterSpacing: 3,
    fontWeight: '600',
  },
});