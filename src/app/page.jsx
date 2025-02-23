'use client';

import { useState, useRef, useEffect } from 'react';
import PopUp from './PopUp';
import styles from './page.module.css';

export default function Home() {
  const gridSize = 64;
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState(new Set());
  const [hoveredTile, setHoveredTile] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [showPopup, setShowPopup] = useState(true);
  const [selectedTileInfo, setSelectedTileInfo] = useState(null);
  const gridRef = useRef(null);

  const countryNames = [
    "Xyphos", "Zentharis", "Omicron", "Nyxara", "Tarkonis",
    "Vorlune", "Erythraea", "Draconis", "Aetheron", "Zephyria"
  ];
  const pastelColors = ["#FF8FA3", "#FFC488", "#7DD9F0", "#C08BC0", "#76F776", "#FFF488", "#CFCFFF"];

  useEffect(() => {
    generateMap();
  }, []);

  const generateMap = () => {
    const map = new Array(gridSize * gridSize).fill(null);
    let countryIndex = 0;

    for (let i = 0; i < gridSize * gridSize; i++) {
      if (map[i] === null) {
        const countryName = countryNames[countryIndex % countryNames.length];
        const borderColor = pastelColors[countryIndex % pastelColors.length];
        floodFill(map, i, countryName, borderColor);
        countryIndex++;
      }
    }

    setTiles(applyBorders(map));
  };

  const floodFill = (map, startIdx, countryName, borderColor) => {
    let queue = [startIdx];
    let size = Math.floor(Math.random() * 100) + 20;
    let added = 0;

    while (queue.length > 0 && added < size) {
      const idx = queue.shift();
      if (idx < 0 || idx >= map.length || map[idx] !== null) continue;

      map[idx] = { country: countryName, borderColor };
      added++;

      let neighbors = [idx - 1, idx + 1, idx - gridSize, idx + gridSize].filter(
        n => n >= 0 && n < map.length
      );

      queue.push(...neighbors);
    }
  };

  const applyBorders = (map) => {
    return map.map((tile, i) => {
      if (!tile) return null;

      const left = i % gridSize === 0 || map[i - 1]?.country !== tile.country;
      const right = i % gridSize === gridSize - 1 || map[i + 1]?.country !== tile.country;
      const top = i < gridSize || map[i - gridSize]?.country !== tile.country;
      const bottom = i >= map.length - gridSize || map[i + gridSize]?.country !== tile.country;

      return {
        ...tile,
        border: left || right || top || bottom,
      };
    });
  };

  const handleTileClick = (index, event) => {
    const tile = tiles[index];
    if (!tile) return;

    const rect = event.target.getBoundingClientRect();
    const popupX = rect.left + rect.width / 2;
    const popupY = rect.bottom + 5;

    setSelectedTileInfo({
      index,
      ...tile,
      x: index % gridSize,
      y: Math.floor(index / gridSize),
      screenX: popupX,
      screenY: popupY,
    });
  };

  const handleBuyTile = () => {
    if (selectedTileInfo) {
      setSelectedTiles((prevSelected) => new Set([...prevSelected, selectedTileInfo.index]));
      setSelectedTileInfo(null);
    }
  };

  const handleScroll = (event) => {
    if (gridRef.current) {
      gridRef.current.scrollLeft += event.deltaX;
      gridRef.current.scrollTop += event.deltaY;
    }
  };

  return (
    <div className={styles.container} onContextMenu={(e) => e.preventDefault()} onWheel={handleScroll}>
      {showPopup && (
        <div>
          <PopUp onPlay={() => setShowPopup(false)} />
        </div>
      )}

      <main className={styles.main} ref={gridRef}>
        <div className={styles.grid}>
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`${styles.tile} ${selectedTiles.has(i) ? styles.selected : ''}`}
              style={{
                "--border-color": tile?.borderColor || "#FFFFFF",
                backgroundColor: selectedTiles.has(i) ? tile?.borderColor : "black",
              }}
              onClick={(e) => handleTileClick(i, e)}
              onMouseEnter={(e) => {
                setHoveredTile({ name: tile?.country, x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => {
                setHoveredTile(null);
              }}
            />
          ))}
        </div>
      </main>

      {hoveredTile && (
        <div
          className={styles.countryName}
          style={{
            left: `${hoveredTile.x}px`,
            top: `${hoveredTile.y - 50}px`
          }}
        >
          {hoveredTile.name}
        </div>
      )}

      {selectedTileInfo && (
        <div
          className={styles.tilePopup}
          style={{
            position: "absolute",
            left: `${selectedTileInfo.screenX}px`,
            top: `${selectedTileInfo.screenY}px`,
            transform: "translateX(-50%)",
          }}
        >
          <p>Country: {selectedTileInfo.country}</p>
          <p>Color: {selectedTileInfo.borderColor}</p>
          <p>Tile Index: {selectedTileInfo.index}</p>
          <p>Coordinates: ({selectedTileInfo.x}, {selectedTileInfo.y})</p>
          <button className={styles.futuristicButton} onClick={handleBuyTile}>Buy this Tile</button>
        </div>
      )}
    </div>
  );
}
