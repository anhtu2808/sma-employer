import useAnimatedScore from "@/hooks/useAnimatedScore";

const getScoreColor = (score) => {
  if (score >= 70) return { stroke: "#10B981", text: "text-emerald-500" };
  if (score >= 40) return { stroke: "#F59E0B", text: "text-amber-500" };
  return { stroke: "#EF4444", text: "text-red-500" };
};

const ScoreCard = ({ score = 0, size = 80, matchLevel }) => {
  const animatedScore = useAnimatedScore(score, 1000);
  const strokeWidth = size >= 80 ? 6 : 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const fontSize = size >= 80 ? "text-2xl" : "text-lg";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            stroke="currentColor"
            className="text-gray-200 dark:text-neutral-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute font-bold leading-none ${fontSize} ${color.text}`}>
          {animatedScore}
        </span>
      </div>
      {matchLevel && (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          matchLevel === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          matchLevel === 'GOOD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          matchLevel === 'FAIR' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {matchLevel.replace('_', ' ')}
        </span>
      )}
    </div>
  );
};

export default ScoreCard;
