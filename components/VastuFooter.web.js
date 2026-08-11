import React, { useState } from 'react';
import { lightTheme } from '../constants/theme';
import VastuLogo from './VastuLogo';

export default function VastuFooter({ language, theme: propTheme, activeTheme, style }) {
  const isTe = language === 'te';
  const [email, setEmail] = useState('');

  const currentTheme = propTheme || lightTheme;
  const isDark = currentTheme.colors.background === '#000000' || currentTheme.colors.background === '#121212';

  const footerBg = currentTheme.colors.surface;
  const footerText = currentTheme.colors.textSecondary;
  const footerTitle = currentTheme.colors.text;
  const footerBorder = currentTheme.colors.border;
  const brandColor = currentTheme.colors.primary === '#1a1a1a' ? currentTheme.colors.accent : currentTheme.colors.primary;
  const brandStroke = isDark ? currentTheme.colors.accent : currentTheme.colors.primary;

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

  const isMobileWeb = windowWidth < 768;
  const footerPaddingHorizontal = isMobileWeb ? 16 : 24;

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
        paddingTop: isMobileWeb ? '48px' : '64px',
        paddingBottom: '48px',
        boxSizing: 'border-box',
        fontFamily: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
          opacity: isDark ? 0.02 : 0.05,
          pointerEvents: 'none'
        }}
        viewBox="0 0 68 26" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_8678_1074)">
          <path d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26C12.6684 26 15.2152 24.9512 17.0929 23.0845L21.3319 18.8705C21.3319 18.8705 21.3319 18.8706 21.3319 18.8705L33.6827 6.59239C34.5795 5.70086 35.7958 5.2 37.0641 5.2C39.1874 5.2 40.9876 6.57576 41.6117 8.47953L45.5096 4.60457C43.7314 1.83589 40.6134 0 37.0641 0C34.4085 0 31.8617 1.04871 29.984 2.91543L13.3943 19.4076C12.4974 20.2992 11.2811 20.8 10.0128 20.8C7.37176 20.8 5.23077 18.6716 5.23077 16.0461C5.23077 14.7852 5.73459 13.5761 6.63139 12.6845L12.7596 6.59239C13.6564 5.70086 14.8727 5.2 16.141 5.2C18.2645 5.2 20.0645 6.57582 20.6887 8.47965L24.5866 4.60466C22.8084 1.83595 19.6904 0 16.141 0Z" fill={isDark ? '#FFFFFF' : '#364153'} />
          <path d="M34.3188 19.4076C33.422 20.2992 32.2056 20.8 30.9373 20.8C28.8143 20.8 27.0143 19.4246 26.39 17.5211L22.4922 21.396C24.2705 24.1643 27.3883 26 30.9373 26C33.5929 26 36.1397 24.9512 38.0175 23.0845L54.6072 6.59239C55.504 5.70086 56.7203 5.2 57.9886 5.2C60.6297 5.2 62.7707 7.32839 62.7707 9.95393C62.7707 11.2148 62.2669 12.4239 61.37 13.3155L55.2419 19.4076C54.345 20.2992 53.1287 20.8 51.8604 20.8C49.7372 20.8 47.9371 19.4243 47.3129 17.5207L43.4151 21.3957C45.1933 24.1642 48.3112 26 51.8604 26C54.516 26 57.0628 24.9512 58.9405 23.0845L65.0687 16.9924C66.9465 15.1257 68.0014 12.5939 68.0014 9.95393C68.0014 4.45652 63.5186 0 57.9886 0C55.333 0 52.7863 1.04871 50.9085 2.91543L34.3188 19.4076Z" fill={isDark ? '#FFFFFF' : '#364153'} />
        </g>
        <defs>
          <clipPath id="clip0_8678_1074">
            <rect width="68" height="26" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {/* Inner centered grid wrapper for structured grid alignment */}
      <div 
        style={{ 
          maxWidth: '1140px', 
          margin: '0 auto', 
          width: '100%', 
          position: 'relative', 
          zIndex: 2 
        }}
      >
        {/* Main Grid Content */}
        <div 
          style={{
            display: 'flex',
            flexDirection: isMobileWeb ? 'column' : 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: isMobileWeb ? '28px' : '40px'
          }}
        >
          {/* Brand Column */}
          <div style={{ flex: isMobileWeb ? '1' : '1.4', minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <VastuLogo size={32} />
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
          <div style={{ flex: isMobileWeb ? '1' : '0.8', minWidth: '150px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: footerTitle, marginBottom: '14px', marginTop: 0 }}>
              {isTe ? "కంపెనీ" : "Company"}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      transition: 'color 0.2s',
                      width: 'fit-content'
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
          <div style={{ flex: isMobileWeb ? '1' : '1.2', minWidth: '240px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: footerTitle, marginBottom: '14px', marginTop: 0 }}>
              {isTe ? "వార్తాలేఖకు చందా" : "Subscribe to our newsletter"}
            </h2>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: footerText, marginBottom: '14px', marginTop: 0, maxWidth: '360px' }}>
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
                height: '40px',
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
                  backgroundColor: isDark ? '#1F1F1F' : '#F8FAFC'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                style={{
                  paddingLeft: '18px',
                  paddingRight: '18px',
                  backgroundColor: brandColor,
                  color: isDark ? '#000000' : '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.target.style.opacity = 0.9}
                onMouseOut={(e) => e.target.style.opacity = 1}
                onClick={handleSubscribe}
              >
                {isTe ? "చందా" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and legal links */}
        <div 
          style={{
            marginTop: isMobileWeb ? '28px' : '40px',
            paddingTop: '20px',
            borderTop: `1px solid ${footerBorder}`,
            display: 'flex',
            flexDirection: isMobileWeb ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobileWeb ? 'flex-start' : 'center',
            gap: '12px'
          }}
        >
          <p style={{ fontSize: '12px', color: footerText, margin: 0 }}>
            {isTe 
              ? `కాపీరైట్ 2026 © వాస్తు సర్వస్వం. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.` 
              : `Copyright 2026 © Vastu Sarvaswam. All Rights Reserved.`}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
      </div>
    </footer>
  );
}
