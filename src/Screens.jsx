import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="rounded-2xl w-96 h-96 bg-pink-100 flex flex-col items-center justify-center p-10 text-pink-500 ">
        <h2 className="font-bold text-4xl mt-8">Memory</h2>
        <div className="font-medium text-lg mt-4 mb-10">
          Flip over tiles looking for pairs
        </div>
        <button onClick={start} style={{width: '150px'}} className="hover:from-pink-500 hover:to-pink:500 font-semibold bg-gray-400 text-white p-3 bg-gradient-to-b from-pink-400 to-pink-600 text-white rounded-3xl text-2xl cursor-pointer py-2 px-5">
        Play
      </button>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [bestCount,setBestCount] = useState(0);
  

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex justify-between">
          <span className="text-green-500 mb-8 text-lg font-semibold">Best score &nbsp;
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0. rounded" style={{ fontSize: '20px'}}>
              {bestCount}
            </span>
          </span>

          <span className="text-blue-500 mb-8 text-lg font-semibold">Tries&nbsp;
          <span className="bg-blue-100 text-blue-800 text-sx font-medium me-2 px-2.5 rounded" style={{color: '#4d46e4',fontSize: '20px',backgroundColor:'#c3d3fe'}}>
            {tryCount}
          </span>
          </span>
        </div>

        <div className="w-80 h-80 rounded-2xl bg-blue-50" style={{height:"400px",width: '400px'}}>
          <div className="grid grid-cols-4 place-items-center p-2 w-full h-full">
            {getTiles(16).map((tile,i) => (<Tile key={i} flip={() => flip(i)} {...tile}/>))}
          </div>
        </div>
      </div>
      
    </>
  );
}
