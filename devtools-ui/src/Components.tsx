import { css, cx } from "@emotion/css";
import { commitName, initName } from "./constants";

export function Button({
  icon,
  text = "",
  onClick,
  className,
  title,
  selected = false,
  disabled = false,
}: {
  icon?: React.ReactElement;
  text?: string;
  onClick?: () => void;
  className?: string;
  title: string;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cx(buttonStyle, className, {
        disabled,
        active: !disabled,
        selected,
      })}
      title={title}
    >
      {icon} {text}
    </div>
  );
}

const buttonStyle = css({
  backgroundColor: "#333",
  padding: "5px 10px",
  borderRadius: "3px",
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.1s",
  userSelect: "none",
  display: "flex",
  gap: 5,
  alignItems: "center",

  "&.active:hover": {
    backgroundColor: "#555",
  },

  "&.active:active": {
    backgroundColor: "#222",
    transform: "scale(0.95)",
  },

  "&.disabled": {
    cursor: "unset",
    opacity: 0.3,
  },
});

export function Title({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <div className={cx(titleStyle, className)}>{text}</div>;
}

const titleStyle = css({
  fontSize: 16,
});

export function Time({
  time,
  className,
}: {
  time: number;
  className?: string;
}) {
  return (
    <div className={cx(timeStyle, className)}>
      {new Date(time).toLocaleString()}
    </div>
  );
}

const timeStyle = css({
  color: "#777",
});

export function Name({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div className={cx(nameStyle, className)}>
      {(() => {
        switch (name) {
          case initName:
            return <div className="init">{name}</div>;
          case "":
            return <div className="none">No name</div>;
          case commitName:
            return <div className="commit">{name}</div>;
          default:
            return <div className="others">{name}</div>;
        }
      })()}
    </div>
  );
}

const nameStyle = css({
  ".init": {
    color: "#0ac3b0",
  },
  ".none": {
    color: "#777",
  },
  ".commit": {
    color: "#f8f847",
  },
  ".others": {
    color: "#6f86eb",
  },
});

export function TimeDiff({ duration }: { duration: number }) {
  if (duration === 0) return null;

  const minus = duration < 0;

  duration = Math.abs(duration);

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  return (
    <div className={timeDiffStyle}>
      {minus ? (
        <span className="minus">-</span>
      ) : (
        <span className="plus">+</span>
      )}
      {hrs > 0 ? <span className="hr">{hrs}h</span> : null}
      {min > 0 ? <span className="min">{min % 60}m</span> : null}
      {sec % 60 > 1 ? (
        <span className="sec">{(sec % 60).toFixed(2)}s</span>
      ) : (
        <span className="ms">{duration}ms</span>
      )}
    </div>
  );
}

const timeDiffStyle = css({
  fontSize: 10,
  fontFamily: "monospace",

  ".minus": {
    color: "#d84685",
  },
  ".plus": {
    color: "#66ffac",
  },

  ".min": {
    color: "#e1e05a",
  },

  ".sec": {
    color: "#aaa",
  },

  ".ms": {
    color: "#777",
  },
});
