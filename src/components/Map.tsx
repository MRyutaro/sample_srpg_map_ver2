import { useState, useRef, useEffect } from "react";
import image from "../image1.png";

// マップ全体の設定
const MAP_TILES_X_LEN = 10; // マップの横のタイル数（windowのX軸方向）
const MAP_TILES_Y_LEN = 20; // マップの縦のタイル数（windowのY軸方向）
const TILE_SIZE = 100; // タイルのサイズ
const ROTATE_X = 66; // マップの平たさ具合(deg)
const A = TILE_SIZE * 0.71; // タイルを敷き詰めるための補正値。√2/2 ≒ 0.71。これを変えるとタイル同士の間隔が変わる。
const MAP_LEFT_OFFSET = 0; // マップの左のオフセット
const MAP_TOP_OFFSET = 0; // マップの上のオフセット

// タイルの設定
const SELECTED_TILE_MOVE_Y = -5; // タイルが選択されたときのY軸の移動量(px)

const IMAGE_SIZE = 524; // タイルに埋め込む画像のサイズ
const IMAGE_POSITION = -296; // 画像の位置

export function Map(): JSX.Element {
    const [selectedTile, setSelectedTile] = useState<[number, number] | null>(null);
    const tileRef = useRef<HTMLDivElement | null>(null); // [1, MAP_TILES_X_LEN]のタイル用のuseRef

    // タイルがクリックされたときに選択状態にする
    const handleTileClick = (x: number, y: number) => {
        if (selectedTile && selectedTile[0] === x && selectedTile[1] === y) {
            setSelectedTile(null);
        } else {
            setSelectedTile([x, y]);
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            {/* gridを使って実装 */}
            {Array.from({ length: MAP_TILES_Y_LEN + MAP_TILES_X_LEN }, (_, y) =>
                Array.from({ length: MAP_TILES_Y_LEN + MAP_TILES_X_LEN }, (_, x) => {
                    if (x + y <= MAP_TILES_X_LEN || x + y >= MAP_TILES_X_LEN + 2 * MAP_TILES_Y_LEN) {
                        return null;
                    } else if (x - y <= -MAP_TILES_X_LEN || x - y >= MAP_TILES_X_LEN) {
                        return null;
                    }

                    const isSelected = selectedTile?.[0] === x && selectedTile?.[1] === y;
                    const tileTopOffset = isSelected ? SELECTED_TILE_MOVE_Y : 0;

                    // [1, MAP_TILES_X_LEN]のタイルにrefを設定
                    const isTargetTile = x === 1 && y === MAP_TILES_X_LEN;

                    return (
                        <div
                            key={`${x},${y}`}
                            ref={isTargetTile ? tileRef : null} // 対象のタイルにrefを設定
                            style={{
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                position: "absolute",
                                backgroundColor: "lightblue",
                                left: `${MAP_LEFT_OFFSET + x * A - y * A}px`,
                                top: `${
                                    MAP_TOP_OFFSET +
                                    tileTopOffset +
                                    y * (A * Math.cos((ROTATE_X * Math.PI) / 180)) +
                                    x * (A * Math.cos((ROTATE_X * Math.PI) / 180))
                                }px`,
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
