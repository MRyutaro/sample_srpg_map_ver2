const MAP_WIDTH_LEN = 20;
const MAP_HEIGHT_LEN = 20;
const TILE_SIZE = 150;
const rotateX = Math.PI / 3;

const A = TILE_SIZE * Math.cos(Math.PI / 4);

export function Map(): JSX.Element {
    return (
        <div>
            {/* gridを使って実装 */}
            <div
                style={{
                    display: "grid",
                }}
            >
                {Array.from({ length: MAP_HEIGHT_LEN }, (_, y) =>
                    Array.from({ length: MAP_WIDTH_LEN }, (_, x) => (
                        <div
                            key={`${x}-${y}`}
                            style={{
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                position: "absolute",
                                left: `${x * A - y * A}px`,
                                top: `${
                                    y * (A * Math.cos(rotateX)) +
                                    x * (A * Math.cos(rotateX))
                                }px`,
                                transform: `rotateX(${rotateX}rad) rotateZ(45deg)`,
                                border: "0.1px solid black",
                            }}
                        >
                            {/* {x}, {y} */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
