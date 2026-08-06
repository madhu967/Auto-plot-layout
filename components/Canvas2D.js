import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { lightTheme as staticTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Canvas2D({ language, state, theme: propTheme }) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const theme = propTheme || staticTheme;
  const styles = getStyles(theme);
  const isTe = language === 'te';

  // CAD Layer toggles & Scale state
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showCirculation, setShowCirculation] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [scale, setScale] = useState(1.0);

  // Parse Compass Orientation rotation angle
  const angle = parseFloat(state.compassAngle) || 0;

  // Geometry dimensions in Feet
  const siteL = parseFloat(state.siteLength) || 50;
  const siteW = parseFloat(state.siteWidth) || 30;
  const maxDim = Math.max(siteL, siteW);

  const eastO = parseFloat(state.eastOpen) || 0;
  const westO = parseFloat(state.westOpen) || 0;
  const northO = parseFloat(state.northOpen) || 0;
  const southO = parseFloat(state.southOpen) || 0;

  // Buildable footprint area in Feet
  const footW = Math.max(10, siteW - eastO - westO);
  const footL = Math.max(10, siteL - northO - southO);

  // Scaled dimensions to occupy almost the entire screen (increased scale from 0.80 to 0.94)
  const availableCanvasWidth = SCREEN_WIDTH - 32;
  const plotWidth = (siteW / maxDim) * (availableCanvasWidth * 0.94);
  const plotHeight = (siteL / maxDim) * (availableCanvasWidth * 0.94);
  
  const pxPerFt = plotWidth / siteW;

  const footWidthPx = footW * pxPerFt;
  const footHeightPx = footL * pxPerFt;

  const westOpenPx = westO * pxPerFt;
  const eastOpenPx = eastO * pxPerFt;
  const northOpenPx = northO * pxPerFt;
  const southOpenPx = southO * pxPerFt;

  // Dynamic canvas height to fit everything and avoid any vertical overlaps
  const CANVAS_HEIGHT = Math.max(620, plotHeight + 160);

  // ==========================================
  // 1. VASTU DYNAMIC LAYOUT GRID GENERATION
  // ==========================================
  const grid = [
    [[], [], []],
    [[], [], []],
    [[], [], []]
  ];

  state.customRooms.forEach(room => {
    const name = room.name.toLowerCase();
    const parsedRoom = {
      id: room.id,
      name: room.name,
      reqW: parseFloat(room.width) || 10,
      reqH: parseFloat(room.length) || 10,
    };

    if (name.includes("pooja")) {
      grid[0][2].push(parsedRoom); // NE (Auspicious for Pooja Altar)
    } else if (name.includes("kitchen")) {
      grid[2][2].push(parsedRoom); // SE (Auspicious for Agni/Kitchen Stove)
    } else if (name.includes("master")) {
      grid[2][0].push(parsedRoom); // SW (Auspicious for Master Bedroom)
    } else if (name.includes("toilet") || name.includes("bathroom") || name.includes("bath") || name.includes("wc")) {
      if (grid[0][0].length === 0) grid[0][0].push(parsedRoom); // NW (Optimal Toilet direction)
      else if (grid[1][0].length === 0) grid[1][0].push(parsedRoom); // W
      else grid[2][1].push(parsedRoom); // S
    } else if (name.includes("dining")) {
      if (grid[1][2].length === 0) grid[1][2].push(parsedRoom); // E (Near kitchen)
      else if (grid[2][1].length === 0) grid[2][1].push(parsedRoom); // S
      else grid[1][1].push(parsedRoom); // Center
    } else if (name.includes("study")) {
      if (grid[0][1].length === 0) grid[0][1].push(parsedRoom); // N
      else grid[0][2].push(parsedRoom); // NE
    } else if (name.includes("guest") || name.includes("bedroom")) {
      if (grid[0][0].length === 0) grid[0][0].push(parsedRoom); // NW
      else if (grid[0][1].length === 0) grid[0][1].push(parsedRoom); // N
      else if (grid[2][1].length === 0) grid[2][1].push(parsedRoom); // S
      else grid[1][0].push(parsedRoom); // W
    } else if (name.includes("living") || name.includes("hall") || name.includes("drawing")) {
      grid[1][1].push(parsedRoom); // Center/Brahmasthan
    } else {
      let placed = false;
      const order = [[0, 1], [1, 2], [2, 1], [1, 0], [0, 0], [0, 2], [2, 0], [2, 2]];
      for (const [r, c] of order) {
        if (grid[r][c].length === 0) {
          grid[r][c].push(parsedRoom);
          placed = true;
          break;
        }
      }
      if (!placed) grid[1][1].push(parsedRoom);
    }
  });

  // Ensure center has a living room if not explicitly defined
  if (grid[1][1].length === 0) {
    grid[1][1].push({
      id: "default-hall",
      name: isTe ? "హాల్ (Living Room)" : "Living Room (Hall)",
      reqW: footW * 0.35,
      reqH: footL * 0.35
    });
  }

  // Calculate adaptive column widths & row heights
  const getColMaxW = (c) => {
    let max = 0;
    for (let r = 0; r < 3; r++) {
      grid[r][c].forEach(rm => { if (rm.reqW > max) max = rm.reqW; });
    }
    return max;
  };
  const getRowMaxH = (r) => {
    let max = 0;
    for (let c = 0; c < 3; c++) {
      grid[r][c].forEach(rm => { if (rm.reqH > max) max = rm.reqH; });
    }
    return max;
  };

  let colW = [getColMaxW(0), getColMaxW(1), getColMaxW(2)];
  let rowH = [getRowMaxH(0), getRowMaxH(1), getRowMaxH(2)];

  for (let i = 0; i < 3; i++) {
    const hasColRooms = (grid[0][i].length > 0 || grid[1][i].length > 0 || grid[2][i].length > 0);
    if (hasColRooms && colW[i] === 0) colW[i] = 8;
    const hasRowRooms = (grid[i][0].length > 0 || grid[i][1].length > 0 || grid[i][2].length > 0);
    if (hasRowRooms && rowH[i] === 0) rowH[i] = 8;
  }
  if (colW[1] === 0) colW[1] = 10;
  if (rowH[1] === 0) rowH[1] = 10;

  const sumW = colW[0] + colW[1] + colW[2];
  const colScale = footW / sumW;
  const colW_scaled = colW.map(w => w * colScale);

  const sumH = rowH[0] + rowH[1] + rowH[2];
  const rowScale = footL / sumH;
  const rowH_scaled = rowH.map(h => h * rowScale);

  const colX = [0, colW_scaled[0], colW_scaled[0] + colW_scaled[1]];
  const rowY = [0, rowH_scaled[0], rowH_scaled[0] + rowH_scaled[1]];

  let blocks = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cellRooms = grid[r][c];
      const cellX = colX[c];
      const cellY = rowY[r];
      const cellW = colW_scaled[c];
      const cellH = rowH_scaled[r];

      if (cellRooms.length === 0) continue;

      if (cellRooms.length === 1) {
        blocks.push({
          id: cellRooms[0].id,
          name: cellRooms[0].name,
          x: cellX,
          y: cellY,
          w: cellW,
          h: cellH,
          gridRow: r,
          gridCol: c
        });
      } else {
        const count = cellRooms.length;
        if (cellW > cellH) {
          const subW = cellW / count;
          cellRooms.forEach((room, idx) => {
            blocks.push({
              id: room.id,
              name: room.name,
              x: cellX + idx * subW,
              y: cellY,
              w: subW,
              h: cellH,
              gridRow: r,
              gridCol: c
            });
          });
        } else {
          const subH = cellH / count;
          cellRooms.forEach((room, idx) => {
            blocks.push({
              id: room.id,
              name: room.name,
              x: cellX,
              y: cellY + idx * subH,
              w: cellW,
              h: subH,
              gridRow: r,
              gridCol: c
            });
          });
        }
      }
    }
  }

  // Expand center room to empty neighboring cells (resolves gaps)
  const hallBlock = blocks.find(b => b.name.toLowerCase().includes("living") || b.name.toLowerCase().includes("hall")) ||
                    blocks.find(b => b.gridRow === 1 && b.gridCol === 1) || blocks[0];

  if (hallBlock) {
    const occupied = Array.from({ length: 3 }, () => Array(3).fill(false));
    blocks.forEach(b => { occupied[b.gridRow][b.gridCol] = true; });

    if (!occupied[0][1]) {
      hallBlock.y = rowY[0];
      hallBlock.h += rowH_scaled[0];
      occupied[0][1] = true;
    }
    if (!occupied[2][1]) {
      hallBlock.h += rowH_scaled[2];
      occupied[2][1] = true;
    }
    if (!occupied[1][0]) {
      hallBlock.x = colX[0];
      hallBlock.w += colW_scaled[0];
      occupied[1][0] = true;
    }
    if (!occupied[1][2]) {
      hallBlock.w += colW_scaled[2];
      occupied[1][2] = true;
    }

    // Expand corner rooms into empty neighbors
    if (!occupied[0][0]) {
      const neighbor = blocks.find(b => b.gridRow === 0 && b.gridCol === 1) || blocks.find(b => b.gridRow === 1 && b.gridCol === 0);
      if (neighbor) {
        if (neighbor.gridCol === 1) { neighbor.x = colX[0]; neighbor.w += colW_scaled[0]; }
        else { neighbor.y = rowY[0]; neighbor.h += rowH_scaled[0]; }
        occupied[0][0] = true;
      }
    }
    if (!occupied[0][2]) {
      const neighbor = blocks.find(b => b.gridRow === 0 && b.gridCol === 1) || blocks.find(b => b.gridRow === 1 && b.gridCol === 2);
      if (neighbor) {
        if (neighbor.gridCol === 1) { neighbor.w += colW_scaled[2]; }
        else { neighbor.y = rowY[0]; neighbor.h += rowH_scaled[0]; }
        occupied[0][2] = true;
      }
    }
    if (!occupied[2][0]) {
      const neighbor = blocks.find(b => b.gridRow === 2 && b.gridCol === 1) || blocks.find(b => b.gridRow === 1 && b.gridCol === 0);
      if (neighbor) {
        if (neighbor.gridCol === 1) { neighbor.x = colX[0]; neighbor.w += colW_scaled[0]; }
        else { neighbor.h += rowH_scaled[2]; }
        occupied[2][0] = true;
      }
    }
    if (!occupied[2][2]) {
      const neighbor = blocks.find(b => b.gridRow === 2 && b.gridCol === 1) || blocks.find(b => b.gridRow === 1 && b.gridCol === 2);
      if (neighbor) {
        if (neighbor.gridCol === 1) { neighbor.w += colW_scaled[2]; }
        else { neighbor.h += rowH_scaled[2]; }
        occupied[2][2] = true;
      }
    }
  }

  // ==========================================
  // 2. DETAILED WALL SYSTEM WITH INSETS (9" & 4.5")
  // ==========================================
  const extWallThick = 0.75; // 9 inches in feet
  const intWallThick = 0.375; // 4.5 inches in feet

  const roomPlacements = blocks.map(b => {
    const isLeftExt = b.x <= 0.05;
    const isTopExt = b.y <= 0.05;
    const isRightExt = Math.abs(b.x + b.w - footW) <= 0.05;
    const isBottomExt = Math.abs(b.y + b.h - footL) <= 0.05;

    const leftWall = isLeftExt ? extWallThick : intWallThick / 2;
    const topWall = isTopExt ? extWallThick : intWallThick / 2;
    const rightWall = isRightExt ? extWallThick : intWallThick / 2;
    const bottomWall = isBottomExt ? extWallThick : intWallThick / 2;

    return {
      ...b,
      visX: b.x + leftWall,
      visY: b.y + topWall,
      visW: b.w - leftWall - rightWall,
      visH: b.h - topWall - bottomWall,
      borders: {
        left: leftWall,
        top: topWall,
        right: rightWall,
        bottom: bottomWall
      }
    };
  });

  // ==========================================
  // 3. DOOR & SWING PLACEMENTS
  // ==========================================
  const doors = [];
  
  roomPlacements.forEach(b => {
    if (b.id === hallBlock?.id) return;
    let doorPlaced = false;

    // Check shared vertical wall with Hall (Room Left - Hall Right)
    if (hallBlock && Math.abs((b.x + b.w) - hallBlock.x) < 0.1) {
      const startY = Math.max(b.y, hallBlock.y);
      const endY = Math.min(b.y + b.h, hallBlock.y + hallBlock.h);
      if (endY - startY > 1.5) {
        doors.push({
          id: `door-${b.id}`,
          x: b.x + b.w,
          y: (startY + endY) / 2,
          type: 'vertical',
          wallSide: 'right',
          isBathroom: b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom")
        });
        doorPlaced = true;
      }
    }
    // Check shared vertical wall with Hall (Room Right - Hall Left)
    if (!doorPlaced && hallBlock && Math.abs(b.x - (hallBlock.x + hallBlock.w)) < 0.1) {
      const startY = Math.max(b.y, hallBlock.y);
      const endY = Math.min(b.y + b.h, hallBlock.y + hallBlock.h);
      if (endY - startY > 1.5) {
        doors.push({
          id: `door-${b.id}`,
          x: b.x,
          y: (startY + endY) / 2,
          type: 'vertical',
          wallSide: 'left',
          isBathroom: b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom")
        });
        doorPlaced = true;
      }
    }
    // Check shared horizontal wall with Hall (Room Top - Hall Bottom)
    if (!doorPlaced && hallBlock && Math.abs((b.y + b.h) - hallBlock.y) < 0.1) {
      const startX = Math.max(b.x, hallBlock.x);
      const endX = Math.min(b.x + b.w, hallBlock.x + hallBlock.w);
      if (endX - startX > 1.5) {
        doors.push({
          id: `door-${b.id}`,
          x: (startX + endX) / 2,
          y: b.y + b.h,
          type: 'horizontal',
          wallSide: 'bottom',
          isBathroom: b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom")
        });
        doorPlaced = true;
      }
    }
    // Check shared horizontal wall with Hall (Room Bottom - Hall Top)
    if (!doorPlaced && hallBlock && Math.abs(b.y - (hallBlock.y + hallBlock.h)) < 0.1) {
      const startX = Math.max(b.x, hallBlock.x);
      const endX = Math.min(b.x + b.w, hallBlock.x + hallBlock.w);
      if (endX - startX > 1.5) {
        doors.push({
          id: `door-${b.id}`,
          x: (startX + endX) / 2,
          y: b.y,
          type: 'horizontal',
          wallSide: 'top',
          isBathroom: b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom")
        });
        doorPlaced = true;
      }
    }

    // Neighbor fallback
    if (!doorPlaced) {
      for (let i = 0; i < roomPlacements.length; i++) {
        const b2 = roomPlacements[i];
        if (b2.id === b.id) continue;
        if (Math.abs((b.x + b.w) - b2.x) < 0.1) {
          const startY = Math.max(b.y, b2.y);
          const endY = Math.min(b.y + b.h, b2.y + b2.h);
          if (endY - startY > 1.5) {
            doors.push({
              id: `door-${b.id}`,
              x: b.x + b.w,
              y: (startY + endY) / 2,
              type: 'vertical',
              wallSide: 'right',
              isBathroom: b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom")
            });
            break;
          }
        }
      }
    }
  });

  // Main door entrance at Hall
  let mainDoor = null;
  if (hallBlock) {
    const mainDoorDir = state.mainDoorDirection || 'North';
    let mdX = hallBlock.x + hallBlock.w / 2;
    let mdY = hallBlock.y;
    let mdType = 'horizontal';
    let mdSide = 'top';

    if (mainDoorDir === 'North') {
      mdX = hallBlock.x + hallBlock.w / 2;
      mdY = hallBlock.y;
    } else if (mainDoorDir === 'South') {
      mdX = hallBlock.x + hallBlock.w / 2;
      mdY = hallBlock.y + hallBlock.h;
      mdSide = 'bottom';
    } else if (mainDoorDir === 'East') {
      mdX = hallBlock.x + hallBlock.w;
      mdY = hallBlock.y + hallBlock.h / 2;
      mdType = 'vertical';
      mdSide = 'right';
    } else if (mainDoorDir === 'West') {
      mdX = hallBlock.x;
      mdY = hallBlock.y + hallBlock.h / 2;
      mdType = 'vertical';
      mdSide = 'left';
    }

    mainDoor = {
      x: mdX,
      y: mdY,
      type: mdType,
      wallSide: mdSide,
      isMain: true
    };
  }

  // ==========================================
  // 4. WINDOW & EXHAUST GENERATOR (Proportional Sizes)
  // ==========================================
  const windows = [];
  roomPlacements.forEach(b => {
    const isBath = b.name.toLowerCase().includes("toilet") || b.name.toLowerCase().includes("bathroom");
    const isKit = b.name.toLowerCase().includes("kitchen");
    let winCount = 0;

    let wSize = 4.0; 
    if (isBath) wSize = 2.0; 
    else if (b.name.toLowerCase().includes("living") || b.name.toLowerCase().includes("hall")) wSize = 5.5; 
    else if (b.name.toLowerCase().includes("master") || b.name.toLowerCase().includes("bedroom")) wSize = 4.8;
    else if (isKit) wSize = 3.6;

    // Check North Wall Exterior
    if (b.y <= 0.05 && northO > 0) {
      windows.push({
        id: `win-n-${b.id}`,
        x: b.x + b.w / 2,
        y: 0,
        widthFt: wSize,
        type: 'horizontal',
        side: 'top',
        isBathroom: isBath,
        isKitchen: isKit
      });
      winCount++;
    }
    // Check South Wall Exterior
    if (Math.abs(b.y + b.h - footL) <= 0.05 && southO > 0 && winCount < 2) {
      windows.push({
        id: `win-s-${b.id}`,
        x: b.x + b.w / 2,
        y: footL,
        widthFt: wSize,
        type: 'horizontal',
        side: 'bottom',
        isBathroom: isBath,
        isKitchen: isKit
      });
      winCount++;
    }
    // Check West Wall Exterior
    if (b.x <= 0.05 && westO > 0 && winCount < 2) {
      windows.push({
        id: `win-w-${b.id}`,
        x: 0,
        y: b.y + b.h / 2,
        widthFt: wSize,
        type: 'vertical',
        side: 'left',
        isBathroom: isBath,
        isKitchen: isKit
      });
      winCount++;
    }
    // Check East Wall Exterior
    if (Math.abs(b.x + b.w - footW) <= 0.05 && eastO > 0 && winCount < 2) {
      windows.push({
        id: `win-e-${b.id}`,
        x: footW,
        y: b.y + b.h / 2,
        widthFt: wSize,
        type: 'vertical',
        side: 'right',
        isBathroom: isBath,
        isKitchen: isKit
      });
      winCount++;
    }
  });

  // ==========================================
  // 5. UTILITY PLACEMENT IN SETBACKS
  // ==========================================
  const getUtilityCoords = (location, utilityType) => {
    const pad = 12;
    const size = 32;
    const rightSide = plotWidth - eastOpenPx - pad - size;
    const bottomSide = plotHeight - southOpenPx - pad - size;

    let coord = { x: pad, y: pad };

    if (location.includes("Northeast")) {
      coord = { x: rightSide, y: pad };
    } else if (location.includes("Southeast")) {
      coord = { x: rightSide, y: bottomSide };
    } else if (location.includes("Southwest")) {
      coord = { x: pad, y: bottomSide };
    } else if (location.includes("Northwest")) {
      coord = { x: pad, y: pad };
    } else if (location.includes("North")) {
      coord = { x: plotWidth / 2 - size / 2, y: pad };
    } else if (location.includes("South")) {
      coord = { x: plotWidth / 2 - size / 2, y: bottomSide };
    } else if (location.includes("East")) {
      coord = { x: rightSide, y: plotHeight / 2 - size / 2 };
    } else if (location.includes("West")) {
      coord = { x: pad, y: plotHeight / 2 - size / 2 };
    }

    if (utilityType === 'sump') {
      coord.y += 38; 
    }

    return { ...coord, w: size, h: size };
  };

  // ==========================================
  // 6. RENDER SUB-COMPONENTS
  // ==========================================
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

  const renderRoads = () => {
    const road = state.roadDirection || 'North Road';
    const roadsList = [];

    const drawRoadComponent = (direction, key) => {
      let style = {};
      let isVertical = false;
      if (direction === 'North') {
        style = { top: -38, left: 0, right: 0, height: 26 };
      } else if (direction === 'South') {
        style = { bottom: -38, left: 0, right: 0, height: 26 };
      } else if (direction === 'East') {
        style = { right: -38, top: 0, bottom: 0, width: 26 };
        isVertical = true;
      } else if (direction === 'West') {
        style = { left: -38, top: 0, bottom: 0, width: 26 };
        isVertical = true;
      }

      return (
        <View key={key} style={[styles.asphaltRoad, style, isVertical ? styles.vertAsphalt : styles.horizAsphalt]}>
          <View style={isVertical ? styles.roadLaneDividerV : styles.roadLaneDividerH} />
          <Text style={[styles.asphaltRoadText, isVertical && { transform: [{ rotate: '90deg' }] }]}>
            {direction.toUpperCase()} ROADWAY (30 FT WIDE)
          </Text>
        </View>
      );
    };

    if (road.includes("Corner E+N") || road.includes("Corner E + N")) {
      roadsList.push(drawRoadComponent('North', 'road-n'));
      roadsList.push(drawRoadComponent('East', 'road-e'));
    } else if (road.includes("Corner W+S") || road.includes("Corner W + S")) {
      roadsList.push(drawRoadComponent('South', 'road-s'));
      roadsList.push(drawRoadComponent('West', 'road-w'));
    } else {
      if (road.includes("North")) roadsList.push(drawRoadComponent('North', 'road-n'));
      else if (road.includes("South")) roadsList.push(drawRoadComponent('South', 'road-s'));
      else if (road.includes("East")) roadsList.push(drawRoadComponent('East', 'road-e'));
      else if (road.includes("West")) roadsList.push(drawRoadComponent('West', 'road-w'));
    }

    return roadsList;
  };

  const renderDoorSymbol = (door) => {
    const dW_ft = door.widthFt || (door.isBathroom ? 2.3 : door.isMain ? 3.8 : 2.8);
    const dW = dW_ft * pxPerFt;
    const dH_thick = intWallThick * pxPerFt;

    const doorLeft = westOpenPx + door.x * pxPerFt;
    const doorTop = northOpenPx + door.y * pxPerFt;

    if (door.isMain) {
      let frameStyle = {};
      let leafL = {}, leafR = {};
      let arcL = {}, arcR = {};
      const halfW = dW / 2;

      if (door.type === 'horizontal') {
        const topOffset = door.wallSide === 'top' ? 0 : -dH_thick;
        frameStyle = {
          left: doorLeft - halfW,
          top: doorTop + topOffset,
          width: dW,
          height: dH_thick,
          backgroundColor: '#0F172A', // Seamless open gap in wall
        };

        if (door.wallSide === 'top') {
          leafL = { position: 'absolute', left: 0, top: 0, width: 2, height: halfW, backgroundColor: '#D97706' };
          leafR = { position: 'absolute', right: 0, top: 0, width: 2, height: halfW, backgroundColor: '#D97706' };
          arcL = { position: 'absolute', left: 0, top: 0, width: halfW, height: halfW, borderBottomLeftRadius: halfW, borderLeftWidth: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
          arcR = { position: 'absolute', right: 0, top: 0, width: halfW, height: halfW, borderBottomRightRadius: halfW, borderRightWidth: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
        } else {
          leafL = { position: 'absolute', left: 0, bottom: 0, width: 2, height: halfW, backgroundColor: '#D97706' };
          leafR = { position: 'absolute', right: 0, bottom: 0, width: 2, height: halfW, backgroundColor: '#D97706' };
          arcL = { position: 'absolute', left: 0, bottom: 0, width: halfW, height: halfW, borderTopLeftRadius: halfW, borderLeftWidth: 1, borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
          arcR = { position: 'absolute', right: 0, bottom: 0, width: halfW, height: halfW, borderTopRightRadius: halfW, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
        }
      } else {
        const leftOffset = door.wallSide === 'left' ? 0 : -dH_thick;
        frameStyle = {
          left: doorLeft + leftOffset,
          top: doorTop - halfW,
          width: dH_thick,
          height: dW,
          backgroundColor: '#0F172A',
        };

        if (door.wallSide === 'left') {
          leafL = { position: 'absolute', left: 0, top: 0, width: halfW, height: 2, backgroundColor: '#D97706' };
          leafR = { position: 'absolute', left: 0, bottom: 0, width: halfW, height: 2, backgroundColor: '#D97706' };
          arcL = { position: 'absolute', left: 0, top: 0, width: halfW, height: halfW, borderTopRightRadius: halfW, borderRightWidth: 1, borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
          arcR = { position: 'absolute', left: 0, bottom: 0, width: halfW, height: halfW, borderBottomRightRadius: halfW, borderRightWidth: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
        } else {
          leafL = { position: 'absolute', right: 0, top: 0, width: halfW, height: 2, backgroundColor: '#D97706' };
          leafR = { position: 'absolute', right: 0, bottom: 0, width: halfW, height: 2, backgroundColor: '#D97706' };
          arcL = { position: 'absolute', right: 0, top: 0, width: halfW, height: halfW, borderTopLeftRadius: halfW, borderLeftWidth: 1, borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
          arcR = { position: 'absolute', right: 0, bottom: 0, width: halfW, height: halfW, borderBottomLeftRadius: halfW, borderLeftWidth: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.7)' };
        }
      }

      return (
        <View key="main-double-door" style={[styles.doorFrameBlock, frameStyle]}>
          <View style={leafL} />
          <View style={leafR} />
          <View style={arcL} />
          <View style={arcR} />
        </View>
      );
    }

    // Single doors
    let doorStyle = {};
    let leafStyle = {};
    let arcStyle = {};

    if (door.type === 'horizontal') {
      const topOffset = door.wallSide === 'top' ? 0 : -dH_thick;
      doorStyle = {
        left: doorLeft - dW / 2,
        top: doorTop + topOffset,
        width: dW,
        height: dH_thick,
        backgroundColor: '#0F172A',
      };

      if (door.wallSide === 'top') {
        leafStyle = { position: 'absolute', left: 0, top: 0, width: 2, height: dW, backgroundColor: '#D97706' };
        arcStyle = { position: 'absolute', left: 0, top: 0, width: dW, height: dW, borderBottomLeftRadius: dW, borderLeftWidth: 1.2, borderBottomWidth: 1.2, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.6)' };
      } else {
        leafStyle = { position: 'absolute', left: 0, bottom: 0, width: 2, height: dW, backgroundColor: '#D97706' };
        arcStyle = { position: 'absolute', left: 0, bottom: 0, width: dW, height: dW, borderTopLeftRadius: dW, borderLeftWidth: 1.2, borderTopWidth: 1.2, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.6)' };
      }
    } else {
      const leftOffset = door.wallSide === 'left' ? 0 : -dH_thick;
      doorStyle = {
        left: doorLeft + leftOffset,
        top: doorTop - dW / 2,
        width: dH_thick,
        height: dW,
        backgroundColor: '#0F172A',
      };

      if (door.wallSide === 'left') {
        leafStyle = { position: 'absolute', left: 0, top: 0, width: dW, height: 2, backgroundColor: '#D97706' };
        arcStyle = { position: 'absolute', left: 0, top: 0, width: dW, height: dW, borderTopRightRadius: dW, borderRightWidth: 1.2, borderTopWidth: 1.2, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.6)' };
      } else {
        leafStyle = { position: 'absolute', right: 0, top: 0, width: dW, height: 2, backgroundColor: '#D97706' };
        arcStyle = { position: 'absolute', right: 0, top: 0, width: dW, height: dW, borderTopLeftRadius: dW, borderLeftWidth: 1.2, borderTopWidth: 1.2, borderStyle: 'dashed', borderColor: 'rgba(217, 119, 6, 0.6)' };
      }
    }

    return (
      <View key={door.id} style={[styles.doorFrameBlock, doorStyle]}>
        <View style={leafStyle} />
        <View style={arcStyle} />
      </View>
    );
  };

  const renderWindowSymbol = (win) => {
    const winW = win.widthFt * pxPerFt;
    const wThick = extWallThick * pxPerFt;

    const winLeft = westOpenPx + win.x * pxPerFt;
    const winTop = northOpenPx + win.y * pxPerFt;

    let winStyle = {};
    let chajjaStyle = null; 

    const chajjaExtend = 5; 
    const chajjaDepth = 1.0 * pxPerFt; 

    if (win.type === 'horizontal') {
      const topOffset = win.side === 'top' ? 0 : -wThick;
      winStyle = {
        left: winLeft - winW / 2,
        top: winTop + topOffset,
        width: winW,
        height: wThick,
        borderWidth: 1.2,
        borderColor: win.isBathroom ? '#64748B' : '#38BDF8',
        backgroundColor: win.isBathroom ? '#334155' : '#0C4A6E',
      };

      if (win.side === 'top') {
        chajjaStyle = {
          position: 'absolute',
          left: winLeft - winW / 2 - chajjaExtend,
          top: winTop - chajjaDepth,
          width: winW + chajjaExtend * 2,
          height: chajjaDepth,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#475569',
          borderBottomWidth: 0,
        };
      } else {
        chajjaStyle = {
          position: 'absolute',
          left: winLeft - winW / 2 - chajjaExtend,
          top: winTop + wThick,
          width: winW + chajjaExtend * 2,
          height: chajjaDepth,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#475569',
          borderTopWidth: 0,
        };
      }
    } else {
      const leftOffset = win.side === 'left' ? 0 : -wThick;
      winStyle = {
        left: winLeft + leftOffset,
        top: winTop - winW / 2,
        width: wThick,
        height: winW,
        borderWidth: 1.2,
        borderColor: win.isBathroom ? '#64748B' : '#38BDF8',
        backgroundColor: win.isBathroom ? '#334155' : '#0C4A6E',
      };

      if (win.side === 'left') {
        chajjaStyle = {
          position: 'absolute',
          left: winLeft - chajjaDepth,
          top: winTop - winW / 2 - chajjaExtend,
          width: chajjaDepth,
          height: winW + chajjaExtend * 2,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#475569',
          borderRightWidth: 0,
        };
      } else {
        chajjaStyle = {
          position: 'absolute',
          left: winLeft + wThick,
          top: winTop - winW / 2 - chajjaExtend,
          width: chajjaDepth,
          height: winW + chajjaExtend * 2,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#475569',
          borderLeftWidth: 0,
        };
      }
    }

    return (
      <React.Fragment key={win.id}>
        {chajjaStyle && <View style={chajjaStyle} />}
        <View style={[styles.windowGlassBlock, winStyle]}>
          <View style={win.type === 'horizontal' ? styles.winGlassCenterH : styles.winGlassCenterV} />
          {win.isKitchen && <Text style={styles.exhaustIndicator}>EF</Text>}
          <Text style={styles.windowLabelTag}>{win.isBathroom ? 'V' : 'W'}</Text>
        </View>
      </React.Fragment>
    );
  };

  const renderCirculationPath = () => {
    if (!showCirculation || !hallBlock || !mainDoor) return null;

    const hX = hallBlock.x + hallBlock.w / 2;
    const hY = hallBlock.y + hallBlock.h / 2;

    const paths = [];

    // Path 1: Entrance Gate -> Main Entrance Door
    paths.push(
      <RenderCirculationLine 
        key="circ-entrance" 
        x1={mainDoor.x} y1={mainDoor.y} 
        x2={hX} y2={hY} 
        pxPerFt={pxPerFt} 
        footLeft={westOpenPx} footTop={northOpenPx} 
      />
    );

    // Paths: Main Hall -> Room Threshold Doors
    doors.forEach((door, index) => {
      paths.push(
        <RenderCirculationLine 
          key={`circ-door-${index}`} 
          x1={hX} y1={hY} 
          x2={door.x} y2={door.y} 
          pxPerFt={pxPerFt} 
          footLeft={westOpenPx} footTop={northOpenPx} 
        />
      );
    });

    return paths;
  };

  const renderRoomFurniture = (room) => {
    if (!showFurniture) return null;

    const name = room.name.toLowerCase();
    const rW_px = room.visW * pxPerFt;
    const rH_px = room.visH * pxPerFt;

    if (name.includes("bedroom") || name.includes("guest") || name.includes("study")) {
      const bW = Math.min(rW_px * 0.65, 6.0 * pxPerFt);
      const bH = Math.min(rH_px * 0.70, 6.5 * pxPerFt);
      return (
        <View style={[styles.bedFurniture, { width: bW, height: bH, bottom: 6, right: 6 }]}>
          <View style={styles.bedPillowsRow}>
            <View style={styles.bedPillow} />
            <View style={styles.bedPillow} />
          </View>
          <View style={styles.bedHeadboard} />
          <View style={styles.bedBlanket} />
        </View>
      );
    }

    if (name.includes("kitchen")) {
      const cThick = 2.0 * pxPerFt;
      return (
        <View style={styles.furnitureOverlayContainer}>
          <View style={[styles.kitchenCounterV, { width: cThick, right: 0, top: 0, bottom: 0 }]} />
          <View style={[styles.kitchenCounterH, { height: cThick, bottom: 0, left: 0, right: 0 }]} />
          <View style={[styles.cooktopStove, { bottom: 4, right: 4 }]}>
            <View style={styles.burnerCircle} />
            <View style={styles.burnerCircle} />
          </View>
          <View style={[styles.kitchenSink, { top: 6, right: 6 }]} />
        </View>
      );
    }

    if (name.includes("toilet") || name.includes("bathroom")) {
      return (
        <View style={styles.furnitureOverlayContainer}>
          <View style={styles.toiletCommode}>
            <View style={styles.toiletTank} />
            <View style={styles.toiletBowl} />
          </View>
          <View style={styles.washBasinCorner} />
        </View>
      );
    }

    if (name.includes("living") || name.includes("hall") || name.includes("drawing")) {
      return (
        <View style={styles.furnitureOverlayContainer}>
          <View style={styles.sofaSectional}>
            <View style={styles.sofaSeatLong} />
            <View style={styles.sofaSeatShort} />
          </View>
          <View style={styles.coffeeTable} />
        </View>
      );
    }

    if (name.includes("dining")) {
      return (
        <View style={[styles.diningTableSet, { width: rW_px * 0.6, height: rH_px * 0.5 }]}>
          <View style={styles.diningChairDot} />
          <View style={styles.diningChairDot} />
          <View style={styles.diningTablePlate} />
          <View style={styles.diningChairDot} />
          <View style={styles.diningChairDot} />
        </View>
      );
    }

    if (name.includes("pooja")) {
      return (
        <View style={styles.poojaPedestal}>
          <Ionicons name="flame" size={14} color="#FBBF24" />
        </View>
      );
    }

    return null;
  };

  const getRoomThemeColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes("pooja")) return "rgba(245, 158, 11, 0.04)";
    if (n.includes("kitchen")) return "rgba(239, 68, 68, 0.04)";
    if (n.includes("master")) return "rgba(99, 102, 241, 0.04)";
    if (n.includes("toilet") || n.includes("bathroom")) return "rgba(148, 163, 184, 0.03)";
    if (n.includes("living") || n.includes("hall")) return "rgba(16, 185, 129, 0.03)";
    return "rgba(251, 191, 36, 0.02)";
  };

  const getRoomIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("pooja")) return "flame-outline";
    if (n.includes("kitchen")) return "restaurant-outline";
    if (n.includes("master")) return "bed-outline";
    if (n.includes("toilet") || n.includes("bathroom")) return "water-outline";
    if (n.includes("dining")) return "cafe-outline";
    if (n.includes("study")) return "book-outline";
    return "tv-outline";
  };

  return (
    <View style={styles.container}>
      
      {/* Light Theme CAD Blueprint Toolbar */}
      <View style={styles.draftToolbar}>
        <View style={styles.toolbarTitleBlock}>
          <View style={styles.onlineDot} />
          <Text style={styles.toolbarTitle}>
            {isTe ? "వాస్తు CAD నివాస ప్లాన్" : "CAD Architectural Planner Workspace"}
          </Text>
        </View>
        
        <View style={styles.toolbarActions}>
          <TouchableOpacity 
            style={[styles.toolBtn, showGrid && styles.activeToolBtn]} 
            onPress={() => setShowGrid(!showGrid)}
          >
            <Ionicons name="grid-outline" size={13} color={showGrid ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, showLabels && styles.activeToolBtn]} 
            onPress={() => setShowLabels(!showLabels)}
          >
            <Ionicons name="text-outline" size={13} color={showLabels ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, showFurniture && styles.activeToolBtn]} 
            onPress={() => setShowFurniture(!showFurniture)}
          >
            <Ionicons name="bed-outline" size={13} color={showFurniture ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, showCirculation && styles.activeToolBtn]} 
            onPress={() => setShowCirculation(!showCirculation)}
          >
            <Ionicons name="walk-outline" size={13} color={showCirculation ? "#FFFFFF" : theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          <TouchableOpacity style={styles.toolBtn} onPress={() => setScale(Math.max(0.6, scale - 0.1))}>
            <Ionicons name="remove-outline" size={13} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setScale(Math.min(1.4, scale + 0.1))}>
            <Ionicons name="add-outline" size={13} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen-filling drawing canvas */}
      <View style={[styles.canvasContainer, { height: CANVAS_HEIGHT }]}>
        <View style={styles.draftSheet}>
          <View style={[
            styles.rotateWrapper,
            { transform: [{ rotate: `${angle}deg` }, { scale: scale }] }
          ]}>
            
            {/* Centered Plot Boundary (Gold dotted outline) - removed left/top offsets to center perfectly */}
            <View style={[styles.plotBoundary, { width: plotWidth, height: plotHeight }]}>
              
              {renderHorizontalRuler()}
              {renderVerticalRuler()}

              {showGrid && (
                <View style={styles.cadGridBackdrop}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <View key={`grid-v-${i}`} style={[styles.cadGridV, { left: `${(i + 1) * 10}%` }]} />
                  ))}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <View key={`grid-h-${i}`} style={[styles.cadGridH, { top: `${(i + 1) * 10}%` }]} />
                  ))}
                </View>
              )}

              {/* Setback Utilities */}
              {/* Stairs */}
              <View style={[
                styles.stairsBlueprintBlock, 
                getUtilityCoords(state.stairsLocation, 'stairs')
              ]}>
                <View style={styles.stairStepRow} />
                <View style={styles.stairStepRow} />
                <View style={styles.stairStepRow} />
                <View style={styles.stairStepRow} />
                <Text style={styles.utilityTextTag}>{isTe ? "మెట్లు" : "STAIRS"}</Text>
              </View>

              {/* Sump */}
              <View style={[
                styles.sumpBlueprintBlock,
                getUtilityCoords(state.sumpLocation, 'sump')
              ]}>
                <Ionicons name="water-outline" size={12} color="#0284C7" />
                <Text style={styles.utilityTextTag}>{isTe ? "సంప్" : "SUMP"}</Text>
              </View>

              {/* Borewell */}
              <View style={[
                styles.boreholeBlueprintBlock,
                getUtilityCoords(state.boreLocation, 'bore')
              ]}>
                <View style={styles.boreRingOuter}>
                  <View style={styles.boreRingInner} />
                </View>
                <Text style={styles.utilityTextTag}>{isTe ? "బోరు" : "BORE"}</Text>
              </View>

              {/* Septic Tank */}
              <View style={[
                styles.septicBlueprintBlock,
                getUtilityCoords(state.septicLocation, 'septic')
              ]}>
                <Ionicons name="construct-outline" size={10} color="#64748B" />
                <Text style={styles.utilityTextTag}>{isTe ? "సెప్టిక్" : "SEPTIC"}</Text>
              </View>

              {/* Outside toilet WC */}
              <View style={[
                styles.outsideWcBlock,
                getUtilityCoords(state.outsideBtLocation, 'wc')
              ]}>
                <Ionicons name="water-outline" size={10} color="#64748B" />
                <Text style={styles.utilityTextTag}>OUT WC</Text>
              </View>

              {/* Setback guideways */}
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

              {/* ==========================================
                  BUILDING CONTAINER (Thick concrete walls)
                  ========================================== */}
              <View style={[
                styles.buildingFootprintWalls, 
                { 
                  width: footWidthPx, 
                  height: footHeightPx,
                  left: westOpenPx,
                  top: northOpenPx,
                  backgroundColor: '#334155'
                }
              ]}>
                
                {/* Rooms rendering (with inset wall spacing) */}
                {roomPlacements.map((room) => {
                  const rX = room.visX * pxPerFt;
                  const rY = room.visY * pxPerFt;
                  const rW = room.visW * pxPerFt;
                  const rH = room.visH * pxPerFt;

                  return (
                    <View 
                      key={room.id}
                      style={[
                        styles.draftRoomBox,
                        {
                          left: rX,
                          top: rY,
                          width: rW,
                          height: rH,
                          backgroundColor: getRoomThemeColor(room.name),
                          borderColor: room.name.toLowerCase().includes("master") ? '#6366F1' :
                                       room.name.toLowerCase().includes("kitchen") ? '#EF4444' :
                                       room.name.toLowerCase().includes("pooja") ? '#F59E0B' : '#64748B',
                        }
                      ]}
                    >
                      {renderRoomFurniture(room)}

                      {showLabels && (
                        <View style={styles.roomTextCentering}>
                          <Ionicons name={getRoomIcon(room.name)} size={13} color="#D97706" style={{ marginBottom: 2 }} />
                          <Text style={styles.roomLabelText} numberOfLines={1}>{room.name}</Text>
                          <Text style={styles.roomSizeText}>
                            {Math.round(room.visW)}' × {Math.round(room.visH)}'
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Main Gate & Entrance Arrow (Very Prominent) */}
                {mainDoor && (
                  <View style={[
                    styles.entranceArrowContainer,
                    {
                      left: mainDoor.x * pxPerFt + (mainDoor.wallSide === 'left' ? -38 : mainDoor.wallSide === 'right' ? 18 : -18),
                      top: mainDoor.y * pxPerFt + (mainDoor.wallSide === 'top' ? -38 : mainDoor.wallSide === 'bottom' ? 18 : -18),
                      transform: [{ rotate: mainDoor.wallSide === 'top' ? '180deg' : mainDoor.wallSide === 'bottom' ? '0deg' : mainDoor.wallSide === 'left' ? '90deg' : '270deg' }]
                    }
                  ]}>
                    <Ionicons name="arrow-down-circle" size={18} color="#10B981" />
                    <Text style={styles.entranceLabelTag}>MAIN GATE</Text>
                  </View>
                )}

                {/* Doors Rendering */}
                {doors.map(d => renderDoorSymbol(d))}
                {mainDoor && renderDoorSymbol(mainDoor)}

                {/* Windows Rendering */}
                {windows.map(w => renderWindowSymbol(w))}

                {/* Circulation path overlay */}
                {renderCirculationPath()}

              </View>

              {renderRoads()}
            </View>

          </View>

          {/* Interactive compass icon showing rotation angle */}
          <View style={[styles.goldCompass, { transform: [{ rotate: `${angle}deg` }] }]}>
            <Ionicons name="compass" size={26} color={theme.colors.accent} />
            <Text style={styles.compassLabel}>N</Text>
          </View>

        </View>

        {/* Legend Overlay Section (Senior Architectural Design UI) */}
        <View style={styles.legendContainer}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>{isTe ? "సూచిక" : "ARCHITECTURAL BLUEPRINT LEGEND"}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendContent}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#334155', borderWidth: 0 }]} />
              <Text style={styles.legendText}>{isTe ? "9\" బాహ్య గోడ" : "9\" External Wall"}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#0F172A', borderColor: '#475569' }]} />
              <Text style={styles.legendText}>{isTe ? "4.5\" విభజన గోడ" : "4.5\" Partition Wall"}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#0C4A6E', borderColor: '#38BDF8' }]} />
              <Text style={styles.legendText}>{isTe ? "కిటికీ / సన్ షేడ్" : "Window / Sunshade (Chajja)"}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#334155', borderColor: '#64748B' }]} />
              <Text style={styles.legendText}>{isTe ? "సహజ వెంటిలేటర్" : "Ventilator (V)"}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: 'transparent', borderColor: '#D97706', borderStyle: 'dashed' }]} />
              <Text style={styles.legendText}>{isTe ? "డోర్ స్వింగ్ ఆర్క్" : "Door Swing Arc"}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { borderColor: '#10B981', borderStyle: 'dashed' }]} />
              <Text style={styles.legendText}>{isTe ? "నడక మార్గం" : "Circulation Pathway"}</Text>
            </View>
          </ScrollView>
        </View>

        {/* Footer specifications */}
        <Text style={styles.statusFooter}>
          {isTe 
            ? `స్థలం: ${state.siteWidth}×${state.siteLength} అడుగులు | బిల్డప్ ఏరియా: ${Math.round(footW * footL)} చ.అ` 
            : `Plot: ${state.siteWidth}×${state.siteLength} ft | Built Area: ${Math.round(footW * footL)} sq.ft`}
        </Text>
      </View>

    </View>
  );
}

