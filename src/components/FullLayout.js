import React, { useState, useEffect } from 'react'
import Cell from './Cell'
import { dijkstra, getNodesInShortestPathOrder } from '../algo/dijkstra'


export default function Body() {


    const setRows = () => {
        let height = window.innerHeight;
        console.log('height ' + height);
        height = (height - 84) / 37.2;
        return parseInt(height) - 2;
    }
    const setCols = () => {
        let width = window.innerWidth;
        console.log('width ' + width);
        width = (width - 10) / 37.2;
        return parseInt(width);
    }


    const [totRow, setTotRow] = useState(setRows);
    const [totCol, setTotCol] = useState(setCols);
    const [isStart, setIsStart] = useState({ row: 8, col: 7 });
    const [isFinish, setIsFinish] = useState({ row: 8, col: 32 });

    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [wheelMoveDetail, setWheelMoveDetail] = useState({
        ctrlKey: false,
        deltaY: 0,
    });

    useEffect(() => {
        const gridd = makingOfGrid();
        setGrid(gridd);
        document.addEventListener("wheel", (e) => {
            setWheelMoveDetail({
                ctrlKey: e.ctrlKey,
                deltaY: e.deltaY,
            });
        });
    }, []);

    const makingOfGrid = () => {
        const grid = [];
        for (let i = 0; i < totRow; i++) {
            const fullRow = [];
            for (let j = 0; j < totCol; j++) {
                fullRow.push(createNode(i, j));
            }
            grid.push(fullRow);
        }
        return grid;
    }

    const createNode = (row, col) => {
        return {
            col,
            row,
            isStart: row === isStart.row && col === isStart.col,
            isFinish: row === isFinish.row && col === isFinish.col,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    };


    const wallToggle = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;

        return newGrid;
    }

    useEffect(() => {
        if (!wheelMoveDetail.ctrlKey) return;
        zommInZoomOut();
    }, [wheelMoveDetail])

    const zommInZoomOut = () => {
        let row = totRow;
        let col = totCol;

        if (wheelMoveDetail.ctrlKey && wheelMoveDetail.deltaY < 0) {
            setTotRow(++row)
            setTotCol(++col)
            const gridd = makingOfGrid();
            setGrid(gridd);
        }
        else if (wheelMoveDetail.ctrlKey && wheelMoveDetail.deltaY > 0) {
            setTotRow(--row)
            setTotCol(--col)
            const gridd = makingOfGrid();
            setGrid(gridd);
        }
    }


    const onMouseDown = (row, col) => {
        const newGrid = wallToggle(grid, row, col);
        setGrid(newGrid);
        if ((row !== isStart.row && col !== isStart.col) && (row !== isFinish.row && col !== isFinish.col)) {
            setMouseIsPressed(true)
        }
    }

    const onMouseEnterHandler = (row, col) => {
        if (!mouseIsPressed) return;
        const newGrid = wallToggle(grid, row, col);
        setGrid(newGrid);
    }


    const onMouseUp = () => {
        setMouseIsPressed(false);
    }


    const findPath = () => {
        const startNode = grid[isStart.row][isStart.col];
        const finishNode = grid[isFinish.row][isFinish.col];
        dijkstra(grid, startNode, finishNode)
        const shortestPath = getNodesInShortestPathOrder(finishNode)
        animation(shortestPath);
    }

    const animation = (shortestPath) => {
        for (let i = 1; i < shortestPath.length - 1; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                var elem = document.getElementById(`node-${node.row}-${node.col}`);
                elem.classList.add('shortestPath');
            }, 100 * i);

        }
    }

    useEffect(() => {
        const startNode = document.querySelector(".source");
        const endNode = document.querySelector(".endNode");
        const boxes = document.querySelectorAll(".cell");

        if (startNode && endNode && boxes) {

            startNode.addEventListener('dragstart', (e) => {

            })
            startNode.addEventListener('dragend', (e) => {

            })

            boxes.forEach((box) => {
                box.addEventListener('dragover', (e) => {
                    e.preventDefault();
                })
                box.addEventListener('drop', (e) => {
                    let node = (box.id).split('-');
                    let newRow = node[1];
                    let newCol = node[2];

                    grid[isStart.row][isStart.col].isStart = false;
                    grid[isStart.row][isStart.col].isWall = false;
                    grid[newRow][newCol].isStart = true;

                    setIsStart({ row: parseInt(newRow), col: parseInt(newCol) })
                })
            })
        }

    });



    return (
        <>
            <button onClick={() => findPath()}>Find Path</button>
            <div className="grid">
                {grid.map((rows, rowId) => {
                    return (
                        <div key={rowId}>
                            {rows.map((cells, cellId) => {
                                const { isStart, isFinish, row, col, isWall } = cells;
                                return (
                                    <Cell
                                        key={cellId}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        onMouseDown={() => onMouseDown(row, col)}
                                        onMouseEnter={() => onMouseEnterHandler(row, col)}
                                        onMouseUp={() => onMouseUp()}
                                        row={row}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </>
    )
}





