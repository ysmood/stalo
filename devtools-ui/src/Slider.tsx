import { css, cx } from "@emotion/css";
import {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from "react";

const width = 16;
const animationDuration = 200;

export default function Slider({
  min,
  max,
  step,
  value,
  title,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  title?: string;
  onChange: (value: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(0);

  const updateFromMouse = useCallback(
    (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newValue = Math.min(
        max,
        Math.max(min, min + (offsetX / rect.width) * (max - min))
      );
      onChange(Math.round(newValue / step) * step);
    },
    [min, max, step, onChange]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      updateFromMouse(e);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, updateFromMouse]);

  const handleMouseDown: MouseEventHandler = (e) => {
    e.preventDefault();

    sliderRef.current?.focus();

    setDragging(true);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      onChange(Math.max(value - step, min));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      onChange(Math.min(value + step, max));
    }
  };

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (clicking) {
      clearTimeout(clicking);
    }

    const id = window.setTimeout(() => {
      setClicking(0);
    }, animationDuration);
    setClicking(id);

    updateFromMouse(e as unknown as MouseEvent);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={style}
      ref={sliderRef}
      tabIndex={0}
      onClick={onClick}
      title={title}
    >
      <div className="bg">
        <div
          className="progress"
          style={{
            width: `${percentage}%`,
            transition: clicking ? `width ${animationDuration}ms` : "",
          }}
        ></div>
      </div>
      <div
        className={cx("thumb", { dragging })}
        style={{
          left: `${percentage}%`,
          transition: clicking ? `left ${animationDuration}ms` : "",
        }}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      ></div>
    </div>
  );
}

const style = css({
  all: "unset",
  position: "relative",
  height: width,
  margin: "0 8px",
  display: "grid",
  alignItems: "center",
  cursor: "pointer",

  ".bg": {
    margin: "0 -8px",
    height: "40%",
    background: "#727272",
    borderRadius: width,
    boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.3)",

    ".progress": {
      height: "100%",
      background: "#1175bb",
      borderRadius: width,
      ":hover": {
        background: "#0096ff",
      },
    },
  },

  ".thumb": {
    position: "absolute",
    transform: "translateX(-50%)",
    background: "#727272",
    width: width,
    height: "100%",
    borderRadius: "50%",
    boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
  },

  ".thumb:hover": {
    background: "#ddd",
  },

  ".bg:hover": {
    background: "#ccc",
  },

  ".thumb.dragging": {
    background: "#fff",
  },

  "&:focus": {
    ".bg, .thumb": {
      background: "#aaa",
    },

    ".bg:hover": {
      background: "#ccc",
    },

    ".thumb:hover": {
      background: "#ddd",
    },

    ".thumb.dragging": {
      background: "#fff",
    },
  },
});
