import type { SiteContent } from "./types";
import { SITE_URL } from "./site";

const customerContent = {
  "studio": {
    "nome": "Studio Dentistico Briguglia",
    "nomeBreve": "Briguglia",
    "claim": "Il tuo sorriso, curato con precisione e delicatezza.",
    "sottoClaim": "Odontoiatria completa per adulti e bambini: prevenzione, implantologia, ortodonzia invisibile ed estetica del sorriso, con tecnologie digitali e un'équipe dedicata.",
    "annoFondazione": 2004,
    "metaDescription": "Studio Dentistico Briguglia: igiene e prevenzione, implantologia, ortodonzia invisibile, estetica dentale e odontoiatria pediatrica. Sedi a Messina e Milazzo.",
    "heroImmagine": "/uploads/cms/jumbotron1.webp",
    "citazione": {
      "testo": "Un buon trattamento inizia sempre dall'ascolto: prima di guardare i denti, guardiamo la persona.",
      "autore": "Dott. Carlo Briguglia"
    },
    "presentazione": "Fondato nel 2004 dal Dott. Carlo Briguglia, lo Studio Dentistico Briguglia è oggi un punto di riferimento a Messina per la salute orale di tutta la famiglia. Un'équipe multidisciplinare di odontoiatri, ortodontisti e igienisti lavora in sinergia per offrire percorsi di cura completi, dalla prima visita al mantenimento nel tempo. Investiamo costantemente in tecnologie digitali — scanner intraorale, radiologia 3D a basso dosaggio, progettazione protesica computerizzata — per rendere ogni trattamento più preciso, confortevole e prevedibile.",
    "missione": "Vogliamo che ogni paziente esca dallo studio più sereno di come è entrato. Per questo spieghiamo ogni diagnosi con chiarezza, presentiamo un piano di cura scritto con tempi e costi definiti, e privilegiamo sempre l'approccio meno invasivo possibile, puntando sulla prevenzione per conservare i denti naturali il più a lungo possibile.",
    "storia": [
      {
        "anno": "2004",
        "titolo": "L'apertura dello Studio",
        "testo": "Il Dott. Carlo Briguglia apre il primo studio in Via Garibaldi a Messina, con due riuniti e un'attenzione particolare alla conservativa e alla protesi."
      },
      {
        "anno": "2009",
        "titolo": "Nasce il reparto di implantologia",
        "testo": "Lo Studio si dota di una sala chirurgica dedicata e avvia un protocollo di implantologia guidata, integrando la diagnostica radiologica 3D."
      },
      {
        "anno": "2014",
        "titolo": "Ortodonzia e pedodonzia",
        "testo": "Con l'ingresso della Dott.ssa Martina Ferraro lo Studio amplia l'offerta con l'ortodonzia per bambini e adulti e un percorso dedicato ai piccoli pazienti."
      },
      {
        "anno": "2018",
        "titolo": "Il flusso digitale",
        "testo": "Arrivano lo scanner intraorale e la progettazione CAD/CAM: niente più impronte in pasta e protesi realizzate con maggiore precisione e in tempi più brevi."
      },
      {
        "anno": "2022",
        "titolo": "La nuova sede di Milazzo",
        "testo": "Per essere più vicini ai pazienti della provincia apriamo una seconda sede a Milazzo, con gli stessi protocolli e la stessa équipe."
      }
    ],
    "valori": [
      {
        "titolo": "Ascolto",
        "testo": "Ogni percorso di cura inizia da un colloquio: esigenze, timori e aspettative del paziente guidano le nostre scelte."
      },
      {
        "titolo": "Trasparenza",
        "testo": "Piano di trattamento scritto, preventivo dettagliato e nessuna sorpresa: sai sempre cosa faremo, quando e quanto costerà."
      },
      {
        "titolo": "Precisione",
        "testo": "Diagnosi digitali, materiali certificati e protocolli di sterilizzazione tracciati per risultati affidabili e duraturi."
      },
      {
        "titolo": "Delicatezza",
        "testo": "Tecniche mininvasive, anestesia computerizzata e sedazione cosciente per trattamenti il più possibile confortevoli, anche per chi ha paura del dentista."
      }
    ],
    "numeri": [
      {
        "valore": 22,
        "suffisso": "+",
        "etichetta": "Anni di attività"
      },
      {
        "valore": 12000,
        "suffisso": "+",
        "etichetta": "Pazienti seguiti"
      },
      {
        "valore": 2,
        "suffisso": "",
        "etichetta": "Sedi sul territorio"
      },
      {
        "valore": 4,
        "suffisso": "",
        "etichetta": "Professionisti"
      }
    ],
    "sedi": [
      {
        "citta": "Messina",
        "indirizzo": "Via Garibaldi 118, 98122 Messina (ME)",
        "telefono": "+39 090 7123456 - +39 347 1234567",
        "email": "info@studiodentisticobriguglia.it",
        "principale": true
      },
      {
        "citta": "Milazzo",
        "indirizzo": "Via Umberto I 45, 98057 Milazzo (ME)",
        "telefono": "+39 090 9281234",
        "email": "milazzo@studiodentisticobriguglia.it",
        "principale": false
      }
    ],
    "contatti": {
      "emailGenerale": "info@studiodentisticobriguglia.it",
      "pec": "studiobriguglia@pec.it",
      "telefono": "+39 090 7123456 - +39 347 1234567",
      "orari": "Lun – Ven, 9:00 – 13:00 / 15:00 – 19:30 · Sab 9:00 – 13:00"
    },
    "legale": {
      "pIva": "03456780831",
      "ordine": "Ordine dei Medici Chirurghi e degli Odontoiatri di Messina"
    }
  },
  "privacy": {
    "siteUrl": "www.studiodentisticobriguglia.it",
    "titolare": "Studio Dentistico Briguglia",
    "sedeLegale": "Via Garibaldi 118, 98122 Messina (ME)",
    "pIva": "03456780831",
    "codiceFiscale": "",
    "ordine": "Ordine dei Medici Chirurghi e degli Odontoiatri di Messina",
    "emailPrivacy": "privacy@studiodentisticobriguglia.it",
    "pec": "studiobriguglia@pec.it",
    "conservazioneSenzaIncaricoMesi": 12
  },
  "aree": [
    {
      "slug": "igiene-prevenzione",
      "titolo": "Igiene e prevenzione",
      "sintesi": "Pulizia professionale, controlli periodici e educazione all'igiene orale domiciliare.",
      "descrizione": "La prevenzione è il trattamento più efficace e meno costoso. Le nostre igieniste eseguono sedute di igiene professionale personalizzate e insegnano a ogni paziente le tecniche corrette per mantenere denti e gengive sani tra un controllo e l'altro.",
      "prestazioni": [
        "Ablazione del tartaro e lucidatura",
        "Airflow e sbiancamento delle macchie superficiali",
        "Sigillature dei solchi nei bambini",
        "Fluoroprofilassi",
        "Richiami periodici personalizzati"
      ],
      "icona": "ShieldCheck"
    },
    {
      "slug": "conservativa-endodonzia",
      "titolo": "Conservativa ed endodonzia",
      "sintesi": "Cura della carie e devitalizzazioni per salvare il dente naturale.",
      "descrizione": "Trattiamo la carie con otturazioni estetiche in composito e, quando l'infezione raggiunge la polpa, eseguiamo devitalizzazioni con strumenti rotanti al nichel-titanio e ingrandimento ottico, per conservare il dente il più a lungo possibile.",
      "prestazioni": [
        "Otturazioni estetiche in composito",
        "Intarsi in ceramica e composito",
        "Devitalizzazioni (terapia canalare)",
        "Ritrattamenti endodontici"
      ],
      "icona": "Microscope"
    },
    {
      "slug": "implantologia",
      "titolo": "Implantologia",
      "sintesi": "Sostituzione dei denti mancanti con impianti in titanio, anche a carico immediato.",
      "descrizione": "Pianifichiamo ogni intervento con TAC 3D e software di chirurgia guidata, per inserire gli impianti con la massima precisione e il minimo disagio. Nei casi indicati è possibile ricevere denti fissi provvisori già in giornata.",
      "prestazioni": [
        "Impianti singoli e multipli",
        "Carico immediato",
        "Chirurgia implantare guidata",
        "Rialzo del seno mascellare e rigenerazione ossea",
        "Protesi fissa su impianti (All-on-4 / All-on-6)"
      ],
      "icona": "Crown"
    },
    {
      "slug": "ortodonzia",
      "titolo": "Ortodonzia",
      "sintesi": "Apparecchi fissi, mobili e allineatori trasparenti per bambini e adulti.",
      "descrizione": "Correggiamo la posizione dei denti e i rapporti tra le arcate con soluzioni su misura: dall'ortodonzia intercettiva nei bambini agli allineatori trasparenti invisibili, ideali per gli adulti che desiderano discrezione.",
      "prestazioni": [
        "Allineatori trasparenti",
        "Apparecchi fissi estetici",
        "Ortodonzia intercettiva nei bambini",
        "Contenzione post-trattamento"
      ],
      "icona": "Smile"
    },
    {
      "slug": "protesi",
      "titolo": "Protesi dentale",
      "sintesi": "Corone, ponti e protesi mobili realizzate con flusso digitale.",
      "descrizione": "Grazie allo scanner intraorale e alla progettazione CAD/CAM realizziamo protesi precise, estetiche e confortevoli, in collaborazione con laboratori odontotecnici certificati.",
      "prestazioni": [
        "Corone in zirconia e disilicato di litio",
        "Ponti fissi",
        "Protesi mobili totali e parziali",
        "Riparazioni e ribasature"
      ],
      "icona": "Gem"
    },
    {
      "slug": "estetica-dentale",
      "titolo": "Estetica dentale",
      "sintesi": "Sbiancamento, faccette e ricontorno per un sorriso naturale e armonioso.",
      "descrizione": "Progettiamo il nuovo sorriso con il Digital Smile Design, mostrando al paziente un'anteprima del risultato prima di iniziare. Privilegiamo sempre tecniche conservative e risultati naturali.",
      "prestazioni": [
        "Sbiancamento professionale alla poltrona e domiciliare",
        "Faccette in ceramica e composito",
        "Digital Smile Design",
        "Ricontorno estetico gengivale"
      ],
      "icona": "Sparkles"
    },
    {
      "slug": "parodontologia",
      "titolo": "Parodontologia",
      "sintesi": "Diagnosi e cura delle malattie gengivali per proteggere i tessuti di sostegno.",
      "descrizione": "Gengive che sanguinano o denti che si muovono sono segnali da non trascurare. Con una diagnosi accurata e terapie non chirurgiche e chirurgiche fermiamo la malattia parodontale e manteniamo stabile il risultato nel tempo.",
      "prestazioni": [
        "Sondaggio e cartella parodontale",
        "Levigatura radicolare",
        "Chirurgia parodontale rigenerativa",
        "Terapia di mantenimento"
      ],
      "icona": "HeartPulse"
    },
    {
      "slug": "pedodonzia",
      "titolo": "Odontoiatria pediatrica",
      "sintesi": "Cure dentali per bambini in un ambiente sereno e accogliente.",
      "descrizione": "La prima visita è un gioco: accompagniamo i più piccoli a conoscere lo studio senza paura, insegnando loro a prendersi cura dei denti fin da subito e intercettando precocemente eventuali problemi.",
      "prestazioni": [
        "Prima visita dai 3 anni",
        "Cure dei denti da latte",
        "Sigillature e fluoroprofilassi",
        "Valutazione ortodontica precoce"
      ],
      "icona": "Baby"
    },
    {
      "slug": "chirurgia-orale",
      "titolo": "Chirurgia orale",
      "sintesi": "Estrazioni, denti del giudizio e piccola chirurgia in sicurezza.",
      "descrizione": "Eseguiamo estrazioni semplici e complesse, inclusi i denti del giudizio inclusi, con tecniche atraumatiche e, su richiesta, in sedazione cosciente per il massimo comfort.",
      "prestazioni": [
        "Estrazione dei denti del giudizio",
        "Estrazioni complesse",
        "Frenulectomie",
        "Sedazione cosciente"
      ],
      "icona": "Syringe"
    }
  ],
  "team": [
    {
      "slug": "carlo-briguglia",
      "nome": "Dott. Carlo Briguglia",
      "ruolo": "Direttore sanitario",
      "abilitazione": "Odontoiatra · Implantologia e protesi",
      "bio": "Fondatore dello Studio, si dedica da oltre vent'anni all'implantologia e alla riabilitazione protesica, con un approccio digitale e mininvasivo.",
      "bioEstesa": [
        "Il Dott. Carlo Briguglia si laurea con lode in Odontoiatria e Protesi Dentaria presso l'Università degli Studi di Messina nel 2001 e, dopo alcune esperienze in cliniche del Nord Italia, fonda lo Studio nel 2004.",
        "Si è perfezionato in implantologia e chirurgia guidata con un Master universitario di II livello e frequenta regolarmente corsi di aggiornamento in Italia e all'estero sulle più recenti tecniche di riabilitazione protesica.",
        "Da direttore sanitario coordina l'équipe e i protocolli clinici dello Studio, seguendo personalmente i casi implantologici e protesici più complessi."
      ],
      "aree": [
        "Implantologia",
        "Protesi dentale",
        "Chirurgia orale"
      ],
      "formazione": [
        "Laurea in Odontoiatria e Protesi Dentaria, Università degli Studi di Messina (2001)",
        "Master di II livello in Implantologia e Chirurgia Guidata (2006)",
        "Socio attivo della Società Italiana di Implantologia (SIdI)"
      ],
      "email": "c.briguglia@studiodentisticobriguglia.it",
      "telefono": "+39 090 7123456",
      "iniziali": "CB",
      "foto": ""
    },
    {
      "slug": "martina-ferraro",
      "nome": "Dott.ssa Martina Ferraro",
      "ruolo": "Ortodontista",
      "abilitazione": "Specialista in Ortognatodonzia",
      "bio": "Specialista in ortognatodonzia, segue bambini e adulti con apparecchi fissi e allineatori trasparenti.",
      "bioEstesa": [
        "La Dott.ssa Martina Ferraro si laurea in Odontoiatria presso l'Università degli Studi di Catania e consegue la specializzazione in Ortognatodonzia presso l'Università di Roma “La Sapienza”.",
        "Nello Studio dal 2014, ha sviluppato un percorso ortodontico dedicato ai bambini, basato sull'intercettazione precoce delle malocclusioni, e un protocollo con allineatori trasparenti per i pazienti adulti.",
        "È certificata per i principali sistemi di allineatori invisibili e partecipa come relatrice a corsi di aggiornamento in ortodonzia digitale."
      ],
      "aree": [
        "Ortodonzia",
        "Odontoiatria pediatrica"
      ],
      "formazione": [
        "Laurea in Odontoiatria e Protesi Dentaria, Università degli Studi di Catania (2008)",
        "Specializzazione in Ortognatodonzia, Sapienza Università di Roma (2012)",
        "Certificazione in ortodonzia con allineatori trasparenti (2016)"
      ],
      "email": "m.ferraro@studiodentisticobriguglia.it",
      "telefono": "+39 090 7123456",
      "iniziali": "MF",
      "foto": ""
    },
    {
      "slug": "luca-santangelo",
      "nome": "Dott. Luca Santangelo",
      "ruolo": "Odontoiatra",
      "abilitazione": "Endodonzia e conservativa",
      "bio": "Si occupa di endodonzia al microscopio operatorio, conservativa ed estetica dentale.",
      "bioEstesa": [
        "Il Dott. Luca Santangelo si laurea in Odontoiatria presso l'Università degli Studi di Messina nel 2013 e frequenta un corso annuale di perfezionamento in endodonzia clinica.",
        "Entrato nello Studio nel 2016, si dedica alla conservativa e all'endodonzia con l'ausilio del microscopio operatorio, con l'obiettivo di salvare anche i denti più compromessi.",
        "Segue inoltre i trattamenti di estetica dentale, dallo sbiancamento alle faccette, e la progettazione del sorriso con il Digital Smile Design."
      ],
      "aree": [
        "Conservativa ed endodonzia",
        "Estetica dentale"
      ],
      "formazione": [
        "Laurea in Odontoiatria e Protesi Dentaria, Università degli Studi di Messina (2013)",
        "Corso di perfezionamento in Endodonzia clinica (2015)",
        "Corso avanzato di Digital Smile Design (2019)"
      ],
      "email": "l.santangelo@studiodentisticobriguglia.it",
      "telefono": "+39 090 7123456",
      "iniziali": "LS",
      "foto": ""
    },
    {
      "slug": "chiara-lopresti",
      "nome": "Dott.ssa Chiara Lo Presti",
      "ruolo": "Igienista dentale",
      "abilitazione": "Igiene e prevenzione · Parodontologia",
      "bio": "Igienista dentale, si occupa di prevenzione, igiene professionale e terapia di mantenimento parodontale.",
      "bioEstesa": [
        "La Dott.ssa Chiara Lo Presti si laurea in Igiene Dentale presso l'Università degli Studi di Messina e collabora con lo Studio dal 2017.",
        "Segue i pazienti nei programmi di prevenzione e nelle terapie parodontali non chirurgiche, con particolare attenzione alla motivazione e all'educazione all'igiene orale domiciliare.",
        "Si occupa anche della prevenzione nei più piccoli, con sigillature e sedute di igiene pensate per i bambini."
      ],
      "aree": [
        "Igiene e prevenzione",
        "Parodontologia"
      ],
      "formazione": [
        "Laurea in Igiene Dentale, Università degli Studi di Messina (2016)",
        "Corso di perfezionamento in Parodontologia non chirurgica (2018)"
      ],
      "email": "c.lopresti@studiodentisticobriguglia.it",
      "telefono": "+39 090 7123456",
      "iniziali": "CL",
      "foto": ""
    }
  ],
  "ui": {
    "header": {
      "brandPrefix": "Studio Dentistico",
      "menuOpenAriaLabel": "Apri menu",
      "menuCloseAriaLabel": "Chiudi menu",
      "navHome": "Home",
      "navStudio": "Lo Studio",
      "navAree": "I nostri servizi",
      "navTeam": "Professionisti",
      "navContatti": "Contatti"
    },
    "footer": {
      "areeHeading": "I nostri servizi",
      "navigationHeading": "Navigazione",
      "hqHeading": "Sede principale",
      "navStudio": "Lo Studio",
      "navTeam": "Professionisti",
      "navContatti": "Contatti",
      "rightsReservedLabel": "Tutti i diritti riservati.",
      "vatLabel": "P.IVA",
      "privacyLabel": "Privacy",
      "mainOfficeBadge": "Sede principale"
    },
    "hero": {
      "primaryCtaLabel": "Prenota una visita",
      "secondaryCtaLabel": "I nostri servizi"
    },
    "home": {
      "introEyebrow": "Lo Studio",
      "introTitle": "Cure dentali moderne, con un tocco umano",
      "introCtaLabel": "Scopri lo Studio",
      "areasEyebrow": "I nostri servizi",
      "areasTitle": "Tutto ciò che serve al tuo sorriso, in un unico studio",
      "areasDescription": "Dalla prevenzione all'implantologia, un'équipe multidisciplinare segue ogni fase del percorso di cura con tecnologie digitali e protocolli condivisi.",
      "areasCtaLabel": "Tutti i servizi",
      "valuesEyebrow": "I nostri valori",
      "valuesTitle": "Il modo in cui ci prendiamo cura di te",
      "valuesDescription": "Principi che guidano ogni visita, dal primo colloquio ai controlli di mantenimento.",
      "teamEyebrow": "I professionisti",
      "teamTitle": "Professionisti al servizio del tuo sorriso",
      "teamDescription": "Odontoiatri, ortodontisti e igienisti con competenze complementari, uniti da un metodo di lavoro attento e condiviso.",
      "teamCtaLabel": "Conosci tutto il team"
    },
    "seo": {
      "homeTitleSuffix": "Dentista a Messina e Milazzo",
      "studioTitle": "Lo Studio",
      "studioDescription": "Storia, missione e valori dello Studio Dentistico Briguglia: dal 2004 al fianco dei pazienti di Messina e provincia.",
      "practiceAreasTitle": "I nostri servizi",
      "practiceAreasDescription": "I trattamenti dello Studio Dentistico Briguglia: igiene e prevenzione, conservativa, implantologia, ortodonzia, protesi, estetica dentale, parodontologia e odontoiatria pediatrica.",
      "teamTitle": "Professionisti",
      "teamDescription": "L'équipe dello Studio Dentistico Briguglia: odontoiatri, ortodontisti e igienisti dentali a Messina e Milazzo.",
      "contactTitle": "Contatti",
      "contactDescription": "Contatta lo Studio Dentistico Briguglia. Sedi a Messina e Milazzo. Prenota una visita o una seduta di igiene.",
      "privacyTitle": "Informativa Privacy",
      "privacyDescription": "Informativa sul trattamento dei dati personali (art. 13 GDPR) dello Studio Dentistico Briguglia."
    },
    "studioPage": {
      "heroEyebrow": "Lo Studio",
      "heroTitle": "Salute orale e benessere dal 2004",
      "heroDescription": "Un'équipe multidisciplinare, tecnologie digitali e un'accoglienza attenta per prenderci cura del sorriso di tutta la famiglia.",
      "aboutEyebrow": "Chi siamo",
      "aboutTitle": "Il nostro Studio",
      "missionEyebrow": "La missione",
      "missionTitle": "Il nostro impegno",
      "historyEyebrow": "La nostra storia",
      "historyTitle": "Le tappe di un percorso",
      "valuesEyebrow": "I nostri valori",
      "valuesTitle": "I principi che ci guidano"
    },
    "teamPage": {
      "heroEyebrow": "Professionisti",
      "heroTitle": "Le persone dietro ogni sorriso",
      "heroDescription": "Odontoiatri, specialisti e igienisti che condividono protocolli, aggiornamento continuo e attenzione al paziente.",
      "cardCtaLabel": "Profilo completo",
      "backLabel": "Tutti i professionisti",
      "profileEyebrow": "Profilo",
      "biographyTitle": "Biografia",
      "educationTitle": "Formazione",
      "expertiseTitle": "Ambiti clinici",
      "contactsTitle": "Contatti",
      "otherProfessionalsTitle": "Altri professionisti",
      "viewAllLabel": "Vedi tutti",
      "notFoundTitle": "Profilo non trovato"
    },
    "privacyPage": {
      "heroEyebrow": "Privacy",
      "heroTitle": "Informativa sul trattamento dei dati personali",
      "heroDescription": "Art. 13 GDPR - trattamento dei dati personali degli utenti che consultano il sito e utilizzano il modulo di contatto."
    },
    "contactPage": {
      "heroEyebrow": "Contatti",
      "heroTitle": "Prenota la tua visita",
      "heroDescription": "Compila il modulo o chiamaci: ti ricontatteremo per fissare un appuntamento nella sede e nell'orario più comodi per te.",
      "detailsEyebrow": "Recapiti",
      "detailsTitle": "Come raggiungerci",
      "phoneLabel": "Telefono",
      "emailLabel": "Email",
      "pecLabel": "PEC",
      "hoursLabel": "Orari",
      "officesEyebrow": "Le nostre sedi",
      "mainOfficeBadge": "Sede principale",
      "mapTitlePrefix": "Mappa"
    },
    "practiceAreasPage": {
      "heroEyebrow": "I nostri servizi",
      "heroTitle": "Cure complete per ogni esigenza del sorriso",
      "heroDescription": "Prevenzione, cura e riabilitazione per adulti e bambini, con tecnologie digitali e un piano di trattamento sempre chiaro e condiviso.",
      "ctaTitle": "Non trovi il trattamento che cerchi?",
      "ctaText": "Contattaci comunque: durante la prima visita valuteremo insieme la tua situazione e le soluzioni più adatte."
    },
    "cta": {
      "defaultTitle": "È il momento di prenderti cura del tuo sorriso",
      "defaultText": "Prenota una prima visita: valuteremo insieme la tua salute orale e ti proporremo un piano di cura chiaro, con tempi e costi definiti.",
      "buttonLabel": "Prenota una visita"
    }
  }
} as SiteContent;

export const defaultContent: SiteContent = {
  ...customerContent,
  privacy: {
    ...customerContent.privacy,
    siteUrl: customerContent.privacy?.siteUrl || SITE_URL.replace("https://", ""),
  },
};
