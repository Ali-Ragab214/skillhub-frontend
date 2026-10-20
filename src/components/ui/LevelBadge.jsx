const levelConfig = {
  BEGINNER: {
    label: "Beginner",
    bg: "bg-level-beginner/15 dark:bg-level-beginner/20",
    text: "text-level-beginner",
    border: "border-level-beginner/20 dark:border-level-beginner/30",
    dot: "bg-level-beginner",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    bg: "bg-level-intermediate/15 dark:bg-level-intermediate/20",
    text: "text-level-intermediate",
    border: "border-level-intermediate/20 dark:border-level-intermediate/30",
    dot: "bg-level-intermediate",
  },
  ADVANCED: {
    label: "Advanced",
    bg: "bg-level-advanced/15 dark:bg-level-advanced/20",
    text: "text-level-advanced",
    border: "border-level-advanced/20 dark:border-level-advanced/30",
    dot: "bg-level-advanced",
  },
};

export default function LevelBadge({ level, showDot = true, className = "" }) {
  const key = level || "BEGINNER";
  const config = levelConfig[key] || levelConfig.BEGINNER;

  const classes = [
    "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border",
    config.bg,
    config.text,
    config.border,
    className,
  ].join(" ");

  return (
    <span className={classes}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label}
    </span>
  );
}
