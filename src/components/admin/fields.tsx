"use client";

import { useId, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-navy focus:ring-2 focus:ring-navy/15";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y`}
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Modifica una lista di stringhe come testo, una voce per riga. */
export function StringListField({
  label,
  value,
  onChange,
  hint = "Una voce per riga.",
  rows = 4,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <TextArea
      label={label}
      value={value.join("\n")}
      rows={rows}
      hint={hint}
      onChange={(text) =>
        onChange(
          text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0)
        )
      }
    />
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Campo per indicare il percorso di un'immagine.
 * Le immagini vanno caricate manualmente nella cartella `public/` del progetto
 * e qui se ne indica il percorso (es. /uploads/cms/foto.jpg).
 */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload non riuscito");
      }
      onChange(data.url as string);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Errore upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-100 text-slate-400">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={24} />
          )}
        </div>
        <div className="flex-1">
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/cms/foto.jpg"
            className={inputClass}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label
              htmlFor={`${id}-file`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Carica immagine
            </label>
            <input
              id={`${id}-file`}
              type="file"
              accept="image/webp,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => void handleUpload(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-slate-500">
              Max 700 KB. Formati: WEBP, JPG, PNG. Limite CMS: 3 immagini.
            </p>
          </div>
          {uploadError ? (
            <p className="mt-1 text-xs text-red-600">{uploadError}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              Puoi anche inserire manualmente un percorso esistente (es. /uploads/cms/file.webp).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
