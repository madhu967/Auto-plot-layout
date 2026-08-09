import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Animated, 
  Dimensions, 
  Platform, 
  Easing 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CANVAS_WIDTH = 380;
const CANVAS_HEIGHT = 300;

export default function SmartLayoutSection({ theme, language }) {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [variant, setVariant] = useState(1); // 1 = North-facing 40x30, 2 = East-facing 30x40
  const [stage, setStage] = useState(0); // 0: Init, 1: Scan, 2: Place, 3: Optimize, 4: Detail, 5: Complete, 6: Reset

  // Dimension counters state
  const [dispWidth, setDispWidth] = useState(0);
  const [dispHeight, setDispHeight] = useState(0);

  // Grid size variables for display
  const currentFacing = variant === 1 ? 'North' : 'East';
  const currentEfficiency = variant === 1 ? '98.4%' : '97.6%';

  // Animated values
  const compassRotation = useRef(new Animated.Value(0)).current;
  const plotOpacity = useRef(new Animated.Value(0)).current;
  const plotScale = useRef(new Animated.Value(0.9)).current;
  const scanY = useRef(new Animated.Value(0)).current;
  const scanOpacity = useRef(new Animated.Value(0)).current;
  const detailsOpacity = useRef(new Animated.Value(0)).current;
  
  // High-tech overlays animated values
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const crosshairOpacity = useRef(new Animated.Value(0)).current;
  const crosshairPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const vastuLinesOpacity = useRef(new Animated.Value(0)).current;
  const radarPulseAnim = useRef(new Animated.Value(1)).current;

  // Status checkmark animations
  const statusOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const statusOffsets = useRef([
    new Animated.Value(-12),
    new Animated.Value(-12),
    new Animated.Value(-12),
    new Animated.Value(-12)
  ]).current;

  // Rooms animated positions and sizes
  // Order: Master Bed (0), Kitchen (1), Bath (2), Living (3), Pooja (4)
  const roomPositions = useRef([
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 })
  ]).current;

  const roomSizes = useRef([
    new Animated.ValueXY({ x: 100, y: 100 }),
    new Animated.ValueXY({ x: 100, y: 100 }),
    new Animated.ValueXY({ x: 100, y: 100 }),
    new Animated.ValueXY({ x: 100, y: 100 }),
    new Animated.ValueXY({ x: 100, y: 100 })
  ]).current;

  const roomOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Complete banner animations
  const completeOpacity = useRef(new Animated.Value(0)).current;
  const completeScale = useRef(new Animated.Value(0.8)).current;
  const scanGlowAnim = useRef(new Animated.Value(0)).current;

  // Monitor screen resizing
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;
  const activeTheme = theme || {
    colors: {
      text: '#111111',
      textSecondary: '#52525B'
    }
  };
  const styles = getStyles(isDesktop, activeTheme);

  // Radar Targets Pulse Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulseAnim, { toValue: 1.25, duration: 800, easing: Easing.ease, useNativeDriver: false }),
        Animated.timing(radarPulseAnim, { toValue: 1.0, duration: 800, easing: Easing.ease, useNativeDriver: false })
      ])
    ).start();
  }, []);

  // Layout positions mapping
  const variantData = {
    1: {
      plotX: 40, plotY: 40, plotW: 300, plotH: 225,
      compassAngle: 0, // North
      unoptimized: [
        { x: 280, y: 40, w: 60, h: 112.5 },   // Master Bed (snapped to Northeast)
        { x: 40, y: 152.5, w: 150, h: 112.5 }, // Kitchen (snapped to Southwest)
        { x: 190, y: 152.5, w: 150, h: 112.5 },// Bath (snapped to Southeast)
        { x: 40, y: 40, w: 80, h: 112.5 },    // Living (snapped to Northwest)
        { x: 120, y: 40, w: 160, h: 112.5 }   // Pooja (snapped to Center)
      ],
      optimized: [
        { x: 40, y: 152.5, w: 150, h: 112.5 }, // Master Bed (Southwest) - Correct Vastu
        { x: 190, y: 152.5, w: 150, h: 112.5 }, // Kitchen (Southeast) - Correct Vastu
        { x: 40, y: 40, w: 80, h: 112.5 },     // Bath (Northwest) - Correct Vastu
        { x: 120, y: 40, w: 160, h: 112.5 },   // Living (Center)
        { x: 280, y: 40, w: 60, h: 112.5 }     // Pooja (Northeast) - Correct Vastu
      ],
      radarCenters: [
        { x: 115, y: 208.5 }, // Master Bed
        { x: 265, y: 208.5 }, // Kitchen
        { x: 80, y: 96 },     // Bath
        { x: 200, y: 96 },    // Living
        { x: 310, y: 96 }     // Pooja
      ],
      rooms: [
        { name: 'Master Bed', key: 'bed', tag: 'Southwest' },
        { name: 'Kitchen', key: 'kitchen', tag: 'Agni (SE)' },
        { name: 'Bath & WC', key: 'bath', tag: 'Northwest' },
        { name: 'Living Room', key: 'living', tag: 'Nirup' },
        { name: 'Pooja Room', key: 'pooja', tag: 'Eshanya (NE)' }
      ]
    },
    2: {
      plotX: 75, plotY: 25, plotW: 230, plotH: 250,
      compassAngle: 90, // East (90 deg)
      unoptimized: [
        { x: 75, y: 25, w: 70, h: 125 },     // Master Bed (snapped to Northwest)
        { x: 245, y: 25, w: 60, h: 125 },    // Kitchen (snapped to Northeast)
        { x: 195, y: 150, w: 110, h: 125 },  // Bath (snapped to Southeast)
        { x: 75, y: 150, w: 120, h: 125 },   // Living (snapped to Southwest)
        { x: 145, y: 25, w: 100, h: 125 }    // Pooja (snapped to Center)
      ],
      optimized: [
        { x: 75, y: 150, w: 120, h: 125 },   // Master Bed (Southwest) - Correct Vastu
        { x: 195, y: 150, w: 110, h: 125 },  // Kitchen (Southeast) - Correct Vastu
        { x: 75, y: 25, w: 70, h: 125 },     // Bath (Northwest) - Correct Vastu
        { x: 145, y: 25, w: 100, h: 125 },   // Living (Center)
        { x: 245, y: 25, w: 60, h: 125 }     // Pooja (Northeast) - Correct Vastu
      ],
      radarCenters: [
        { x: 135, y: 212.5 },
        { x: 250, y: 212.5 },
        { x: 110, y: 87.5 },
        { x: 195, y: 87.5 },
        { x: 275, y: 87.5 }
      ],
      rooms: [
        { name: 'Master Bed', key: 'bed', tag: 'Southwest' },
        { name: 'Kitchen', key: 'kitchen', tag: 'Agni (SE)' },
        { name: 'Bath & WC', key: 'bath', tag: 'Northwest' },
        { name: 'Living Room', key: 'living', tag: 'Vayu (W)' },
        { name: 'Pooja Room', key: 'pooja', tag: 'Eshanya (NE)' }
      ]
    }
  };

  // Helper delay function
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // CAD Crosshair path-drawing animation
  const tracePlot = (plotX, plotY, plotW, plotH) => {
    crosshairOpacity.setValue(0.9);
    crosshairPos.setValue({ x: plotX, y: plotY });
    Animated.sequence([
      Animated.timing(crosshairPos, { toValue: { x: plotX + plotW, y: plotY }, duration: 400, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(crosshairPos, { toValue: { x: plotX + plotW, y: plotY + plotH }, duration: 400, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(crosshairPos, { toValue: { x: plotX, y: plotY + plotH }, duration: 400, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(crosshairPos, { toValue: { x: plotX, y: plotY }, duration: 400, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(crosshairOpacity, { toValue: 0, duration: 250, useNativeDriver: false })
    ]).start();
  };

  // Loop runner
  useEffect(() => {
    let isMounted = true;

    const animateSequence = async () => {
      if (!isMounted) return;

      const currentData = variantData[variant];
      const targetW = variant === 1 ? 40 : 30;
      const targetH = variant === 1 ? 30 : 40;

      // --- STAGE 0: INITIALIZATION (Empty Plot, Wobble Compass, Counters) ---
      setStage(0);
      detailsOpacity.setValue(0);
      completeOpacity.setValue(0);
      completeScale.setValue(0.85);
      scanOpacity.setValue(0);
      scanY.setValue(0);
      plotOpacity.setValue(0);
      plotScale.setValue(0.95);
      gridOpacity.setValue(0);
      crosshairOpacity.setValue(0);
      vastuLinesOpacity.setValue(0);
      
      // Reset dimension counters
      setDispWidth(0);
      setDispHeight(0);
      
      // Reset statuses
      statusOpacities.forEach(anim => anim.setValue(0));
      statusOffsets.forEach(anim => anim.setValue(-12));
      
      // Reset rooms positions & sizes outside plot to simulate entering
      currentData.unoptimized.forEach((pos, idx) => {
        roomPositions[idx].setValue({ x: pos.x, y: CANVAS_HEIGHT + 40 });
        roomSizes[idx].setValue({ x: pos.w, y: pos.h });
        roomOpacities[idx].setValue(0);
      });

      await delay(400);
      if (!isMounted) return;

      // Magnetic physical compass spring wobble & plot fade-in
      compassRotation.setValue(variant === 1 ? -180 : -90);
      Animated.parallel([
        Animated.spring(compassRotation, {
          toValue: currentData.compassAngle,
          tension: 28,
          friction: 3.8,
          useNativeDriver: false
        }),
        Animated.timing(plotOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false
        }),
        Animated.timing(plotScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false
        })
      ]).start();

      // Trigger high-tech dimension count-up counter
      let countW = 0;
      let countH = 0;
      const countSteps = 15;
      const stepW = targetW / countSteps;
      const stepH = targetH / countSteps;
      let countTick = 0;
      
      const counterTimer = setInterval(() => {
        countTick++;
        countW += stepW;
        countH += stepH;
        if (countTick >= countSteps) {
          setDispWidth(targetW);
          setDispHeight(targetH);
          clearInterval(counterTimer);
        } else {
          setDispWidth(parseFloat(countW.toFixed(1)));
          setDispHeight(parseFloat(countH.toFixed(1)));
        }
      }, 50);

      await delay(1600);
      if (!isMounted) return;

      // --- STAGE 1: SCANNING & 3X3 GRID VASTU PURUSHA MATRIX ---
      setStage(1);
      scanOpacity.setValue(1);
      scanY.setValue(0);
      
      // Fade in traditional 3x3 Vastu Purusha matrix grid
      Animated.timing(gridOpacity, {
        toValue: 0.75,
        duration: 500,
        useNativeDriver: false
      }).start();

      // Sweeping laser bar down
      Animated.timing(scanY, {
        toValue: CANVAS_HEIGHT - 60,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();

      // Pulse background scan glow
      Animated.sequence([
        Animated.timing(scanGlowAnim, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(scanGlowAnim, { toValue: 0, duration: 900, useNativeDriver: false })
      ]).start();

      // Staggered Status checkmarks fading in
      for (let i = 0; i < 4; i++) {
        await delay(400);
        if (!isMounted) return;
        Animated.parallel([
          Animated.timing(statusOpacities[i], {
            toValue: 1,
            duration: 400,
            useNativeDriver: false
          }),
          Animated.timing(statusOffsets[i], {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false
          })
        ]).start();
      }

      await delay(800);
      if (!isMounted) return;

      // Fade out laser bar
      Animated.timing(scanOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();

      // --- STAGE 2: ROOM PLACEMENT (Drafting crosshair & snap-in) ---
      setStage(2);
      crosshairOpacity.setValue(1);
      
      // Animate rooms popping in guided by the red drafting crosshair
      for (let i = 0; i < 5; i++) {
        const targetPos = currentData.unoptimized[i];
        
        // Glide crosshair to new room center before snapping it
        const center = { x: targetPos.x + targetPos.w / 2, y: targetPos.y + targetPos.h / 2 };
        Animated.timing(crosshairPos, {
          toValue: center,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false
        }).start();

        await delay(180);
        if (!isMounted) return;

        Animated.parallel([
          Animated.timing(roomOpacities[i], {
            toValue: 1,
            duration: 450,
            useNativeDriver: false
          }),
          Animated.spring(roomPositions[i], {
            toValue: { x: targetPos.x, y: targetPos.y },
            friction: 6.5,
            tension: 40,
            useNativeDriver: false
          })
        ]).start();
        await delay(250);
        if (!isMounted) return;
      }

      await delay(1200);
      if (!isMounted) return;

      // --- STAGE 3: OPTIMIZATION (Radar target locks, crosshair glide, morph swap) ---
      setStage(3);
      
      // Fade in target locator rings (radar centers)
      Animated.timing(vastuLinesOpacity, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: false
      }).start();

      // Glide crosshair to central focal point
      const plotCenter = {
        x: currentData.plotX + currentData.plotW / 2,
        y: currentData.plotY + currentData.plotH / 2
      };
      Animated.timing(crosshairPos, {
        toValue: plotCenter,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start();

      await delay(300);
      if (!isMounted) return;

      // Morph rooms and swap positions into correct Vastu cardinal sectors
      const anims = currentData.optimized.map((targetOpt, idx) => {
        return Animated.parallel([
          Animated.timing(roomPositions[idx], {
            toValue: { x: targetOpt.x, y: targetOpt.y },
            duration: 1600,
            easing: Easing.out(Easing.back(0.7)),
            useNativeDriver: false
          }),
          Animated.timing(roomSizes[idx], {
            toValue: { x: targetOpt.w, y: targetOpt.h },
            duration: 1600,
            easing: Easing.out(Easing.back(0.7)),
            useNativeDriver: false
          })
        ]);
      });

      Animated.parallel(anims).start();

      await delay(2200);
      if (!isMounted) return;

      // --- STAGE 4: STRUCTURAL DETAILS (Trace walls, render architectural details) ---
      setStage(4);

      // Fade out scanning targets and Vastu Purusha grid
      Animated.parallel([
        Animated.timing(vastuLinesOpacity, { toValue: 0, duration: 400, useNativeDriver: false }),
        Animated.timing(gridOpacity, { toValue: 0, duration: 400, useNativeDriver: false })
      ]).start();

      // Trace plot boundary walls using CAD Crosshair
      tracePlot(currentData.plotX, currentData.plotY, currentData.plotW, currentData.plotH);
      await delay(300);
      if (!isMounted) return;

      // Fade/draw in walls, doors, windows, interior tags
      Animated.timing(detailsOpacity, {
        toValue: 1,
        duration: 850,
        useNativeDriver: false
      }).start();

      await delay(2000);
      if (!isMounted) return;

      // --- STAGE 5: COMPLETE & SUCCESS STATE ---
      setStage(5);
      Animated.parallel([
        Animated.timing(completeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false
        }),
        Animated.spring(completeScale, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: false
        })
      ]).start();

      await delay(4500);
      if (!isMounted) return;

      // --- STAGE 6: RESET (Morph out) ---
      setStage(6);
      Animated.parallel([
        Animated.timing(plotOpacity, { toValue: 0, duration: 600, useNativeDriver: false }),
        Animated.timing(completeOpacity, { toValue: 0, duration: 500, useNativeDriver: false }),
        Animated.timing(detailsOpacity, { toValue: 0, duration: 500, useNativeDriver: false }),
        ...roomOpacities.map(anim => Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: false }))
      ]).start();

      await delay(900);
      if (!isMounted) return;

      // Toggle variation to continue looping dynamically
      setVariant(prev => prev === 1 ? 2 : 1);
    };

    animateSequence();

    return () => {
      isMounted = false;
    };
  }, [variant]);

  // Interpolated rotation values for Compass
  const rotateCompass = compassRotation.interpolate({
    inputRange: [-180, 360],
    outputRange: ['-180deg', '360deg']
  });

  // Interpolated scan pulse background color
  const scanGlowBg = scanGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(14, 165, 233, 0)', 'rgba(14, 165, 233, 0.08)']
  });

  // Style helpers for drawing walls and windows in CAD blueprint
  const renderWallsAndWindows = () => {
    const currentData = variantData[variant];
    return (
      <Animated.View style={[styles.wallsContainer, { opacity: detailsOpacity }]}>
        {/* Draw outer walls overlay */}
        <View style={[
          styles.outerWallBorder, 
          { 
            left: currentData.plotX, 
            top: currentData.plotY, 
            width: currentData.plotW, 
            height: currentData.plotH 
          }
        ]}>
          {/* Windows (styled thin slots overlaying the wall) */}
          {variant === 1 ? (
            <>
              {/* Master Bed South Window */}
              <View style={[styles.windowSlot, { bottom: -3, left: 55, width: 40, height: 6 }]} />
              {/* Kitchen East Window */}
              <View style={[styles.windowSlotHorizontal, { right: -3, bottom: 40, width: 6, height: 40 }]} />
              {/* Living North Window */}
              <View style={[styles.windowSlot, { top: -3, left: 150, width: 50, height: 6 }]} />
            </>
          ) : (
            <>
              {/* Master Bed West Window */}
              <View style={[styles.windowSlotHorizontal, { left: -3, bottom: 40, width: 6, height: 45 }]} />
              {/* Kitchen South Window */}
              <View style={[styles.windowSlot, { bottom: -3, right: 35, width: 40, height: 6 }]} />
              {/* Living East Window */}
              <View style={[styles.windowSlotHorizontal, { right: -3, top: 60, width: 6, height: 40 }]} />
            </>
          )}
        </View>

        {/* Draw door swings */}
        {currentData.optimized.map((opt, idx) => {
          let doorStyle = {};
          let swingStyle = {};
          
          if (idx === 0) { // Master Bedroom Door (SW corner room, door on North-East side)
            doorStyle = { left: opt.x + opt.w - 24, top: opt.y, width: 24, height: 24 };
            swingStyle = { borderBottomWidth: 1.2, borderLeftWidth: 1.2, borderBottomLeftRadius: 24 };
          } else if (idx === 1) { // Kitchen Door (SE corner room, door on North-West side)
            doorStyle = { left: opt.x, top: opt.y, width: 24, height: 24 };
            swingStyle = { borderBottomWidth: 1.2, borderRightWidth: 1.2, borderBottomRightRadius: 24 };
          } else if (idx === 3) { // Living Main Door 
            doorStyle = { left: opt.x + 30, top: opt.y, width: 28, height: 28 };
            swingStyle = { borderBottomWidth: 1.2, borderLeftWidth: 1.2, borderBottomLeftRadius: 28 };
          } else {
            return null; // Skip door for other rooms to keep CAD clean
          }

          return (
            <View key={`door-${idx}`} style={[styles.doorWrapper, doorStyle]}>
              <View style={[styles.doorSwingArc, swingStyle]} />
              <View style={styles.doorLeaf} />
            </View>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.contentWrap}>
        
        {/* Header copy */}
        <View style={styles.textColumn}>
          <View style={styles.tagBadge}>
            <Ionicons name="sparkles-outline" size={12} color="#0EA5E9" style={{ marginRight: 4 }} />
            <Text style={styles.tagBadgeText}>
              {language === 'te' ? "భవిష్యత్ ఆర్కిటెక్చర్ టెక్నాలజీ" : "AI ARCHITECTURAL ENGINE"}
            </Text>
          </View>
          <Text style={styles.mainHeading}>
            {language === 'te' 
              ? "కేవలం ఒక డ్రాయింగ్ కాదు. మీ ఇంటిని నిర్మించడానికి ఒక స్మార్ట్ మార్గం." 
              : "Not Just a Drawing. A Smarter Way to Plan Your Home."}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'te'
              ? "మా ఇంటెలిజెంట్ లేఅవుట్ ఇంజిన్ మీ ప్లాట్‌ను విశ్లేషిస్తుంది, స్థలాన్ని ఆప్టిమైజ్ చేస్తుంది మరియు స్వయంచాలకంగా ప్రాక్టికల్ హౌస్ ప్లాన్‌ను సృష్టిస్తుంది."
              : "Our intelligent layout engine analyzes your plot, optimizes space, and creates a practical house plan automatically."}
          </Text>

          {/* Left panel for desktop view showing status logs */}
          {!isDesktop && <View style={{ height: 16 }} />}
          
          <View style={styles.statusBox}>
            <Text style={styles.statusBoxTitle}>
              {stage === 0 ? "Initialising Layout..." : stage === 1 ? "Analysing Plot Dimensions..." : stage < 5 ? "Optimising Layout Parameters..." : "Layout Optimization Complete"}
            </Text>
            
            <View style={styles.statusRowContainer}>
              <Animated.View style={[styles.statusItem, { opacity: statusOpacities[0], transform: [{ translateY: statusOffsets[0] }] }]}>
                <View style={styles.statusDotActive}>
                  <Ionicons name="checkmark-sharp" size={10} color="#06B6D4" />
                </View>
                <Text style={styles.statusText}>{language === 'te' ? "ప్లాట్ కొలతలు కనుగొనబడ్డాయి ✓" : "Plot dimensions detected ✓"}</Text>
              </Animated.View>

              <Animated.View style={[styles.statusItem, { opacity: statusOpacities[1], transform: [{ translateY: statusOffsets[1] }] }]}>
                <View style={styles.statusDotActive}>
                  <Ionicons name="checkmark-sharp" size={10} color="#06B6D4" />
                </View>
                <Text style={styles.statusText}>
                  {language === 'te' ? `దిశ గుర్తించబడింది (${currentFacing}) ✓` : `Direction detected (${currentFacing}) ✓`}
                </Text>
              </Animated.View>

              <Animated.View style={[styles.statusItem, { opacity: statusOpacities[2], transform: [{ translateY: statusOffsets[2] }] }]}>
                <View style={styles.statusDotActive}>
                  <Ionicons name="checkmark-sharp" size={10} color="#06B6D4" />
                </View>
                <Text style={styles.statusText}>{language === 'te' ? "స్థలం విశ్లేషించబడింది ✓" : "Space analyzed ✓"}</Text>
              </Animated.View>

              <Animated.View style={[styles.statusItem, { opacity: statusOpacities[3], transform: [{ translateY: statusOffsets[3] }] }]}>
                <View style={styles.statusDotActive}>
                  <Ionicons name="checkmark-sharp" size={10} color="#06B6D4" />
                </View>
                <Text style={styles.statusText}>{language === 'te' ? "గది అవసరాలు ప్రాసెస్ చేయబడ్డాయి ✓" : "Room requirements processed ✓"}</Text>
              </Animated.View>
            </View>

            {/* Live Data Badge */}
            <View style={styles.liveBadgeRow}>
              <View style={styles.liveMetaCard}>
                <Text style={styles.metaLabel}>PLOT FACING</Text>
                <Text style={styles.metaValue}>{currentFacing}</Text>
              </View>
              <View style={styles.liveMetaCard}>
                <Text style={styles.metaLabel}>SIZE</Text>
                <Text style={styles.metaValue}>{dispWidth} × {dispHeight} ft</Text>
              </View>
              <View style={styles.liveMetaCard}>
                <Text style={styles.metaLabel}>OPTIMIZATION</Text>
                <Text style={[styles.metaValue, { color: '#06B6D4' }]}>VASTU VEDIC</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CAD Animation Canvas Area */}
        <View style={styles.rightAnimationColumn}>
          <Animated.View style={[styles.cadConsoleWrapper, { backgroundColor: scanGlowBg }]}>
            
            {/* Grid Blueprint Background (Vertical & Horizontal lines) */}
            <View style={styles.blueprintGridLayer}>
              {Array(10).fill(0).map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLineV, { left: (i + 1) * (CANVAS_WIDTH / 11) }]} />
              ))}
              {Array(8).fill(0).map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLineH, { top: (i + 1) * (CANVAS_HEIGHT / 9) }]} />
              ))}
            </View>

            {/* North Compass */}
            <View style={styles.compassContainer}>
              <Animated.View style={[styles.compassNeedleWrap, { transform: [{ rotate: rotateCompass }] }]}>
                <View style={styles.needleNorth} />
                <View style={styles.needleSouth} />
              </Animated.View>
              <Text style={styles.compassLabel}>N</Text>
              <Text style={[styles.compassLabel, styles.compassLabelS]}>S</Text>
              <Text style={[styles.compassLabel, styles.compassLabelE]}>E</Text>
              <Text style={[styles.compassLabel, styles.compassLabelW]}>W</Text>
            </View>

            {/* Plot Boundary Rectangle */}
            <Animated.View style={[
              styles.plotBoundaryBox, 
              { 
                opacity: plotOpacity, 
                transform: [{ scale: plotScale }],
                left: variantData[variant].plotX,
                top: variantData[variant].plotY,
                width: variantData[variant].plotW,
                height: variantData[variant].plotH
              }
            ]}>
              {/* Outer dimension marks */}
              <View style={[styles.dimLineHorizontal, { top: -20 }]}>
                <View style={styles.dimTick} />
                <Text style={styles.dimText}>{dispWidth} ft</Text>
                <View style={styles.dimTick} />
              </View>
              <View style={[styles.dimLineVertical, { right: -22 }]}>
                <View style={styles.dimTickV} />
                <Text style={styles.dimTextV}>{dispHeight} ft</Text>
                <View style={styles.dimTickV} />
              </View>
            </Animated.View>

            {/* Vastu 3x3 Grid Overlay (Scanning Stage) */}
            <Animated.View style={[
              styles.vastuGridOverlay,
              {
                opacity: gridOpacity,
                left: variantData[variant].plotX,
                top: variantData[variant].plotY,
                width: variantData[variant].plotW,
                height: variantData[variant].plotH
              }
            ]}>
              {/* Grid Lines */}
              <View style={[styles.vastuGridLineV, { left: '33.3%' }]} />
              <View style={[styles.vastuGridLineV, { left: '66.6%' }]} />
              <View style={[styles.vastuGridLineH, { top: '33.3%' }]} />
              <View style={[styles.vastuGridLineH, { top: '66.6%' }]} />

              {/* Tonal quadrants labels */}
              <View style={[styles.vastuGridCell, { left: 0, top: 0 }]}><Text style={styles.vastuCellText}>NW</Text></View>
              <View style={[styles.vastuGridCell, { left: '33.3%', top: 0 }]}><Text style={styles.vastuCellText}>N</Text></View>
              <View style={[styles.vastuGridCell, { left: '66.6%', top: 0 }]}><Text style={styles.vastuCellText}>NE</Text></View>
              <View style={[styles.vastuGridCell, { left: 0, top: '33.3%' }]}><Text style={styles.vastuCellText}>W</Text></View>
              <View style={[styles.vastuGridCell, { left: '33.3%', top: '33.3%' }]}><Text style={[styles.vastuCellText, { color: '#0EA5E9' }]}>C</Text></View>
              <View style={[styles.vastuGridCell, { left: '66.6%', top: '33.3%' }]}><Text style={styles.vastuCellText}>E</Text></View>
              <View style={[styles.vastuGridCell, { left: 0, top: '66.6%' }]}><Text style={styles.vastuCellText}>SW</Text></View>
              <View style={[styles.vastuGridCell, { left: '33.3%', top: '66.6%' }]}><Text style={styles.vastuCellText}>S</Text></View>
              <View style={[styles.vastuGridCell, { left: '66.6%', top: '66.6%' }]}><Text style={styles.vastuCellText}>SE</Text></View>
            </Animated.View>

            {/* Vastu Target Rings Radar (Optimization Stage) */}
            {variantData[variant].radarCenters.map((radar, idx) => {
              const label = variantData[variant].rooms[idx].tag;
              return (
                <Animated.View 
                  key={`radar-${idx}`} 
                  style={[
                    styles.targetRadarRing, 
                    { 
                      opacity: vastuLinesOpacity,
                      left: radar.x - 22, 
                      top: radar.y - 22,
                      transform: [{ scale: radarPulseAnim }]
                    }
                  ]}
                >
                  <Text style={styles.radarLabelText}>{label}</Text>
                </Animated.View>
              );
            })}

            {/* Room Blocks (placed & morphed dynamically) */}
            {variantData[variant].rooms.map((room, idx) => {
              // Color palettes based on Vastu zones for visual richness
              const colors = {
                bed: { bg: 'rgba(14, 165, 233, 0.12)', border: '#0EA5E9', text: '#38BDF8' },       // Cyan (SW - Air)
                kitchen: { bg: 'rgba(239, 68, 68, 0.12)', border: '#EF4444', text: '#F87171' },   // Red (SE - Fire)
                bath: { bg: 'rgba(245, 158, 11, 0.12)', border: '#F59E0B', text: '#FBBF24' },     // Amber (NW - Wind)
                living: { bg: 'rgba(99, 102, 241, 0.12)', border: '#6366F1', text: '#818CF8' },   // Indigo (Center)
                pooja: { bg: 'rgba(16, 185, 129, 0.12)', border: '#10B981', text: '#34D399' }    // Green (NE - Water)
              }[room.key];

              return (
                <Animated.View 
                  key={`room-${idx}`} 
                  style={[
                    styles.roomBlock, 
                    {
                      opacity: roomOpacities[idx],
                      left: roomPositions[idx].x,
                      top: roomPositions[idx].y,
                      width: roomSizes[idx].x,
                      height: roomSizes[idx].y,
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }
                  ]}
                >
                  <View style={styles.roomCenterLabelBox}>
                    <Text numberOfLines={1} style={[styles.roomTitleText, { color: colors.text }]}>
                      {room.name}
                    </Text>
                    
                    {/* Interior dimension text visible during detail stage */}
                    <Animated.Text style={[styles.roomDimText, { opacity: detailsOpacity }]}>
                      {idx === 0 ? "14' x 11'" : idx === 1 ? "11' x 10'" : idx === 2 ? "6' x 8'" : idx === 3 ? "12' x 16'" : "6' x 6'"}
                    </Animated.Text>
                  </View>
                  
                  {/* Small absolute indicator for compliance corner */}
                  <View style={[styles.miniCornerIndicator, { backgroundColor: colors.border }]} />
                </Animated.View>
              );
            })}

            {/* Inner Walls overlay */}
            {renderWallsAndWindows()}

            {/* Scanning Laser Line (vertical sweep) */}
            <Animated.View style={[
              styles.laserScanningLine, 
              { 
                top: scanY, 
                opacity: scanOpacity,
                width: CANVAS_WIDTH 
              }
            ]}>
              <View style={styles.laserBarGlow} />
            </Animated.View>

            {/* CAD Crosshair Draft Indicator */}
            <Animated.View style={[
              styles.cadCrosshair,
              {
                opacity: crosshairOpacity,
                left: crosshairPos.x,
                top: crosshairPos.y
              }
            ]}>
              <View style={styles.crosshairLineH} />
              <View style={styles.crosshairLineV} />
              <View style={styles.crosshairCircle} />
            </Animated.View>

            {/* SUCCESS BANNER OVERLAY */}
            <Animated.View style={[
              styles.completeBanner,
              { 
                opacity: completeOpacity,
                transform: [{ scale: completeScale }]
              }
            ]}>
              <View style={styles.completeIconCircle}>
                <Ionicons name="checkmark-circle" size={24} color="#06B6D4" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.completeStatusTitle}>Optimal Layout Found ✓</Text>
                <Text style={styles.completeStatusDesc}>
                  Space Efficiency: <Text style={{ color: '#06B6D4', fontWeight: '800' }}>{currentEfficiency}</Text> | Vastu Compliant
                </Text>
              </View>
            </Animated.View>

          </Animated.View>
        </View>

      </View>

    </View>
  );
}

