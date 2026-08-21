import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Platform,
  StatusBar,
  Image,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VastuFooter from './VastuFooter';
import SmartLayoutSection from './SmartLayoutSection';
import WorkflowCarousel from './PeopleCarousel';

const ParallaxSection = ({ theme, language, isDesktop, onGetStarted, scrollY }) => {
  const isTe = language === 'te';
  const activeTheme = theme || {
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#111111',
      textSecondary: '#52525B',
      border: '#E4E4E7',
      primary: '#070262',
      accent: '#FBBF24',
      primaryLight: '#EEF2F6',
    }
  };

  const imageSource = require('../assets/home.jpg');
  const imageUri = Image.resolveAssetSource ? Image.resolveAssetSource(imageSource).uri : (imageSource && imageSource.uri) || imageSource;

  // Interpolate scrollY to translate multiple layers at different speeds!
  const bgTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [300, 1600],
    outputRange: [-60, 60],
    extrapolate: 'clamp'
  }) : 0;

  const gridTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [300, 1600],
    outputRange: [-30, 30],
    extrapolate: 'clamp'
  }) : 0;

  const compassTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [300, 1600],
    outputRange: [40, -40],
    extrapolate: 'clamp'
  }) : 0;

  const cardTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [300, 1600],
    outputRange: [15, -15],
    extrapolate: 'clamp'
  }) : 0;

  const parallaxStyles = StyleSheet.create({
    container: {
      width: '100%',
      height: isDesktop ? 420 : 360,
      marginVertical: 28,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      alignSelf: 'stretch',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 6,
    },
    bgImage: {
      position: 'absolute',
      top: -80,
      left: 0,
      right: 0,
      bottom: -80,
      width: '100%',
      height: '100%',
      minHeight: '130%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 2, 98, 0.72)', // Branded deep blue overlay
      zIndex: 1,
    },
    vastuGrid: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      borderColor: 'rgba(251, 191, 36, 0.15)',
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderRadius: 16,
      zIndex: 2,
    },
    floatingCompass: {
      position: 'absolute',
      right: isDesktop ? '8%' : '4%',
      bottom: isDesktop ? '10%' : '5%',
      opacity: 0.15,
      zIndex: 2,
    },
    content: {
      width: '100%',
      maxWidth: 900,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
    },
    glassCard: {
      width: '100%',
      maxWidth: 680,
      paddingHorizontal: isDesktop ? 40 : 20,
      paddingVertical: isDesktop ? 32 : 20,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      alignItems: 'center',
      ...Platform.select({
        web: {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      }),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    badge: {
      fontSize: 12,
      fontWeight: '800',
      color: activeTheme.colors.accent || '#FBBF24',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 10,
      textAlign: 'center',
    },
    heading: {
      fontSize: isDesktop ? 26 : 19,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: isDesktop ? 34 : 25,
    },
    description: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
      maxWidth: 580,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: isDesktop ? 40 : 20,
      marginBottom: 20,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    button: {
      backgroundColor: activeTheme.colors.accent || '#FBBF24',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: '#070262',
      fontSize: 14,
      fontWeight: '700',
    }
  });

  return (
    <View style={parallaxStyles.container}>
      {/* Background Image Layer */}
      <Animated.Image 
        source={imageSource} 
        style={[
          parallaxStyles.bgImage,
          {
            transform: [{ translateY: bgTranslateY }]
          }
        ]}
        resizeMode="cover"
      />
      
      <View style={parallaxStyles.overlay} />

      <Animated.View 
        style={[
          parallaxStyles.vastuGrid,
          {
            transform: [{ translateY: gridTranslateY }]
          }
        ]} 
      />

      <Animated.View 
        style={[
          parallaxStyles.floatingCompass,
          {
            transform: [{ translateY: compassTranslateY }, { rotate: '15deg' }]
          }
        ]}
      >
        <Ionicons name="compass" size={isDesktop ? 160 : 100} color="rgba(251, 191, 36, 0.18)" />
      </Animated.View>
      
      <View style={parallaxStyles.content}>
        <Animated.View style={[parallaxStyles.glassCard, { transform: [{ translateY: cardTranslateY }] }]}>
          <Text style={parallaxStyles.badge}>
            {isTe ? "వేద వాస్తు డిజైన్ ఇంజిన్" : "Vedic Vastu Design Engine"}
          </Text>
          <Text style={parallaxStyles.heading}>
            {isTe 
              ? "మీ జీవన ప్రదేశంలో సంపూర్ణ సామరస్యం మరియు శక్తి ప్రవాహం" 
              : "Bringing Perfect Harmony & Energy Flow to Your Living Space"}
          </Text>
          <Text style={parallaxStyles.description}>
            {isTe 
              ? "నిజ-సమయంలో వాస్తు పారామితులను లెక్కించండి, ఆయం-వ్యయం నిష్పత్తులను సరిపోల్చండి మరియు తక్షణ ప్రొఫెషనల్ బ్లూప్రింట్‌లను సృష్టించండి."
              : "Calculate precise structural Vastu parameters, optimize room placement ratios using ancient Vedic sciences, and export professional blueprint reports instantly."}
          </Text>
          
          <View style={parallaxStyles.statsContainer}>
            <View style={parallaxStyles.statItem}>
              <Ionicons name="checkmark-circle" size={16} color={activeTheme.colors.accent || '#FBBF24'} />
              <Text style={parallaxStyles.statText}>
                {isTe ? "100% వాస్తు అనుకూలత" : "100% Vastu Compliant"}
              </Text>
            </View>
            <View style={parallaxStyles.statItem}>
              <Ionicons name="document-text" size={16} color={activeTheme.colors.accent || '#FBBF24'} />
              <Text style={parallaxStyles.statText}>
                {isTe ? "తక్షణ PDF నివేదిక" : "Instant PDF Export"}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={parallaxStyles.button} 
            activeOpacity={0.8}
            onPress={() => onGetStarted('input')}
          >
            <Text style={parallaxStyles.buttonText}>
              {isTe ? "ప్లాన్ సృష్టించండి" : "Generate Floor Plan"}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#070262" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default function LandingPage({ onGetStarted, theme, renderInputs, language, scrollToInputsOnMount }) {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Smooth scroll down to the inputs card if routing targets the input details tab
  useEffect(() => {
    if (scrollToInputsOnMount) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 1650, animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [scrollToInputsOnMount]);

  const isDesktop = windowWidth >= 768;
  
  // Set theme fallbacks
  const activeTheme = theme || {
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#111111',
      textSecondary: '#52525B',
      border: '#E4E4E7',
      primary: '#070262',
      accent: '#FBBF24'
    }
  };

  const isDark = activeTheme.colors.background === '#000000' || activeTheme.colors.background === '#121212';
  const isCrimson = activeTheme.colors.primary === '#990000';
  const isIvory = activeTheme.colors.background === '#F8F5EE';
  
  // Calculate dynamic highlight color matching the active theme's style context
  const brandHighlight = isIvory 
    ? (activeTheme.colors.accent || '#AD7A2E')
    : (isCrimson 
        ? (activeTheme.colors.primary || '#990000') 
        : (isDark ? (activeTheme.colors.accent || '#FBBF24') : (activeTheme.colors.primary || '#070262'))
      );

  const styles = getStyles(activeTheme, isDark, isDesktop, brandHighlight);

  const renderMockupThumbnail = (type, title, desc, iconName, color) => {
    return (
      <TouchableOpacity 
        style={[styles.mockupThumbnail, { borderColor: activeTheme.colors.border }]} 
        key={type}
        activeOpacity={0.8}
        onPress={() => onGetStarted(type)}
      >
        <View style={[styles.thumbnailIconCircle, { backgroundColor: color + '15' }]}>
          <Ionicons name={iconName} size={22} color={color} />
        </View>
        <Text style={styles.thumbnailTitle}>{title}</Text>
        <Text style={styles.thumbnailDesc}>{desc}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.ScrollView 
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
    >
      <View style={styles.heroOuter}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Ratings Badge */}
        <View style={styles.ratingsBadge}>
          <View style={styles.gLogoCircle}>
            <Text style={styles.gLetter}>G</Text>
          </View>
          <Text style={styles.ratingNumber}>4.5</Text>
          <View style={styles.starsRow}>
            {Array(5).fill(0).map((_, i) => (
              <Ionicons key={i} name="star" size={14} color="#FF6900" style={styles.starIcon} />
            ))}
          </View>
          <Text style={reviewsText => styles.reviewsText}>254 reviews</Text>
        </View>

        {/* Hero Heading Section */}
        <Text style={styles.heroTitle}>
          Turn plot dimensions to outstanding Vastu layouts, in seconds
        </Text>
        <Text style={styles.heroSubtitle}>
          Generate customized, professional floor plans based on your plot size, facing direction, and Vedic Vastu calculations instantly.
        </Text>

        {/* Large CTA Button */}
        <TouchableOpacity style={styles.primaryCtaBtn} activeOpacity={0.9} onPress={() => onGetStarted('login')}>
          <Ionicons name="flash-outline" size={16} color={isDark ? '#111111' : '#FFFFFF'} style={{ marginRight: 6 }} />
          <Text style={styles.primaryCtaText}>Get Started for Free</Text>
        </TouchableOpacity>

        {/* Trust checkmarks */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <View style={styles.bulletIndicator} />
            <Text style={styles.trustText}>Vastu Compliance</Text>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.bulletIndicator} />
            <Text style={styles.trustText}>Instant PDF Export</Text>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.bulletIndicator} />
            <Text style={styles.trustText}>Vedic Mathematics</Text>
          </View>
        </View>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* 1. About Section (Positioned under Hero Section, above feature cards) */}
        <View style={styles.aboutContainer}>
          {/* Left Side: Creative Image with Community Overlay */}
          <View style={styles.aboutImageWrapper}>
            <Image 
              style={styles.aboutImage}
              source={{ uri: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop' }}
              resizeMode="cover"
            />
            <View style={styles.aboutOverlayBadge}>
              <View style={styles.avatarOverlap}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100' }} style={styles.avatarImg} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100' }} style={[styles.avatarImg, { marginLeft: -12 }]} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' }} style={[styles.avatarImg, { marginLeft: -12 }]} />
                <View style={styles.avatarCountCircle}>
                  <Text style={styles.avatarCountText}>50+</Text>
                </View>
              </View>
              <Text style={styles.badgeText}>Join our design community</Text>
            </View>
          </View>

          {/* Right Side: Copywriting Content */}
          <View style={styles.aboutContent}>
            {/* Subsection Label ABOUT on top */}
            <Text style={styles.aboutLabel}>ABOUT</Text>
            <Text style={styles.aboutHeading}>What we do?</Text>
            <View style={styles.gradientUnderline} />
            
            <Text style={styles.aboutParagraph}>
              Vastu Sarvaswam helps you design harmonious living spaces by transforming your layout dimensions into fully functional, Vastu-compliant 2D floor plans.
            </Text>
            <Text style={styles.aboutParagraph}>
              Whether you're planning a residential home, office workspace, or commercial building, our auto-layout engine is crafted to optimize room positioning according to Vedic Vastu guidelines (Aya, Vyaya, and Yoni alignments).
            </Text>
            <Text style={styles.aboutParagraph}>
              From structural compass checks to downloadable PDF blueprint audits, Vastu Sarvaswam empowers you to design beautifully and align your space with natural energies effortlessly.
            </Text>

            <TouchableOpacity 
              style={styles.aboutReadMoreBtn} 
              activeOpacity={0.8}
              onPress={() => onGetStarted('input')}
            >
              <Text style={styles.aboutReadMoreText}>Read more</Text>
              <Ionicons name="arrow-forward" size={14} color={isDark ? '#111111' : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* Services Section Header */}
        <Text style={styles.servicesHeading}>SERVICES</Text>
        <View style={styles.gradientUnderlineCentred} />

        {/* 2. Feature Mockups Grid (Positioned directly under About Section) */}
        <View style={styles.mockupsContainer}>
          {renderMockupThumbnail(
            'input', 
            'Auto-Layout Planner', 
            'Calculates optimal Vastu rooms positioning based on facing angles.', 
            'grid-outline', 
            '#3B82F6'
          )}
          {renderMockupThumbnail(
            'core', 
            'Aya-Vyaya Calculations', 
            'Vedic formula analysis to calculate dimensional ratios of Yoni/Ayam.', 
            'calculator-outline', 
            '#F59E0B'
          )}
          {renderMockupThumbnail(
            'pdf', 
            'Automated PDF Reports', 
            'Instant structural summaries, alignment audits and blueprint exports.', 
            'document-text-outline', 
            '#10B981'
          )}
        </View>

        {/* Parallax Section */}
        <ParallaxSection 
          theme={activeTheme} 
          language={language} 
          isDesktop={isDesktop} 
          onGetStarted={onGetStarted} 
          scrollY={scrollY}
        />

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* Smart Layout Generation Section */}
        <SmartLayoutSection theme={activeTheme} language={language} />

        {/* Workflow Carousel Section */}
        <WorkflowCarousel theme={activeTheme} language={language} />

        {/* 3. Vastu Planner Input Details Form (Positioned below Mockup cards) */}
        {renderInputs && (
          <React.Fragment>
            <View style={styles.divider} />
            <View style={styles.inputsWrapper}>
              {renderInputs}
            </View>
          </React.Fragment>
        )}
      </View>

      {/* Website Footer Component */}
      {Platform.OS === 'web' && (
        <VastuFooter 
          language={language || 'en'}
          theme={activeTheme}
          activeTheme={isDark ? 'dark' : (activeTheme.colors.primary === '#990000' ? 'crimson' : 'light')}
          style={{ width: '100%', alignSelf: 'stretch', marginTop: 0 }}
        />
      )}
    </Animated.ScrollView>
  );
}

