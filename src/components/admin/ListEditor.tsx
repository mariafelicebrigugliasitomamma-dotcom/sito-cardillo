"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function ListEditor<T>({
  items,
  onChange,
  newItem,
  render,
  titleOf,
  addLabel = "Aggiungi",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  titleOf: (item: T, index: number) => string;
  addLabel?: string;
}) {
  const [open, setOpen] = useState<number | null>(items.length === 1 ? 0 : null);

  function updateAt(index: number, patch: Partial<T>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
    setOpen(null);
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between gap-2 bg-slate-50 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-slate-800"
              >
                {isOpen ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
                <span className="truncate">{titleOf(item, index)}</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Sposta su"
                  className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label="Sposta giù"
                  className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label="Elimina"
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="space-y-4 p-4">
                {render(item, (patch) => updateAt(index, patch), index)}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, newItem()]);
          setOpen(items.length);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-navy hover:text-navy"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
