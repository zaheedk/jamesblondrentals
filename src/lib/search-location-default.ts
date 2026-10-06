/** Location-specific hubs can start at their own branch without overwriting saved preferences. */
export const searchLocationDefault = (saved: string | undefined, requested: string | undefined, preferRequested: boolean) =>
  (preferRequested ? requested : saved) || saved || '';