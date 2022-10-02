import React from "react";
import source from "../img/arrow.png";
import dest from "../img/dest.png";

export default function Cell(props) {
  var extraClass = props.isStart
    ? "startNode"
    : props.isFinish
    ? "endNode"
    : props.isWall
    ? "wall"
    : "";

  return (
    <>
      <div
        id={`node-${props.row}-${props.col}`}
        className={`cell ${extraClass}`}
        onMouseEnter={props.onMouseEnter}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
      >
        {extraClass === "startNode" ? (
          <img src={source} className="source" draggable="true" />
        ) : extraClass === "endNode" ? (
          <img src={dest} className="desti" draggable="true" />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