const getStyles = (theme, isDark, isDesktop, brandHighlight) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background,
      ...Platform.select({
        web: {
          height: '100%',
          overflowY: 'scroll',
        }
      })
    },
    scrollContent: {
      alignItems: 'center',
      paddingBottom: 0,
    },
    heroOuter: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: 24,
    },
    ratingsBadge: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 24,
      paddingVertical: 6,
      paddingHorizontal: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
    gLogoCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#E2E8F0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 6,
    },
    gLetter: {
      fontSize: 10,
      fontWeight: '900',
      color: '#475569',
    },
    ratingNumber: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    starsRow: {
      flexDirection: 'row',
      marginRight: 8,
    },
    starIcon: {
      marginHorizontal: 1,
    },
    reviewsText: {
      fontSize: 12.5,
      color: theme.colors.textSecondary,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '700',
      textAlign: 'center',
      maxWidth: 760,
      marginTop: 24,
      paddingHorizontal: 24,
      color: theme.colors.text,
      lineHeight: 40,
      letterSpacing: -0.5,
      ...Platform.select({
        web: { fontSize: 48, lineHeight: 56 }
      })
    },
    heroSubtitle: {
      fontSize: 14,
      textAlign: 'center',
      maxWidth: 520,
      marginTop: 14,
      paddingHorizontal: 24,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      ...Platform.select({
        web: { fontSize: 15, lineHeight: 24 }
      })
    },
    primaryCtaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: brandHighlight,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryCtaText: {
      color: isDark ? '#111111' : '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
    trustRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      marginTop: 24,
      paddingHorizontal: 24,
    },
    trustItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    bulletIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: brandHighlight,
    },
    trustText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    mockupsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 24,
      width: '100%',
      maxWidth: 1140,
      paddingHorizontal: 16,
      marginTop: 20,
    },
    mockupThumbnail: {
      flex: 1,
      minWidth: 260,
      maxWidth: 320,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
    thumbnailIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    thumbnailTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
    },
    thumbnailDesc: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    divider: {
      width: '90%',
      maxWidth: 1000,
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 48,
    },
    aboutContainer: {
      flexDirection: isDesktop ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      width: '100%',
      maxWidth: 1140,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    aboutImageWrapper: {
      width: isDesktop ? 460 : '100%',
      height: isDesktop ? 400 : 320,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 20,
      elevation: 6,
    },
    aboutImage: {
      width: '100%',
      height: '100%',
    },
    aboutOverlayBadge: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      right: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 14,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    avatarOverlap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarImg: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2.5,
      borderColor: theme.colors.surface,
    },
    avatarCountCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: brandHighlight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2.5,
      borderColor: theme.colors.surface,
      marginLeft: -12,
    },
    avatarCountText: {
      fontSize: 10.5,
      color: isDark ? '#111111' : '#FFFFFF',
      fontWeight: '800',
    },
    badgeText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: theme.colors.text,
      flexShrink: 1,
    },
    aboutContent: {
      flex: 1,
      alignItems: 'flex-start',
    },
    aboutLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: brandHighlight,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 6,
    },
    aboutHeading: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: 0.5,
    },
    gradientUnderline: {
      width: 96,
      height: 3.5,
      borderRadius: 2,
      backgroundColor: brandHighlight,
      marginTop: 8,
      marginBottom: 20,
    },
    aboutParagraph: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    aboutReadMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: brandHighlight,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    aboutReadMoreText: {
      color: isDark ? '#111111' : '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    servicesHeading: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: 0.5,
      textAlign: 'center',
      marginTop: 10,
    },
    gradientUnderlineCentred: {
      width: 96,
      height: 3.5,
      borderRadius: 2,
      backgroundColor: brandHighlight,
      marginTop: 8,
      marginBottom: 20,
      alignSelf: 'center',
    },
    inputsWrapper: {
      width: '100%',
      maxWidth: 1140,
      paddingHorizontal: 0,
    }
  });
};
