import { css, cx } from "@emotion/css";
import {
  useState,
  useRef,
  useEffect,
  KeyboardEventHandler,
  MouseEventHandler,
} from "react";

const width = 16;

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
  title: string;
  onChange: (value: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newValue = Math.min(
        max,
        Math.max(min, min + (offsetX / rect.width) * (max - min))
      );
      onChange(Math.round(newValue / step) * step);
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
  }, [dragging, min, max, step, onChange]);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      onChange(Math.max(value - step, min));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      onChange(Math.min(value + step, max));
    }
  };

  const handleClick: MouseEventHandler = (event) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newValue = min + (clickX / rect.width) * (max - min);
    onChange(Math.round(newValue / step) * step);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={style}
      ref={sliderRef}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      title={title}
    >
      <div className="bg"></div>
      <div
        className={cx("thumb", { dragging })}
        style={{
          left: `${percentage}%`,
        }}
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

  ".bg": {
    margin: "0 -8px",
    height: "40%",
    background: "#727272",
    borderRadius: width,
    boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.3)",
  },

  ".thumb": {
    position: "absolute",
    transform: "translateX(-50%)",
    cursor: "pointer",
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
