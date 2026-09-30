export type Valore = { titolo: string; testo: string };
export type Numero = { valore: number; suffisso: string; etichetta: string };
export type TappaStoria = { anno: string; titolo: string; testo: string };
export type Sede = {
  citta: string;
  indirizzo: string;
  telefono: string;
  email: string;
  principale: boolean;
};
export type Contatti = {
  emailGenerale: string;
  pec: string;
  telefono: string;
  orari: string;
};
export type Legale = { pIva: string; ordine: string };
export type Citazione = { testo: string; autore: string };

export type Studio = {
  nome: string;
  nomeBreve: string;
  claim: string;
  sottoClaim: string;
  annoFondazione: number;
  metaDescription: string;
  heroImmagine: string;
  citazione: Citazione;
  presentazione: string;
  missione: string;
  storia: TappaStoria[];
  valori: Valore[];
  numeri: Numero[];
  sedi: Sede[];
  contatti: Contatti;
  legale: Legale;
};

export type Area = {
  slug: string;
  titolo: string;
  sintesi: string;
  descrizione: string;
  prestazioni: string[];
  icona: string;
};

export type Professionista = {
  slug: string;
  nome: string;
  ruolo: string;
  abilitazione: string;
  bio: string;
  bioEstesa: string[];
  aree: string[];
  formazione: string[];
  email: string;
  telefono: string;
  iniziali: string;
  foto: string;
};

export type PrivacyContent = {
  siteUrl: string;
  titolare: string;
  sedeLegale: string;
  pIva: string;
  codiceFiscale: string;
  ordine: string;
  emailPrivacy: string;
  pec: string;
  conservazioneSenzaIncaricoMesi: number;
};

export type HeaderUiContent = {
  brandPrefix: string;
  menuOpenAriaLabel: string;
  menuCloseAriaLabel: string;
  navHome: string;
  navStudio: string;
  navAree: string;
  navTeam: string;
  navContatti: string;
};

export type FooterUiContent = {
  areeHeading: string;
  navigationHeading: string;
  hqHeading: string;
  navStudio: string;
  navTeam: string;
  navContatti: string;
  rightsReservedLabel: string;
  vatLabel: string;
  privacyLabel: string;
  mainOfficeBadge: string;
};

export type HeroUiContent = {
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export type HomeUiContent = {
  introEyebrow: string;
  introTitle: string;
  introCtaLabel: string;
  areasEyebrow: string;
  areasTitle: string;
  areasDescription: string;
  areasCtaLabel: string;
  valuesEyebrow: string;
  valuesTitle: string;
  valuesDescription: string;
  teamEyebrow: string;
  teamTitle: string;
  teamDescription: string;
  teamCtaLabel: string;
};

export type StudioPageUiContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  aboutEyebrow: string;
  aboutTitle: string;
  missionEyebrow: string;
  missionTitle: string;
  historyEyebrow: string;
  historyTitle: string;
  valuesEyebrow: string;
  valuesTitle: string;
};

export type TeamPageUiContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  cardCtaLabel: string;
  backLabel: string;
  profileEyebrow: string;
  biographyTitle: string;
  educationTitle: string;
  expertiseTitle: string;
  contactsTitle: string;
  otherProfessionalsTitle: string;
  viewAllLabel: string;
  notFoundTitle: string;
};

export type PrivacyPageUiContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
};

export type ContactPageUiContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  detailsEyebrow: string;
  detailsTitle: string;
  phoneLabel: string;
  emailLabel: string;
  pecLabel: string;
  hoursLabel: string;
  officesEyebrow: string;
  mainOfficeBadge: string;
  mapTitlePrefix: string;
};

export type PracticeAreasPageUiContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  ctaTitle: string;
  ctaText: string;
};

export type CtaUiContent = {
  defaultTitle: string;
  defaultText: string;
  buttonLabel: string;
};

/** Titoli e meta description delle pagine (tag <title> e SEO). */
export type SeoUiContent = {
  homeTitleSuffix: string;
  studioTitle: string;
  studioDescription: string;
  practiceAreasTitle: string;
  practiceAreasDescription: string;
  teamTitle: string;
  teamDescription: string;
  contactTitle: string;
  contactDescription: string;
  privacyTitle: string;
  privacyDescription: string;
};

export type UiContent = {
  header: HeaderUiContent;
  footer: FooterUiContent;
  hero: HeroUiContent;
  home: HomeUiContent;
  seo: SeoUiContent;
  studioPage: StudioPageUiContent;
  teamPage: TeamPageUiContent;
  privacyPage: PrivacyPageUiContent;
  contactPage: ContactPageUiContent;
  practiceAreasPage: PracticeAreasPageUiContent;
  cta: CtaUiContent;
};

export type SiteContent = {
  studio: Studio;
  privacy: PrivacyContent;
  aree: Area[];
  team: Professionista[];
  ui: UiContent;
};

export type Locale = "it" | "en";

export type BundleMeta = {
  revision: string;
  updatedAt: string;
  updatedBy: string;
  idempotencyKey: string;
  commitSha?: string;
};

export type BundleMediaImage = {
  slot: "hero" | "team" | "extra";
  url: string;
  mimeType: string;
  bytes: number;
  fallbackBase64?: string;
};

export type SitePalette = {
  bgHex: string;
  bgV800: string;
  bgV700: string;
  ctaHex: string;
  ctaLight: string;
};

export type SiteBundle = {
  meta: BundleMeta;
  content: Record<Locale, SiteContent>;
  media: {
    images: BundleMediaImage[];
  };
  palette?: SitePalette;
};

export type SaveContentPayload = {
  locale: Locale;
  content: SiteContent;
  expectedRevision?: string;
  idempotencyKey: string;
};

export type SaveContentResult = {
  ok: true;
  revision: string;
  commitSha?: string;
  snapshotPath: string;
};
