import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, StatusBar } from 'react-native';
import { theme as staticTheme, lightTheme, darkTheme, crimsonTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import VastuLogo from './VastuLogo';

export default function VastuHeader({
  language,
  setLanguage,
  activeTheme = 'light',
  setActiveTheme,
  compassAngle = "0",
  showMenuButton = false,
  onMenuPress,
  activeTab,
  setActiveTab,
  navItems = [],
  hasCalculated = false,
  isDesktop = false
}) {
  const { width } = useWindowDimensions();
  const isTe = language === 'te';
  const [mobileOpen, setMobileOpen] = useState(false);

  const themeConfigs = {
    light: lightTheme,
    dark: darkTheme,
    crimson: crimsonTheme
  };
  const currentTheme = themeConfigs[activeTheme] || lightTheme;

  const appTitle = isTe ? "వాస్తు సర్వస్వం" : "Vastu Sarvaswam";
  const appSubtitle = isTe ? "స్వయం చాలిత వాస్తు ప్రణాళికా వ్యవస్థ" : "Architectural Vastu Auto-Layout";

  if (Platform.OS === 'web') {
    const isDark = activeTheme === 'dark';
    const isCrimson = activeTheme === 'crimson';
    
    // Theme-specific colors for the new Poppins/Geist style navbar
    const navBgColor = isDark ? '#121212' : (isCrimson ? '#FFF1F2' : '#FFFFFF');
    const navBorderColor = isDark ? '#27272A' : (isCrimson ? '#FFE4E6' : '#E4E4E7');
    
    // Capsule navigation bar background
    const capsuleBg = isDark ? '#1F1F1F' : (isCrimson ? '#F4EAEA' : '#F4F4F5');
    const capsuleBorder = isDark ? '#2D2D2D' : (isCrimson ? '#EAD6D6' : '#E4E4E7');
    
    // Active navigation button colors
    const activeItemBg = isDark ? '#121212' : (isCrimson ? '#FFFFFF' : '#FFFFFF');
    const activeItemBorder = isDark ? '#2D2D2D' : (isCrimson ? '#EAD6D6' : '#E4E4E7');
    const activeTextColor = isDark ? '#FBBF24' : (isCrimson ? '#990000' : '#18181B');
    const inactiveTextColor = isDark ? '#A1A1AA' : '#71717A';

    // Primary CTA button colors
    const getStartedBg = isDark ? '#FFFFFF' : (isCrimson ? '#990000' : '#18181B');
    const getStartedTextColor = isDark ? '#111111' : '#FFFFFF';

    return (
      <View style={[styles.webHeaderOuter, { backgroundColor: navBgColor, borderColor: navBorderColor }]}>
        <View style={styles.webHeaderContainer}>
          
          {/* Logo Section */}
          <TouchableOpacity style={styles.logoSection} activeOpacity={0.8} onPress={() => typeof setActiveTab === 'function' && setActiveTab('input')}>
            <View style={{ marginRight: 10, marginTop: 2 }}>
              <VastuLogo size={32} />
            </View>
            <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#111111' }]}>Vastu Sarvaswam</Text>
          </TouchableOpacity>

          {/* Center Capsule Navigation Links (Desktop viewports only) */}
          {isDesktop && navItems.length > 0 && (
            <View style={[styles.webCenterNavContainer, { backgroundColor: capsuleBg, borderColor: capsuleBorder }]}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const isLocked = item.id !== 'input' && !hasCalculated;
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.webCenterNavBtn,
                      isActive && [styles.webCenterNavBtnActive, { backgroundColor: activeItemBg, borderColor: activeItemBorder }]
                    ]}
                    onPress={() => !isLocked && typeof setActiveTab === 'function' && setActiveTab(item.id)}
                    activeOpacity={isLocked ? 0.5 : 0.8}
                  >
                    <Text style={[
                      styles.webCenterNavBtnText,
                      isActive 
                        ? { color: activeTextColor, fontWeight: '700' }
                        : { color: inactiveTextColor }
                    ]}>
                      {language === 'te' ? item.labelTe : item.labelEn}
                    </Text>
                    {isLocked && (
                      <Ionicons 
                        name="lock-closed" 
                        size={10} 
                        color={inactiveTextColor} 
                        style={{ marginLeft: 4, opacity: 0.5 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Right Actions section */}
          <View style={styles.webRightSection}>
            {/* Theme switcher */}
            <TouchableOpacity 
              style={[styles.webThemeCycleBtn, { borderColor: navBorderColor, backgroundColor: capsuleBg }]} 
              onPress={() => {
                if (typeof setActiveTheme === 'function') {
                  if (activeTheme === 'light') setActiveTheme('dark');
                  else if (activeTheme === 'dark') setActiveTheme('crimson');
                  else setActiveTheme('light');
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="color-filter-outline" size={18} color={isDark ? '#FFFFFF' : '#111111'} />
            </TouchableOpacity>

            {/* Language cycling */}
            <TouchableOpacity 
              style={[styles.webLangSelectorCompact, { borderColor: navBorderColor, backgroundColor: capsuleBg }]}
              onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
              activeOpacity={0.8}
            >
              <Text style={[styles.webLangText, { color: isDark ? '#FFFFFF' : '#111111' }]}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
            </TouchableOpacity>

            {/* Premium CTA Button */}
            {isDesktop && (
              <TouchableOpacity 
                style={[styles.webGetStartedBtn, { backgroundColor: getStartedBg }]} 
                onPress={() => typeof setActiveTab === 'function' && setActiveTab('login')}
                activeOpacity={0.8}
              >
                <Text style={[styles.webGetStartedText, { color: getStartedTextColor }]}>
                  {language === 'te' ? "ప్రారంభించండి" : "Get Started"}
                </Text>
                <View style={styles.webArrowCircle}>
                  <Ionicons name="arrow-forward" size={11} color="#3F3F46" />
                </View>
              </TouchableOpacity>
            )}

            {/* Mobile menu trigger button */}
            {!isDesktop && (
              <TouchableOpacity 
                onPress={() => setMobileOpen(!mobileOpen)} 
                style={[styles.webHeaderMenuBtn, { borderColor: navBorderColor, backgroundColor: capsuleBg }]}
                activeOpacity={0.7}
              >
                <Ionicons name={mobileOpen ? "close-outline" : "menu-outline"} size={24} color={isDark ? '#FFFFFF' : '#111111'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Mobile dropdown menu overlay drawer */}
        {!isDesktop && mobileOpen && (
          <View style={[styles.webMobileDrawer, { backgroundColor: navBgColor, borderTopColor: navBorderColor }]}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isLocked = item.id !== 'input' && !hasCalculated;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.webMobileLink, isActive && { backgroundColor: capsuleBg }]}
                  onPress={() => {
                    if (!isLocked) {
                      setMobileOpen(false);
                      if (typeof setActiveTab === 'function') setActiveTab(item.id);
                    }
                  }}
                  activeOpacity={isLocked ? 0.5 : 0.8}
                >
                  <Text style={[
                    styles.webMobileLinkText, 
                    { color: isActive ? activeTextColor : inactiveTextColor }, 
                    isActive && { fontWeight: '700' },
                    isLocked && { opacity: 0.4 }
                  ]}>
                    {language === 'te' ? item.labelTe : item.labelEn}
                  </Text>
                  {isLocked && (
                    <Ionicons name="lock-closed" size={12} color={inactiveTextColor} style={{ opacity: 0.4 }} />
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity 
              style={[styles.webGetStartedBtn, { backgroundColor: getStartedBg, marginTop: 12, alignSelf: 'stretch', justifyContent: 'center' }]} 
              onPress={() => {
                setMobileOpen(false);
                if (typeof setActiveTab === 'function') setActiveTab('input');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.webGetStartedText, { color: getStartedTextColor }]}>
                {language === 'te' ? "ప్రారంభించండి" : "Get Started"}
              </Text>
              <View style={styles.webArrowCircle}>
                <Ionicons name="arrow-forward" size={11} color="#3F3F46" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Mobile App Native Viewport Header (Original Design - Unchanged)
  return (
    <View style={[styles.appHeaderOuter, { backgroundColor: currentTheme.colors.accent }]}>
      <View style={[styles.appHeaderContainer, { backgroundColor: currentTheme.colors.primary }]}>
        <View style={styles.appHeaderBody}>
          
          {/* Left Side: Brand Logo and Title */}
          <View style={styles.appLeftSection}>
            <View style={{ marginRight: 10, alignSelf: 'center' }}>
              <VastuLogo size={30} />
            </View>
            <View style={styles.appTextGroup}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }}>{appTitle}</Text>
              <Text style={{ color: '#EEF2F6', fontSize: 9, fontWeight: '500', opacity: 0.75, marginTop: 1 }}>{appSubtitle}</Text>
            </View>
          </View>

          {/* Right Side: Tools & Actions */}
          <View style={styles.appRightSection}>
            
            <TouchableOpacity 
              style={styles.appThemeBtn} 
              onPress={() => {
                if (typeof setActiveTheme === 'function') {
                  if (activeTheme === 'light') setActiveTheme('dark');
                  else if (activeTheme === 'dark') setActiveTheme('crimson');
                  else setActiveTheme('light');
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="color-filter-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.appLangBtn}
              onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
              activeOpacity={0.8}
            >
              <Text style={styles.appLangText}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[styles.appGoldAccentLine, { backgroundColor: currentTheme.colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  webHeaderOuter: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 999,
  },
  webHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 78,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'web' ? 'Playfair Display' : 'System',
  },
  webCenterNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  webCenterNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  webCenterNavBtnActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  webCenterNavBtnText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Platform.OS === 'web' ? 'Outfit' : 'System',
  },
  webRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webThemeCycleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLangSelectorCompact: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLangText: {
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Outfit' : 'System',
  },
  webGetStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 24,
  },
  webGetStartedText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'Outfit' : 'System',
  },
  webArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHeaderMenuBtn: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMobileDrawer: {
    borderTopWidth: 1,
    padding: 16,
    width: '100%',
  },
  webMobileLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  webMobileLinkText: {
    fontSize: 14.5,
    fontWeight: '500',
  },

  // App native styles (Unchanged)
  appHeaderOuter: {
    paddingBottom: 4.5,
    paddingHorizontal: 2.5,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    zIndex: 100,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  appHeaderContainer: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 48 : (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 4 : 20),
    paddingBottom: 8,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  appHeaderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 76,
  },
  appLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  appLogoBadge: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  appTextGroup: {
    justifyContent: 'center',
  },
  appRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appThemeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  appLangBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  appLangText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  appGoldAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 2.5,
    right: 2.5,
    height: 4.5,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  }
});
