import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

/** Intestazione di sezione: ogni parte vuota viene omessa, se sono tutte vuote non renderizza nulla. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  if (!eyebrow?.trim() && !title?.trim() && !description?.trim()) return null;
  return (
    <Reveal
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow?.trim() && (
        <p className={`eyebrow ${light ? "text-gold-light" : "text-gold-ink"}`}>
          {eyebrow}
        </p>
      )}
      {title?.trim() && (
        <h2
          className={`text-3xl font-semibold sm:text-4xl ${
            eyebrow?.trim() ? "mt-3" : ""
          } ${light ? "text-white" : "text-navy"}`}
        >
          {title}
        </h2>
      )}
      {(eyebrow?.trim() || title?.trim()) && (
        <div className={`rule-gold mt-5 ${centered ? "mx-auto" : ""}`} />
      )}
      {description?.trim() && (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            light ? "text-white/80" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