const getStyles = (isDesktop, theme) => StyleSheet.create({
  sectionContainer: {
    width: '100%',
    maxWidth: 1140,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
    gap: 48,
  },
  contentWrap: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 40,
  },
  textColumn: {
    flex: 1,
    minWidth: 320,
    gap: 16,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignSelf: 'flex-start',
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
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 34,
    letterSpacing: -0.5,
    ...Platform.select({
      web: { fontSize: 36, lineHeight: 44 }
    })
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },
  statusBox: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  statusBoxTitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statusRowContainer: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  liveMetaCard: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#070C18',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metaLabel: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '800',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  rightAnimationColumn: {
    flex: 1.1,
    minWidth: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadConsoleWrapper: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#070B14',
    borderColor: '#1E293B',
    borderWidth: 1.5,
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  blueprintGridLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.25,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.75,
    backgroundColor: '#334155',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.75,
    backgroundColor: '#334155',
  },
  compassContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 0.8,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(7, 11, 20, 0.6)',
  },
  compassNeedleWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  needleNorth: {
    width: 2.5,
    height: 11,
    backgroundColor: '#EF4444',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  needleSouth: {
    width: 2.5,
    height: 11,
    backgroundColor: '#94A3B8',
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  compassLabel: {
    position: 'absolute',
    top: -1,
    fontSize: 7.5,
    fontWeight: '900',
    color: '#38BDF8',
  },
  compassLabelS: { top: undefined, bottom: -1 },
  compassLabelE: { top: undefined, left: undefined, right: 1 },
  compassLabelW: { top: undefined, right: undefined, left: 1 },
  plotBoundaryBox: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    borderRadius: 2,
    backgroundColor: 'rgba(14, 165, 233, 0.02)',
  },
  dimLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimTick: {
    width: 1,
    height: 6,
    backgroundColor: '#38BDF8',
  },
  dimText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#38BDF8',
    backgroundColor: '#070B14',
    paddingHorizontal: 6,
    top: -2.5,
  },
  dimLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#38BDF8',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimTickV: {
    width: 6,
    height: 1,
    backgroundColor: '#38BDF8',
  },
  dimTextV: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#38BDF8',
    backgroundColor: '#070B14',
    paddingVertical: 4,
    transform: [{ rotate: '90deg' }],
  },
  roomBlock: {
    position: 'absolute',
    borderWidth: 1.2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  roomCenterLabelBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  roomTitleText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  roomDimText: {
    fontSize: 7.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  miniCornerIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  laserScanningLine: {
    position: 'absolute',
    left: 0,
    height: 1.5,
    backgroundColor: '#06B6D4',
    zIndex: 5,
  },
  laserBarGlow: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    top: -6,
  },
  wallsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  outerWallBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderRadius: 2,
  },
  windowSlot: {
    position: 'absolute',
    backgroundColor: '#070B14',
    borderColor: '#94A3B8',
    borderWidth: 0.8,
    borderStyle: 'dashed',
  },
  windowSlotHorizontal: {
    position: 'absolute',
    backgroundColor: '#070B14',
    borderColor: '#94A3B8',
    borderWidth: 0.8,
    borderStyle: 'dashed',
  },
  doorWrapper: {
    position: 'absolute',
    zIndex: 4,
  },
  doorSwingArc: {
    width: '100%',
    height: '100%',
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
  },
  doorLeaf: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1,
    height: '100%',
    backgroundColor: '#94A3B8',
  },
  completeBanner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#06B6D4',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 15,
  },
  completeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeStatusTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  completeStatusDesc: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  
  // Vastu Purusha 3x3 Grid Overlay styles
  vastuGridOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  vastuGridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.8,
    borderStyle: 'dashed',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderWidth: 0.8,
  },
  vastuGridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.8,
    borderStyle: 'dashed',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderWidth: 0.8,
  },
  vastuGridCell: {
    position: 'absolute',
    width: '33.3%',
    height: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vastuCellText: {
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(148, 163, 184, 0.3)',
  },

  // CAD Crosshair cursor style
  cadCrosshair: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  crosshairLineH: {
    position: 'absolute',
    width: 30,
    height: 0.8,
    backgroundColor: 'rgba(239, 68, 68, 0.75)',
  },
  crosshairLineV: {
    position: 'absolute',
    width: 0.8,
    height: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.75)',
  },
  crosshairCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: 'rgba(239, 68, 68, 0.9)',
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },

  // Target Radar Rings styles
  targetRadarRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.65)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  radarLabelText: {
    fontSize: 6.5,
    fontWeight: '800',
    color: '#06B6D4',
    textAlign: 'center',
    backgroundColor: '#070B14',
    paddingHorizontal: 2,
    borderRadius: 2,
  }
});
