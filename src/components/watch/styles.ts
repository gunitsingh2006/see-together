export const btn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimary = `${btn} bg-primary text-primary-foreground hover:opacity-90`;
export const btnSecondary = `${btn} bg-secondary text-secondary-foreground hover:opacity-90`;
export const btnDanger = `${btn} bg-destructive text-destructive-foreground hover:opacity-90`;
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";