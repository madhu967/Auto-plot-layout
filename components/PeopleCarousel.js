import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkflowCarousel({ theme, language }) {
  // Website workflow steps
  const steps = [
    { 
      title: language === 'te' ? "దశ 1: కొలతలు నమోదు చేయండి" : "Step 1: Input Dimensions", 
      desc: language === 'te' ? "మీ ప్లాట్ యొక్క పొడవు, వెడల్పు మరియు రోడ్డు ఫేసింగ్ దిశను నమోదు చేయండి." : "Enter your plot length, width, and exact road-facing compass direction.", 
      img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=480&h=320&q=80' 
    },
    { 
      title: language === 'te' ? "దశ 2: వాస్తు గణనలు" : "Step 2: Vastu Calculations", 
      desc: language === 'te' ? "మా ఇంజిన్ యోని, ఆదాయ, వ్యయ గణిత సూత్రాల ఆధారంగా విశ్లేషిస్తుంది." : "Our engine computes Vedic mathematical formulas to calculate optimal room sectors.", 
      img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=480&h=320&q=80' 
    },
    { 
      title: language === 'te' ? "దశ 3: ఆటో లేఅవుట్ జనరేషన్" : "Step 3: Auto Layout Generation", 
      desc: language === 'te' ? "మీ స్థలానికి సరిపోయేలా పూర్తి 2D ఫ్లోర్ ప్లాన్‌ను ఆటోమేటిక్‌గా రూపొందిస్తుంది." : "Drafts an optimized, fully functional 2D floor plan layout automatically.", 
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=480&h=320&q=80' 
    },
    { 
      title: language === 'te' ? "దశ 4: ప్రాపర్టీ ఇన్స్పెక్టర్" : "Step 4: Property Audit", 
      desc: language === 'te' ? "ప్రతి గది యొక్క వాస్తు ఫలితాలు మరియు దిద్దుబాట్లను పరిశీలించండి." : "Audit the compliance status and alternative dimensions for individual rooms.", 
      img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=480&h=320&q=80' 
    },
    { 
      title: language === 'te' ? "దశ 5: పిడిఎఫ్ నివేదికను డౌన్‌లోడ్ చేయండి" : "Step 5: PDF Report Export", 
      desc: language === 'te' ? "రూపొందించిన బ్లూప్రింట్ మరియు వాస్తు ఫలితాల PDF రిపోర్ట్‌ను డౌన్‌లోడ్ చేసుకోండి." : "Export the blueprint diagrams and mathematical compliance audits to a PDF report.", 
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=480&h=320&q=80' 
    },
  ];

  const [active, setActive] = useState(0); // Default to Step 1
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isSmall = windowWidth < 768;

  // Set theme fallback colors
  const colors = theme?.colors || {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#111111',
    textSecondary: '#52525B',
    border: '#E4E4E7',
    primary: '#070262'
  };

  const getSideIdx = (direction, blockedIdx) => {
    let index = (active + direction + steps.length) % steps.length;
    while (
      index === blockedIdx || 
      steps[index].img === steps[active].img || 
      (blockedIdx !== undefined && steps[index].img === steps[blockedIdx]?.img)
    ) {
      index = (index + direction + steps.length) % steps.length;
    }
    return index;
  };

  const leftIdx = getSideIdx(-1);
  const rightIdx = getSideIdx(1, leftIdx);

  const styles = getStyles(isSmall, colors);

  // Transition animations & Autoplay
  const activeScale = useRef(new Animated.Value(0.95)).current;
  const activeOpacity = useRef(new Animated.Value(0.8)).current;
  const activeTranslateX = useRef(new Animated.Value(0)).current;
  const prevActiveRef = useRef(0);
  const autoPlayRef = useRef(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActive(current => (current + 1) % steps.length);
    }, 2800);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    // Determine transition slide direction based on index diff
    const prevActive = prevActiveRef.current;
    let slideFrom = 0;
    if (active !== prevActive) {
      const diff = active - prevActive;
      if (diff === 1 || diff < -1) {
        slideFrom = 25;
      } else {
        slideFrom = -25;
      }
    }
    prevActiveRef.current = active;

    activeScale.setValue(0.93);
    activeOpacity.setValue(0.7);
    activeTranslateX.setValue(slideFrom);

    Animated.parallel([
      Animated.spring(activeScale, { toValue: 1, friction: 8, tension: 35, useNativeDriver: false }),
      Animated.timing(activeOpacity, { toValue: 1, duration: 250, useNativeDriver: false }),
      Animated.spring(activeTranslateX, { toValue: 0, friction: 8, tension: 35, useNativeDriver: false })
    ]).start();

    // Start auto scroll timer
    startAutoPlay();

    return () => stopAutoPlay();
  }, [active]);

  return (
    <View style={styles.sectionContainer}>
      
      {/* Dynamic Header */}
      <View style={styles.headerBox}>
        <View style={styles.tagBadge}>
          <Ionicons name="git-branch-outline" size={12} color="#0EA5E9" style={{ marginRight: 4 }} />
          <Text style={styles.tagBadgeText}>{language === 'te' ? "పని విధానం" : "WORKFLOW"}</Text>
        </View>
        <Text style={styles.mainHeading}>{language === 'te' ? "ఇది ఎలా పనిచేస్తుంది" : "How It Works"}</Text>
        <Text style={styles.subtitle}>
          {language === 'te' 
            ? "5 సాధారణ దశల్లో మీ వాస్తు అనుకూలమైన 2D ఫ్లోర్ ప్లాన్‌ను పొందండి." 
            : "Get your optimized, Vastu-compliant 2D house plan in 5 simple steps."}
        </Text>
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        
        {/* Left Side Screen Card */}
        {!isSmall && (
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => setActive(leftIdx)}
            style={styles.sideCard}
          >
            <View style={styles.sideImageContainer}>
              <Image source={{ uri: steps[leftIdx].img }} style={styles.image} />
            </View>
            <Text style={styles.sideName}>{steps[leftIdx].title}</Text>
          </TouchableOpacity>
        )}

        {/* Active Center Screen Card */}
        <Animated.View style={[
          styles.activeCard,
          { 
            opacity: activeOpacity,
            transform: [
              { scale: activeScale },
              { translateX: activeTranslateX }
            ]
          }
        ]}>
          <View style={styles.activeImageContainer}>
            <Image source={{ uri: steps[active].img }} style={styles.image} />
            <View style={styles.stepIndicatorBadge}>
              <Text style={styles.stepIndicatorText}>{active + 1}</Text>
            </View>
          </View>
          <Text style={styles.activeName}>{steps[active].title}</Text>
          <Text style={styles.activeDesc}>{steps[active].desc}</Text>
        </Animated.View>

        {/* Right Side Screen Card */}
        {!isSmall && (
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => setActive(rightIdx)}
            style={styles.sideCard}
          >
            <View style={styles.sideImageContainer}>
              <Image source={{ uri: steps[rightIdx].img }} style={styles.image} />
            </View>
            <Text style={styles.sideName}>{steps[rightIdx].title}</Text>
          </TouchableOpacity>
        )}

      </View>

      {/* Navigation Indicators */}
      <View style={styles.dotsContainer}>
        {steps.map((_, i) => (
          <TouchableOpacity 
            key={i} 
            onPress={() => setActive(i)}
            style={[
              styles.dot,
              i === active ? styles.activeDot : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const getStyles = (isSmall, colors) => StyleSheet.create({
  sectionContainer: {
    width: '100%',
    paddingVertical: 56, // Consistent section padding on top and bottom
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  headerBox: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
    paddingHorizontal: 20,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.15)',
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0EA5E9',
    letterSpacing: 1,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    ...Platform.select({
      web: { fontSize: 32 }
    })
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 20,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isSmall ? 0 : 36,
    width: '100%',
    paddingHorizontal: 20,
  },
  sideCard: {
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.45,
  },
  sideImageContainer: {
    width: 170,
    height: 115,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: colors.border,
  },
  sideName: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  activeCard: {
    flexDirection: 'column',
    alignItems: 'center',
    width: isSmall ? '100%' : 400,
  },
  activeImageContainer: {
    width: isSmall ? '100%' : 380,
    height: isSmall ? 190 : 240,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stepIndicatorBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stepIndicatorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  activeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  activeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0EA5E9',
  }
});
