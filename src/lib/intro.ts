import { useSyncExternalStore } from "react";

/**
 * The opening sequence, shared by the loader and the hero:
 *   loading -> the logo loader is on screen
 *   reveal  -> the loader is handing over: its emblem turns into the hero's gold particles
 *   done    -> the page is fully interactive
 * `rect` is where the loader's emblem sat on screen when it handed over, so the
 * hero's particles can start from exactly that spot.
 */
export type Phase = "loading" | "reveal" | "done";
type State = { phase: Phase; rect: DOMRect | null };

let state: State = { phase: "loading", rect: null };
const subs = new Set<() => void>();

export const intro = {
  get: () => state,
  set(p: Partial<State>) {
    state = { ...state, ...p };
    subs.forEach((f) => f());
  },
  sub(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export function useIntroPhase() {
  return useSyncExternalStore(intro.sub, () => state.phase);
}
