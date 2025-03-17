import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import { updateCanvas } from "../../utils/api";
import classes from "./index.module.css";
import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";
import socket from "../../utils/socket";
import { FaComment, FaPaperPlane } from "react-icons/fa"; // Import icons

function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const commentBoxRef = useRef();
  const commentListRef = useRef();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
    socket.emit("load-comments", canvasId); // Load comments when the canvas loads

    socket.on("canvas-data", (updatedElements) => {
      setElements(updatedElements);
    });

    socket.on("comments-data", (loadedComments) => {
      setComments(loadedComments); // Update comments state
    });

    return () => {
      socket.off("canvas-data");
      socket.off("comments-data");
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

  const handleAddComment = () => {
    const canvasId = window.location.pathname.split("/").pop();
    if (newComment.trim()) {
      socket.emit("add-comment", canvasId, newComment);
      setNewComment("");
      // Scroll to the bottom of the comment list after adding a new comment
      if (commentListRef.current) {
        commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
      }
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

      {/* Comment Icon */}
      <div
        className={classes.commentIcon}
        onClick={() => setShowCommentBox(!showCommentBox)}
      >
        <FaComment size={24} />
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <div className={classes.commentBox} ref={commentBoxRef}>
          <div className={classes.commentHeader}>
            <span>Comments</span>
            <button
              className={classes.closeButton}
              onClick={() => setShowCommentBox(false)}
            >
              &times;
            </button>
          </div>
          <div className={classes.commentList} ref={commentListRef}>
            {comments.map((comment, index) => (
              <div key={index} className={classes.commentItem}>
                <span className={classes.commentUser}>{comment.userEmail}</span>
                <span className={classes.commentTime}>
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </span>
                <p className={classes.commentContent}>{comment.content}</p>
              </div>
            ))}
          </div>
          <div className={classes.commentInputContainer}>
            <textarea
              className={classes.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <button
              className={classes.commentButton}
              onClick={handleAddComment}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
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
