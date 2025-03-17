import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import { updateCanvas } from "../../utils/api";
import classes from "./index.module.css";
import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";
import socket from "../../utils/socket";

function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const {
    elements,
    setElements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);

  useEffect(() => {
    const canvasId = window.location.pathname.split("/").pop();

    socket.emit("join-canvas", canvasId);

    socket.emit("load-canvas", canvasId);

    socket.on("canvas-data", (updatedElements) => {
      setElements(updatedElements); // Update the state with received elements
    });

    return () => {
      socket.off("canvas-data"); // Cleanup socket listener on unmount
    };
  }, [setElements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element, idx) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          if (element.roughEle) {
            roughCanvas.draw(element.roughEle);
          } else {
            console.warn(
              `Missing roughEle for element at index ${idx}`,
              element
            );
          }
          break;
        case TOOL_ITEMS.BRUSH:
          if (element.points && element.points.length > 0) {
            const brushPath = new Path2D(
              getSvgPathFromStroke(getStroke(element.points))
            );
            context.fillStyle = element.stroke || "#000";
            context.fill(brushPath);
          } else {
            console.warn(
              "Missing points for brush element at index",
              idx,
              element
            );
          }
          break;
        case TOOL_ITEMS.TEXT:
          const textToRender = element.text || "";
          context.textBaseline = "top";
          context.font = `${element.size || 16}px Caveat`;
          context.fillStyle = element.stroke || "#000";
          context.fillText(textToRender, element.x1 || 0, element.y1 || 0);
          break;
        default:
          console.error("Type not recognized at index", idx, element);
      }
    });

    context.restore();

    // Double requestAnimationFrame to force a redraw
    requestAnimationFrame(() => {
      canvas.style.display = "none";
      void canvas.offsetHeight;
      canvas.style.display = "";
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    const canvasId = window.location.pathname.split("/").pop();
    boardMouseMoveHandler(event);
    socket.emit("update-canvas", canvasId, elements);
  };

  const handleMouseUp = async () => {
    boardMouseUpHandler();
    const canvasId = window.location.pathname.split("/").pop();
    try {
      await updateCanvas(canvasId, elements);
      socket.emit("update-canvas", canvasId, elements);
    } catch (err) {
      console.error("Failed to update canvas:", err);
    }
  };

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
