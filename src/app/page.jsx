'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const gridSize = 64;
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState(new Set());
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRightClickDragging, setIsRightClickDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

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

  const handleTileClick = (index) => {
    setSelectedTiles((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.has(index) ? newSelected.delete(index) : newSelected.add(index);
      return newSelected;
    });
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isRightClickDragging) {
      const tileIndex = getTileIndexFromMouse(e.clientX, e.clientY);
      if (tileIndex >= 0 && tileIndex < tiles.length) {
        setSelectedTiles((prevSelected) => {
          const newSelected = new Set(prevSelected);
          newSelected.add(tileIndex);
          return newSelected;
        });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true); // Left click: dragging
      setStartDrag({ x: e.clientX, y: e.clientY });
    } else if (e.button === 2) {
      setIsRightClickDragging(true); // Right click: select tiles
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRightClickDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsRightClickDragging(false);
  };

  const handleWheel = (e) => {
    const scrollAmountX = e.deltaX;  // Detect horizontal scroll (left-right)
    const scrollAmountY = e.deltaY;  // Detect vertical scroll (up-down)

    const newOffset = { ...offset };

    // Horizontal scroll
    newOffset.x += scrollAmountX;

    // Vertical scroll
    newOffset.y += scrollAmountY;

    setOffset(newOffset);
  };

  const getTileIndexFromMouse = (mouseX, mouseY) => {
    const gridRect = gridRef.current.getBoundingClientRect();
    const tileSize = gridRect.width / gridSize; // Calculate tile size based on grid width

    // Adjust mouse coordinates for grid offset
    const adjustedX = mouseX - gridRect.left - offset.x;
    const adjustedY = mouseY - gridRect.top - offset.y;

    // Calculate tile indices
    const x = Math.floor(adjustedX / tileSize);
    const y = Math.floor(adjustedY / tileSize);

    // Ensure the indices are within the grid bounds
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
      return -1; // Return -1 if outside the grid
    }

    return y * gridSize + x;
  };

  return (
    <div
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel} // Mouse wheel scroll
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
    >
      <main className={styles.main} ref={gridRef}>
        <div
          className={styles.grid}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            cursor: isDragging ? "grabbing" : "grab", 
          }}
        >
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`${styles.tile}`}
              style={{
                "--border-color": tile?.borderColor || "#FFFFFF",
                backgroundColor: selectedTiles.has(i) ? tile?.borderColor : "black",
              }}
              data-selected={selectedTiles.has(i)}
              onClick={() => handleTileClick(i)} // Left-click to select multiple tiles
              onMouseEnter={(e) => {
                setHoveredCountry(tile?.country);
                setMousePos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          ))}
        </div>
      </main>

      {hoveredCountry && (
        <div
          className={styles.countryName}
          style={{
            top: mousePos.y + 30, 
            left: mousePos.x + 10,
          }}
        >
          {hoveredCountry}
        </div>
      )}
    </div>
  );
}