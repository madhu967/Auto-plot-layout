import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { lightTheme } from '../constants/theme';
import { NAKSHATRAS, TELUGU_VARGA, PADAS_32, PANCHABHOOTA_CHART } from '../constants/vastuData';

export default function MasterTables({ language, theme: propTheme }) {
  const isTe = language === 'te';
  const [activeSubTab, setActiveSubTab] = useState(1);
  const activeTheme = propTheme || lightTheme;
  const styles = getStyles(activeTheme);

  // Translations
  const t = {
    tab1: isTe ? "నక్షత్రాలు" : "Nakshatras",
    tab2: isTe ? "తెలుగు వర్గం" : "Varga Padam",
    tab3: isTe ? "32 పదాలు" : "32 Padas",
    tab4: isTe ? "పంచభూత" : "Panchabhoota",
  };

  const renderNakshatrasTable = () => (
    <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal style={styles.tableScroll} showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, { width: 50 }]}>S.No</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>{isTe ? "నక్షత్రం" : "Nakshatra"}</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>{isTe ? "రాశి" : "Rashi"}</Text>
          </View>
          {NAKSHATRAS.map((item, idx) => (
            <View 
              key={item.id} 
              style={[
                styles.tableDataRow, 
                { backgroundColor: idx % 2 === 0 ? activeTheme.colors.divider : activeTheme.colors.surface }
              ]}
            >
              <Text style={[styles.dataCell, { width: 50, textAlign: 'center' }]}>{item.id}</Text>
              <Text style={[styles.dataCell, { width: 120, fontWeight: '700' }]}>{isTe ? item.nameTe : item.nameEn}</Text>
              <Text style={[styles.dataCell, { width: 120 }]}>{isTe ? item.rashiTe : item.rashiEn}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );

  const renderTeluguVargaTable = () => (
    <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.headerCell, { flex: 2 }]}>{isTe ? "అక్షరములు" : "Telugu Letters"}</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>{isTe ? "నామ వర్గం" : "Varga Name"}</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>{isTe ? "దిశ (యోని)" : "Yoni (Padam)"}</Text>
        </View>
        {TELUGU_VARGA.map((item, idx) => (
          <View 
            key={idx} 
            style={[
              styles.tableDataRow, 
              { backgroundColor: idx % 2 === 0 ? activeTheme.colors.divider : activeTheme.colors.surface }
            ]}
          >
            <Text style={[styles.dataCell, { flex: 2, fontSize: 12, fontWeight: '700' }]}>{item.letters}</Text>
            <Text style={[styles.dataCell, { flex: 1.5 }]}>{isTe ? item.vargaTe : item.vargaEn}</Text>
            <Text style={[styles.dataCell, { flex: 1.5 }]}>{isTe ? item.padamTe : item.padamEn}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const render32PadasTable = () => (
    <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.headerCell, { width: 50 }]}>No</Text>
          <Text style={[styles.headerCell, { width: 100 }]}>{isTe ? "పదం" : "Pada"}</Text>
          <Text style={[styles.headerCell, { width: 110 }]}>{isTe ? "దిశ" : "Direction"}</Text>
          <Text style={[styles.headerCell, { width: 130 }]}>{isTe ? "ఫలితం" : "Vastu Devata"}</Text>
        </View>
        {PADAS_32.map((item, idx) => (
          <View 
            key={item.no} 
            style={[
              styles.tableDataRow, 
              { backgroundColor: idx % 2 === 0 ? activeTheme.colors.divider : activeTheme.colors.surface }
            ]}
          >
            <Text style={[styles.dataCell, { width: 50 }]}>{item.no}</Text>
            <Text style={[styles.dataCell, { width: 100, fontWeight: '700' }]}>{item.name}</Text>
            <Text style={[styles.dataCell, { width: 110 }]}>{isTe ? item.directionTe : item.directionEn}</Text>
            <Text style={[styles.dataCell, { width: 130, fontWeight: '600' }]}>{isTe ? item.devathaTe : item.devathaEn}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const getElementBorderLeftColor = (zone) => {
    const name = zone.toLowerCase();
    if (name.includes("water") || name.includes("జల")) return "#3B82F6"; // Blue
    if (name.includes("fire") || name.includes("అగ్ని")) return "#EF4444"; // Red
    if (name.includes("earth") || name.includes("భూమి")) return "#FBBF24"; // Yellow
    if (name.includes("air") || name.includes("వాయు")) return "#10B981"; // Green
    return "#8B5CF6"; // Space - Purple
  };

  const renderPanchabhootaTable = () => (
    <ScrollView style={styles.verticalScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.headerCell, { width: 90 }]}>{isTe ? "మూలకం" : "Element"}</Text>
          <Text style={[styles.headerCell, { width: 90 }]}>{isTe ? "దిశ" : "Zone"}</Text>
          <Text style={[styles.headerCell, { width: 120 }]}>{isTe ? "వాస్తు సూచన" : "Property Impact"}</Text>
        </View>
        {PANCHABHOOTA_CHART.map((item, idx) => {
          const borderLeftColor = getElementBorderLeftColor(item.elementEn);
          return (
            <View 
              key={idx} 
              style={[
                styles.tableDataRow, 
                { 
                  backgroundColor: idx % 2 === 0 ? activeTheme.colors.divider : activeTheme.colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: borderLeftColor
                }
              ]}
            >
              <Text style={[styles.dataCell, { width: 90, fontWeight: '700' }]}>{isTe ? item.elementTe : item.elementEn}</Text>
              <Text style={[styles.dataCell, { width: 90 }]}>{isTe ? item.directionTe : item.directionEn}</Text>
              <Text style={[styles.dataCell, { width: 120, textAlign: 'left', paddingLeft: 8 }]}>{isTe ? item.descTe : item.descEn}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.subTabRow}>
        {[1, 2, 3, 4].map((id) => (
          <TouchableOpacity 
            key={id}
            style={[styles.subTabBtn, activeSubTab === id && styles.activeSubTabBtn]}
            onPress={() => setActiveSubTab(id)}
          >
            <Text style={[styles.subTabText, activeSubTab === id && styles.activeSubTabText]}>
              {t[`tab${id}`]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Table Card */}
      <View style={styles.tableCard}>
        {activeSubTab === 1 && renderNakshatrasTable()}
        {activeSubTab === 2 && renderTeluguVargaTable()}
        {activeSubTab === 3 && render32PadasTable()}
        {activeSubTab === 4 && renderPanchabhootaTable()}
      </View>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' ? { height: '100%', maxHeight: '100%', overflow: 'hidden' } : {}),
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSubTabBtn: {
    backgroundColor: theme.colors.accent,
  },
  subTabText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeSubTabText: {
    color: '#070262', // Dark contrast color for gold active background
    fontWeight: '750',
  },
  tableCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: 12,
    borderWidth: 1.2,
    borderColor: theme.colors.border,
    ...(Platform.OS === 'web' ? { overflow: 'hidden' } : {}),
  },
  tableScroll: {
    flex: 1,
    width: '100%',
  },
  verticalScroll: {
    flex: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  headerCell: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  dataCell: {
    fontSize: 11,
    color: theme.colors.text,
    paddingHorizontal: 6,
    textAlign: 'center',
  }
});
