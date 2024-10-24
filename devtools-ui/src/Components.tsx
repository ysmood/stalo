import { css, cx } from "@emotion/css";
import { commitName, initName } from "./store/constants";

export function Button({
  icon,
  text = "",
  onClick,
  className,
  title,
}: {
  icon?: React.ReactElement;
  text?: string;
  onClick?: () => void;
  className?: string;
  title: string;
}) {
  return (
    <div onClick={onClick} className={cx(buttonStyle, className)} title={title}>
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

  "&:hover": {
    backgroundColor: "#555",
  },

  "&:active": {
    backgroundColor: "#222",
    transform: "scale(0.95)",
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
