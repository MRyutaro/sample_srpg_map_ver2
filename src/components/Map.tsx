import image from "../image1.png";

const MAP_TILES_X_LEN = 20; // マップの横の長さ
const MAP_TILES_Y_LEN = 20; // マップの縦の長さ
const TILE_SIZE = 150; // タイルのサイズ
const ROTATE_X = 66; // マップの平たさ具合(deg)
const IMAGE_SIZE = 524; // タイルに埋め込む画像のサイズ
const IMAGE_POSITION = -296; // 画像の位置
const A = TILE_SIZE * 0.71; // タイルを敷き詰めるための補正値。デフォルトはTILE_SIZE * 0.71

export function Map(): JSX.Element {
    return (
        <div>
            {/* gridを使って実装 */}
            {Array.from({ length: MAP_TILES_Y_LEN }, (_, y) =>
                Array.from({ length: MAP_TILES_X_LEN }, (_, x) => (
                    <div
                        key={`${x},${y}`}
                        style={{
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            position: "absolute",
                            left: `${x * A - y * A + 1000}px`,
                            top: `${y * (A * Math.cos((ROTATE_X * Math.PI) / 180)) + x * (A * Math.cos((ROTATE_X * Math.PI) / 180))}px`,
                            transform: `rotateX(${ROTATE_X}deg) rotateZ(45deg)`,
                            border: "0.1px solid black",
                        }}
                    >
                        <div>
                            {x},{y}
                        </div>

                        {x === 3 && y === 3 && (
                            <img
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
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
