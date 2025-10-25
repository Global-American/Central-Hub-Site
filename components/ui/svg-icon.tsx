import React from "react";

export type SvgIconProps = {
  size?: number;
  className?: string;
  title?: string;
  alt?: string;
  style?: React.CSSProperties;
};

// Create a React icon component from an SVG path under /public
// Example:
//   const CargoShipIcon = makeSvgIcon("/cargo-ship.svg");
//   <CargoShipIcon size={24} className="text-accent" />
export function makeSvgIcon(src: string) {
  const SvgIcon: React.FC<SvgIconProps> = ({
    size,
    className,
    title,
    alt,
    style,
  }) => (
    <img
      src={src}
      alt={alt ?? title ?? "icon"}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", width: size, height: size, ...style }}
      aria-label={title}
    />
  );

  SvgIcon.displayName = `SvgIcon(${src})`;
  return SvgIcon;
}
