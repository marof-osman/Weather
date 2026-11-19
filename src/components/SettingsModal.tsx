import { Check, Moon, Sun, SunMoon, X } from 'lucide-react';
import { useEffect } from 'react';
import {
  LANGUAGE_OPTIONS,
  TRANSLATIONS,
  type LanguageCode,
} from '../i18n/translations';
import type { TemperatureUnit } from '../types/weather';

export type ThemeMode = 'auto' | 'light' | 'dark';

interface SettingsModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  lang: LanguageCode;
  unit: TemperatureUnit;
  onChangeTheme: (theme: ThemeMode) => void;
  onChangeLang: (lang: LanguageCode) => void;
  onChangeUnit: (unit: TemperatureUnit) => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  theme,
  lang,
  unit,
  onChangeTheme,
  onChangeLang,
  onChangeUnit,
  onClose,
}: SettingsModalProps) {
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Liquid Glass Settings Panel */}
      <div className="glass-popover relative z-10 w-full max-w-md rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/15 px-6 py-4">
          <h2 id="settings-dialog-title" className="text-base font-semibold text-slate-900 dark:text-white">
            {t.settings}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="glass-control flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto space-y-6 p-6">
          {/* Appearance (Auto / Light / Dark Mode) */}
          <div className="space-y-2.5">
            <div className="text-xs font-medium text-slate-500 dark:text-white/70">{t.appearance}</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChangeTheme('auto')}
                aria-pressed={theme === 'auto'}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  theme === 'auto'
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'glass-control text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                }`}
              >
                <SunMoon className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                <span>{t.autoMode}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                aria-pressed={theme === 'light'}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  theme === 'light'
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'glass-control text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                }`}
              >
                <Sun className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-300" aria-hidden="true" />
                <span>{t.lightMode}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  theme === 'dark'
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'glass-control text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                }`}
              >
                <Moon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                <span>{t.darkMode}</span>
              </button>
            </div>
            {theme === 'auto' && (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-white/65">
                {t.autoModeHint}
              </p>
            )}
          </div>

          {/* Language Selection */}
          <div className="space-y-2.5">
            <div className="text-xs font-medium text-slate-500 dark:text-white/70">{t.language}</div>
            <div className="space-y-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = opt.code === lang;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => onChangeLang(opt.code)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                      isSelected
                        ? 'glass-control-active text-slate-900 dark:text-white'
                        : 'glass-control text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-sky-600 dark:text-white" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Units Selection */}
          <div className="space-y-2.5">
            <div className="text-xs font-medium text-slate-500 dark:text-white/70">{t.units}</div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChangeUnit('celsius')}
                aria-pressed={unit === 'celsius'}
                className={`flex flex-col items-start rounded-2xl px-4 py-3 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  unit === 'celsius'
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'glass-control text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                }`}
              >
                <span className="font-mono text-sm font-semibold">°C</span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-white/75">{t.metricUnit}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeUnit('fahrenheit')}
                aria-pressed={unit === 'fahrenheit'}
                className={`flex flex-col items-start rounded-2xl px-4 py-3 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  unit === 'fahrenheit'
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'glass-control text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white'
                }`}
              >
                <span className="font-mono text-sm font-semibold">°F</span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-white/75">{t.imperialUnit}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
