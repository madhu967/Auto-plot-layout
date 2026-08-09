import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Animated, 
  Easing,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../constants/theme';

export default function LoginScreen({ onLoginSuccess, theme }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  // Responsive breakpoints
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = signin, 1 = signup

  // Toggle modes with sliding animation
  const toggleMode = (targetMode) => {
    if (loading) return;
    
    const targetValue = targetMode === 'signup' ? 1 : 0;
    setMode(targetMode);
    
    Animated.timing(slideAnim, {
      toValue: targetValue,
      duration: 550,
      easing: Easing.bezier(0.25, 1, 0.5, 1), // Custom cubic bezier for a smooth premium ease-out
      useNativeDriver: false,
    }).start();
  };

  const handleAuthSubmit = () => {
    if (loading) return;
    
    // Quick validation
    if (!email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (mode === 'signup' && !agreeTerms) {
      alert('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    // Simulate API call for auth
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  // Interpolated values for sliding panels on Desktop Web View
  const containerWidth = 840;
  const halfContainerWidth = containerWidth / 2;

  const imageTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, halfContainerWidth],
  });

  const formTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -halfContainerWidth],
  });

  // Cross-fading and shifting forms inside Form panel (works on both Mobile and Desktop)
  const signinFormOpacity = slideAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0, 0],
  });

  const signinFormTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const signupFormOpacity = slideAnim.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });

  const signupFormTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const activeTheme = theme || lightTheme;
  const styles = getStyles(activeTheme);

  // Derive checkmark color and border styling dynamically
  const checkboxCheckedBg = activeTheme.colors.primary === '#1a1a1a' ? activeTheme.colors.accent : activeTheme.colors.primary;

  return (
    <View style={styles.outerContainer}>
      {/* Background decoration */}
      <View style={styles.bgGlowLeft} />
      <View style={styles.bgGlowRight} />

      <View style={[
        styles.cardContainer,
        isDesktop ? styles.desktopCard : styles.mobileCard
      ]}>
        
        {/* DESKTOP SPLIT PANEL VIEW */}
        {isDesktop ? (
          <View style={styles.splitWrapper}>
            {/* Sliding Image Panel */}
            <Animated.View style={[
              styles.imagePanel,
              { transform: [{ translateX: imageTranslateX }] }
            ]}>
              <Image 
                source={require('../assets/login.jpg')}
                style={styles.splitImage}
                resizeMode="cover"
              />
              {/* Premium overlay with subtle branding */}
              <View style={styles.imageOverlay}>
                <View style={styles.overlayContent}>
                  <Text style={styles.overlayTitle}>Smart Plot Vastu</Text>
                  <Text style={styles.overlaySubtitle}>Beautiful architectural layouts created instantly under Vedic Vastu standards.</Text>
                </View>
              </View>
            </Animated.View>

            {/* Sliding Form Panel */}
            <Animated.View style={[
              styles.formPanel,
              { transform: [{ translateX: formTranslateX }] }
            ]}>
              
              {/* SIGN IN FORM CONTAINER */}
              <Animated.View style={[
                styles.formInnerContainer,
                { 
                  opacity: signinFormOpacity,
                  transform: [{ translateX: signinFormTranslateX }],
                  pointerEvents: mode === 'signin' ? 'auto' : 'none'
                }
              ]}>
                <View style={styles.formWidthLock}>
                  <Text style={styles.formTitle}>Sign in</Text>
                  <Text style={styles.formSubtitle}>
                    Welcome back! Please sign in to continue
                  </Text>

                  {/* Email Input */}
                  <View style={[styles.inputWrapper, { marginTop: 24 }]}>
                    <Ionicons name="mail-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Email id"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Password Input */}
                  <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Options row: Remember Me & Forgot Password */}
                  <View style={styles.optionsRow}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer} 
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.customCheckbox, 
                        rememberMe && { backgroundColor: checkboxCheckedBg, borderColor: checkboxCheckedBg }
                      ]}>
                        {rememberMe && <Ionicons name="checkmark" size={12} color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />}
                      </View>
                      <Text style={styles.checkboxLabel}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleAuthSubmit}
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />
                    ) : (
                      <Text style={styles.submitButtonText}>Login</Text>
                    )}
                  </TouchableOpacity>

                  {/* Mode toggle */}
                  <View style={styles.toggleFooter}>
                    <Text style={styles.toggleFooterText}>
                      Don’t have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => toggleMode('signup')}>
                      <Text style={styles.toggleLinkText}>Sign up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>

              {/* SIGN UP FORM CONTAINER */}
              <Animated.View style={[
                styles.formInnerContainer,
                { 
                  opacity: signupFormOpacity,
                  transform: [{ translateX: signupFormTranslateX }],
                  pointerEvents: mode === 'signup' ? 'auto' : 'none'
                }
              ]}>
                <View style={styles.formWidthLock}>
                  <Text style={styles.formTitle}>Sign up</Text>
                  <Text style={styles.formSubtitle}>
                    Create an account to get started
                  </Text>

                  {/* Full Name Input */}
                  <View style={[styles.inputWrapper, { marginTop: 24 }]}>
                    <Ionicons name="person-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Full Name"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  {/* Email Input */}
                  <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                    <Ionicons name="mail-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Email id"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Password Input */}
                  <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Confirm Password Input */}
                  <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Confirm Password"
                      placeholderTextColor={activeTheme.colors.textSecondary}
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Terms Checkbox */}
                  <View style={styles.optionsRow}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer} 
                      onPress={() => setAgreeTerms(!agreeTerms)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.customCheckbox, 
                        agreeTerms && { backgroundColor: checkboxCheckedBg, borderColor: checkboxCheckedBg }
                      ]}>
                        {agreeTerms && <Ionicons name="checkmark" size={12} color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleAuthSubmit}
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />
                    ) : (
                      <Text style={styles.submitButtonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>

                  {/* Mode toggle */}
                  <View style={styles.toggleFooter}>
                    <Text style={styles.toggleFooterText}>
                      Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => toggleMode('signin')}>
                      <Text style={styles.toggleLinkText}>Sign in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>

            </Animated.View>
          </View>
        ) : (
          
          /* MOBILE SINGLE PANEL CARD (No Split, Pure cross-fade layout) */
          <View style={styles.mobileWrapper}>
            {/* Dynamic Sign In / Register Card View */}
            {mode === 'signin' ? (
              <Animated.View style={[
                styles.mobileFormContainer,
                { 
                  opacity: signinFormOpacity,
                  transform: [{ translateX: signinFormTranslateX }]
                }
              ]}>
                <Text style={styles.formTitle}>Sign in</Text>
                <Text style={styles.formSubtitle}>
                  Welcome back! Please sign in to continue
                </Text>

                {/* Email Input */}
                <View style={[styles.inputWrapper, { marginTop: 24 }]}>
                  <Ionicons name="mail-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Email id"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                </View>

                {/* Options row */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.customCheckbox, 
                      rememberMe && { backgroundColor: checkboxCheckedBg, borderColor: checkboxCheckedBg }
                    ]}>
                      {rememberMe && <Ionicons name="checkmark" size={12} color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />}
                    </View>
                    <Text style={styles.checkboxLabel}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleAuthSubmit}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />
                  ) : (
                    <Text style={styles.submitButtonText}>Login</Text>
                  )}
                </TouchableOpacity>

                {/* Mode toggle */}
                <View style={styles.toggleFooter}>
                  <Text style={styles.toggleFooterText}>
                    Don’t have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => toggleMode('signup')}>
                    <Text style={styles.toggleLinkText}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              <Animated.View style={[
                styles.mobileFormContainer,
                { 
                  opacity: signupFormOpacity,
                  transform: [{ translateX: signupFormTranslateX }]
                }
              ]}>
                <Text style={styles.formTitle}>Sign up</Text>
                <Text style={styles.formSubtitle}>
                  Create an account to get started
                </Text>

                {/* Full Name Input */}
                <View style={[styles.inputWrapper, { marginTop: 24 }]}>
                  <Ionicons name="person-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Full Name"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                {/* Email Input */}
                <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                  <Ionicons name="mail-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Email id"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                </View>

                {/* Confirm Password Input */}
                <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={activeTheme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    placeholderTextColor={activeTheme.colors.textSecondary}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                  />
                </View>

                {/* Terms Checkbox */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setAgreeTerms(!agreeTerms)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.customCheckbox, 
                      agreeTerms && { backgroundColor: checkboxCheckedBg, borderColor: checkboxCheckedBg }
                    ]}>
                      {agreeTerms && <Ionicons name="checkmark" size={12} color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      I agree to Terms & Conditions
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleAuthSubmit}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={activeTheme.colors.primary === '#1a1a1a' ? '#000000' : '#FFF'} />
                  ) : (
                    <Text style={styles.submitButtonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>

                {/* Mode toggle */}
                <View style={styles.toggleFooter}>
                  <Text style={styles.toggleFooterText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => toggleMode('signin')}>
                    <Text style={styles.toggleLinkText}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme) => {
  const isDark = theme.colors.background === '#000000' || theme.colors.background === '#121212';
  const ctaBgColor = theme.colors.primary === '#1a1a1a' ? theme.colors.accent : theme.colors.primary;
  const ctaTextColor = theme.colors.primary === '#1a1a1a' ? '#000000' : '#FFFFFF';
  
  return StyleSheet.create({
    outerContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
    },
    bgGlowLeft: {
      position: 'absolute',
      width: 350,
      height: 350,
      borderRadius: 175,
      backgroundColor: theme.colors.primary === '#1a1a1a' ? 'rgba(251, 191, 36, 0.06)' : theme.colors.primary + '18',
      top: -100,
      left: -100,
      ...Platform.select({
        web: { filter: 'blur(80px)' },
      })
    },
    bgGlowRight: {
      position: 'absolute',
      width: 350,
      height: 350,
      borderRadius: 175,
      backgroundColor: theme.colors.accent + '12',
      bottom: -100,
      right: -100,
      ...Platform.select({
        web: { filter: 'blur(80px)' },
      })
    },
    cardContainer: {
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.4 : 0.08,
      shadowRadius: 24,
      elevation: 8,
      overflow: 'hidden',
      borderWidth: isDark ? 1.5 : 0,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    desktopCard: {
      width: 840,
      height: 480,
    },
    mobileCard: {
      width: '90%',
      maxWidth: 400,
      paddingVertical: 24,
      paddingHorizontal: 24,
    },
    splitWrapper: {
      flex: 1,
      flexDirection: 'row',
      position: 'relative',
    },
    imagePanel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 420,
      height: '100%',
      zIndex: 10,
    },
    splitImage: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.primary === '#1a1a1a' ? 'rgba(18, 18, 18, 0.75)' : 'rgba(7, 2, 98, 0.45)',
      justifyContent: 'flex-end',
      padding: 36,
    },
    overlayContent: {
      gap: 8,
    },
    overlayTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFF',
    },
    overlaySubtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.85)',
      lineHeight: 20,
    },
    formPanel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 420,
      width: 420,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5,
    },
    formInnerContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 36,
    },
    formWidthLock: {
      width: '100%',
      maxWidth: 320,
    },
    mobileWrapper: {
      width: '100%',
      alignItems: 'center',
    },
    mobileFormContainer: {
      width: '100%',
    },
    formTitle: {
      fontSize: 28,
      fontWeight: '600',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    formSubtitle: {
      fontSize: 13,
      marginTop: 4,
      lineHeight: 18,
      color: theme.colors.textSecondary,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      height: 44,
      borderRadius: 22,
      paddingLeft: 20,
      width: '100%',
      overflow: 'hidden',
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    inputIcon: {
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      height: '100%',
      fontSize: 14,
      color: theme.colors.text,
      ...Platform.select({
        web: { outlineStyle: 'none' }
      })
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      width: '100%',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customCheckbox: {
      width: 18,
      height: 18,
      borderWidth: 1.5,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      borderColor: theme.colors.border,
    },
    checkboxLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    forgotPasswordLink: {
      fontSize: 13,
      textDecorationLine: 'underline',
      color: theme.colors.textSecondary,
    },
    submitButton: {
      marginTop: 20,
      width: '100%',
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ctaBgColor,
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: ctaTextColor,
    },
    toggleFooter: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      width: '100%',
    },
    toggleFooterText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    toggleLinkText: {
      fontSize: 13,
      color: ctaBgColor,
      fontWeight: '600',
    },
  });
};
