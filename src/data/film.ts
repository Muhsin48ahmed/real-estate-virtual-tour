/** The cinematic intro: one stock-footage shot per chapter, scrubbed by scroll. Built by `npm run film`. */
export const FILM_BASE = `${import.meta.env.BASE_URL}film`

export interface FilmChapter {
  /** File name (without extension) in public/film/. */
  readonly shot: string
  readonly eyebrow: string
  readonly title: string
  readonly body: string
}

export const FILM_CHAPTERS: readonly FilmChapter[] = [
  {
    shot: 'shot-1-arrival',
    eyebrow: 'Aurelia Estates · Costa Verde Hills',
    title: 'Exceptional homes, before they’re built.',
    body: 'Reserve off-plan today and move into a finished, furnished residence in 2028.',
  },
  {
    shot: 'shot-2-twilight',
    eyebrow: 'Villa Serena',
    title: 'Arrive at dusk.',
    body: 'Single-level living wrapped around a private garden, minutes from the coast.',
  },
  {
    shot: 'shot-3-courtyard',
    eyebrow: 'Indoor–outdoor living',
    title: 'Light on water.',
    body: 'A heated pool and teak deck open straight off the living spaces.',
  },
  {
    shot: 'shot-4-living',
    eyebrow: 'Inside',
    title: 'Room to breathe.',
    body: 'Seventy square metres of living space, oak floors and a wall of sliding glass.',
  },
  {
    shot: 'shot-5-dusk',
    eyebrow: 'Completion Q4 2028',
    title: 'Walk through it today.',
    body: 'Step inside every room in 3D, then register for the brochure and current availability.',
  },
]

/** Shown with the film: the footage sets the mood and is not the actual development. */
export const FILM_CREDIT = 'Illustrative footage: Alef Morais and Abdullah | 4K via Pexels.'
