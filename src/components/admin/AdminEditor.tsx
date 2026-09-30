"use client";

import { useState } from "react";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";
import type {
  SiteContent,
  Area,
  Professionista,
  Locale,
  SiteBundle,
  SitePalette,
} from "@/lib/types";
import { iconNames } from "@/lib/icons";
import {
  TextField,
  TextArea,
  StringListField,
  SelectField,
  ImageField,
} from "./fields";
import ListEditor from "./ListEditor";

const TABS = [
  { id: "generale", label: "Generale" },
  { id: "interfaccia", label: "Interfaccia" },
  { id: "privacy", label: "Privacy" },
  { id: "storia", label: "Storia & Valori" },
  { id: "numeri", label: "Numeri" },
  { id: "contatti", label: "Sedi & Contatti" },
  { id: "aree", label: "Servizi" },
  { id: "team", label: "Professionisti" },
  { id: "palette", label: "Palette colori" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type SaveState = "idle" | "saving" | "ok" | "error";
function newIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminEditor({
  initialBundle,
}: {
  initialBundle: SiteBundle;
}) {
  const [locale] = useState<Locale>("it");
  const initialPalette: SitePalette | null = initialBundle.palette ?? null;
  const [contentByLocale, setContentByLocale] = useState(initialBundle.content);
  const [revision, setRevision] = useState(initialBundle.meta.revision);
  const [lastCommitSha, setLastCommitSha] = useState(initialBundle.meta.commitSha || "");
  const [lastSnapshotPath, setLastSnapshotPath] = useState("");
  const [tab, setTab] = useState<TabId>("generale");
  const [save, setSave] = useState<SaveState>("idle");
  const [error, setError] = useState("");

  const content = contentByLocale[locale];
  const setContent = (updater: (content: SiteContent) => SiteContent) =>
    setContentByLocale((current) => ({
      ...current,
      [locale]: updater(current[locale]),
    }));

  const studio = content.studio;
  const ui = content.ui;
  const privacy = content.privacy;
  const setStudio = (patch: Partial<SiteContent["studio"]>) =>
    setContent((c) => ({ ...c, studio: { ...c.studio, ...patch } }));
  const setPrivacy = (patch: Partial<SiteContent["privacy"]>) =>
    setContent((c) => ({ ...c, privacy: { ...c.privacy, ...patch } }));
  const setUi = (patch: Partial<SiteContent["ui"]>) =>
    setContent((c) => ({ ...c, ui: { ...c.ui, ...patch } }));

  async function handleSave() {
    setSave("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          content,
          expectedRevision: revision,
          idempotencyKey: newIdempotencyKey(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(
          data?.error || `Errore nel salvataggio (codice ${res.status})`
        );
      if (data?.revision) setRevision(data.revision as string);
      if (data?.commitSha) setLastCommitSha(data.commitSha as string);
      if (data?.snapshotPath) setLastSnapshotPath(data.snapshotPath as string);
      if (data?.backupMailError) {
        setError(String(data.backupMailError));
      }
      setSave("ok");
      setTimeout(() => setSave("idle"), 2500);
    } catch (err) {
      setSave("error");
      setError(err instanceof Error ? err.message : "Errore");
    }
  }

  return (
    <div className="pb-28">
      {/* Tabs */}
      <div className="sticky top-[57px] z-10 -mx-4 mb-6 border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur sm:top-[65px]">
        <div className="mb-2 flex items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Revisione: {revision}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5">
        {tab === "generale" && (
          <>
            <Card title="Identità dello Studio">
              <TextField
                label="Nome completo"
                value={studio.nome}
                onChange={(v) => setStudio({ nome: v })}
              />
              <TextField
                label="Nome breve (logo)"
                value={studio.nomeBreve}
                onChange={(v) => setStudio({ nomeBreve: v })}
              />
              <TextField
                label="Anno di fondazione"
                type="number"
                value={studio.annoFondazione}
                onChange={(v) =>
                  setStudio({ annoFondazione: Number(v) || 0 })
                }
              />
            </Card>

            <Card title="Sezione hero (home)">
              <TextField
                label="Claim principale"
                value={studio.claim}
                onChange={(v) => setStudio({ claim: v })}
              />
              <TextArea
                label="Sotto-claim"
                value={studio.sottoClaim}
                onChange={(v) => setStudio({ sottoClaim: v })}
                rows={3}
              />
              <ImageField
                label="Immagine di sfondo hero (opzionale)"
                value={studio.heroImmagine}
                onChange={(v) => setStudio({ heroImmagine: v })}
              />
            </Card>

            <Card title="Presentazione e citazione">
              <TextArea
                label="Presentazione dello Studio"
                value={studio.presentazione}
                onChange={(v) => setStudio({ presentazione: v })}
                rows={5}
              />
              <TextArea
                label="Missione"
                value={studio.missione}
                onChange={(v) => setStudio({ missione: v })}
                rows={4}
              />
              <TextArea
                label="Citazione"
                value={studio.citazione.testo}
                onChange={(v) =>
                  setStudio({
                    citazione: { ...studio.citazione, testo: v },
                  })
                }
                rows={3}
              />
              <TextField
                label="Autore citazione"
                value={studio.citazione.autore}
                onChange={(v) =>
                  setStudio({
                    citazione: { ...studio.citazione, autore: v },
                  })
                }
              />
            </Card>

            <Card title="SEO">
              <TextArea
                label="Meta description"
                value={studio.metaDescription}
                onChange={(v) => setStudio({ metaDescription: v })}
                rows={2}
              />
            </Card>
          </>
        )}

        {tab === "interfaccia" && (
          <>
            <Card title="Header e menu">
              <TextField
                label="Brand prefix"
                value={ui.header.brandPrefix}
                onChange={(v) =>
                  setUi({ header: { ...ui.header, brandPrefix: v } })
                }
              />
              <TextField
                label="Aria menu aperto"
                value={ui.header.menuOpenAriaLabel}
                onChange={(v) =>
                  setUi({ header: { ...ui.header, menuOpenAriaLabel: v } })
                }
              />
              <TextField
                label="Aria menu chiuso"
                value={ui.header.menuCloseAriaLabel}
                onChange={(v) =>
                  setUi({ header: { ...ui.header, menuCloseAriaLabel: v } })
                }
              />
              <TextField
                label="Nav Home"
                value={ui.header.navHome}
                onChange={(v) => setUi({ header: { ...ui.header, navHome: v } })}
              />
              <TextField
                label="Nav Studio"
                value={ui.header.navStudio}
                onChange={(v) => setUi({ header: { ...ui.header, navStudio: v } })}
              />
              <TextField
                label="Nav Servizi"
                value={ui.header.navAree}
                onChange={(v) => setUi({ header: { ...ui.header, navAree: v } })}
              />
              <TextField
                label="Nav Professionisti"
                value={ui.header.navTeam}
                onChange={(v) => setUi({ header: { ...ui.header, navTeam: v } })}
              />
              <TextField
                label="Nav Contatti"
                value={ui.header.navContatti}
                onChange={(v) =>
                  setUi({ header: { ...ui.header, navContatti: v } })
                }
              />
            </Card>

            <Card title="Footer">
              <TextField
                label="Heading servizi"
                value={ui.footer.areeHeading}
                onChange={(v) =>
                  setUi({ footer: { ...ui.footer, areeHeading: v } })
                }
              />
              <TextField
                label="Heading navigazione"
                value={ui.footer.navigationHeading}
                onChange={(v) =>
                  setUi({ footer: { ...ui.footer, navigationHeading: v } })
                }
              />
              <TextField
                label="Heading sede principale"
                value={ui.footer.hqHeading}
                onChange={(v) => setUi({ footer: { ...ui.footer, hqHeading: v } })}
              />
              <TextField
                label="Footer nav Studio"
                value={ui.footer.navStudio}
                onChange={(v) => setUi({ footer: { ...ui.footer, navStudio: v } })}
              />
              <TextField
                label="Footer nav Professionisti"
                value={ui.footer.navTeam}
                onChange={(v) => setUi({ footer: { ...ui.footer, navTeam: v } })}
              />
              <TextField
                label="Footer nav Contatti"
                value={ui.footer.navContatti}
                onChange={(v) =>
                  setUi({ footer: { ...ui.footer, navContatti: v } })
                }
              />
              <TextField
                label="Label diritti riservati"
                value={ui.footer.rightsReservedLabel}
                onChange={(v) =>
                  setUi({ footer: { ...ui.footer, rightsReservedLabel: v } })
                }
              />
              <TextField
                label="Label P.IVA"
                value={ui.footer.vatLabel}
                onChange={(v) => setUi({ footer: { ...ui.footer, vatLabel: v } })}
              />
              <TextField
                label="Label privacy"
                value={ui.footer.privacyLabel}
                onChange={(v) =>
                  setUi({ footer: { ...ui.footer, privacyLabel: v } })
                }
              />
            </Card>

            <Card title="Hero e CTA globale">
              <TextField
                label="Hero CTA primaria"
                value={ui.hero.primaryCtaLabel}
                onChange={(v) =>
                  setUi({ hero: { ...ui.hero, primaryCtaLabel: v } })
                }
              />
              <TextField
                label="Hero CTA secondaria"
                value={ui.hero.secondaryCtaLabel}
                onChange={(v) =>
                  setUi({ hero: { ...ui.hero, secondaryCtaLabel: v } })
                }
              />
              <TextField
                label="CTA titolo default"
                value={ui.cta.defaultTitle}
                onChange={(v) => setUi({ cta: { ...ui.cta, defaultTitle: v } })}
              />
              <TextArea
                label="CTA testo default"
                value={ui.cta.defaultText}
                onChange={(v) => setUi({ cta: { ...ui.cta, defaultText: v } })}
                rows={3}
              />
              <TextField
                label="CTA bottone"
                value={ui.cta.buttonLabel}
                onChange={(v) => setUi({ cta: { ...ui.cta, buttonLabel: v } })}
              />
            </Card>

            <Card title="Home - testi sezione">
              <TextField
                label="Intro eyebrow"
                value={ui.home.introEyebrow}
                onChange={(v) => setUi({ home: { ...ui.home, introEyebrow: v } })}
              />
              <TextField
                label="Intro titolo"
                value={ui.home.introTitle}
                onChange={(v) => setUi({ home: { ...ui.home, introTitle: v } })}
              />
              <TextField
                label="Intro CTA"
                value={ui.home.introCtaLabel}
                onChange={(v) => setUi({ home: { ...ui.home, introCtaLabel: v } })}
              />
              <TextField
                label="Servizi eyebrow"
                value={ui.home.areasEyebrow}
                onChange={(v) => setUi({ home: { ...ui.home, areasEyebrow: v } })}
              />
              <TextField
                label="Servizi titolo"
                value={ui.home.areasTitle}
                onChange={(v) => setUi({ home: { ...ui.home, areasTitle: v } })}
              />
              <TextArea
                label="Servizi descrizione"
                value={ui.home.areasDescription}
                onChange={(v) =>
                  setUi({ home: { ...ui.home, areasDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Servizi CTA"
                value={ui.home.areasCtaLabel}
                onChange={(v) =>
                  setUi({ home: { ...ui.home, areasCtaLabel: v } })
                }
              />
              <TextField
                label="Valori eyebrow"
                value={ui.home.valuesEyebrow}
                onChange={(v) =>
                  setUi({ home: { ...ui.home, valuesEyebrow: v } })
                }
              />
              <TextField
                label="Valori titolo"
                value={ui.home.valuesTitle}
                onChange={(v) => setUi({ home: { ...ui.home, valuesTitle: v } })}
              />
              <TextArea
                label="Valori descrizione"
                value={ui.home.valuesDescription}
                onChange={(v) =>
                  setUi({ home: { ...ui.home, valuesDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Team eyebrow"
                value={ui.home.teamEyebrow}
                onChange={(v) => setUi({ home: { ...ui.home, teamEyebrow: v } })}
              />
              <TextField
                label="Team titolo"
                value={ui.home.teamTitle}
                onChange={(v) => setUi({ home: { ...ui.home, teamTitle: v } })}
              />
              <TextArea
                label="Team descrizione"
                value={ui.home.teamDescription}
                onChange={(v) =>
                  setUi({ home: { ...ui.home, teamDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Team CTA"
                value={ui.home.teamCtaLabel}
                onChange={(v) => setUi({ home: { ...ui.home, teamCtaLabel: v } })}
              />
            </Card>

            <Card title="Pagina Lo Studio">
              <TextField
                label="Hero eyebrow"
                value={ui.studioPage.heroEyebrow}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, heroEyebrow: v } })
                }
              />
              <TextField
                label="Hero titolo"
                value={ui.studioPage.heroTitle}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, heroTitle: v } })
                }
              />
              <TextArea
                label="Hero descrizione"
                value={ui.studioPage.heroDescription}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, heroDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Chi siamo - eyebrow"
                value={ui.studioPage.aboutEyebrow}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, aboutEyebrow: v } })
                }
              />
              <TextField
                label="Chi siamo - titolo"
                value={ui.studioPage.aboutTitle}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, aboutTitle: v } })
                }
              />
              <TextField
                label="Missione - eyebrow"
                value={ui.studioPage.missionEyebrow}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, missionEyebrow: v } })
                }
              />
              <TextField
                label="Missione - titolo"
                value={ui.studioPage.missionTitle}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, missionTitle: v } })
                }
              />
              <TextField
                label="Storia - eyebrow"
                value={ui.studioPage.historyEyebrow}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, historyEyebrow: v } })
                }
              />
              <TextField
                label="Storia - titolo"
                value={ui.studioPage.historyTitle}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, historyTitle: v } })
                }
              />
              <TextField
                label="Valori - eyebrow"
                value={ui.studioPage.valuesEyebrow}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, valuesEyebrow: v } })
                }
              />
              <TextField
                label="Valori - titolo"
                value={ui.studioPage.valuesTitle}
                onChange={(v) =>
                  setUi({ studioPage: { ...ui.studioPage, valuesTitle: v } })
                }
              />
            </Card>

            <Card title="Pagina Professionisti e schede profilo">
              <TextField
                label="Hero eyebrow"
                value={ui.teamPage.heroEyebrow}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, heroEyebrow: v } })
                }
              />
              <TextField
                label="Hero titolo"
                value={ui.teamPage.heroTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, heroTitle: v } })
                }
              />
              <TextArea
                label="Hero descrizione"
                value={ui.teamPage.heroDescription}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, heroDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Link scheda professionista"
                value={ui.teamPage.cardCtaLabel}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, cardCtaLabel: v } })
                }
              />
              <TextField
                label="Link ritorno all'elenco"
                value={ui.teamPage.backLabel}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, backLabel: v } })
                }
              />
              <TextField
                label="Profilo - eyebrow"
                value={ui.teamPage.profileEyebrow}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, profileEyebrow: v } })
                }
              />
              <TextField
                label="Profilo - titolo biografia"
                value={ui.teamPage.biographyTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, biographyTitle: v } })
                }
              />
              <TextField
                label="Profilo - titolo formazione"
                value={ui.teamPage.educationTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, educationTitle: v } })
                }
              />
              <TextField
                label="Profilo - titolo aree di competenza"
                value={ui.teamPage.expertiseTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, expertiseTitle: v } })
                }
              />
              <TextField
                label="Profilo - titolo contatti"
                value={ui.teamPage.contactsTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, contactsTitle: v } })
                }
              />
              <TextField
                label="Profilo - titolo altri professionisti"
                value={ui.teamPage.otherProfessionalsTitle}
                onChange={(v) =>
                  setUi({
                    teamPage: { ...ui.teamPage, otherProfessionalsTitle: v },
                  })
                }
              />
              <TextField
                label="Profilo - link vedi tutti"
                value={ui.teamPage.viewAllLabel}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, viewAllLabel: v } })
                }
              />
              <TextField
                label="Titolo profilo non trovato"
                value={ui.teamPage.notFoundTitle}
                onChange={(v) =>
                  setUi({ teamPage: { ...ui.teamPage, notFoundTitle: v } })
                }
              />
            </Card>

            <Card title="Pagina Informativa Privacy">
              <TextField
                label="Hero eyebrow"
                value={ui.privacyPage.heroEyebrow}
                onChange={(v) =>
                  setUi({ privacyPage: { ...ui.privacyPage, heroEyebrow: v } })
                }
              />
              <TextField
                label="Hero titolo"
                value={ui.privacyPage.heroTitle}
                onChange={(v) =>
                  setUi({ privacyPage: { ...ui.privacyPage, heroTitle: v } })
                }
              />
              <TextArea
                label="Hero descrizione"
                value={ui.privacyPage.heroDescription}
                onChange={(v) =>
                  setUi({
                    privacyPage: { ...ui.privacyPage, heroDescription: v },
                  })
                }
                rows={3}
              />
            </Card>

            <Card title="Titoli e SEO delle pagine">
              <TextField
                label="Home - suffisso del titolo"
                value={ui.seo.homeTitleSuffix}
                onChange={(v) => setUi({ seo: { ...ui.seo, homeTitleSuffix: v } })}
              />
              <TextField
                label="Lo Studio - titolo"
                value={ui.seo.studioTitle}
                onChange={(v) => setUi({ seo: { ...ui.seo, studioTitle: v } })}
              />
              <TextArea
                label="Lo Studio - meta description"
                value={ui.seo.studioDescription}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, studioDescription: v } })
                }
                rows={2}
              />
              <TextField
                label="Servizi - titolo"
                value={ui.seo.practiceAreasTitle}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, practiceAreasTitle: v } })
                }
              />
              <TextArea
                label="Servizi - meta description"
                value={ui.seo.practiceAreasDescription}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, practiceAreasDescription: v } })
                }
                rows={2}
              />
              <TextField
                label="Professionisti - titolo"
                value={ui.seo.teamTitle}
                onChange={(v) => setUi({ seo: { ...ui.seo, teamTitle: v } })}
              />
              <TextArea
                label="Professionisti - meta description"
                value={ui.seo.teamDescription}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, teamDescription: v } })
                }
                rows={2}
              />
              <TextField
                label="Contatti - titolo"
                value={ui.seo.contactTitle}
                onChange={(v) => setUi({ seo: { ...ui.seo, contactTitle: v } })}
              />
              <TextArea
                label="Contatti - meta description"
                value={ui.seo.contactDescription}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, contactDescription: v } })
                }
                rows={2}
              />
              <TextField
                label="Informativa Privacy - titolo"
                value={ui.seo.privacyTitle}
                onChange={(v) => setUi({ seo: { ...ui.seo, privacyTitle: v } })}
              />
              <TextArea
                label="Informativa Privacy - meta description"
                value={ui.seo.privacyDescription}
                onChange={(v) =>
                  setUi({ seo: { ...ui.seo, privacyDescription: v } })
                }
                rows={2}
              />
            </Card>

            <Card title="Pagina Servizi">
              <TextField
                label="Servizi hero eyebrow"
                value={ui.practiceAreasPage.heroEyebrow}
                onChange={(v) =>
                  setUi({
                    practiceAreasPage: {
                      ...ui.practiceAreasPage,
                      heroEyebrow: v,
                    },
                  })
                }
              />
              <TextField
                label="Servizi hero titolo"
                value={ui.practiceAreasPage.heroTitle}
                onChange={(v) =>
                  setUi({
                    practiceAreasPage: {
                      ...ui.practiceAreasPage,
                      heroTitle: v,
                    },
                  })
                }
              />
              <TextArea
                label="Servizi hero descrizione"
                value={ui.practiceAreasPage.heroDescription}
                onChange={(v) =>
                  setUi({
                    practiceAreasPage: {
                      ...ui.practiceAreasPage,
                      heroDescription: v,
                    },
                  })
                }
                rows={3}
              />
              <TextField
                label="Servizi CTA titolo"
                value={ui.practiceAreasPage.ctaTitle}
                onChange={(v) =>
                  setUi({
                    practiceAreasPage: {
                      ...ui.practiceAreasPage,
                      ctaTitle: v,
                    },
                  })
                }
              />
              <TextArea
                label="Servizi CTA testo"
                value={ui.practiceAreasPage.ctaText}
                onChange={(v) =>
                  setUi({
                    practiceAreasPage: {
                      ...ui.practiceAreasPage,
                      ctaText: v,
                    },
                  })
                }
                rows={3}
              />

            </Card>

            <Card title="Pagina contatti">
              <TextField
                label="Contatti hero eyebrow"
                value={ui.contactPage.heroEyebrow}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, heroEyebrow: v } })
                }
              />
              <TextField
                label="Contatti hero titolo"
                value={ui.contactPage.heroTitle}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, heroTitle: v } })
                }
              />
              <TextArea
                label="Contatti hero descrizione"
                value={ui.contactPage.heroDescription}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, heroDescription: v } })
                }
                rows={3}
              />
              <TextField
                label="Recapiti eyebrow"
                value={ui.contactPage.detailsEyebrow}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, detailsEyebrow: v } })
                }
              />
              <TextField
                label="Recapiti titolo"
                value={ui.contactPage.detailsTitle}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, detailsTitle: v } })
                }
              />
              <TextField
                label="Label telefono"
                value={ui.contactPage.phoneLabel}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, phoneLabel: v } })
                }
              />
              <TextField
                label="Label email"
                value={ui.contactPage.emailLabel}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, emailLabel: v } })
                }
              />
              <TextField
                label="Label PEC"
                value={ui.contactPage.pecLabel}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, pecLabel: v } })
                }
              />
              <TextField
                label="Label orari"
                value={ui.contactPage.hoursLabel}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, hoursLabel: v } })
                }
              />
              <TextField
                label="Eyebrow sedi"
                value={ui.contactPage.officesEyebrow}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, officesEyebrow: v } })
                }
              />
              <TextField
                label="Badge sede principale"
                value={ui.contactPage.mainOfficeBadge}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, mainOfficeBadge: v } })
                }
              />
              <TextField
                label="Prefisso titolo mappa"
                value={ui.contactPage.mapTitlePrefix}
                onChange={(v) =>
                  setUi({ contactPage: { ...ui.contactPage, mapTitlePrefix: v } })
                }
              />
            </Card>
          </>
        )}

        {tab === "privacy" && (
          <>
            <Card title="Dati privacy dedicati">
              <TextField
                label="URL del sito (senza protocollo)"
                value={privacy.siteUrl}
                onChange={(v) => setPrivacy({ siteUrl: v })}
              />
              <TextField
                label="Titolare del trattamento"
                value={privacy.titolare}
                onChange={(v) => setPrivacy({ titolare: v })}
              />
              <TextField
                label="Sede legale"
                value={privacy.sedeLegale}
                onChange={(v) => setPrivacy({ sedeLegale: v })}
              />
              <TextField
                label="P.IVA"
                value={privacy.pIva}
                onChange={(v) => setPrivacy({ pIva: v })}
              />
              <TextField
                label="Codice Fiscale"
                value={privacy.codiceFiscale}
                onChange={(v) => setPrivacy({ codiceFiscale: v })}
              />
              <TextField
                label="Ordine professionale"
                value={privacy.ordine}
                onChange={(v) => setPrivacy({ ordine: v })}
              />
              <TextField
                label="Email privacy"
                value={privacy.emailPrivacy}
                onChange={(v) => setPrivacy({ emailPrivacy: v })}
              />
              <TextField
                label="PEC privacy"
                value={privacy.pec}
                onChange={(v) => setPrivacy({ pec: v })}
              />
              <TextField
                label="Conservazione senza presa in carico (mesi)"
                type="number"
                value={privacy.conservazioneSenzaIncaricoMesi}
                onChange={(v) =>
                  setPrivacy({
                    conservazioneSenzaIncaricoMesi: Number(v) || 0,
                  })
                }
              />
            </Card>
          </>
        )}

        {tab === "storia" && (
          <>
            <Card title="Tappe della storia">
              <ListEditor
                items={studio.storia}
                onChange={(storia) => setStudio({ storia })}
                newItem={() => ({ anno: "", titolo: "", testo: "" })}
                titleOf={(t) => `${t.anno} — ${t.titolo}` || "Nuova tappa"}
                addLabel="Aggiungi tappa"
                render={(t, update) => (
                  <>
                    <TextField
                      label="Anno"
                      value={t.anno}
                      onChange={(v) => update({ anno: v })}
                    />
                    <TextField
                      label="Titolo"
                      value={t.titolo}
                      onChange={(v) => update({ titolo: v })}
                    />
                    <TextArea
                      label="Testo"
                      value={t.testo}
                      onChange={(v) => update({ testo: v })}
                      rows={3}
                    />
                  </>
                )}
              />
            </Card>

            <Card title="Valori">
              <ListEditor
                items={studio.valori}
                onChange={(valori) => setStudio({ valori })}
                newItem={() => ({ titolo: "", testo: "" })}
                titleOf={(v) => v.titolo || "Nuovo valore"}
                addLabel="Aggiungi valore"
                render={(v, update) => (
                  <>
                    <TextField
                      label="Titolo"
                      value={v.titolo}
                      onChange={(val) => update({ titolo: val })}
                    />
                    <TextArea
                      label="Testo"
                      value={v.testo}
                      onChange={(val) => update({ testo: val })}
                      rows={3}
                    />
                  </>
                )}
              />
            </Card>
          </>
        )}

        {tab === "numeri" && (
          <Card title="Numeri / credenziali">
            <ListEditor
              items={studio.numeri}
              onChange={(numeri) => setStudio({ numeri })}
              newItem={() => ({ valore: 0, suffisso: "", etichetta: "" })}
              titleOf={(n) => n.etichetta || "Nuovo dato"}
              addLabel="Aggiungi dato"
              render={(n, update) => (
                <>
                  <TextField
                    label="Valore (numero)"
                    type="number"
                    value={n.valore}
                    onChange={(v) => update({ valore: Number(v) || 0 })}
                  />
                  <TextField
                    label="Suffisso (es. +)"
                    value={n.suffisso}
                    onChange={(v) => update({ suffisso: v })}
                  />
                  <TextField
                    label="Etichetta"
                    value={n.etichetta}
                    onChange={(v) => update({ etichetta: v })}
                  />
                </>
              )}
            />
          </Card>
        )}

        {tab === "contatti" && (
          <>
            <Card title="Recapiti generali">
              <TextField
                label="Email generale"
                value={studio.contatti.emailGenerale}
                onChange={(v) =>
                  setStudio({
                    contatti: { ...studio.contatti, emailGenerale: v },
                  })
                }
              />
              <TextField
                label="PEC"
                value={studio.contatti.pec}
                onChange={(v) =>
                  setStudio({ contatti: { ...studio.contatti, pec: v } })
                }
              />
              <TextField
                label="Telefono"
                value={studio.contatti.telefono}
                onChange={(v) =>
                  setStudio({
                    contatti: { ...studio.contatti, telefono: v },
                  })
                }
              />
              <TextField
                label="Orari"
                value={studio.contatti.orari}
                onChange={(v) =>
                  setStudio({ contatti: { ...studio.contatti, orari: v } })
                }
              />
            </Card>

            <Card title="Dati legali">
              <TextField
                label="P.IVA"
                value={studio.legale.pIva}
                onChange={(v) =>
                  setStudio({ legale: { ...studio.legale, pIva: v } })
                }
              />
              <TextField
                label="Ordine di appartenenza"
                value={studio.legale.ordine}
                onChange={(v) =>
                  setStudio({ legale: { ...studio.legale, ordine: v } })
                }
              />
            </Card>

            <Card title="Sedi">
              <ListEditor
                items={studio.sedi}
                onChange={(sedi) => setStudio({ sedi })}
                newItem={() => ({
                  citta: "",
                  indirizzo: "",
                  telefono: "",
                  email: "",
                  principale: false,
                })}
                titleOf={(s) => s.citta || "Nuova sede"}
                addLabel="Aggiungi sede"
                render={(s, update) => (
                  <>
                    <TextField
                      label="Città"
                      value={s.citta}
                      onChange={(v) => update({ citta: v })}
                    />
                    <TextField
                      label="Indirizzo"
                      value={s.indirizzo}
                      onChange={(v) => update({ indirizzo: v })}
                    />
                    <TextField
                      label="Telefono"
                      value={s.telefono}
                      onChange={(v) => update({ telefono: v })}
                    />
                    <TextField
                      label="Email"
                      value={s.email}
                      onChange={(v) => update({ email: v })}
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={s.principale}
                        onChange={(e) =>
                          update({ principale: e.target.checked })
                        }
                        className="h-4 w-4 accent-navy"
                      />
                      Sede principale
                    </label>
                  </>
                )}
              />
            </Card>
          </>
        )}

        {tab === "aree" && (
          <Card title="Servizi">
            <ListEditor<Area>
              items={content.aree}
              onChange={(aree) => setContent((c) => ({ ...c, aree }))}
              newItem={() => ({
                slug: `area-${content.aree.length + 1}`,
                titolo: "",
                sintesi: "",
                descrizione: "",
                prestazioni: [],
                icona: iconNames[0],
              })}
              titleOf={(a) => a.titolo || "Nuovo servizio"}
              addLabel="Aggiungi servizio"
              render={(a, update) => (
                <>
                  <TextField
                    label="Titolo"
                    value={a.titolo}
                    onChange={(v) =>
                      update({ titolo: v, slug: a.slug || slugify(v) })
                    }
                  />
                  <TextField
                    label="Slug (URL)"
                    value={a.slug}
                    onChange={(v) => update({ slug: slugify(v) })}
                  />
                  <SelectField
                    label="Icona"
                    value={a.icona}
                    options={iconNames}
                    onChange={(v) => update({ icona: v })}
                  />
                  <TextArea
                    label="Sintesi (anteprima)"
                    value={a.sintesi}
                    onChange={(v) => update({ sintesi: v })}
                    rows={2}
                  />
                  <TextArea
                    label="Descrizione completa"
                    value={a.descrizione}
                    onChange={(v) => update({ descrizione: v })}
                    rows={4}
                  />
                  <StringListField
                    label="Prestazioni"
                    value={a.prestazioni}
                    onChange={(v) => update({ prestazioni: v })}
                  />
                </>
              )}
            />
          </Card>
        )}

        {tab === "team" && (
          <Card title="Professionisti">
            <ListEditor<Professionista>
              items={content.team}
              onChange={(team) => setContent((c) => ({ ...c, team }))}
              newItem={() => ({
                slug: `professionista-${content.team.length + 1}`,
                nome: "",
                ruolo: "",
                abilitazione: "",
                bio: "",
                bioEstesa: [],
                aree: [],
                formazione: [],
                email: "",
                telefono: "",
                iniziali: "",
                foto: "",
              })}
              titleOf={(p) => p.nome || "Nuovo professionista"}
              addLabel="Aggiungi professionista"
              render={(p, update) => (
                <>
                  <ImageField
                    label="Foto"
                    value={p.foto}
                    onChange={(v) => update({ foto: v })}
                  />
                  <TextField
                    label="Nome (es. Dott. Mario Rossi)"
                    value={p.nome}
                    onChange={(v) =>
                      update({ nome: v, slug: p.slug || slugify(v) })
                    }
                  />
                  <TextField
                    label="Slug (URL)"
                    value={p.slug}
                    onChange={(v) => update({ slug: slugify(v) })}
                  />
                  <TextField
                    label="Iniziali (se senza foto)"
                    value={p.iniziali}
                    onChange={(v) => update({ iniziali: v })}
                  />
                  <TextField
                    label="Ruolo"
                    value={p.ruolo}
                    onChange={(v) => update({ ruolo: v })}
                  />
                  <TextField
                    label="Abilitazione"
                    value={p.abilitazione}
                    onChange={(v) => update({ abilitazione: v })}
                  />
                  <TextArea
                    label="Bio breve (anteprima)"
                    value={p.bio}
                    onChange={(v) => update({ bio: v })}
                    rows={3}
                  />
                  <StringListField
                    label="Bio estesa (un paragrafo per riga)"
                    value={p.bioEstesa}
                    onChange={(v) => update({ bioEstesa: v })}
                    hint="Un paragrafo per riga."
                    rows={6}
                  />
                  <StringListField
                    label="Aree di competenza"
                    value={p.aree}
                    onChange={(v) => update({ aree: v })}
                  />
                  <StringListField
                    label="Formazione"
                    value={p.formazione}
                    onChange={(v) => update({ formazione: v })}
                  />
                  <TextField
                    label="Email"
                    value={p.email}
                    onChange={(v) => update({ email: v })}
                  />
                  <TextField
                    label="Telefono"
                    value={p.telefono}
                    onChange={(v) => update({ telefono: v })}
                  />
                </>
              )}
            />
          </Card>
        )}

        {tab === "palette" && <PaletteTab initialPalette={initialPalette} />}
      </div>

      {/* Barra di salvataggio fissa */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm text-slate-500">
            {save === "error" ? (
              <span className="flex items-center gap-1.5 text-red-600">
                <AlertCircle size={16} /> {error}
              </span>
            ) : save === "ok" ? (
              <span className="flex items-center gap-1.5 text-green-600">
                <Check size={16} />
                Salvato ({locale.toUpperCase()})
                {lastCommitSha ? ` - commit ${lastCommitSha.slice(0, 8)}` : ""}
                {lastSnapshotPath ? ` - snapshot ${lastSnapshotPath}` : ""}
              </span>
            ) : (
              "La pubblicazione delle modifiche può avvenire dopo qualche minuto."
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={save === "saving"}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
          >
            {save === "saving" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Salva e pubblica
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// ─── Palette colori ────────────────────────────────────────────────────────

const BG_OPTIONS: { n: number; label: string; hex: string; v800: string; v700: string }[] = [
  { n:  1, label: "Blu notte",      hex: "#0f1b2d", v800: "#16263d", v700: "#1e3450" },
  { n:  2, label: "Verde foresta",  hex: "#0e2a1c", v800: "#163825", v700: "#1e4830" },
  { n:  3, label: "Antracite",      hex: "#1c2025", v800: "#252b33", v700: "#2f3642" },
  { n:  4, label: "Granato",        hex: "#2a1520", v800: "#36202b", v700: "#452838" },
  { n:  5, label: "Blu polvere",    hex: "#1a2d48", v800: "#213a5e", v700: "#284773" },
  { n:  6, label: "Marrone caldo",  hex: "#2a1f14", v800: "#38291c", v700: "#473524" },
  { n:  7, label: "Viola profondo", hex: "#1e1730", v800: "#2a2040", v700: "#362952" },
  { n:  8, label: "Verde petrolio", hex: "#0d2830", v800: "#143640", v700: "#1b4550" },
  { n:  9, label: "Blu cobalto",    hex: "#0e1f4a", v800: "#162860", v700: "#1d3278" },
  { n: 10, label: "Verde oliva",    hex: "#1e2614", v800: "#283220", v700: "#33402a" },
  { n: 11, label: "Grigio blu",     hex: "#1a2130", v800: "#222c3e", v700: "#2c3850" },
  { n: 12, label: "Porpora",        hex: "#250f2a", v800: "#321638", v700: "#401f48" },
];

const CTA_OPTIONS: { n: number; label: string; hex: string; light: string }[] = [
  { n:  1, label: "Oro",          hex: "#b8924f", light: "#d4b577" },
  { n:  2, label: "Salvia",       hex: "#5f8a6b", light: "#82aa8d" },
  { n:  3, label: "Turchese",     hex: "#3d8b8b", light: "#65aaaa" },
  { n:  4, label: "Terracotta",   hex: "#c05a3a", light: "#d6826a" },
  { n:  5, label: "Lavanda",      hex: "#7a6fa0", light: "#a09ac4" },
  { n:  6, label: "Azzurro",      hex: "#4a7fa8", light: "#75a3c5" },
  { n:  7, label: "Rosa antico",  hex: "#c4747a", light: "#d89a9f" },
  { n:  8, label: "Rame",         hex: "#c07842", light: "#d49a6a" },
  { n:  9, label: "Lime salvia",  hex: "#7a9e42", light: "#9abc65" },
  { n: 10, label: "Corallo",      hex: "#d45840", light: "#e07e68" },
  { n: 11, label: "Indaco",       hex: "#5060b0", light: "#7888c8" },
  { n: 12, label: "Smeraldo",     hex: "#2e8a6a", light: "#55aa8a" },
];

function applyPaletteVars(
  bg: { hex: string; v800: string; v700: string } | null,
  cta: { hex: string; light: string } | null,
) {
  const root = document.documentElement;
  if (bg) {
    root.style.setProperty("--color-navy",     bg.hex);
    root.style.setProperty("--color-navy-800", bg.v800);
    root.style.setProperty("--color-navy-700", bg.v700);
  }
  if (cta) {
    root.style.setProperty("--color-gold",       cta.hex);
    root.style.setProperty("--color-gold-light", cta.light);
  }
}

function paletteFromSelections(
  bgN: number,
  ctaN: number,
): SitePalette | null {
  const bg  = BG_OPTIONS.find(o => o.n === bgN);
  const cta = CTA_OPTIONS.find(o => o.n === ctaN);
  if (!bg || !cta) return null;
  return { bgHex: bg.hex, bgV800: bg.v800, bgV700: bg.v700, ctaHex: cta.hex, ctaLight: cta.light };
}

function nFromPalette(
  palette: SitePalette | null,
): { bgN: number; ctaN: number } {
  const bgN  = BG_OPTIONS.find(o => o.hex === palette?.bgHex)?.n  ?? 1;
  const ctaN = CTA_OPTIONS.find(o => o.hex === palette?.ctaHex)?.n ?? 1;
  return { bgN, ctaN };
}

function ColorGrid({
  options,
  selected,
  onSelect,
}: {
  options: { n: number; label: string; hex: string }[];
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {options.map((o) => (
        <button
          key={o.n}
          onClick={() => onSelect(o.n)}
          className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all ${
            selected === o.n ? "" : "hover:bg-slate-50"
          }`}
          style={selected === o.n ? { boxShadow: `0 0 0 2px ${o.hex}` } : {}}
        >
          <span
            className="flex h-12 w-full items-end justify-end rounded-lg p-1"
            style={{ background: o.hex }}
          >
            <span className="rounded bg-white/25 px-1 py-0.5 font-mono text-xs font-bold text-white">
              {o.n}
            </span>
          </span>
          <span className="text-center text-[11px] font-medium text-slate-600 leading-tight">
            {o.label}
          </span>
        </button>
      ))}
    </div>
  );
}

type PaletteSave = "idle" | "saving" | "ok" | "error";

function PaletteTab({ initialPalette }: { initialPalette: SitePalette | null }) {
  const { bgN: initBg, ctaN: initCta } = nFromPalette(initialPalette);
  const [selBg,  setSelBg]  = useState<number>(initBg);
  const [selCta, setSelCta] = useState<number>(initCta);
  const [saveState, setSaveState] = useState<PaletteSave>("idle");
  const [saveError, setSaveError] = useState("");

  const bgOpt  = BG_OPTIONS.find(o => o.n === selBg)!;
  const ctaOpt = CTA_OPTIONS.find(o => o.n === selCta)!;

  function chooseBg(n: number) {
    setSelBg(n);
    const o = BG_OPTIONS.find(x => x.n === n)!;
    applyPaletteVars(o, null);
  }
  function chooseCta(n: number) {
    setSelCta(n);
    const o = CTA_OPTIONS.find(x => x.n === n)!;
    applyPaletteVars(null, o);
  }

  async function handleSave() {
    const palette = paletteFromSelections(selBg, selCta);
    if (!palette) return;
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ palette }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
      }
      setSaveState("ok");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Errore");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Anteprima */}
      <section className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: bgOpt.hex }}
        >
          <span className="font-serif text-lg font-semibold text-white">Studio Dentistico Briguglia</span>
          <button
            className="rounded-full px-5 py-2 text-sm font-semibold text-white"
            style={{ background: ctaOpt.hex }}
          >
            Prenota ora
          </button>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: ctaOpt.hex }}
          >
            CTA
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-3/4 rounded" style={{ background: bgOpt.hex, opacity: 0.12 }} />
            <div className="h-2.5 w-1/2 rounded" style={{ background: bgOpt.hex, opacity: 0.08 }} />
          </div>
          <div
            className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white"
            style={{ background: ctaOpt.hex }}
          >
            Scopri
          </div>
        </div>
        <div
          className="flex justify-center gap-6 px-6 py-3"
          style={{ background: bgOpt.v800 }}
        >
          {["Home", "Servizi", "Team", "Contatti"].map((v) => (
            <span key={v} className="text-xs text-white/70">{v}</span>
          ))}
        </div>
      </section>

      {/* Sfondo */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Colore sfondo</h2>
        <p className="mb-4 text-xs text-slate-500">
          Header, footer e sezioni scure del sito.
        </p>
        <ColorGrid options={BG_OPTIONS} selected={selBg} onSelect={chooseBg} />
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Colore CTA — pulsanti e accenti</h2>
        <p className="mb-4 text-xs text-slate-500">
          Pulsanti principali, link attivi e dettagli decorativi.
        </p>
        <ColorGrid options={CTA_OPTIONS} selected={selCta} onSelect={chooseCta} />
      </section>

      {/* Riepilogo + salvataggio */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Combinazione selezionata</h2>
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <span className="h-7 w-7 rounded-full border border-slate-200" style={{ background: bgOpt.hex }} />
            <div>
              <p className="text-xs text-slate-500">Sfondo</p>
              <p className="text-sm font-semibold text-slate-800">{selBg} — {bgOpt.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <span className="h-7 w-7 rounded-full border border-slate-200" style={{ background: ctaOpt.hex }} />
            <div>
              <p className="text-xs text-slate-500">CTA</p>
              <p className="text-sm font-semibold text-slate-800">{selCta} — {ctaOpt.label}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ background: ctaOpt.hex }}
          >
            {saveState === "saving" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : saveState === "ok" ? (
              <Check size={16} />
            ) : (
              <Save size={16} />
            )}
            {saveState === "ok" ? "Salvato!" : "Applica e salva"}
          </button>
          {saveState === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle size={14} /> {saveError}
            </span>
          )}
          {saveState === "ok" && (
            <span className="text-xs text-slate-500">
              I colori sono ora attivi su tutto il sito.
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
