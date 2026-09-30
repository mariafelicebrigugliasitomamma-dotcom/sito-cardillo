import { ImageResponse } from "next/og";
import { getContent } from "./content";

/**
 * Immagine Open Graph / Twitter generata dinamicamente.
 * Condivisa da `app/opengraph-image` e `app/twitter-image`.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Studio Dentistico Briguglia — Dentista a Messina e Milazzo";

export default async function ogImage() {
  const { studio, ui } = await getContent();
  const occhiello = `${ui.header.brandPrefix} · dal ${studio.annoFondazione}`;
  const piede = [studio.nome, ...studio.sedi.map((s) => s.citta)].join(" · ");
  // Il claim è editabile: riduce il corpo del testo per non far traboccare l'immagine
  const claimSize =
    studio.claim.length > 90 ? 46 : studio.claim.length > 55 ? 58 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background:
            "radial-gradient(circle at 30% 20%, #1e3450 0%, #0f1b2d 60%, #0a1320 100%)",
          color: "#ffffff",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c8a24c",
          }}
        >
          {occhiello}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: claimSize,
            fontWeight: 600,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {studio.claim}
        </div>
        <div
          style={{
            marginTop: 40,
            width: 120,
            height: 4,
            background: "#c8a24c",
          }}
        />
        <div style={{ marginTop: 36, fontSize: 30, color: "#c8a24c" }}>
          {piede}
        </div>
      </div>
    ),
    size
  );
}
