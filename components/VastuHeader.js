import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, StatusBar } from 'react-native';
import { theme, lightTheme, darkTheme, crimsonTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VastuHeader({
  language,
  setLanguage,
  activeTheme = 'light',
  setActiveTheme,
  compassAngle = "0"
}) {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const isTe = language === 'te';

  const themeConfigs = {
    light: lightTheme,
    dark: darkTheme,
    crimson: crimsonTheme
  };
  const currentTheme = themeConfigs[activeTheme] || lightTheme;

  const appTitle = isTe ? "వాస్తు సర్వస్వం" : "Vastu Sarvaswam";
  const appSubtitle = isTe ? "స్వయం చాలిత వాస్తు ప్రణాళికా వ్యవస్థ" : "Architectural Vastu Auto-Layout";

  return (
    <View style={[styles.headerContainer, { backgroundColor: currentTheme.colors.primary }]}>
      <View style={styles.headerBody}>
        {/* Left Side: Brand Logo and Title */}
        <View style={styles.leftSection}>
          <View style={[styles.logoBadge, { borderColor: currentTheme.colors.accent }]}>
            <Ionicons name="compass" size={22} color={currentTheme.colors.accent} />
          </View>
          <View style={styles.textGroup}>
            <Text style={styles.titleText}>{appTitle}</Text>
            <Text style={styles.subtitleText}>{appSubtitle}</Text>
          </View>
        </View>

        {/* Right Side: Tools & Actions */}
        <View style={styles.rightSection}>
          {/* Single Theme Cycle Button */}
          <TouchableOpacity 
            style={styles.themeCycleBtn} 
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

          {isCompact ? (
            <TouchableOpacity 
              style={styles.langSelectorCompact}
              onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
              activeOpacity={0.8}
            >
              <Text style={styles.langText}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
            </TouchableOpacity>
          ) : (
            <React.Fragment>
              <TouchableOpacity 
                style={styles.langSelector}
                onPress={() => setLanguage(language === 'en' ? 'te' : 'en')}
                activeOpacity={0.8}
              >
                <Ionicons name="globe-outline" size={14} color="#FFFFFF" />
                <Text style={styles.langText}>{language === 'en' ? 'తెలుగు' : 'EN'}</Text>
              </TouchableOpacity>
              
              <View style={styles.verticalDivider} />

              <TouchableOpacity style={styles.profileCircle}>
                <Text style={[styles.profileInitials, { color: currentTheme.colors.primary }]}>VM</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </View>
      {/* Unique Golden structural accent line */}
      <View style={[styles.goldAccentLine, { backgroundColor: currentTheme.colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : (Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 16),
    zIndex: 100,
    position: 'relative',
  },
  headerBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  textGroup: {
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitleText: {
    color: '#EEF2F6',
    fontSize: 9,
    fontWeight: '500',
    opacity: 0.7,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeCycleBtn: {
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
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  langSelectorCompact: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  langText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 11,
    fontWeight: '700',
  },
  goldAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  }
});
