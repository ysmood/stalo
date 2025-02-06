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
const stepSize = 4;
const animationDuration = 200;

export default function Slider({
  min,
  max,
  value,
  step = 1,
  title,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  step?: number;
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
      className={cx(style, { dragging })}
      ref={sliderRef}
      tabIndex={0}
      onClick={onClick}
      title={title}
      onKeyDown={handleKeyDown}
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
      <Steps
        steps={max - min}
        sliderWidth={sliderRef.current?.clientWidth || 0}
      />
      <div
        className={"thumb"}
        style={{
          left: `${percentage}%`,
          transition: clicking ? `left ${animationDuration}ms` : "",
        }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
}

function Steps({ steps, sliderWidth }: { steps: number; sliderWidth: number }) {
  if (sliderWidth / steps < 3 * stepSize) {
    return null;
  }

  return Array.from({ length: steps + 1 }).map((_, i) => (
    <div key={i} className="step" style={{ left: `${(i / steps) * 100}%` }} />
  ));
}

const style = css({
  all: "unset",
  position: "relative",
  height: width,
  margin: "0 8px",
  display: "grid",
  alignItems: "center",
  cursor: "pointer",

  "&:focus .thumb": {
    border: "1px solid #aedeff",
  },

  ".bg": {
    margin: "0 -8px",
    height: "40%",
    background: "#727272",
    borderRadius: width,
    boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.3)",

    ".progress": {
      height: "100%",
      borderRadius: width,
      background: "#1175bb",
    },
  },

  ".thumb": {
    position: "absolute",
    transform: "translateX(-50%)",
    background: "#1784d0",
    width: width - 2,
    height: width - 2,
    borderRadius: "50%",
    boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
  },

  ".step": {
    position: "absolute",
    y: 0,
    width: stepSize,
    height: stepSize,
    borderRadius: stepSize,
    transform: "translateX(-50%)",
    background: "#ffffff66",
  },

  "&.dragging .thumb, .thumb:hover": {
    background: "#40a1e4",
  },

  "&.dragging .bg, .bg:hover": {
    background: "#aaa",
  },

  "&.dragging .progress, .progress:hover": {
    background: "#1784d0",
  },
});
