import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p className={`eyebrow ${light ? "text-gold-light" : "text-gold"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl font-semibold sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      <div className={`rule-gold mt-5 ${centered ? "mx-auto" : ""}`} />
      {description && (
        <p
          className={`mt-5 text-base leading-relaxed ${
            light ? "text-white/70" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
