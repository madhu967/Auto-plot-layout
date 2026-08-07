import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingSlides({ 
  language, 
  setLanguage, 
  theme, 
  onFinish,
  autoStartTransition = false
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  
  // Responsive layout: On large screens/desktop, center the onboarding inside a beautiful card.
  // On mobile devices, take up the entire screen.
  const isTabletOrDesktop = windowWidth > 768;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [foundationScaleX] = useState(new Animated.Value(0));
  const [wallsScaleY] = useState(new Animated.Value(0));
  const [roofTranslateY] = useState(new Animated.Value(-40));
  const [roofOpacity] = useState(new Animated.Value(0));
  const [detailsScale] = useState(new Animated.Value(0));
  const [glowOpacity] = useState(new Animated.Value(0));
  const [textFadeAnim] = useState(new Animated.Value(0));
  const [screenFadeAnim] = useState(new Animated.Value(1));

  const slides = [
    {
      type: "layout",
      titleEn: "Smart Plot Layout Planner",
      titleTe: "స్మార్ట్ లేఅవుట్ ప్లానర్",
      descEn: "Generate customized, professional floor plans based on your plot size, facing direction, and requirements in seconds.",
      descTe: "మీ ప్లాట్ పరిమాణం, ముఖభాగం మరియు అవసరాలకు అనుగుణంగా అనుకూలీకరించిన ఇండ్ల ప్లాన్లను క్షణాల్లో రూపొందించుకోండి.",
      color: "#3B82F6"
    },
    {
      type: "vastu",
      titleEn: "Aya & Vyaya Vastu Compliance",
      titleTe: "ఆయ & వ్యయ వాస్తు లెక్కలు",
      descEn: "Ensure spiritual harmony with built-in Vedic mathematics verifying room dimensions, placement compliance, and directional alignments.",
      descTe: "గదుల కొలతలు, సరైన స్థానాలు మరియు దిశా అమరికలను వేద గణిత శాస్త్రం ఆధారంగా సరిచూసుకొని మీ ఇంట్లో సుఖశాంతులను పెంపొందించుకోండి.",
      color: "#FBBF24"
    },
    {
      type: "export",
      titleEn: "Export 2D Plans & Reports",
      titleTe: "2D ప్లాన్లు మరియు పిడిఎఫ్ నివేదికలు",
      descEn: "Download high-quality PDF reports containing your structural layout, dimension tables, and detailed Vastu analysis instantly.",
      descTe: "మీ ఇండ్ల లేఅవుట్, కొలతల పట్టికలు మరియు సమగ్ర వాస్తు విశ్లేషణతో కూడిన పిడిఎఫ్ నివేదికలను వెంటనే డౌన్‌లోడ్ చేసుకోండి.",
      color: "#10B981"
    }
  ];

  const startTransition = () => {
    setIsTransitioning(true);
    
    // Reset all animated values
    foundationScaleX.setValue(0);
    wallsScaleY.setValue(0);
    roofTranslateY.setValue(-40);
    roofOpacity.setValue(0);
    detailsScale.setValue(0);
    glowOpacity.setValue(0);
    textFadeAnim.setValue(0);
    screenFadeAnim.setValue(1);

    // Staggered timeline sequence representing "Building a House"
    Animated.sequence([
      // 1. Foundation baseline grows horizontally
      Animated.timing(foundationScaleX, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // 2. Walls vertical growth (starts immediately after foundation)
      Animated.timing(wallsScaleY, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      // 3. Roof drops down and fades in
      Animated.parallel([
        Animated.timing(roofTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(roofOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        })
      ]),
      // 4. Doors & Windows pop up with a playful spring
      Animated.spring(detailsScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      // 5. Final golden glow (Vastu blessing) and text fade-in
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();

    // Loop a gentle pulsing effect on the glow after it completes
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }, 2000);

    // Fade out overlay after 3.2 seconds and finalize redirect to home page
    setTimeout(() => {
      Animated.timing(screenFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3200);
  };

  React.useEffect(() => {
    if (autoStartTransition) {
      startTransition();
    }
  }, [autoStartTransition]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      startTransition();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isTe = language === 'te';

  // Custom visual illustration builders for high-fidelity UI
  const renderVisualMockup = (type) => {
    switch (type) {
      case "layout":
        return (
          <View style={styles.mockupContainer}>
            {/* Grid background */}
            <View style={styles.gridOverlay}>
              {[...Array(6)].map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 16}%` }]} />
              ))}
              {[...Array(6)].map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 16}%` }]} />
              ))}
            </View>
            
            {/* Architectural Layout Blueprint */}
            <View style={[styles.blueprintFrame, { borderColor: theme.colors.primary }]}>
              <View style={[styles.blueprintRoom, { top: 10, left: 10, width: 80, height: 60, borderColor: theme.colors.primary }]}>
                <Text style={styles.blueprintText}>Kitchen</Text>
              </View>
              <View style={[styles.blueprintRoom, { top: 10, right: 10, width: 90, height: 90, borderColor: theme.colors.primary }]}>
                <Text style={styles.blueprintText}>Bedroom</Text>
              </View>
              <View style={[styles.blueprintRoom, { bottom: 10, left: 10, width: 110, height: 80, borderColor: theme.colors.primary }]}>
                <Text style={styles.blueprintText}>Living Room</Text>
              </View>
              <View style={[styles.blueprintRoom, { bottom: 10, right: 10, width: 60, height: 50, borderColor: theme.colors.primary }]}>
                <Text style={styles.blueprintText}>Pooja</Text>
              </View>
            </View>
            
            {/* Floating golden ruler scale */}
            <View style={styles.floatingScale}>
              <Ionicons name="resize-outline" size={20} color="#070262" />
              <Text style={styles.scaleText}>40' × 30'</Text>
            </View>
          </View>
        );

      case "vastu":
        return (
          <View style={styles.mockupContainer}>
            {/* Vastu Mandala Compass Circle */}
            <View style={[styles.mandalaOuter, { borderColor: theme.colors.border }]}>
              <View style={[styles.mandalaInner, { borderColor: theme.colors.accent }]}>
                {/* Compass Needle */}
                <View style={styles.compassNeedleContainer}>
                  <View style={[styles.needleNorth, { borderBottomColor: theme.colors.danger }]} />
                  <View style={[styles.needleSouth, { borderTopColor: theme.colors.primary }]} />
                </View>
                {/* Cardinal directions */}
                <Text style={[styles.dirText, styles.dirN, { color: theme.colors.text }]}>N</Text>
                <Text style={[styles.dirText, styles.dirE, { color: theme.colors.text }]}>E</Text>
                <Text style={[styles.dirText, styles.dirS, { color: theme.colors.text }]}>S</Text>
                <Text style={[styles.dirText, styles.dirW, { color: theme.colors.text }]}>W</Text>
              </View>
            </View>

            {/* Vastu Status Badges */}
            <View style={[styles.floatingBadge, { top: 20, right: 10, backgroundColor: theme.colors.success }]}>
              <Ionicons name="checkmark-circle" size={14} color="#FFF" />
              <Text style={styles.badgeText}>Yoni Matches</Text>
            </View>
            <View style={[styles.floatingBadge, { bottom: 20, left: 10, backgroundColor: theme.colors.accent }]}>
              <Ionicons name="star" size={14} color="#070262" />
              <Text style={[styles.badgeText, { color: '#070262' }]}>Aya Compliance</Text>
            </View>
          </View>
        );

      case "export":
        return (
          <View style={styles.mockupContainer}>
            {/* Report Document Mockup */}
            <View style={[styles.documentCard, theme.elevation.soft]}>
              <View style={[styles.docHeader, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="document-text" size={18} color="#FFF" />
                <Text style={styles.docTitle}>Vastu Layout Report.pdf</Text>
              </View>
              <View style={styles.docContent}>
                <View style={[styles.docLine, { width: '80%' }]} />
                <View style={[styles.docLine, { width: '90%' }]} />
                <View style={[styles.docLine, { width: '60%' }]} />
                
                {/* Table representation */}
                <View style={styles.docTable}>
                  <View style={[styles.tableRow, { borderBottomColor: theme.colors.border }]} />
                  <View style={[styles.tableRow, { borderBottomColor: theme.colors.border }]} />
                </View>
              </View>
            </View>

            {/* Floating download circle */}
            <View style={[styles.downloadCircle, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="cloud-download" size={32} color="#FFF" />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const currentData = slides[currentSlide];

  if (isTransitioning) {
    const wallsTranslateY = wallsScaleY.interpolate({
      inputRange: [0, 1],
      outputRange: [28, 0]
    });

    const glowScale = glowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1.1]
    });

    return (
      <Animated.View style={[styles.container, { backgroundColor: '#FFFFFF', opacity: screenFadeAnim }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.animationCentering}>
          
          {/* Main House Building Canvas */}
          <View style={styles.houseCanvas}>
            
            {/* Glow Aura behind the house */}
            <Animated.View style={[
              styles.houseGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }]
              }
            ]} />

            {/* Triangular Roof */}
            <Animated.View style={[
              styles.roofTriangle,
              {
                opacity: roofOpacity,
                transform: [{ translateY: roofTranslateY }]
              }
            ]} />

            {/* Golden Star peak decoration */}
            <Animated.View style={[
              styles.roofStar,
              {
                opacity: detailsScale,
                transform: [{ scale: detailsScale }]
              }
            ]}>
              <Ionicons name="star" size={18} color="#FBBF24" />
            </Animated.View>

            {/* Walls container (anchored at the bottom) */}
            <Animated.View style={[
              styles.houseWalls,
              {
                transform: [
                  { scaleY: wallsScaleY },
                  { translateY: wallsTranslateY }
                ]
              }
            ]}>
              {/* Row containing Windows and Door */}
              <View style={styles.houseDetailsRow}>
                {/* Left Window */}
                <Animated.View style={[styles.houseWindow, { transform: [{ scale: detailsScale }] }]} />
                
                {/* Center Door */}
                <Animated.View style={[styles.houseDoor, { transform: [{ scale: detailsScale }] }]} />
                
                {/* Right Window */}
                <Animated.View style={[styles.houseWindow, { transform: [{ scale: detailsScale }] }]} />
              </View>
            </Animated.View>

            {/* Foundation Line */}
            <Animated.View style={[
              styles.houseFoundation,
              {
                transform: [{ scaleX: foundationScaleX }]
              }
            ]} />

          </View>

          {/* Calibrating Texts */}
          <Animated.View style={{ opacity: textFadeAnim, alignItems: 'center', marginTop: 36, gap: 8 }}>
            <Text style={[styles.animTitle, { color: '#070262' }]}>
              {isTe ? "వాస్తు ప్లానర్ సిద్ధమౌతోంది" : "Building Your Vastu Layout"}
            </Text>
            <Text style={[styles.animSubtitle, { color: '#6B7280' }]}>
              {isTe 
                ? "మీ కోసం అత్యంత ఖచ్చితమైన స్థల నివేదికలను సిద్ధం చేస్తున్నాము..." 
                : "Setting up dimensions & Aya-Vyaya tables..."}
            </Text>
          </Animated.View>

        </View>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(7, 2, 98, 0.4)' }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[
        styles.safeArea, 
        isTabletOrDesktop && styles.desktopWrapper
      ]}>
        <View style={[
          styles.modalBox, 
          { backgroundColor: theme.colors.surface },
          theme.elevation.soft
        ]}>
          
          {/* Header with Language Selector & Skip */}
          <View style={styles.header}>
            <View style={styles.langToggleContainer}>
              <TouchableOpacity 
                style={[styles.langBtn, language === 'en' && { backgroundColor: theme.colors.primaryLight }]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langText, language === 'en' && { color: theme.colors.primary, fontWeight: '700' }]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.langBtn, language === 'te' && { backgroundColor: theme.colors.primaryLight }]}
                onPress={() => setLanguage('te')}
              >
                <Text style={[styles.langText, language === 'te' && { color: theme.colors.primary, fontWeight: '700' }]}>తెలుగు</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.skipBtn} onPress={startTransition}>
              <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
                {isTe ? "దాటవేయి" : "Skip"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Visual Display */}
          <View style={styles.visualArea}>
            {renderVisualMockup(currentData.type)}
          </View>

          {/* Texts (Title & Subtitle) */}
          <View style={styles.textContainer}>
            <Text style={[styles.slideTitle, { color: theme.colors.text }]}>
              {isTe ? currentData.titleTe : currentData.titleEn}
            </Text>
            <Text style={[styles.slideDesc, { color: theme.colors.textSecondary }]}>
              {isTe ? currentData.descTe : currentData.descEn}
            </Text>
          </View>

          {/* Footer controls: Back, Dot Indicators, Next */}
          <View style={styles.footer}>
            {/* Back Button */}
            <View style={styles.footerBtnWrapper}>
              {currentSlide > 0 && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                  <Ionicons name="arrow-back" size={20} color={theme.colors.textSecondary} />
                  <Text style={[styles.backBtnText, { color: theme.colors.textSecondary }]}>
                    {isTe ? "వెనుకకు" : "Back"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Pagination Indicators */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dot, 
                    { backgroundColor: theme.colors.border },
                    currentSlide === index && [styles.activeDot, { backgroundColor: theme.colors.primary }]
                  ]}
                  onPress={() => setCurrentSlide(index)}
                />
              ))}
            </View>

            {/* Next / Get Started Button */}
            <View style={styles.footerBtnWrapper}>
              <TouchableOpacity 
                style={[
                  styles.nextBtn, 
                  { backgroundColor: theme.colors.primary },
                  currentSlide === slides.length - 1 && { backgroundColor: theme.colors.success }
                ]}
                onPress={handleNext}
              >
                <Text style={styles.nextBtnText}>
                  {currentSlide === slides.length - 1 
                    ? (isTe ? "ప్రారంభించండి" : "Get Started") 
                    : (isTe ? "తరువాత" : "Next")}
                </Text>
                <Ionicons 
                  name={currentSlide === slides.length - 1 ? "rocket-outline" : "arrow-forward"} 
                  size={16} 
                  color="#FFF" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  desktopWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        maxWidth: 480,
        maxHeight: 740,
        borderRadius: 24,
        overflow: 'hidden',
      },
      default: {
        borderRadius: 0,
      }
    })
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  langToggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  visualArea: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  mockupContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.1,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#000',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#000',
  },
  blueprintFrame: {
    width: 170,
    height: 150,
    borderWidth: 2.5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'relative',
  },
  blueprintRoom: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: 'rgba(7, 2, 98, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  blueprintText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#070262',
    opacity: 0.8,
  },
  floatingScale: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#FBBF24',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scaleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#070262',
  },
  mandalaOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  mandalaInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassNeedleContainer: {
    width: 12,
    height: 110,
    justifyContent: 'space-between',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  needleNorth: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 55,
  },
  needleSouth: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 55,
  },
  dirText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '800',
  },
  dirN: { top: 6 },
  dirE: { right: 8 },
  dirS: { bottom: 6 },
  dirW: { left: 8 },
  floatingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
  },
  documentCard: {
    width: 140,
    height: 170,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  docTitle: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '600',
  },
  docContent: {
    padding: 10,
    gap: 6,
  },
  docLine: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  docTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 4,
    padding: 4,
    gap: 4,
  },
  tableRow: {
    height: 6,
    borderBottomWidth: 1,
  },
  downloadCircle: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  slideDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerBtnWrapper: {
    width: 105,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeDot: {
    width: 18,
    borderRadius: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  animationCentering: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  houseCanvas: {
    width: 160,
    height: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  houseGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    bottom: 5,
  },
  roofTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 48,
    borderRightWidth: 48,
    borderBottomWidth: 32,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#070262',
    position: 'absolute',
    bottom: 58,
  },
  roofStar: {
    position: 'absolute',
    bottom: 90,
    zIndex: 10,
  },
  houseWalls: {
    width: 82,
    height: 56,
    borderWidth: 3.5,
    borderColor: '#070262',
    borderBottomWidth: 0,
    backgroundColor: '#F9FAFB',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    position: 'absolute',
    bottom: 4,
  },
  houseDetailsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  houseWindow: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#070262',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    marginBottom: 14,
  },
  houseDoor: {
    width: 20,
    height: 30,
    borderWidth: 2,
    borderColor: '#070262',
    backgroundColor: '#FBBF24',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  houseFoundation: {
    width: 112,
    height: 4,
    backgroundColor: '#070262',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  animTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  animSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  }
});
