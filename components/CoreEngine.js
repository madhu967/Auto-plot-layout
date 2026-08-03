import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { lightTheme } from '../constants/theme';
import { 
  NAKSHATRAS, 
  calculateTaraBalam, 
  getPadamFromVarga, 
  validateOpenSpace, 
  checkAyaVyayaYoni, 
  generateBuildingSize 
} from '../constants/vastuData';
import { Ionicons } from '@expo/vector-icons';

export default function CoreEngine({ language, state, theme: propTheme }) {
  const isTe = language === 'te';
  const activeTheme = propTheme || lightTheme;
  const styles = getStyles(activeTheme);

  // 1. Nakshatra & Tara Balam
  const ownerStarObj = NAKSHATRAS.find(n => n.nameEn === state.nakshatra || n.nameTe === state.nakshatra);
  const ownerStarId = ownerStarObj ? ownerStarObj.id : 1;
  const targetStarId = 17; // Anuradha (standard auspicious reference)
  const targetStarObj = NAKSHATRAS.find(n => n.id === targetStarId);
  const taraResult = calculateTaraBalam(ownerStarId, targetStarId);

  // 2. Padam
  const padamResult = getPadamFromVarga(state.ownerName);

  // 3. Open Spaces setback
  const spacesResult = validateOpenSpace(state.eastOpen, state.westOpen, state.northOpen, state.southOpen);

  // 4. Building Size
  const footprint = generateBuildingSize(
    state.siteLength, 
    state.siteWidth, 
    state.eastOpen, 
    state.westOpen, 
    state.northOpen, 
    state.southOpen
  );

  // Translations
  const t = {
    card1Title: isTe ? "నిర్మాణ విస్తీర్ణం (Footprint)" : "Building Footprint Specs",
    card2Title: isTe ? "జన్మ తారాబలం (Tara Balam)" : "Tara Balam Astrology",
    card3Title: isTe ? "నామ అక్షర వర్గం (Yoni Padam)" : "Name Varga & Yoni",
    card4Title: isTe ? "చుట్టుపక్కల ఖాళీ స్థలాలు" : "Setback Spaces Status",
    card5Title: isTe ? "రూమ్స్ ఆయ వ్యయ విశ్లేషణ" : "Room Vastu Analysis Table",
    alternativesLabel: isTe ? "ప్రత్యామ్నాయ పరిమాణాలు (Auspicious Sizes):" : "Recommended Auspicious Sizes:"
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return activeTheme.colors.success;
      case 'warning': return activeTheme.colors.warning;
      case 'danger': return activeTheme.colors.danger;
      default: return activeTheme.colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* 1. Footprint specs card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="construct-outline" size={18} color={activeTheme.colors.accent} />
          <Text style={styles.cardTitle}>{t.card1Title}</Text>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{isTe ? "వెడల్పు" : "Width"}</Text>
            <Text style={styles.gridValue}>{footprint.width} ft</Text>
          </View>
          <View style={styles.gridDivider} />
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{isTe ? "పొడవు" : "Length"}</Text>
            <Text style={styles.gridValue}>{footprint.length} ft</Text>
          </View>
          <View style={styles.gridDivider} />
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>{isTe ? "వైశాల్యం" : "Area"}</Text>
            <Text style={styles.gridValue}>{footprint.area} Sft</Text>
          </View>
        </View>
      </View>

      {/* 2. Tara Balam Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="star-outline" size={18} color={activeTheme.colors.accent} />
          <Text style={styles.cardTitle}>{t.card2Title}</Text>
        </View>
        <View style={styles.detailsList}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "యజమాని నక్షత్రం" : "Owner Nakshatra"}</Text>
            <Text style={styles.detailsVal}>{isTe ? (ownerStarObj ? ownerStarObj.nameTe : state.nakshatra) : state.nakshatra}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "లక్ష్య నక్షత్రం" : "Reference Star"}</Text>
            <Text style={styles.detailsVal}>{isTe ? (targetStarObj ? targetStarObj.nameTe : "Anuradha") : "Anuradha"}</Text>
          </View>
        </View>

        <View style={[styles.bannerAlert, { 
          backgroundColor: taraResult.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          borderColor: getStatusColor(taraResult.status)
        }]}>
          <Ionicons 
            name={taraResult.status === 'success' ? "checkmark-circle" : "close-circle"} 
            size={22} 
            color={getStatusColor(taraResult.status)} 
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: getStatusColor(taraResult.status) }]}>
              {taraResult.taraName} ({taraResult.value})
            </Text>
            <Text style={styles.bannerDesc}>
              {isTe ? taraResult.descTe : taraResult.descEn}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Name Varga Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="text-outline" size={18} color={activeTheme.colors.accent} />
          <Text style={styles.cardTitle}>{t.card3Title}</Text>
        </View>
        <View style={styles.detailsList}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "యజమాని పేరు" : "Owner Name"}</Text>
            <Text style={styles.detailsVal}>{state.ownerName}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "అక్షర వర్గం" : "Alphabet Varga"}</Text>
            <Text style={styles.detailsVal}>{padamResult.varga} ({isTe ? padamResult.vargaNameTe : padamResult.vargaNameEn})</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "యోని పదం" : "Yoni Padam"}</Text>
            <Text style={styles.detailsVal}>{isTe ? padamResult.padamTe : padamResult.padamEn}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>{isTe ? "శుభ ఫలితం" : "Astrological Effect"}</Text>
            <Text style={[styles.detailsVal, { color: activeTheme.colors.success }]}>{isTe ? padamResult.descTe : padamResult.descEn}</Text>
          </View>
        </View>
      </View>

      {/* 4. Open Spaces Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="git-commit-outline" size={18} color={activeTheme.colors.accent} />
          <Text style={styles.cardTitle}>{t.card4Title}</Text>
        </View>
        
        <View style={{ gap: 12, marginBottom: 16 }}>
          <View style={styles.setbackBarContainer}>
            <View style={styles.setbackLabelRow}>
              <Text style={styles.barLabel}>{isTe ? "తూర్పు కాలిబాట" : "East Open Space"}</Text>
              <Text style={styles.barVal}>{state.eastOpen} ft</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.min(100, (parseFloat(state.eastOpen)/10)*100)}%`, backgroundColor: activeTheme.colors.success }]} />
            </View>
          </View>

          <View style={styles.setbackBarContainer}>
            <View style={styles.setbackLabelRow}>
              <Text style={styles.barLabel}>{isTe ? "పడమర కాలిబాట" : "West Open Space"}</Text>
              <Text style={styles.barVal}>{state.westOpen} ft</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.min(100, (parseFloat(state.westOpen)/10)*100)}%`, backgroundColor: activeTheme.colors.warning }]} />
            </View>
          </View>

          <View style={styles.setbackBarContainer}>
            <View style={styles.setbackLabelRow}>
              <Text style={styles.barLabel}>{isTe ? "ఉత్తరం కాలిబాట" : "North Open Space"}</Text>
              <Text style={styles.barVal}>{state.northOpen} ft</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.min(100, (parseFloat(state.northOpen)/10)*100)}%`, backgroundColor: activeTheme.colors.success }]} />
            </View>
          </View>

          <View style={styles.setbackBarContainer}>
            <View style={styles.setbackLabelRow}>
              <Text style={styles.barLabel}>{isTe ? "దక్షిణం కాలిబాట" : "South Open Space"}</Text>
              <Text style={styles.barVal}>{state.southOpen} ft</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.min(100, (parseFloat(state.southOpen)/10)*100)}%`, backgroundColor: activeTheme.colors.warning }]} />
            </View>
          </View>
        </View>

        <View style={[styles.bannerAlert, { 
          backgroundColor: spacesResult.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          borderColor: getStatusColor(spacesResult.status)
        }]}>
          <Ionicons 
            name={spacesResult.status === 'success' ? "checkmark-circle" : "warning"} 
            size={22} 
            color={getStatusColor(spacesResult.status)} 
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: getStatusColor(spacesResult.status) }]}>
              {isTe ? "నిష్పత్తి తుల్యత" : "Proportional Setbacks"}
            </Text>
            <Text style={styles.bannerDesc}>
              {isTe ? spacesResult.descTe : spacesResult.descEn}
            </Text>
          </View>
        </View>
      </View>

      {/* 5. Room details & alternatives list */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="grid-outline" size={18} color={activeTheme.colors.accent} />
          <Text style={styles.cardTitle}>{t.card5Title}</Text>
        </View>

        {state.customRooms.map((room) => {
          const roomRes = checkAyaVyayaYoni(room.width, room.length);
          return (
            <View key={room.id} style={styles.roomReportCard}>
              <View style={styles.roomReportHeader}>
                <Text style={styles.roomReportName}>{room.name}</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: roomRes.status === 'success' ? 'rgba(16, 185, 129, 0.15)' : roomRes.status === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(roomRes.status) }]}>
                    {roomRes.status === 'success' ? (isTe ? "అనుకూలం" : "Auspicious") : (isTe ? "సరిదిద్దాలి" : "Inauspicious")}
                  </Text>
                </View>
              </View>

              <View style={styles.specsContainer}>
                <View style={styles.specColumn}>
                  <Text style={styles.specLabel}>{isTe ? "ఆదాయం" : "Aya"}</Text>
                  <Text style={styles.specVal}>{roomRes.aya}</Text>
                </View>
                <View style={styles.specColumn}>
                  <Text style={styles.specLabel}>{isTe ? "వ్యయం" : "Vyaya"}</Text>
                  <Text style={styles.specVal}>{roomRes.vyaya}</Text>
                </View>
                <View style={styles.specColumn}>
                  <Text style={styles.specLabel}>{isTe ? "యోని" : "Yoni"}</Text>
                  <Text style={styles.specVal}>
                    {isTe 
                      ? (roomRes.yoniNameTe || "").split(" - ")[0] 
                      : (roomRes.yoniName || "").split(" - ")[0]}
                  </Text>
                </View>
              </View>

              {roomRes.status !== 'success' && roomRes.alternatives.length > 0 && (
                <View style={styles.alternativesBox}>
                  <Text style={styles.altTitle}>{t.alternativesLabel}</Text>
                  {roomRes.alternatives.slice(0, 3).map((alt, altIdx) => (
                    <View key={altIdx} style={styles.altRow}>
                      <Ionicons name="checkmark-circle-outline" size={12} color={activeTheme.colors.success} />
                      <Text style={styles.altText}>
                        <Text style={{ fontWeight: '700', color: activeTheme.colors.text }}>{alt.width} × {alt.length} ft</Text> 
                        {isTe ? ` (ఆదాయం: ${alt.aya}, వ్యయం: ${alt.vyaya}, ${alt.yoniNameTe.split(" - ")[0]})`
                              : ` (Aya: ${alt.aya}, Vyaya: ${alt.vyaya}, ${alt.yoniName.split(" - ")[0]})`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
  gridLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.accent, // Gold accent for metrics
  },
  detailsList: {
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsLabel: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    paddingRight: 8,
  },
  detailsVal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'right',
    flexShrink: 1,
  },
  bannerAlert: {
    borderLeftWidth: 4,
    borderRadius: theme.radius.input,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerDesc: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.text,
    lineHeight: 16,
  },
  setbackBarContainer: {
    paddingVertical: 4,
  },
  setbackLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  barVal: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  barTrack: {
    height: 6,
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  roomReportCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.divider, // Use theme divider for slightly offset backdrops
  },
  roomReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 8,
    marginBottom: 10,
  },
  roomReportName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  specColumn: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  alternativesBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  altTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  altText: {
    fontSize: 11,
    color: theme.colors.text,
    flex: 1,
    flexShrink: 1,
  }
});
