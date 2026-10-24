"use client";

import { useEffect, useRef, useState } from "react";

import {
  addBrainDumpEntry,
  clearBrainDumpEntries,
  loadBrainDumpEntries,
  removeBrainDumpEntry,
  type BrainDumpEntry,
} from "@/lib/brain-dump-storage";

type BrainDumpProps = {
  userId: string;
};

function BrainDumpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a6 6 0 0 0-4 10.472V15h8v-2.528A6 6 0 0 0 12 2Z" />
    </svg>
  );
}

export function BrainDump({ userId }: BrainDumpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<BrainDumpEntry[]>([]);
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sincroniza com o localStorage e começa com o rascunho em branco toda
  // vez que o modal abre — hidratação client-only, sem valor vindo do
  // servidor pra divergir.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setEntries(loadBrainDumpEntries(userId));
      setDraft("");
    }
  }, [isOpen, userId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Foca a textarea num tick separado do keydown que abriu o modal (via
  // atalho "B") — usar o atributo autoFocus faz esse mesmo "b" vazar pra
  // dentro do campo recém-focado em alguns cenários, já que o foco muda
  // antes do navegador terminar de processar aquela mesma tecla.
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => textareaRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  // Atalho "B" abre/fecha, Escape fecha — ignora enquanto o foco está num
  // campo de formulário (a própria textarea do brain dump inclusive), pra
  // não interceptar o "b" ou o "Escape" digitados normalmente.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target !== null &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (isTypingTarget || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() === "b") {
        // Previne o "b" de vazar pra dentro da textarea quando ela ganha
        // foco automaticamente ao abrir (senão a anotação já começa com um
        // "b" sobrando).
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleAdd() {
    if (!draft.trim()) return;
    setEntries(addBrainDumpEntry(userId, draft));
    setDraft("");
  }

  function handleRemove(id: string) {
    setEntries(removeBrainDumpEntry(userId, id));
  }

  function handleClearAll() {
    clearBrainDumpEntries(userId);
    setEntries([]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Brain dump"
        title="Brain dump (B)"
        className="absolute top-4 left-4 rounded-full border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
      >
        <BrainDumpIcon />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Brain dump"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Brain dump
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Anote rápido o que te distraiu e volte pro foco — sem sair do timer.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAdd();
              }}
              className="flex flex-col gap-2"
            >
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="O que veio à cabeça?"
                rows={3}
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent-to)] dark:border-zinc-800"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="self-end rounded-full bg-[var(--accent-to)] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-from)] disabled:opacity-50"
              >
                Adicionar
              </button>
            </form>

            {entries.length > 0 && (
              <div className="flex max-h-60 flex-col gap-2 overflow-y-auto border-t border-zinc-200 pt-3 dark:border-zinc-800">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300">{entry.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(entry.id)}
                      aria-label="Remover anotação"
                      className="shrink-0 text-zinc-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="self-start text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
