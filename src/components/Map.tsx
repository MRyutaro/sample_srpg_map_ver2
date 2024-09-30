import { useState } from "react";
import image from "../image1.png";

const MAP_TILES_X_LEN = 20; // マップの横の長さ
const MAP_TILES_Y_LEN = 20; // マップの縦の長さ
const TILE_SIZE = 100; // タイルのサイズ
const ROTATE_X = 66; // マップの平たさ具合(deg)
const IMAGE_SIZE = 524; // タイルに埋め込む画像のサイズ
const IMAGE_POSITION = -296; // 画像の位置
const A = TILE_SIZE * 0.71; // タイルを敷き詰めるための補正値
const SELECTED_TILE_MOVE_Y = -5; // タイルが選択されたときのY軸の移動量

export function Map(): JSX.Element {
    const [selectedTile, setSelectedTile] = useState<[number, number] | null>(null);

    // タイルがクリックされたときに選択状態にする
    const handleTileClick = (x: number, y: number) => {
        setSelectedTile([x, y]);
    };

    return (
        <div>
            {/* gridを使って実装 */}
            {Array.from({ length: MAP_TILES_Y_LEN }, (_, y) =>
                Array.from({ length: MAP_TILES_X_LEN }, (_, x) => {
                    const isSelected = selectedTile?.[0] === x && selectedTile?.[1] === y;
                    const tileTopOffset = isSelected ? SELECTED_TILE_MOVE_Y : 0;

                    return (
                        <div
                            key={`${x},${y}`}
                            style={{
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                position: "absolute",
                                backgroundColor: "lightblue",
                                left: `${x * A - y * A + 1000}px`,
                                top: `${y * (A * Math.cos((ROTATE_X * Math.PI) / 180)) + x * (A * Math.cos((ROTATE_X * Math.PI) / 180)) + tileTopOffset}px`,
                                transform: `rotateX(${ROTATE_X}deg) rotateZ(45deg)`,
                                border: isSelected ? "1px solid red" : "1px solid black",
                                boxShadow: isSelected ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                transition: "top 0.2s ease, box-shadow 0.2s ease",
                                cursor: "pointer",
                            }}
                            onClick={() => handleTileClick(x, y)} // クリックイベント
                        >
                            <div>
                                {x},{y}
                            </div>

                            {/* 画像を表示する場合 */}
                            {/* <img
                                src={image}
                                alt={`${x},${y}`}
                                style={{
                                    width: `${IMAGE_SIZE}px`,
                                    height: `${IMAGE_SIZE}px`,
                                    transform: `rotateZ(-45deg) rotateY(-${ROTATE_X}deg)`,
                                    transformOrigin: "center",
                                    position: "absolute",
                                    top: `${IMAGE_POSITION}px`,
                                    left: `${IMAGE_POSITION}px`,
                                }}
                            /> */}
                        </div>
                    );
                })
            )}
        </div>
    );
}
