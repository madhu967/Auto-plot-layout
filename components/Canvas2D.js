import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { lightTheme as staticTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const CANVAS_HEIGHT = 500;

export default function Canvas2D({ language, state, theme: propTheme }) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const theme = propTheme || staticTheme;
  const styles = getStyles(theme);
  const isTe = language === 'te';
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [scale, setScale] = useState(1.0);

  const angle = parseFloat(state.compassAngle) || 0;

  const getRoomGridPosition = (roomName) => {
    const name = roomName.toLowerCase();
    if (name.includes("pooja")) {
      return { 
        row: 0, col: 2, 
        bg: "rgba(251, 191, 36, 0.05)", 
        border: theme.colors.accent, 
        label: isTe ? "పూజ (NE)" : "Pooja (NE)",
        icon: "flame-outline"
      };
    }
    if (name.includes("kitchen")) {
      return { 
        row: 2, col: 2, 
        bg: "rgba(251, 191, 36, 0.05)", 
        border: theme.colors.accent, 
        label: isTe ? "వంటగది (SE)" : "Kitchen (SE)",
        icon: "restaurant-outline"
      };
    }
    if (name.includes("master")) {
      return { 
        row: 2, col: 0, 
        bg: "rgba(251, 191, 36, 0.05)", 
        border: theme.colors.accent, 
        label: isTe ? "మాస్టర్ బెడ్ (SW)" : "Master Bed (SW)",
        icon: "bed-outline"
      };
    }
    if (name.includes("toilet") || name.includes("bathroom")) {
      return { 
        row: 0, col: 0, 
        bg: "rgba(251, 191, 36, 0.03)", 
        border: theme.colors.accent, 
        label: isTe ? "టాయిలెట్ (NW)" : "Toilet (NW)",
        icon: "water-outline"
      };
    }
    if (name.includes("dining")) {
      return { 
        row: 1, col: 0, 
        bg: "rgba(251, 191, 36, 0.03)", 
        border: theme.colors.accent, 
        label: isTe ? "డైనింగ్ (W)" : "Dining (W)",
        icon: "cafe-outline"
      };
    }
    if (name.includes("study")) {
      return { 
        row: 0, col: 1, 
        bg: "rgba(251, 191, 36, 0.03)", 
        border: theme.colors.accent, 
        label: isTe ? "స్టడీ (N)" : "Study (N)",
        icon: "book-outline"
      };
    }
    return { 
      row: 1, col: 1, 
      bg: "rgba(251, 191, 36, 0.02)", 
      border: theme.colors.accent, 
      label: isTe ? "హాల్ (Center)" : "Living (Center)",
      icon: "tv-outline"
    };
  };

  const siteL = parseFloat(state.siteLength) || 40;
  const siteW = parseFloat(state.siteWidth) || 30;
  const maxDim = Math.max(siteL, siteW);

  const eastO = parseFloat(state.eastOpen) || 0;
  const westO = parseFloat(state.westOpen) || 0;
  const northO = parseFloat(state.northOpen) || 0;
  const southO = parseFloat(state.southOpen) || 0;

  const footL = Math.max(0, siteL - northO - southO);
  const footW = Math.max(0, siteW - eastO - westO);
  const footprint = {
    width: footW,
    length: footL,
    area: footW * footL
  };

  const availableCanvasWidth = SCREEN_WIDTH - 32;
  const plotWidth = (siteW / maxDim) * (availableCanvasWidth * 0.88);
  const plotHeight = (siteL / maxDim) * (availableCanvasWidth * 0.88);

  const footWidthPx = (footW / siteW) * plotWidth;
  const footHeightPx = (footL / siteL) * plotHeight;

  const westOpenPx = (westO / siteW) * plotWidth;
  const eastOpenPx = (eastO / siteW) * plotWidth;
  const northOpenPx = (northO / siteL) * plotHeight;
  const southOpenPx = (southO / siteL) * plotHeight;

  const cellW = footWidthPx / 3;
  const cellH = footHeightPx / 3;

  const renderHorizontalRuler = () => {
    const ticks = [];
    const step = plotWidth / 5;
    for (let i = 0; i <= 5; i++) {
      const val = Math.round((siteW / 5) * i);
      ticks.push(
        <View key={i} style={[styles.rulerTickH, { left: (step * i) }]}>
          <View style={styles.tickLineH} />
          <Text style={styles.rulerText}>{val}'</Text>
        </View>
      );
    }
    return <View style={styles.horizontalRuler}>{ticks}</View>;
  };

  const renderVerticalRuler = () => {
    const ticks = [];
    const step = plotHeight / 5;
    for (let i = 0; i <= 5; i++) {
      const val = Math.round((siteL / 5) * i);
      ticks.push(
        <View key={i} style={[styles.rulerTickV, { top: (step * i) }]}>
          <View style={styles.tickLineV} />
          <Text style={styles.rulerText}>{val}'</Text>
        </View>
      );
    }
    return <View style={styles.verticalRuler}>{ticks}</View>;
  };

  const renderRoad = () => {
    const road = state.roadDirection;
    let roadStyle = {};
    let isVertical = false;

    if (road.includes("North")) {
      roadStyle = { top: -22, left: 0, right: 0, height: 18 };
    } else if (road.includes("South")) {
      roadStyle = { bottom: -22, left: 0, right: 0, height: 18 };
    } else if (road.includes("East")) {
      roadStyle = { right: -22, top: 0, bottom: 0, width: 18 };
      isVertical = true;
    } else if (road.includes("West")) {
      roadStyle = { left: -22, top: 0, bottom: 0, width: 18 };
      isVertical = true;
    } else {
      roadStyle = { top: -22, left: 0, right: 0, height: 18 };
    }

    return (
      <View style={[styles.roadContainer, roadStyle, isVertical ? styles.vertRoad : styles.horizRoad]}>
        <View style={isVertical ? styles.dashedV : styles.dashedH} />
        <Text style={styles.roadText}>{isTe ? "రోడ్డు మార్గం" : "ROADWAY"}</Text>
      </View>
    );
  };

  const renderDoor = () => {
    const door = state.mainDoorDirection;
    let style = {};
    if (door === "North") style = { top: 2, left: '50%', transform: [{ translateX: -12 }] };
    else if (door === "South") style = { bottom: 2, left: '50%', transform: [{ translateX: -12 }] };
    else if (door === "East") style = { right: 2, top: '50%', transform: [{ translateY: -12 }] };
    else if (door === "West") style = { left: 2, top: '50%', transform: [{ translateY: -12 }] };
    else style = { top: 2, right: 2 };

    return (
      <View style={[styles.doorArcContainer, style]}>
        <View style={styles.doorSwing} />
        <Text style={styles.doorLabel}>{isTe ? "ద్వారం" : "DOOR"}</Text>
      </View>
    );
  };

  const plotLeft = (availableCanvasWidth - plotWidth) / 2 + 16;
  const plotTop = (CANVAS_HEIGHT - plotHeight) / 2;

  return (
    <View style={styles.container}>
      
      {/* Light Theme CAD Toolbar */}
      <View style={styles.draftToolbar}>
        <View style={styles.toolbarTitleBlock}>
          <View style={styles.onlineDot} />
          <Text style={styles.toolbarTitle}>{isTe ? "ఆటోక్యాడ్ ప్రణాళిక" : "AutoCAD Blueprint Workspace"}</Text>
        </View>
        
        <View style={styles.toolbarActions}>
          <TouchableOpacity 
            style={[styles.toolBtn, showGrid && styles.activeToolBtn]} 
            onPress={() => setShowGrid(!showGrid)}
          >
            <Ionicons name="grid-outline" size={14} color={showGrid ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, showLabels && styles.activeToolBtn]} 
            onPress={() => setShowLabels(!showLabels)}
          >
            <Ionicons name="text-outline" size={14} color={showLabels ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity style={styles.toolBtn} onPress={() => setScale(Math.max(0.6, scale - 0.1))}>
            <Ionicons name="remove-outline" size={14} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setScale(Math.min(1.4, scale + 0.1))}>
            <Ionicons name="add-outline" size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen-filling drawing canvas (Matches App Background) */}
      <View style={styles.canvasContainer}>
        
        <View style={styles.draftSheet}>
          <View style={[
            styles.rotateWrapper,
            {
              transform: [{ rotate: `${angle}deg` }, { scale: scale }]
            }
          ]}>
            
            {/* Centered Plot Boundary (Gold dotted outline) */}
            <View style={[styles.plotBoundary, { width: plotWidth, height: plotHeight, left: plotLeft, top: plotTop }]}>
              
              {/* Rulers locked directly to plot boundaries */}
              {renderHorizontalRuler()}
              {renderVerticalRuler()}

              {/* Grid Overlay */}
              {showGrid && (
                <View style={styles.cadGridBackdrop}>
                  <View style={[styles.cadGridV, { left: '10%' }]} />
                  <View style={[styles.cadGridV, { left: '20%' }]} />
                  <View style={[styles.cadGridV, { left: '30%' }]} />
                  <View style={[styles.cadGridV, { left: '40%' }]} />
                  <View style={[styles.cadGridV, { left: '50%' }]} />
                  <View style={[styles.cadGridV, { left: '60%' }]} />
                  <View style={[styles.cadGridV, { left: '70%' }]} />
                  <View style={[styles.cadGridV, { left: '80%' }]} />
                  <View style={[styles.cadGridV, { left: '90%' }]} />

                  <View style={[styles.cadGridH, { top: '10%' }]} />
                  <View style={[styles.cadGridH, { top: '20%' }]} />
                  <View style={[styles.cadGridH, { top: '30%' }]} />
                  <View style={[styles.cadGridH, { top: '40%' }]} />
                  <View style={[styles.cadGridH, { top: '50%' }]} />
                  <View style={[styles.cadGridH, { top: '60%' }]} />
                  <View style={[styles.cadGridH, { top: '70%' }]} />
                  <View style={[styles.cadGridH, { top: '80%' }]} />
                  <View style={[styles.cadGridH, { top: '90%' }]} />
                </View>
              )}

              {/* Setback dimension lines (Gold/Accent guidelines) */}
              {westO > 0 && (
                <View style={[styles.dimLineRow, { left: 0, width: westOpenPx, top: plotHeight / 2 - 8 }]}>
                  <Text style={styles.dimArrowText}>◀</Text>
                  <View style={styles.dimDashedLine} />
                  <Text style={styles.dimValueText}>{westO}'</Text>
                  <View style={styles.dimDashedLine} />
                  <Text style={styles.dimArrowText}>▶</Text>
                </View>
              )}

              {eastO > 0 && (
                <View style={[styles.dimLineRow, { left: westOpenPx + footWidthPx, width: eastOpenPx, top: plotHeight / 2 - 8 }]}>
                  <Text style={styles.dimArrowText}>◀</Text>
                  <View style={styles.dimDashedLine} />
                  <Text style={styles.dimValueText}>{eastO}'</Text>
                  <View style={styles.dimDashedLine} />
                  <Text style={styles.dimArrowText}>▶</Text>
                </View>
              )}

              {northO > 0 && (
                <View style={[styles.dimLineCol, { top: 0, height: northOpenPx, left: plotWidth / 2 - 8 }]}>
                  <Text style={styles.dimArrowTextCol}>▲</Text>
                  <View style={styles.dimDashedLineCol} />
                  <Text style={styles.dimValueTextCol}>{northO}'</Text>
                  <View style={styles.dimDashedLineCol} />
                  <Text style={styles.dimArrowTextCol}>▼</Text>
                </View>
              )}

              {southO > 0 && (
                <View style={[styles.dimLineCol, { top: northOpenPx + footHeightPx, height: southOpenPx, left: plotWidth / 2 - 8 }]}>
                  <Text style={styles.dimArrowTextCol}>▲</Text>
                  <View style={styles.dimDashedLineCol} />
                  <Text style={styles.dimValueTextCol}>{southO}'</Text>
                  <View style={styles.dimDashedLineCol} />
                  <Text style={styles.dimArrowTextCol}>▼</Text>
                </View>
              )}

              {/* Building Footprint (Gold boundary) */}
              <View style={[
                styles.buildingFootprint, 
                { 
                  width: footWidthPx, 
                  height: footHeightPx,
                  left: westOpenPx,
                  top: northOpenPx
                }
              ]}>
                
                {/* Mandala Overlay */}
                <View style={styles.mandalaRing}>
                  <View style={styles.mandalaCrossV} />
                  <View style={styles.mandalaCrossH} />
                  <Text style={[styles.mandalaText, { top: 4 }]}>N</Text>
                  <Text style={[styles.mandalaText, { right: 4 }]}>E</Text>
                  <Text style={[styles.mandalaText, { bottom: 4 }]}>S</Text>
                  <Text style={[styles.mandalaText, { left: 4 }]}>W</Text>
                </View>

                {/* Door swing */}
                {renderDoor()}

                {/* Custom Rooms */}
                {state.customRooms.map((room) => {
                  const pos = getRoomGridPosition(room.name);
                  const roomX = pos.col * cellW + 3;
                  const roomY = pos.row * cellH + 3;
                  const roomW = cellW - 6;
                  const roomH = cellH - 6;

                  return (
                    <View 
                      key={room.id}
                      style={[
                        styles.draftRoomBox,
                        {
                          left: roomX,
                          top: roomY,
                          width: roomW,
                          height: roomH,
                          backgroundColor: pos.bg,
                          borderColor: pos.border
                        }
                      ]}
                    >
                      <Ionicons name={pos.icon} size={14} color={theme.colors.accent} style={{ marginBottom: 2 }} />
                      {showLabels && (
                        <React.Fragment>
                          <Text style={styles.roomLabelText} numberOfLines={1}>{pos.label}</Text>
                          <Text style={styles.roomSizeText}>{room.width}×{room.length} ft</Text>
                        </React.Fragment>
                      )}
                    </View>
                  );
                })}

                <View style={styles.centerRose} />
              </View>

              {renderRoad()}
            </View>

          </View>

          {/* Floating Gold Compass Indicator */}
          <View style={styles.goldCompass}>
            <Ionicons name="compass" size={24} color={theme.colors.accent} />
            <Text style={styles.compassLabel}>N</Text>
          </View>

        </View>

        {/* Footer coordinates details */}
        <Text style={styles.statusFooter}>
          {isTe 
            ? `స్థలం: ${state.siteWidth}×${state.siteLength} ft | కార్పెట్ వైశాల్యం: ${footprint.area} Sq.Ft` 
            : `Plot: ${state.siteWidth}×${state.siteLength} ft | Footprint: ${footprint.area} Sq.Ft`}
        </Text>
      </View>

    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Matches App Background
  },
  draftToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.2,
    borderBottomColor: theme.colors.border,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  toolbarTitleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  toolbarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeToolBtn: {
    backgroundColor: theme.colors.accent,
  },
  toolbarDivider: {
    width: 1,
    height: 18,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: theme.colors.background, // Matches App Background
    position: 'relative',
    overflow: 'hidden',
  },
  horizontalRuler: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rulerTickH: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    height: '100%',
    width: 24,
  },
  tickLineH: {
    width: 1.2,
    height: 6,
    backgroundColor: '#CCCCCC',
  },
  rulerText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#B45309', // Dark gold/amber for readability
    marginTop: 2,
  },
  verticalRuler: {
    position: 'absolute',
    top: 0,
    left: -20,
    bottom: 0,
    width: 20,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  rulerTickV: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    flexDirection: 'row',
    height: 12,
    width: '100%',
  },
  tickLineV: {
    height: 1.2,
    width: 6,
    backgroundColor: '#CCCCCC',
  },
  draftSheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  plotBoundary: {
    borderWidth: 1.8,
    borderColor: theme.colors.accent, // Gold border dashed line
    borderStyle: 'dashed',
    position: 'absolute',
    backgroundColor: '#FFFFFF', // Crisp white drafting sheet
  },
  cadGridBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cadGridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: 'rgba(251, 191, 36, 0.15)', // Soft gold grid lines
  },
  cadGridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(251, 191, 36, 0.15)', // Soft gold grid lines
  },
  mandalaRing: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mandalaCrossV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  mandalaCrossH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  mandalaText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(251, 191, 36, 0.25)',
  },
  roadContainer: {
    position: 'absolute',
    backgroundColor: '#E2E8F0', // Soft grey roadway
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  horizRoad: {
    left: 0,
    right: 0,
  },
  vertRoad: {
    top: 0,
    bottom: 0,
  },
  dashedH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 0.8,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
  },
  dashedV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderWidth: 0.8,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
  },
  roadText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#475569',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  doorArcContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  doorSwing: {
    width: 14,
    height: 14,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: theme.colors.accent, // Gold swing arc
    borderTopLeftRadius: 14,
    position: 'absolute',
    top: 2,
    left: 2,
    opacity: 0.8,
  },
  doorLabel: {
    fontSize: 5,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 8,
  },
  buildingFootprint: {
    position: 'absolute',
    borderWidth: 2.2,
    borderColor: theme.colors.accent, // Solid gold architectural walls
    backgroundColor: '#FFFFFF',
  },
  draftRoomBox: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
  },
  roomLabelText: {
    fontSize: 8,
    fontWeight: '750',
    color: '#B45309', // Dark gold/bronze for readability
  },
  roomSizeText: {
    fontSize: 6,
    color: '#78350F',
    marginTop: 1,
  },
  centerRose: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  goldCompass: {
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: 2,
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  compassLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: theme.colors.accent,
    marginTop: -4,
  },
  statusFooter: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    height: 28,
    lineHeight: 28,
    backgroundColor: theme.colors.background,
    textAlign: 'center',
    fontWeight: '700',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  dimLineRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 16,
    zIndex: 15,
  },
  dimDashedLine: {
    flex: 1,
    height: 0.8,
    borderWidth: 0.5,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
  },
  dimArrowText: {
    fontSize: 7,
    color: theme.colors.accent,
    lineHeight: 8,
  },
  dimValueText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.accent,
    paddingHorizontal: 3,
    backgroundColor: '#FFFFFF',
  },
  dimLineCol: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 16,
    zIndex: 15,
  },
  dimDashedLineCol: {
    flex: 1,
    width: 0.8,
    borderWidth: 0.5,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
  },
  dimArrowTextCol: {
    fontSize: 7,
    color: theme.colors.accent,
    lineHeight: 8,
  },
  dimValueTextCol: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.accent,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  }
});
