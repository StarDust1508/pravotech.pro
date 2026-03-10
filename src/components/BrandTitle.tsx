type BrandTitleProps = {
  className?: string;
  uppercase?: boolean;
  lineBreakBeforeLaw?: boolean;
};

export const BrandTitle = ({
  className = "",
  uppercase = false,
  lineBreakBeforeLaw = false,
}: BrandTitleProps) => {
  const techPrefix = uppercase ? "ТЕХНОЛОГ" : "Технолог";
  const techSuffix = uppercase ? "ИИ" : "ии";
  const law = uppercase ? "ПРАВА" : "права";

  return (
    <span className={className}>
      <span className="text-neon-cyan">{techPrefix}</span>
      <span className="text-neon-magenta">{techSuffix}</span>
      {lineBreakBeforeLaw ? <br /> : " "}
      <span className="text-neon-magenta">{law}</span>
    </span>
  );
};