// Circulation line helper
const RenderCirculationLine = ({ x1, y1, x2, y2, pxPerFt, footLeft, footTop }) => {
  const x1_px = footLeft + x1 * pxPerFt;
  const y1_px = footTop + y1 * pxPerFt;
  const x2_px = footLeft + x2 * pxPerFt;
  const y2_px = footTop + y2 * pxPerFt;

  const dx = x2_px - x1_px;
  const dy = y2_px - y1_px;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  return (
    <View style={{
      position: 'absolute',
      left: (x1_px + x2_px) / 2 - length / 2,
      top: (y1_px + y2_px) / 2 - 1,
      width: length,
      height: 2,
      borderTopWidth: 1.8,
      borderTopColor: '#10B981',
      borderStyle: 'dashed',
      transform: [{ rotate: `${angle}deg` }],
      opacity: 0.8,
      zIndex: 25 // Elevated overlay for circulation path
    }} />
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Premium midnight theme for the workspace
  },
  draftToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.2,
    borderBottomColor: '#1E293B',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#0F172A',
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
    color: '#F8FAFC',
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
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeToolBtn: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  toolbarDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  canvasContainer: {
    backgroundColor: '#0B0F19', // Deep dark blueprint background
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
    borderBottomColor: '#1E293B',
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
    backgroundColor: '#475569',
  },
  rulerText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  verticalRuler: {
    position: 'absolute',
    top: 0,
    left: -20,
    bottom: 0,
    width: 20,
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
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
    backgroundColor: '#475569',
  },
  draftSheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  plotBoundary: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderStyle: 'dashed',
    backgroundColor: '#0F172A', // Dark drafting paper style
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
    backgroundColor: 'rgba(56, 189, 248, 0.08)', // Cyber cyan grids
  },
  cadGridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  asphaltRoad: {
    position: 'absolute',
    backgroundColor: '#1E293B', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderColor: '#334155',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  horizAsphalt: {
    left: 0,
    right: 0,
  },
  vertAsphalt: {
    top: 0,
    bottom: 0,
  },
  roadLaneDividerH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderWidth: 1,
    borderColor: '#F59E0B', 
    borderStyle: 'dashed',
  },
  roadLaneDividerV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  asphaltRoadText: {
    fontSize: 6.8,
    fontWeight: '900',
    color: '#F8FAFC',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 2,
    letterSpacing: 0.8,
  },
  buildingFootprintWalls: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'visible',
  },
  draftRoomBox: {
    position: 'absolute',
    borderWidth: 1.2,
    backgroundColor: '#111827', // Deep room fills
    overflow: 'hidden',
  },
  roomTextCentering: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  roomLabelText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  roomSizeText: {
    fontSize: 6,
    color: '#94A3B8',
    marginTop: 1,
    fontWeight: '600',
  },
  goldCompass: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: theme.colors.accent, 
    borderRadius: 20,
    padding: 2,
    width: 38,
    height: 38,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  compassLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: theme.colors.accent,
    marginTop: -4,
  },
  statusFooter: {
    fontSize: 9.5,
    color: '#94A3B8',
    height: 28,
    lineHeight: 28,
    backgroundColor: '#0F172A',
    textAlign: 'center',
    fontWeight: '700',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
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
    backgroundColor: '#0F172A',
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
    backgroundColor: '#0F172A',
    textAlign: 'center',
  },
  stairsBlueprintBlock: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  stairStepRow: {
    width: '100%',
    height: '20%',
    borderBottomWidth: 0.8,
    borderBottomColor: '#475569',
  },
  sumpBlueprintBlock: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: '#0284C7',
    backgroundColor: '#0C4A6E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    zIndex: 12,
  },
  boreholeBlueprintBlock: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  boreRingOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boreRingInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  septicBlueprintBlock: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    zIndex: 12,
  },
  outsideWcBlock: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  utilityTextTag: {
    fontSize: 5,
    fontWeight: '800',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  doorFrameBlock: {
    position: 'absolute',
    zIndex: 15,
    overflow: 'visible',
  },
  windowGlassBlock: {
    position: 'absolute',
    zIndex: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winGlassCenterH: {
    width: '100%',
    height: 1,
    backgroundColor: '#38BDF8',
  },
  winGlassCenterV: {
    height: '100%',
    width: 1,
    backgroundColor: '#38BDF8',
  },
  windowLabelTag: {
    fontSize: 5.5,
    fontWeight: '900',
    color: '#38BDF8',
    position: 'absolute',
    bottom: -8,
  },
  exhaustIndicator: {
    fontSize: 4.5,
    fontWeight: '900',
    color: '#EF4444',
    position: 'absolute',
    top: -8,
  },
  entranceArrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 44,
    zIndex: 20,
  },
  entranceLabelTag: {
    fontSize: 5.5,
    fontWeight: '950',
    color: '#A7F3D0',
    marginTop: 1,
    backgroundColor: '#064E3B',
    borderWidth: 0.8,
    borderColor: '#059669',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    letterSpacing: 0.3,
  },
  bedFurniture: {
    position: 'absolute',
    backgroundColor: '#78350F',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 3,
  },
  bedPillowsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  bedPillow: {
    width: '38%',
    height: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 0.8,
    borderColor: '#D97706',
    borderRadius: 1,
  },
  bedHeadboard: {
    width: '100%',
    height: 3,
    backgroundColor: '#D97706',
  },
  bedBlanket: {
    width: '100%',
    height: '40%',
    backgroundColor: '#B45309',
    opacity: 0.4,
    borderTopWidth: 0.8,
    borderColor: '#D97706',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  kitchenCounterV: {
    position: 'absolute',
    backgroundColor: '#334155',
    borderLeftWidth: 1,
    borderColor: '#475569',
  },
  kitchenCounterH: {
    position: 'absolute',
    backgroundColor: '#334155',
    borderTopWidth: 1,
    borderColor: '#475569',
  },
  cooktopStove: {
    position: 'absolute',
    width: 18,
    height: 12,
    backgroundColor: '#0F172A',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  burnerCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 0.8,
    borderColor: '#EF4444',
    backgroundColor: '#334155',
  },
  kitchenSink: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#475569',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 1,
  },
  toiletCommode: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: 14,
    height: 20,
    alignItems: 'center',
  },
  toiletTank: {
    width: 12,
    height: 5,
    backgroundColor: '#475569',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 1,
  },
  toiletBowl: {
    width: 10,
    height: 14,
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 5,
    marginTop: 1,
  },
  washBasinCorner: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 12,
    height: 12,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: '#334155',
  },
  sofaSectional: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    width: 14,
    backgroundColor: '#475569',
    borderRadius: 1,
  },
  sofaSeatLong: {
    width: '100%',
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#334155',
  },
  sofaSeatShort: {
    position: 'absolute',
    left: 14,
    top: 0,
    width: 20,
    height: 14,
    backgroundColor: '#475569',
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  coffeeTable: {
    position: 'absolute',
    left: 24,
    top: 24,
    width: 18,
    height: 12,
    backgroundColor: '#78350F',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 1,
  },
  diningTableSet: {
    position: 'absolute',
    left: '20%',
    top: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  diningTablePlate: {
    flex: 1,
    height: '100%',
    backgroundColor: '#78350F',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  diningChairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#475569',
    borderWidth: 0.8,
    borderColor: '#334155',
  },
  poojaPedestal: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 16,
    height: 16,
    backgroundColor: '#78350F',
    borderWidth: 1.2,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopWidth: 1.2,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 30,
  },
  legendHeader: {
    marginBottom: 4,
    alignItems: 'center',
  },
  legendTitle: {
    fontSize: 7.5,
    fontWeight: '850',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  legendContent: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
  },
  legendLine: {
    width: 16,
    height: 0,
    borderTopWidth: 2,
  },
  legendText: {
    fontSize: 7.2,
    fontWeight: '700',
    color: '#94A3B8',
  }
});
