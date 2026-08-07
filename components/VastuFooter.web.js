import React, { useState } from 'react';
import { theme as staticTheme, lightTheme, darkTheme, crimsonTheme } from '../constants/theme';

export default function VastuFooter({ language, theme: propTheme, activeTheme = 'light', style }) {
  const isTe = language === 'te';
  const [email, setEmail] = useState('');

  const themeConfigs = {
    light: lightTheme,
    dark: darkTheme,
    crimson: crimsonTheme
  };
  const currentTheme = themeConfigs[activeTheme] || lightTheme;

  const footerBg = currentTheme.colors.surface;
  const footerText = currentTheme.colors.textSecondary;
  const footerTitle = currentTheme.colors.text;
  const footerBorder = currentTheme.colors.border;
  const brandColor = currentTheme.colors.primary;
  const brandStroke = activeTheme === 'dark' ? currentTheme.colors.accent : currentTheme.colors.primary;

  const handleSubscribe = () => {
    if (email.trim()) {
      alert(isTe ? `చందా విజయవంతమైంది: ${email}` : `Successfully subscribed: ${email}`);
      setEmail('');
    }
  };

  // Convert layout style prop margins to web style strings if provided
  const customMarginStyle = style ? {
    marginLeft: style.marginHorizontal !== undefined ? `${style.marginHorizontal}px` : undefined,
    marginRight: style.marginHorizontal !== undefined ? `${style.marginHorizontal}px` : undefined,
    marginBottom: style.marginBottom !== undefined ? `${style.marginBottom}px` : undefined,
    marginTop: style.marginTop !== undefined ? `${style.marginTop}px` : '40px',
  } : {};

  // Responsive padding calculation matching workspace
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive padding calculation matching workspace (very slight padding)
  const footerPaddingHorizontal = windowWidth >= 768 ? 20 : 12;

  return (
    <footer 
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: footerBg,
        borderTop: `1px solid ${footerBorder}`,
        paddingLeft: `${footerPaddingHorizontal}px`,
        paddingRight: `${footerPaddingHorizontal}px`,
        paddingTop: '48px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        fontFamily: '"Geist", sans-serif',
        ...customMarginStyle
      }}
    >
      {/* Background SVG Decoration */}
      <svg 
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-120px',
          width: '680px',
          height: '260px',
          opacity: 0.05,
          pointerEvents: 'none'
        }}
        viewBox="0 0 68 26" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_8678_1074)">
          <path d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26C12.6684 26 15.2152 24.9512 17.0929 23.0845L21.3319 18.8705C21.3319 18.8705 21.3319 18.8706 21.3319 18.8705L33.6827 6.59239C34.5795 5.70086 35.7958 5.2 37.0641 5.2C39.1874 5.2 40.9876 6.57576 41.6117 8.47953L45.5096 4.60457C43.7314 1.83589 40.6134 0 37.0641 0C34.4085 0 31.8617 1.04871 29.984 2.91543L13.3943 19.4076C12.4974 20.2992 11.2811 20.8 10.0128 20.8C7.37176 20.8 5.23077 18.6716 5.23077 16.0461C5.23077 14.7852 5.73459 13.5761 6.63139 12.6845L12.7596 6.59239C13.6564 5.70086 14.8727 5.2 16.141 5.2C18.2645 5.2 20.0645 6.57582 20.6887 8.47965L24.5866 4.60466C22.8084 1.83595 19.6904 0 16.141 0Z" fill={activeTheme === 'dark' ? '#FFFFFF' : '#364153'} />
          <path d="M34.3188 19.4076C33.422 20.2992 32.2056 20.8 30.9373 20.8C28.8143 20.8 27.0143 19.4246 26.39 17.5211L22.4922 21.396C24.2705 24.1643 27.3883 26 30.9373 26C33.5929 26 36.1397 24.9512 38.0175 23.0845L54.6072 6.59239C55.504 5.70086 56.7203 5.2 57.9886 5.2C60.6297 5.2 62.7707 7.32839 62.7707 9.95393C62.7707 11.2148 62.2669 12.4239 61.37 13.3155L55.2419 19.4076C54.345 20.2992 53.1287 20.8 51.8604 20.8C49.7372 20.8 47.9371 19.4243 47.3129 17.5207L43.4151 21.3957C45.1933 24.1642 48.3112 26 51.8604 26C54.516 26 57.0628 24.9512 58.9405 23.0845L65.0687 16.9924C66.9465 15.1257 68.0014 12.5939 68.0014 9.95393C68.0014 4.45652 63.5186 0 57.9886 0C55.333 0 52.7863 1.04871 50.9085 2.91543L34.3188 19.4076Z" fill={activeTheme === 'dark' ? '#FFFFFF' : '#364153'} />
        </g>
        <defs>
          <clipPath id="clip0_8678_1074">
            <rect width="68" height="26" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Grid Content */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
          gap: '40px'
        }}
      >
        {/* Brand Column */}
        <div style={{ flex: '1.4', minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="30" height="30" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M8 11.2991L14.75 15.1839L21.5 11.2991M8 34.5783V26.8236L1.25 22.9387M28.25 22.9387L21.5 26.8236V34.5783M1.655 15.4081L14.75 22.9536L27.845 15.4081M14.75 38V22.9387M28.25 28.9154V16.962C28.2495 16.4379 28.1106 15.9233 27.8473 15.4696C27.584 15.0159 27.2056 14.6391 26.75 14.3771L16.25 8.40036C15.7939 8.13808 15.2766 8 14.75 8C14.2234 8 13.7061 8.13808 13.25 8.40036L2.75 14.3771C2.29439 14.6391 1.91597 15.0159 1.65269 15.4696C1.38941 15.9233 1.25054 16.4379 1.25 16.962V28.9154C1.25054 29.4395 1.38941 29.9541 1.65269 30.4078C1.91597 30.8615 2.29439 31.2383 2.75 31.5003L13.25 37.477C13.7061 37.7393 14.2234 37.8774 14.75 37.8774C15.2766 37.8774 15.7939 37.7393 16.25 37.477L26.75 31.5003C27.2056 31.2383 27.584 30.8615 27.8473 30.4078C28.1106 29.9541 28.2495 29.4395 28.25 28.9154Z" 
                stroke={brandStroke} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: '800', color: footerTitle, letterSpacing: '0.5px' }}>
              {isTe ? "వాస్తు సర్వస్వం" : "Vastu Sarvaswam"}
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '20px', color: footerText, margin: '6px 0 0 0', maxWidth: '320px' }}>
            {isTe 
              ? "వాస్తు సర్వస్వం అనేది వేద వాస్తు శాస్త్ర మరియు ఆయ-వ్యయ గణనలతో కూడిన ఉచిత మరియు స్వయం చాలిత లేఅవుట్ ప్లానర్."
              : "Vastu Sarvaswam is a free and open-source Vastu Auto-Layout system with Vedic Aya calculations and optimal plotting."}
          </p>
        </div>

        {/* Company Links Column */}
        <div style={{ flex: '0.8', minWidth: '150px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: footerTitle, marginBottom: '18px', marginTop: 0 }}>
            {isTe ? "కంపెనీ" : "Company"}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['About us', 'Careers', 'Contact us', 'Privacy policy'].map((link, idx) => {
              const labelTe = ['మా గురించి', 'ఉద్యోగాలు', 'సంప్రదించండి', 'గోప్యతా విధానం'][idx];
              return (
                <a 
                  key={idx} 
                  href="#" 
                  style={{ 
                    fontSize: '13px', 
                    color: footerText, 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = brandColor}
                  onMouseOut={(e) => e.target.style.color = footerText}
                >
                  {isTe ? labelTe : link}
                </a>
              );
            })}
          </div>
        </div>

        {/* Subscribe Column */}
        <div style={{ flex: '1.2', minWidth: '240px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: footerTitle, marginBottom: '18px', marginTop: 0 }}>
            {isTe ? "వార్తాలేఖకు చందా" : "Subscribe to our newsletter"}
          </h2>
          <p style={{ fontSize: '13px', lineHeight: '18px', color: footerText, marginBottom: '16px', marginTop: 0, maxWidth: '360px' }}>
            {isTe 
              ? "తాజా వార్తలు, వాస్తు చిట్కాలు మరియు లేఅవుట్ వనరులు ప్రతి వారం మీ ఇన్‌బాక్స్‌కు పొందండి."
              : "The latest news, Vastu tips, and layout resources, sent to your inbox weekly."}
          </p>
          <div 
            style={{ 
              display: 'flex', 
              borderRadius: '6px', 
              overflow: 'hidden', 
              border: `1px solid ${footerBorder}`, 
              height: '44px',
              maxWidth: '320px'
            }}
          >
            <input 
              type="email" 
              placeholder={isTe ? "ఈమెయిల్ నమోదు చేయండి" : "Enter your email"} 
              style={{
                flex: 1,
                paddingLeft: '14px',
                paddingRight: '14px',
                fontSize: '13px',
                border: 'none',
                outline: 'none',
                color: footerTitle,
                backgroundColor: activeTheme === 'dark' ? '#1F1F1F' : '#F8FAFC'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              onClick={handleSubscribe}
              style={{
                paddingLeft: '18px',
                paddingRight: '18px',
                backgroundColor: brandColor,
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.9}
              onMouseOut={(e) => e.target.style.opacity = 1}
            >
              {isTe ? "చందా" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and legal links */}
      <div 
        style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: `1px solid ${footerBorder}`,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          gap: '12px'
        }}
      >
        <p style={{ fontSize: '12px', color: footerText, margin: 0 }}>
          {isTe 
            ? `కాపీరైట్ 2026 © వాస్తు సర్వస్వం. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.` 
            : `Copyright 2026 © Vastu Sarvaswam. All Rights Reserved.`}
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, idx) => {
            const labelTe = ['గోప్యతా పాలసీ', 'నిబంధనలు', 'కుకీ పాలసీ'][idx];
            return (
              <a 
                key={idx} 
                href="#" 
                style={{ 
                  fontSize: '12px', 
                  color: footerText, 
                  textDecoration: 'none' 
                }}
              >
                {isTe ? labelTe : link}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
