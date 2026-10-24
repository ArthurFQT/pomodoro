"use client";

import { useActionState, useState } from "react";

import { updateSoundSettings, type SoundSettingsFormState } from "@/app/dashboard/actions";
import { playAlarm, startAmbientNoise, stopAmbientNoise } from "@/lib/audio-engine";
import { ALARM_SOUNDS, AMBIENT_NOISES, type AlarmSound, type AmbientNoise } from "@/lib/sound";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";

type SoundsTabProps = {
  initialAlarmSound: AlarmSound;
  initialSoundVolume: number;
  initialAmbientNoise: AmbientNoise;
};

const previewButtonClassName =
  "shrink-0 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900";

export function SoundsTab({
  initialAlarmSound,
  initialSoundVolume,
  initialAmbientNoise,
}: SoundsTabProps) {
  const [state, formAction, isPending] = useActionState<
    SoundSettingsFormState,
    FormData
  >(updateSoundSettings, undefined);

  const [alarmSound, setAlarmSound] = useState<AlarmSound>(initialAlarmSound);
  const [soundVolume, setSoundVolume] = useState(initialSoundVolume);
  const [ambientNoise, setAmbientNoise] = useState<AmbientNoise>(initialAmbientNoise);
  const [previewingNoise, setPreviewingNoise] = useState(false);

  function handlePreviewAlarm() {
    playAlarm(alarmSound, soundVolume);
  }

  function handleToggleNoisePreview() {
    if (previewingNoise) {
      stopAmbientNoise();
      setPreviewingNoise(false);
      return;
    }
    if (ambientNoise === "none") return;
    startAmbientNoise(ambientNoise, soundVolume);
    setPreviewingNoise(true);
  }

  function handleAmbientNoiseChange(value: string) {
    const next = value as AmbientNoise;
    setAmbientNoise(next);
    if (previewingNoise) {
      stopAmbientNoise();
      setPreviewingNoise(false);
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (previewingNoise) {
          stopAmbientNoise();
          setPreviewingNoise(false);
        }
      }}
      className="flex max-w-sm flex-col gap-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              name="alarmSound"
              label="Som do alarme"
              value={alarmSound}
              onChange={(value) => setAlarmSound(value as AlarmSound)}
              options={ALARM_SOUNDS.map((sound) => ({ value: sound.id, label: sound.label }))}
            />
          </div>
          <button
            type="button"
            onClick={handlePreviewAlarm}
            className={previewButtonClassName}
          >
            Ouvir
          </button>
        </div>

        <Slider
          name="soundVolume"
          label="Volume"
          min={0}
          max={100}
          unit="%"
          defaultValue={soundVolume}
          onChange={setSoundVolume}
        />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              name="ambientNoise"
              label="Ruído ambiente durante o foco"
              value={ambientNoise}
              onChange={handleAmbientNoiseChange}
              options={AMBIENT_NOISES.map((noise) => ({ value: noise.id, label: noise.label }))}
            />
          </div>
          <button
            type="button"
            onClick={handleToggleNoisePreview}
            disabled={ambientNoise === "none"}
            className={previewButtonClassName}
          >
            {previewingNoise ? "Parar" : "Ouvir"}
          </button>
        </div>
      </div>

      {state && (
        <p
          className={`text-sm ${
            state.ok
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--accent-to)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-from)] disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
