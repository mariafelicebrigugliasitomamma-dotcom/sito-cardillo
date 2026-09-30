import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return {
    title: ui.seo.privacyTitle,
    description: ui.seo.privacyDescription,
    alternates: { canonical: "/informativa-privacy" },
  };
}

export default async function InformativaPrivacyPage() {
  const { privacy, ui } = await getContent();

  const codiceFiscaleText = privacy.codiceFiscale.trim()
    ? privacy.codiceFiscale
    : "dato non disponibile";

  return (
    <>
      <PageHero
        eyebrow={ui.privacyPage.heroEyebrow}
        title={ui.privacyPage.heroTitle}
        description={ui.privacyPage.heroDescription}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal className="space-y-7 rounded-2xl border border-gold/15 bg-cream/40 p-6 text-[1.05rem] leading-relaxed text-slate-800 shadow-sm sm:p-10">
            <p>
              La presente Informativa viene resa per descrivere le modalità
              di gestione del sito web {privacy.siteUrl}, in
              riferimento al trattamento dei dati personali degli utenti che lo
              consultano e che contattano lo Studio tramite i recapiti
              (telefono, email o PEC) indicati sul sito.
            </p>
            <p>
              Il trattamento dei dati personali si basa sui principi di
              correttezza, liceità, trasparenza e tutela della riservatezza,
              in conformità al Regolamento UE 2016/679 (di seguito “GDPR”) e
              alla normativa nazionale vigente.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              1. Titolare del trattamento
            </h2>
            <p>
              Il Titolare del trattamento è {privacy.titolare}, con sede
              legale in {privacy.sedeLegale}, P.IVA {privacy.pIva}, Codice
              Fiscale: {codiceFiscaleText}, iscritto presso {privacy.ordine}.
            </p>
            <p>
              L’utente può contattare il Titolare per qualsiasi questione
              relativa alla privacy o per esercitare i propri diritti scrivendo
              al seguente indirizzo email: {privacy.emailPrivacy} o tramite PEC
              all’indirizzo {privacy.pec}.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              2. Tipi di dati trattati
            </h2>
            <p>
              Il sito non prevede moduli di raccolta dati online. I dati
              personali vengono trattati esclusivamente quando l’utente
              contatta spontaneamente lo Studio tramite i recapiti indicati
              (telefono, email o PEC). In tal caso possono essere trattati dati
              personali comuni quali:
            </p>
            <ul className="list-disc space-y-1 pl-6 marker:text-gold">
              <li>Nome e cognome;</li>
              <li>Indirizzo email;</li>
              <li>Numero di telefono;</li>
              <li>
                Eventuali dati personali e informazioni spontaneamente inseriti
                dall’utente nel testo del messaggio o comunicati durante la
                telefonata.
              </li>
            </ul>
            <p>
              Si invita l’utente a non comunicare, nel primo contatto, “dati
              particolari” (ex dati sensibili, tra cui in particolare i dati
              relativi alla salute, come diagnosi, terapie o referti) se non
              strettamente indispensabili per la richiesta di appuntamento. Le
              informazioni cliniche verranno raccolte direttamente in sede di
              visita, con apposita informativa.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              3. Finalità e base giuridica del trattamento
            </h2>
            <p>
              I dati personali forniti dagli utenti sono utilizzati al solo fine
              di riscontrare la richiesta di informazioni, contatto o preventivo
              inviata dall’utente.
            </p>
            <p>
              Base giuridica: il trattamento è necessario all’esecuzione di
              misure precontrattuali adottate su richiesta dell’interessato
              (Art. 6, par. 1, lett. b del GDPR). Pertanto, non è richiesto un
              consenso esplicito per questa finalità.
            </p>
            <p>
              I dati possono inoltre essere trattati per adempiere a obblighi di
              legge, regolamentari o derivanti dalla normativa sanitaria e
              deontologica medico-odontoiatrica a cui il Titolare è soggetto.
            </p>
            <p>
              Base giuridica: adempimento di un obbligo legale (Art. 6, par. 1,
              lett. c del GDPR).
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              4. Modalità del trattamento e sicurezza
            </h2>
            <p>
              Il trattamento dei dati è eseguito attraverso procedure
              informatiche, telematiche (es. ricezione del messaggio via email)
              e, solo residualmente, cartacee, ad opera del Titolare o di
              soggetti interni espressamente autorizzati e istruiti. Vengono
              adottate adeguate misure di sicurezza tecniche e organizzative per
              prevenire la perdita dei dati, usi illeciti o non corretti ed
              accessi non autorizzati.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              5. Natura del conferimento dei dati
            </h2>
            <p>
              Il conferimento dei dati personali è libero e volontario.
              Tuttavia il conferimento dei dati necessari a identificare
              l’utente e a comprenderne la richiesta (ad esempio nome ed email o
              numero di telefono) è indispensabile per consentire al Titolare di
              fornire il riscontro richiesto: il mancato conferimento comporterà
              l’impossibilità di dare seguito alla richiesta.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              6. Destinatari dei dati
            </h2>
            <p>
              I dati raccolti non saranno diffusi, venduti o comunicati a terzi
              per scopi commerciali. I dati potranno essere conosciuti solo da:
            </p>
            <ul className="list-disc space-y-1 pl-6 marker:text-gold">
              <li>
                Personale dello Studio Dentistico espressamente autorizzato e
                istruito;
              </li>
              <li>
                Soggetti esterni che forniscono servizi tecnologici per la
                gestione del sito web e del servizio di posta elettronica (es.
                fornitore dell’hosting), i quali agiscono in qualità di
                Responsabili del Trattamento ai sensi dell’Art. 28 GDPR.
              </li>
            </ul>
            <p>
              L’elenco aggiornato dei Responsabili può essere richiesto al
              Titolare.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              7. Trasferimento dei dati all’estero
            </h2>
            <p>
              I dati personali sono trattati all’interno dello Spazio Economico
              Europeo (SEE). Qualora per esigenze tecniche i dati dovessero
              essere trasferiti o archiviati presso fornitori situati al di
              fuori del SEE (es. servizi cloud), il trasferimento avverrà
              esclusivamente verso Paesi ritenuti sicuri dalla Commissione
              Europea o previa sottoscrizione delle Clausole Contrattuali
              Standard (Standard Contractual Clauses).
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              8. Periodo di conservazione dei dati
            </h2>
            <p>
              I dati raccolti tramite le richieste di contatto verranno
              conservati per il tempo strettamente necessario a evadere la
              richiesta dell’utente e a fornire il riscontro desiderato.
            </p>
            <p>
              Se al contatto non segue la presa in carico come paziente, i
              dati personali e il testo del messaggio verranno
              cancellati entro un termine massimo di{" "}
              {privacy.conservazioneSenzaIncaricoMesi} mesi dalla ricezione
              dell’ultimo contatto.
            </p>
            <p>
              Se al contatto segue l’instaurazione di un rapporto di cura, i
              dati saranno conservati per tutta la durata del rapporto e per
              l’ulteriore periodo previsto dalla normativa vigente per la
              conservazione della documentazione sanitaria e ai fini della
              tutela legale dello Studio (ordinariamente 10 anni dall’ultima
              prestazione).
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              9. Diritti dell’interessato
            </h2>
            <p>
              In ogni momento, l’utente può esercitare nei confronti del
              Titolare i diritti previsti dagli artt. 15 e seguenti del GDPR,
              tra cui:
            </p>
            <ul className="list-disc space-y-1 pl-6 marker:text-gold">
              <li>
                Diritto di accesso: ottenere la conferma che sia o meno in corso
                un trattamento di dati che lo riguardano e riceverne copia;
              </li>
              <li>
                Diritto di rettifica: ottenere l’aggiornamento o la correzione
                dei dati inesatti;
              </li>
              <li>
                Diritto alla cancellazione (oblio): richiedere la cancellazione
                dei propri dati qualora non siano più necessari per le
                finalità raccolte o se non sussistono altri obblighi di legge
                per la conservazione;
              </li>
              <li>
                Diritto di limitazione: richiedere il blocco del trattamento in
                casi specifici previsti dall’art. 18 GDPR;
              </li>
              <li>
                Diritto alla portabilità: ricevere i propri dati in un formato
                strutturato e comunemente leggibile.
              </li>
            </ul>
            <p>
              Per esercitare tali diritti, è sufficiente inviare una
              comunicazione scritta via email all’indirizzo: {privacy.emailPrivacy}.
            </p>
            <p>
              L’utente ha inoltre il diritto di proporre reclamo all’Autorità
              Garante per la Protezione dei Dati Personali (Piazza Venezia n. 11,
              00187 Roma - www.garanteprivacy.it), qualora ritenga che il
              trattamento dei propri dati avvenga in violazione del GDPR.
            </p>

            <h2 className="pt-3 font-serif text-2xl text-navy">
              Informazioni sui cookie e servizi di terze parti
            </h2>
            <p>
              Questo sito non utilizza cookie di profilazione o di marketing né
              sistemi di monitoraggio degli utenti o pixel di tracciamento.
              Possono essere presenti esclusivamente cookie tecnici o di sessione
              strettamente necessari a garantire la sicurezza e il corretto
              funzionamento del sito. Per tali cookie, ai sensi della normativa
              vigente, non è richiesto il consenso preventivo dell’utente.
            </p>
            <p>
              Nella pagina Contatti è integrata una mappa fornita da{" "}
              <strong>Google Maps</strong> (Google Ireland Ltd). Al caricamento
              della mappa, Google può raccogliere dati sulla navigazione (tra cui
              l’indirizzo IP) e installare propri cookie, anche con trasferimento
              dei dati al di fuori dello Spazio Economico Europeo sulla base delle
              garanzie previste dalla normativa (Clausole Contrattuali Standard).
              Il trattamento è disciplinato dall’informativa privacy di Google,
              consultabile all’indirizzo{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-navy underline decoration-gold/70 underline-offset-2 transition-colors hover:text-gold"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}