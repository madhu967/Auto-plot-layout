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
  Animated,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VastuFooter from './VastuFooter';
import SmartLayoutSection from './SmartLayoutSection';
import WorkflowCarousel from './PeopleCarousel';

// Scroll Reveal Animation Wrapper for Website view
const RevealWrapper = ({ children, delay = 0, duration = 800, xOffset = 0, yOffset = 30, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const viewRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const el = viewRef.current;
    if (el) {
      observer.observe(el);
    } else {
      setIsVisible(true);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [yOffset, 0],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [xOffset, 0],
  });

  return (
    <View ref={viewRef} style={[{ width: '100%', alignItems: 'center' }, style]}>
      <Animated.View
        style={{
          opacity: animatedValue,
          transform: [{ translateY }, { translateX }],
          width: '100%',
          alignItems: 'center',
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};

// FAQ Section Component matching exact styling & animations
const FAQSection = ({ theme, language, isDesktop }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const isTe = language === 'te';

  const faqs = [
    {
      questionEn: "How to use Vastu Sarvaswam Auto-Planner?",
      questionTe: "వాస్తు సర్వస్వం ఆటో-ప్లానర్ ఎలా ఉపయోగించాలి?",
      answerEn: "To use the planner, simply navigate to the 'Input Details' tab, enter your plot dimensions, select the facing direction, and click 'Calculate & Generate'. The engine will instantly draft your Vastu blueprint.",
      answerTe: "ప్లానర్ ఉపయోగించడానికి, 'Input Details' ట్యాబ్‌కు వెళ్లి, మీ ప్లాట్ కొలతలను నమోదు చేసి, ముఖభాగం దిశను ఎంచుకుని, 'Calculate & Generate' క్లిక్ చేయండి. ఇంజిన్ తక్షణమే మీ వాస్తు బ్లూప్రింట్‌ను డ్రాఫ్ట్ చేస్తుంది."
    },
    {
      questionEn: "Are there other layout charts and tables available?",
      questionTe: "ఇతర లేఅవుట్ చార్ట్‌లు మరియు పట్టికలు అందుబాటులో ఉన్నాయా?",
      answerEn: "Yes, we provide Vastu compliance calculation sheets, detailed PDF export options, and master tables for Vedic calculations like Yoni, Ayam, and Vyaya in the navigation tabs.",
      answerTe: "అవును, మేము నావిగేషన్ ట్యాబ్‌లలో యోని, ఆయం మరియు వ్యయం వంటి వేద గణనల కోసం వాస్తు అనుకూలత గణన షీట్‌లు, వివరణాత్మక పిడిఎఫ్ ఎగుమతి ఎంపికలు మరియు మాస్టర్ పట్టికలను అందిస్తాము."
    },
    {
      questionEn: "Is the layout planner responsive on mobile?",
      questionTe: "లేఅవుట్ ప్లానర్ మొబైల్‌లో రెస్పాన్సివ్‌గా ఉందా?",
      answerEn: "Yes, the system is fully responsive! You can use Vastu Sarvaswam on your mobile phone, tablet, or desktop browser seamlessly.",
      answerTe: "అవును, ఈ సిస్టమ్ పూర్తిగా రెస్పాన్సివ్! మీరు మీ మొబైల్ ఫోన్, టాబ్లెట్ లేదా డెస్క్‌టాప్ బ్రౌజర్‌లో వాస్తు సర్వస్వంను సజావుగా ఉపయోగించవచ్చు."
    },
    {
      questionEn: "Can I customize the room sizes and positions?",
      questionTe: "నేను గది పరిమాణాలు మరియు స్థానాలను అనుకూలీకరించవచ్చా?",
      answerEn: "Yes, you can customize the room parameters and inspector options directly in the Property Inspector to adapt the generated layout to your personal architectural needs.",
      answerTe: "అవును, మీ వ్యక్తిగత నిర్మాణ అవసరాలకు అనుగుణంగా రూపొందించిన లేఅవుట్‌ను మార్చుకోవడానికి మీరు ప్రాపర్టీ ఇన్‌స్పెక్టర్‌లో నేరుగా గది పారామితులు మరియు ఇన్‌స్పెక్టర్ ఎంపికలను అనుకూలీకరించవచ్చు."
    }
  ];

  const activeTheme = theme || {
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#111111',
      textSecondary: '#52525B',
      border: '#E4E4E7',
      primary: '#070262',
      accent: '#FBBF24',
      divider: '#E4E4E7'
    }
  };

  const isDark = activeTheme.colors.background === '#000000' || activeTheme.colors.background === '#121212';
  const brandHighlight = isDark 
    ? (activeTheme.colors.accent || '#FBBF24') 
    : (activeTheme.colors.primary || '#070262');

  const faqStyles = StyleSheet.create({
    container: {
      flexDirection: isDesktop ? 'row' : 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: isDesktop ? 48 : 28,
      width: '100%',
      maxWidth: 896,
      paddingHorizontal: isDesktop ? 0 : 16,
      marginTop: 20,
      marginBottom: 64,
    },
    imageWrapper: {
      width: isDesktop ? 340 : '100%',
      height: isDesktop ? 350 : 250,
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 12,
      elevation: 4,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    contentWrapper: {
      flex: 1,
      width: '100%',
      alignItems: 'flex-start',
    },
    badgeText: {
      fontSize: 14,
      fontWeight: '500',
      color: brandHighlight,
      marginBottom: 6,
    },
    heading: {
      fontSize: 28,
      fontWeight: '600',
      color: activeTheme.colors.text,
      marginBottom: 8,
      fontFamily: 'Playfair Display',
    },
    subheading: {
      fontSize: 14,
      color: activeTheme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 20,
      fontFamily: 'Outfit',
    },
    faqList: {
      width: '100%',
    },
    faqItem: {
      borderBottomWidth: 1,
      borderBottomColor: activeTheme.colors.divider || activeTheme.colors.border,
      paddingVertical: 16,
      width: '100%',
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: 12,
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: '500',
      color: activeTheme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    faqAnswerContainer: {
      overflow: 'hidden',
      width: '100%',
    },
    faqAnswer: {
      fontSize: 14,
      color: activeTheme.colors.textSecondary,
      lineHeight: 20,
      maxWidth: 448,
    }
  });

  return (
    <View style={faqStyles.container}>
      {/* FAQ Left: Image */}
      <View style={faqStyles.imageWrapper}>
        <Image 
          style={faqStyles.image}
          source={require('../assets/pexels-pavel-danilyuk-7937331.jpg')}
          resizeMode="cover"
        />
      </View>

      {/* FAQ Right: Content */}
      <View style={faqStyles.contentWrapper}>
        <Text style={faqStyles.badgeText}>{isTe ? "ఎఫ్.ఎ.క్యు" : "FAQ's"}</Text>
        <Text style={faqStyles.heading}>{isTe ? "సమాధానాల కోసం చూస్తున్నారా?" : "Looking for answer?"}</Text>
        <Text style={faqStyles.subheading}>
          {isTe 
            ? "సౌకర్యవంతమైన, స్కేలబుల్ మరియు ఉపయోగించడానికి సులభమైన మా ఆటో-లేఅవుట్ ప్లానర్ గురించిన సాధారణ ప్రశ్నలు మరియు సమాధానాలు ఇక్కడ ఉన్నాయి."
            : "Ship Beautiful Frontends Without the Overhead — Customizable, Scalable and Developer-Friendly UI Components."}
        </Text>

        <View style={faqStyles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            const itemAnswerStyle = [
              faqStyles.faqAnswer,
              Platform.select({
                web: {
                  transition: 'all 0.5s ease-in-out',
                  maxHeight: isOpen ? 300 : 0,
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                  paddingTop: isOpen ? 16 : 0,
                },
                default: {
                  height: isOpen ? 'auto' : 0,
                  opacity: isOpen ? 1 : 0,
                }
              })
            ];

            const itemIconStyle = Platform.select({
              web: {
                transition: 'transform 0.5s ease-in-out',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              },
              default: {
                transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
              }
            });

            return (
              <View key={index} style={faqStyles.faqItem}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => setOpenIndex(isOpen ? null : index)}
                  style={faqStyles.faqHeader}
                >
                  <Text style={faqStyles.faqQuestion}>
                    {isTe ? faq.questionTe : faq.questionEn}
                  </Text>
                  <View style={itemIconStyle}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke={isOpen ? brandHighlight : "#1D293D"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </View>
                </TouchableOpacity>

                <View style={faqStyles.faqAnswerContainer}>
                  <Text style={itemAnswerStyle}>
                    {isTe ? faq.answerTe : faq.answerEn}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Newsletter Section Component
const NewsletterSection = ({ theme, language, isDesktop }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'subscribing', 'subscribed', 'error'
  const isTe = language === 'te';

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('subscribing');
    // Simulate API call
    setTimeout(() => {
      setStatus('subscribed');
      setEmail('');
    }, 1200);
  };

  const activeTheme = theme || {
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      primary: '#070262',
      accent: '#FBBF24',
      divider: '#F3F4F6',
      primaryLight: '#EEF2F6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  };

  const isDark = activeTheme.colors.background === '#000000' || activeTheme.colors.background === '#121212';
  const brandHighlight = isDark 
    ? (activeTheme.colors.accent || '#FBBF24') 
    : (activeTheme.colors.primary || '#070262');

  const newsletterStyles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 896,
      paddingHorizontal: isDesktop ? 0 : 16,
      marginTop: 20,
      marginBottom: 20,
    },
    card: {
      backgroundColor: activeTheme.colors.primaryLight || '#EEF2F6',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: activeTheme.colors.border || '#E5E7EB',
      padding: isDesktop ? 40 : 24,
      flexDirection: isDesktop ? 'row' : 'column-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.25 : 0.04,
      shadowRadius: 16,
      elevation: 4,
      overflow: 'hidden',
      position: 'relative',
    },
    glow1: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: brandHighlight + '0C',
      top: -80,
      right: -80,
    },
    glow2: {
      position: 'absolute',
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: (isDark ? '#FFFFFF' : activeTheme.colors.primary) + '05',
      bottom: -40,
      left: -40,
    },
    contentWrapper: {
      flex: 1.2,
      alignItems: 'flex-start',
      zIndex: 1,
      width: '100%',
    },
    imageWrapper: {
      flex: 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    image: {
      width: isDesktop ? 200 : 140,
      height: isDesktop ? 200 : 140,
      resizeMode: 'contain',
    },
    badgeText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: brandHighlight,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 10,
    },
    heading: {
      fontSize: isDesktop ? 30 : 22,
      fontWeight: '700',
      color: activeTheme.colors.text,
      lineHeight: isDesktop ? 36 : 28,
      marginBottom: 12,
      letterSpacing: -0.5,
      fontFamily: 'Playfair Display',
    },
    subheading: {
      fontSize: 14,
      color: activeTheme.colors.textSecondary,
      lineHeight: 21,
      marginBottom: 24,
      fontFamily: 'Outfit',
    },
    inputGroup: {
      flexDirection: isDesktop ? 'row' : 'column',
      width: '100%',
      gap: 12,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      backgroundColor: activeTheme.colors.surface,
      color: activeTheme.colors.text,
      borderWidth: 1.5,
      borderColor: status === 'error' ? activeTheme.colors.danger : activeTheme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      fontFamily: 'Outfit',
      outlineStyle: 'none',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.02,
      shadowRadius: 2,
    },
    button: {
      backgroundColor: brandHighlight,
      borderRadius: 10,
      paddingHorizontal: 22,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      color: isDark && brandHighlight === activeTheme.colors.accent ? '#111111' : '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
      backgroundColor: activeTheme.colors.success + '15',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
      width: '100%',
    },
    successText: {
      fontSize: 14,
      color: activeTheme.colors.success,
      fontWeight: '600',
    },
    errorText: {
      fontSize: 13,
      color: activeTheme.colors.danger,
      marginTop: 6,
      fontWeight: '500',
    },
    trustText: {
      fontSize: 12,
      color: activeTheme.colors.textSecondary,
      marginTop: 10,
      opacity: 0.8,
    }
  });

  return (
    <View style={newsletterStyles.container}>
      <View style={newsletterStyles.card}>
        <View style={newsletterStyles.glow1} />
        <View style={newsletterStyles.glow2} />

        {/* Left Side: Content */}
        <View style={newsletterStyles.contentWrapper}>
          <Text style={newsletterStyles.badgeText}>
            {isTe ? "వార్తాలేఖ" : "Newsletter"}
          </Text>
          <Text style={newsletterStyles.heading}>
            {isTe ? "వాస్తు సర్వస్వం తో తాజాగా ఉండండి" : "Stay Ahead with Vastu Wisdom"}
          </Text>
          <Text style={newsletterStyles.subheading}>
            {isTe 
              ? "తాజా వాస్తు చిట్కాలు, ఆటోమేటిక్ లేఅవుట్ అప్‌డేట్‌లు మరియు నిపుణుల ఆర్కిటెక్చరల్ గైడ్‌లను నేరుగా మీ ఇన్‌బాక్స్‌కి పొందండి."
              : "Receive the latest Vastu placement guides, automatic layout updates, and exclusive design strategies direct to your inbox."}
          </Text>

          {status === 'subscribed' ? (
            <View style={newsletterStyles.successContainer}>
              <Ionicons name="checkmark-circle" size={20} color={activeTheme.colors.success} />
              <Text style={newsletterStyles.successText}>
                {isTe ? "విజయవంతంగా సబ్‌స్క్రైబ్ చేయబడింది! ధన్యవాదాలు." : "Successfully subscribed! Thank you."}
              </Text>
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              <View style={newsletterStyles.inputGroup}>
                <TextInput
                  style={newsletterStyles.input}
                  placeholder={isTe ? "మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి" : "Enter your email address"}
                  placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (status === 'error') setStatus('idle');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={newsletterStyles.button} 
                  activeOpacity={0.8}
                  onPress={handleSubscribe}
                  disabled={status === 'subscribing'}
                >
                  <Text style={newsletterStyles.buttonText}>
                    {status === 'subscribing' 
                      ? (isTe ? "సబ్‌స్క్రైబ్ అవుతోంది..." : "Subscribing...") 
                      : (isTe ? "సబ్‌స్క్రైబ్ చేయండి" : "Subscribe Now")}
                  </Text>
                  <Ionicons 
                    name={status === 'subscribing' ? "hourglass-outline" : "paper-plane-outline"} 
                    size={16} 
                    color={isDark && brandHighlight === activeTheme.colors.accent ? '#111111' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
              </View>

              {status === 'error' && (
                <Text style={newsletterStyles.errorText}>
                  {isTe ? "దయచేసి సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి." : "Please enter a valid email address."}
                </Text>
              )}
            </View>
          )}

          <Text style={newsletterStyles.trustText}>
            🛡️ {isTe ? "సురక్షితమైనది. ఎప్పుడైనా అన్‌సబ్‌స్క్రైబ్ చేయవచ్చు." : "We respect your privacy. Unsubscribe at any time."}
          </Text>
        </View>

        {/* Right Side: 3D Transparent Image */}
        <View style={newsletterStyles.imageWrapper}>
          <Image 
            source={{ uri: 'https://img.icons8.com/3d-fluency/375/mail.png' }}
            style={newsletterStyles.image}
          />
        </View>
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
  
  // Calculate dynamic highlight color matching the active theme's style context
  const brandHighlight = isDark 
    ? (activeTheme.colors.accent || '#FBBF24') 
    : (activeTheme.colors.primary || '#070262');

  const styles = getStyles(activeTheme, isDark, isDesktop, brandHighlight);

  const renderMockupThumbnail = (type, title, desc, iconName, color, index = 0) => {
    return (
      <RevealWrapper key={type} delay={index * 150} yOffset={45} style={{ flex: 1, minWidth: 260, maxWidth: 320 }}>
        <TouchableOpacity 
          style={[styles.mockupThumbnail, { borderColor: activeTheme.colors.border, width: '100%' }]} 
          activeOpacity={0.8}
          onPress={() => onGetStarted(type)}
        >
          <View style={[styles.thumbnailIconCircle, { backgroundColor: color + '15' }]}>
            <Ionicons name={iconName} size={22} color={color} />
          </View>
          <Text style={styles.thumbnailTitle}>{title}</Text>
          <Text style={styles.thumbnailDesc}>{desc}</Text>
        </TouchableOpacity>
      </RevealWrapper>
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
        <RevealWrapper delay={0} yOffset={20}>
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
            <Text style={styles.reviewsText}>254 reviews</Text>
          </View>
        </RevealWrapper>

        {/* Hero Heading Section */}
        <RevealWrapper delay={150} yOffset={30}>
          <Text style={styles.heroTitle}>
            Turn plot dimensions to outstanding Vastu layouts, in seconds
          </Text>
        </RevealWrapper>
        
        <RevealWrapper delay={300} yOffset={30}>
          <Text style={styles.heroSubtitle}>
            Generate customized, professional floor plans based on your plot size, facing direction, and Vedic Vastu calculations instantly.
          </Text>
        </RevealWrapper>

        {/* Large CTA Button */}
        <RevealWrapper delay={450} yOffset={30}>
          <TouchableOpacity style={styles.primaryCtaBtn} activeOpacity={0.9} onPress={() => onGetStarted('login')}>
            <Ionicons name="flash-outline" size={16} color={isDark ? '#111111' : '#FFFFFF'} style={{ marginRight: 6 }} />
            <Text style={styles.primaryCtaText}>Get Started for Free</Text>
          </TouchableOpacity>
        </RevealWrapper>

        {/* Trust checkmarks */}
        <RevealWrapper delay={600} yOffset={20}>
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
        </RevealWrapper>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* 1. About Section (Positioned under Hero Section, above feature cards) */}
        <View style={styles.aboutContainer}>
          {/* Left Side: Creative Image with Community Overlay */}
          <RevealWrapper 
            xOffset={isDesktop ? -40 : 0} 
            yOffset={isDesktop ? 0 : 30} 
            style={isDesktop ? { width: 460 } : { width: '100%' }}
          >
            <View style={[styles.aboutImageWrapper, { width: '100%' }]}>
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
          </RevealWrapper>

          {/* Right Side: Copywriting Content */}
          <RevealWrapper 
            xOffset={isDesktop ? 40 : 0} 
            yOffset={isDesktop ? 0 : 30} 
            delay={100}
            style={{ flex: 1 }}
          >
            <View style={[styles.aboutContent, { width: '100%' }]}>
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
          </RevealWrapper>
        </View>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* Services Section Header */}
        <RevealWrapper yOffset={25}>
          <Text style={styles.servicesHeading}>SERVICES</Text>
          <View style={styles.gradientUnderlineCentred} />
        </RevealWrapper>

        {/* 2. Feature Mockups Grid (Positioned directly under About Section) */}
        <View style={styles.mockupsContainer}>
          {renderMockupThumbnail(
            'input', 
            'Auto-Layout Planner', 
            'Calculates optimal Vastu rooms positioning based on facing angles.', 
            'grid-outline', 
            '#3B82F6',
            0
          )}
          {renderMockupThumbnail(
            'core', 
            'Aya-Vyaya Calculations', 
            'Vedic formula analysis to calculate dimensional ratios of Yoni/Ayam.', 
            'calculator-outline', 
            '#F59E0B',
            1
          )}
          {renderMockupThumbnail(
            'pdf', 
            'Automated PDF Reports', 
            'Instant structural summaries, alignment audits and blueprint exports.', 
            'document-text-outline', 
            '#10B981',
            2
          )}
        </View>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* Smart Layout Generation Section */}
        <RevealWrapper yOffset={40}>
          <SmartLayoutSection theme={activeTheme} language={language} />
        </RevealWrapper>

        {/* Workflow Carousel Section */}
        <RevealWrapper yOffset={40}>
          <WorkflowCarousel theme={activeTheme} language={language} />
        </RevealWrapper>

        {/* 3. Vastu Planner Input Details Form (Positioned below Mockup cards) */}
        {renderInputs && (
          <React.Fragment>
            <View style={styles.divider} />
            <RevealWrapper yOffset={50}>
              <View style={styles.inputsWrapper}>
                {renderInputs}
              </View>
            </RevealWrapper>
          </React.Fragment>
        )}

        {/* Newsletter Section */}
        <View style={styles.divider} />
        <RevealWrapper yOffset={40}>
          <NewsletterSection theme={activeTheme} language={language} isDesktop={isDesktop} />
        </RevealWrapper>

        {/* FAQ Section */}
        <View style={styles.divider} />
        <RevealWrapper yOffset={40}>
          <FAQSection theme={activeTheme} language={language} isDesktop={isDesktop} />
        </RevealWrapper>
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
      fontFamily: 'Playfair Display',
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
      fontFamily: 'Outfit',
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
      fontFamily: 'Outfit',
    },
    aboutHeading: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: 0.5,
      fontFamily: 'Playfair Display',
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
      fontFamily: 'Outfit',
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
      fontFamily: 'Outfit',
    },
    servicesHeading: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: 0.5,
      textAlign: 'center',
      marginTop: 10,
      fontFamily: 'Playfair Display',
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
