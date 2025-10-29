import React from "react";
import { useOutletContext } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const AjustesGenerales = () => {
  const outletContext = useOutletContext();
  const theme = outletContext?.theme || "light";
  const toggleTheme = outletContext?.toggleTheme || (() => {});
  const setTheme = outletContext?.setTheme;

  const handleSelectTheme = (nextTheme) => {
    if (setTheme) {
      setTheme(nextTheme);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Preferencias generales
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Ajusta la apariencia del panel para adaptarse a tus preferencias.
          </p>
        </div>
      </header>

      <article className="surface-card theme-border shadow-soft rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Tema del panel
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Usa el interruptor para alternar entre el modo claro y oscuro.
              La preferencia se guarda automáticamente en tu navegador.
            </p>
          </div>
          {/* El botón reutiliza la lógica proporcionada por DashboardLayout */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle w-12 h-12 rounded-full flex items-center justify-center self-start md:self-auto"
            aria-pressed={theme === "dark"}
            aria-label={
              theme === "dark"
                ? "Activar modo claro"
                : "Activar modo oscuro"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            className={`px-4 py-2 rounded-lg border theme-border text-sm font-medium transition-colors ${
              theme === "light"
                ? "bg-[var(--color-primary-muted)] text-[var(--color-primary-foreground)] border-[var(--color-primary-muted)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            Activar modo claro
          </button>
          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            className={`px-4 py-2 rounded-lg border theme-border text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-[var(--color-primary-muted)] text-[var(--color-primary-foreground)] border-[var(--color-primary-muted)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            Activar modo oscuro
          </button>
        </div>
      </article>
    </section>
  );
};

export default AjustesGenerales;
