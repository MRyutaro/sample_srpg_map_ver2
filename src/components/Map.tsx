import { useState, useRef, useEffect, useCallback } from "react";
import image from "../image1.png";

// マップ全体の設定
const TILE_SIDE_LENGTH = 100; // タイルのサイズ
const ROTATE_X = 66; // マップの平たさ具合(deg)

// タイルの設定
const SELECTED_TILE_MOVE_Y = -5; // タイルが選択されたときのY軸の移動量(px)

const IMAGE_SIZE = 524; // タイルに埋め込む画像のサイズ
const IMAGE_POSITION = -296; // 画像の位置

export function Map(): JSX.Element {
    const mapRef = useRef<HTMLDivElement | null>(null); // マップ全体のref
    const tileRef = useRef<HTMLDivElement | null>(null); // [1, MAP_TILES_X_LEN_PLUS_ONE]のタイルのref
    const [tileHalfWidth, setTileHalfWidth] = useState<number>(TILE_SIDE_LENGTH / Math.sqrt(2));
    const [tileHalfHeight, setTileHalfHeight] = useState<number>(TILE_SIDE_LENGTH / (Math.sqrt(2) * Math.tan((ROTATE_X * Math.PI) / 180)));
    const [mapTilesXLen, setMapTilesXLen] = useState<number>(0);
    const [mapTilesYLen, setMapTilesYLen] = useState<number>(0);
    const [mapSize, setMapSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [selectedTile, setSelectedTile] = useState<[number, number] | null>(null);
    const [mapOffset, setMapOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });


    // リサイズ時の処理
    useEffect(() => {
        const handleResize = () => {
            if (mapRef.current) {
                const rect = mapRef.current.getBoundingClientRect();
                setMapSize({ width: rect.width, height: rect.height });
            }

            if (tileRef.current) {
                const rect = tileRef.current.getBoundingClientRect();
                console.log(rect);
                setMapOffset({ x: -rect.left, y: -rect.top });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // mapSizeが変更されたときにmapTilesXLenとmapTilesYLenを更新する
    useEffect(() => {
        if (mapSize.width > 0 && mapSize.height > 0) {
            // マップの幅と高さに基づいてタイル数を計算する
            console.log(mapSize.width, mapSize.height);

            // ここで計算
            const mapTilesXLen = Math.floor(mapSize.width / (tileHalfWidth * 2)) + 2;
            const mapTilesYLen = Math.floor(mapSize.height / (tileHalfHeight * 2)) + 4;
            setMapTilesXLen(mapTilesXLen);
            setMapTilesYLen(mapTilesYLen);
        }
    }, [mapSize]);

    // タイルがクリックされたときに選択状態にする
    const handleTileClick = useCallback(
        (x: number, y: number) => {
            if (selectedTile && selectedTile[0] === x && selectedTile[1] === y) {
                setSelectedTile(null);
            } else {
                setSelectedTile([x, y]);
            }
        },
        [selectedTile]
    );

    return (
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    backgroundColor: "lightgray",
                    padding: "5px",
                }}
            >
                横のタイル数: {mapTilesXLen}, 縦のタイル数: {mapTilesYLen} <br />
                {selectedTile && `選択されたタイル: (${selectedTile[0]}, ${selectedTile[1]})`}
            </div>

            {/* gridを使って実装 */}
            {Array.from({ length: mapTilesXLen + mapTilesYLen }, (_, y) =>
                Array.from({ length: mapTilesXLen + mapTilesYLen }, (_, x) => {
                    if (x + y <= mapTilesXLen || x + y >= mapTilesXLen + 2 * mapTilesYLen) {
                        return null;
                    } else if (x - y <= -mapTilesXLen || x - y >= mapTilesXLen) {
                        return null;
                    }

                    const isSelected = selectedTile?.[0] === x && selectedTile?.[1] === y;
                    const tileTopOffset = isSelected ? SELECTED_TILE_MOVE_Y : 0;

                    // [1, mapTilesXLen]の場合はisTargetTileをtrueにする
                    const isTargetTile = x === 2 && y === mapTilesXLen;

                    return (
                        <div
                            key={`${x},${y}`}
                            ref={isTargetTile ? tileRef : null}
                            style={{
                                width: TILE_SIDE_LENGTH,
                                height: TILE_SIDE_LENGTH,
                                position: "absolute",
                                backgroundColor: "lightblue",
                                left: `${mapOffset.x + x * tileHalfWidth - y * tileHalfWidth}px`,
                                top: `${
                                    mapOffset.y +
                                    tileTopOffset +
                                    y * (tileHalfWidth * Math.cos((ROTATE_X * Math.PI) / 180)) +
                                    x * (tileHalfWidth * Math.cos((ROTATE_X * Math.PI) / 180))
                                }px`,
                                transform: `rotateX(${ROTATE_X}deg) rotateZ(45deg)`,
                                border: isSelected ? "1px solid red" : "1px solid black",
                                boxShadow: isSelected ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                transition: "top 0.2s ease, box-shadow 0.2s ease",
                                cursor: "pointer",
                            }}
                            onClick={() => handleTileClick(x, y)}
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
