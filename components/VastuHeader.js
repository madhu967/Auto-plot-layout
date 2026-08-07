import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, StatusBar } from 'react-native';
import { theme as staticTheme, lightTheme, darkTheme, crimsonTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

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

  const themeConfigs = {
    light: lightTheme,
    dark: darkTheme,
    crimson: crimsonTheme
  };
  const currentTheme = themeConfigs[activeTheme] || lightTheme;

  const appTitle = isTe ? "వాస్తు సర్వస్వం" : "Vastu Sarvaswam";
  const appSubtitle = isTe ? "స్వయం చాలిత వాస్తు ప్రణాళికా వ్యవస్థ" : "Architectural Vastu Auto-Layout";

  // Web header properties
  const webHeaderBg = currentTheme.colors.surface;
  const webHeaderTextColor = currentTheme.colors.text;
  const webHeaderBorderColor = currentTheme.colors.border;
  const webLogoBadgeBg = activeTheme === 'dark' ? '#1F1F1F' : '#F3F4F6';
  const webLogoBadgeBorder = activeTheme === 'dark' ? '#2D2D2D' : '#E5E7EB';

  // Calculate responsive web header padding (very slight padding)
  const webPaddingHorizontal = width >= 768 ? 20 : 12;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webHeaderOuter, { borderColor: webHeaderBorderColor, backgroundColor: webHeaderBg }]}>
        <View style={styles.webHeaderContainer}>
          <View style={styles.webHeaderBody}>
            
            {/* Left Side: Brand Logo and Title */}
            <View style={styles.webLeftSection}>
              <View style={[styles.webLogoBadge, { backgroundColor: webLogoBadgeBg, borderColor: webLogoBadgeBorder }]}>
                <Ionicons name="compass" size={20} color={currentTheme.colors.primary} />
              </View>
              <View style={styles.webTextGroup}>
                <Text style={[styles.webTitleText, { color: webHeaderTextColor }]}>{appTitle}</Text>
                <Text style={[styles.webSubtitleText, { color: currentTheme.colors.textSecondary }]}>{appSubtitle}</Text>
              </View>
            </View>

            {/* Center Side: Capsule Navigation Bar (Desktop Website Only) */}
            {isDesktop && navItems.length > 0 && (
              <View style={[
                styles.webCenterNavContainer, 
                { 
                  backgroundColor: activeTheme === 'dark' ? '#1F1F1F' : '#F4F4F5', 
                  borderColor: activeTheme === 'dark' ? '#2D2D2D' : '#E4E4E7' 
                }
              ]}>
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const isLocked = item.id !== 'input' && !hasCalculated;
                  
                  const activeItemBg = activeTheme === 'dark' ? '#121212' : '#FFFFFF';
                  const activeItemBorder = activeTheme === 'dark' ? '#2D2D2D' : '#E4E4E7';
                  
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
                          ? { color: webHeaderTextColor, fontWeight: '600' }
                          : { color: activeTheme === 'dark' ? '#A1A1AA' : '#71717A' },
                        isLocked && { opacity: 0.4 }
                      ]}>
                        {language === 'te' ? item.labelTe : item.labelEn}
                      </Text>
                      {isLocked && (
                        <Ionicons 
                          name="lock-closed" 
                          size={10} 
                          color={activeTheme === 'dark' ? '#A1A1AA' : '#71717A'} 
                          style={{ marginLeft: 4, opacity: 0.6 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Right Side: Tools & Actions */}
            <View style={styles.webRightSection}>
              
              {/* Single Theme Cycle Button */}
              <TouchableOpacity 
                style={[styles.webThemeCycleBtn, { borderColor: webHeaderBorderColor, backgroundColor: webLogoBadgeBg }]} 
                onPress={() => {
                  if (typeof setActiveTheme === 'function') {
                    if (activeTheme === 'light') setActiveTheme('dark');
                    else if (activeTheme === 'dark') setActiveTheme('crimson');
                    else setActiveTheme('light');
                  }
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="color-filter-outline" size={18} color={webHeaderTextColor} style={{ opacity: 0.95 }} />
              </TouchableOpacity>

              {/* Compact language selector */}
              <TouchableOpacity 
                style={[styles.webLangSelectorCompact, { borderColor: webHeaderBorderColor, backgroundColor: webLogoBadgeBg }]}
                onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
                activeOpacity={0.8}
              >
                <Text style={[styles.webLangText, { color: webHeaderTextColor }]}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
              </TouchableOpacity>

              {/* "Get Started" Action Button (Desktop Only) */}
              {isDesktop && (
                <TouchableOpacity 
                  style={[
                    styles.webGetStartedBtn, 
                    { backgroundColor: activeTheme === 'dark' ? '#FFFFFF' : currentTheme.colors.primary }
                  ]}
                  onPress={() => {
                    if (typeof setActiveTab === 'function') {
                      setActiveTab('input');
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.webGetStartedText,
                    { color: activeTheme === 'dark' ? currentTheme.colors.primary : '#FFFFFF' }
                  ]}>
                    {language === 'te' ? "ప్రారంభించండి" : "Get Started"}
                  </Text>
                  <View style={[
                    styles.webGetStartedArrowCircle,
                    { backgroundColor: activeTheme === 'dark' ? currentTheme.colors.primary : '#FFFFFF' }
                  ]}>
                    <Ionicons 
                      name="arrow-forward" 
                      size={12} 
                      color={activeTheme === 'dark' ? '#FFFFFF' : currentTheme.colors.primary} 
                    />
                  </View>
                </TouchableOpacity>
              )}

              {/* Hamburger menu button for small web layouts */}
              {showMenuButton && (
                <TouchableOpacity onPress={onMenuPress} style={[styles.webHeaderMenuBtn, { borderColor: webHeaderBorderColor, backgroundColor: webLogoBadgeBg }]}>
                  <Ionicons name="menu-outline" size={24} color={webHeaderTextColor} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Mobile App Native Viewport Header (Original Design - Gold border wrapper, primary blue/crimson container background, gold accent line)
  return (
    <View style={[styles.appHeaderOuter, { backgroundColor: currentTheme.colors.accent }]}>
      <View style={[styles.appHeaderContainer, { backgroundColor: currentTheme.colors.primary }]}>
        <View style={styles.appHeaderBody}>
          
          {/* Left Side: Brand Logo and Title */}
          <View style={styles.appLeftSection}>
            <View style={[styles.appLogoBadge, { borderColor: currentTheme.colors.accent }]}>
              <Ionicons name="compass" size={22} color={currentTheme.colors.accent} />
            </View>
            <View style={styles.appTextGroup}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }}>{appTitle}</Text>
              <Text style={{ color: '#EEF2F6', fontSize: 9, fontWeight: '500', opacity: 0.75, marginTop: 1 }}>{appSubtitle}</Text>
            </View>
          </View>

          {/* Right Side: Tools & Actions */}
          <View style={styles.appRightSection}>
            
            {/* Theme Select */}
            <TouchableOpacity 
              style={[styles.appThemeBtn, { borderColor: 'rgba(255, 255, 255, 0.15)' }]} 
              onPress={() => {
                if (typeof setActiveTheme === 'function') {
                  if (activeTheme === 'light') setActiveTheme('dark');
                  else if (activeTheme === 'dark') setActiveTheme('crimson');
                  else setActiveTheme('light');
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="color-filter-outline" size={18} color="#FFFFFF" style={{ opacity: 0.95 }} />
            </TouchableOpacity>

            {/* Language Selector */}
            <TouchableOpacity 
              style={[styles.appLangBtn, { borderColor: 'rgba(255, 255, 255, 0.15)' }]}
              onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      
      {/* Unique Golden structural accent line */}
      <View style={[styles.appGoldAccentLine, { backgroundColor: currentTheme.colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webHeaderOuter: {
    borderWidth: 1,
    zIndex: 100,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  webHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  webHeaderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  webLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  webLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
  },
  webTextGroup: {
    justifyContent: 'center',
  },
  webTitleText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  webSubtitleText: {
    fontSize: 9,
    fontWeight: '600',
    opacity: 0.8,
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  webCenterNavBtnText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  webRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webThemeCycleBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLangSelectorCompact: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLangText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  webGetStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 24,
  },
  webGetStartedText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  webGetStartedArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHeaderMenuBtn: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // App native styles
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
  appTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appSubtitleText: {
    color: '#EEF2F6',
    fontSize: 9,
    fontWeight: '500',
    opacity: 0.7,
    marginTop: 1,
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
