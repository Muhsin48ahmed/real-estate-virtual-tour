import { ArrowRight, Mail } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { FILM_BASE, FILM_CHAPTERS, FILM_CREDIT, type FilmChapter } from '../../data/film'
import { getProperty } from '../../data/properties'
import { formatArea, formatPrice } from '../../lib/format'
import { interiorArea } from '../../lib/geometry'
import { tourStore } from '../../state/store'
import { BRAND } from '../TopBar'
import './film.css'
import { useFilmScrub } from './useFilmScrub'

const FEATURED_PROPERTY = 'villa-serena'
const OTHER_PROPERTY = 'skyline-12b'
/** Start downloading the 3D tour once the visitor is this far into the film. */
const PRELOAD_TOUR_AT_CHAPTER = 2

const preloadTour = () => {
  void import('../../scene/TourCanvas')
}

const openTour = (propertyId: string) => {
  const store = tourStore.getState()
  store.selectProperty(propertyId)
  store.enterTour()
}

function FinalCall() {
  const villa = getProperty(FEATURED_PROPERTY)
  const facts = [
    `${villa.bedrooms} bedrooms`,
    formatArea(interiorArea(villa.rooms)),
    `From ${formatPrice(villa.priceFrom, villa.currency)}`,
  ]
  return (
    <>
      <ul className="film__facts" aria-label="Villa Serena at a glance">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <div className="film__actions">
        <button type="button" className="button button--primary film__cta" onClick={() => openTour(FEATURED_PROPERTY)}>
          Explore Villa Serena in 3D <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" className="button button--ghost film__ghost" onClick={() => tourStore.getState().openInquiry()}>
          Register interest
        </button>
      </div>
      <button type="button" className="link-button film__other" onClick={() => openTour(OTHER_PROPERTY)}>
        Or tour the Skyline Residence 12B apartment
      </button>
      <p className="film__credit">{FILM_CREDIT}</p>
    </>
  )
}

interface ChapterTextProps {
  readonly chapter: FilmChapter
  readonly index: number
  readonly isFinal: boolean
  readonly textRef: (el: HTMLElement | null) => void
}

function ChapterText({ chapter, index, isFinal, textRef }: ChapterTextProps) {
  return (
    <section ref={textRef} className="film__chapter" aria-labelledby={`film-title-${index}`} style={{ opacity: index === 0 ? 1 : 0 }}>
      <p className="eyebrow">{chapter.eyebrow}</p>
      <h2 id={`film-title-${index}`} className="film__title">
        {chapter.title}
      </h2>
      <p className="film__body">{chapter.body}</p>
      {isFinal && <FinalCall />}
    </section>
  )
}

/**
 * The cinematic opening: a tall scroll track over a pinned stage. Scrolling scrubs through five
 * pieces of footage, chapter text rises in over each, and the last chapter hands off to the 3D tour.
 */
export function FilmIntro() {
  const scroller = useRef<HTMLDivElement>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const texts = useRef<(HTMLElement | null)[]>([])
  const progressBar = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const elements = useMemo(() => ({ scroller, videos, texts, progressBar }), [])
  const count = FILM_CHAPTERS.length

  const onChapter = useCallback((index: number) => {
    setChapter(index)
    if (index >= PRELOAD_TOUR_AT_CHAPTER) preloadTour()
  }, [])
  useFilmScrub(elements, count, onChapter)

  // Keyboard scrolling (space, arrows, page keys) needs the scroll container to have focus.
  useEffect(() => scroller.current?.focus({ preventScroll: true }), [])

  return (
    <div ref={scroller} className="film" tabIndex={-1} style={{ '--chapters': count } as CSSProperties}>
      <div className="film__track">
        <div className="film__stage">
          {FILM_CHAPTERS.map((c, i) => (
            <video
              key={c.shot}
              ref={(el) => {
                videos.current[i] = el
              }}
              className="film__video"
              src={`${FILM_BASE}/${c.shot}.mp4`}
              poster={`${FILM_BASE}/${c.shot}.jpg`}
              muted
              playsInline
              preload={i < 2 ? 'auto' : 'metadata'}
              aria-hidden="true"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div className="film__scrim" aria-hidden="true" />

          <header className="film__header">
            <div className="brand" aria-label={BRAND}>
              <span className="brand__mark" aria-hidden="true">
                A
              </span>
              <span className="brand__name">{BRAND}</span>
            </div>
            <div className="film__header-actions">
              <button
                type="button"
                className="button button--ghost film__ghost film__skip"
                aria-label="Skip to 3D tour"
                onClick={() => openTour(FEATURED_PROPERTY)}
              >
                <span className="film__skip-long">Skip to 3D tour</span>
                <span className="film__skip-short">Skip</span>
              </button>
              <button type="button" className="button button--primary topbar__cta" aria-label="Enquire" onClick={() => tourStore.getState().openInquiry()}>
                <Mail size={18} aria-hidden="true" />
                <span>Enquire</span>
              </button>
            </div>
          </header>

          <main className="film__copy">
            {FILM_CHAPTERS.map((c, i) => (
              <ChapterText
                key={c.shot}
                chapter={c}
                index={i}
                isFinal={i === count - 1}
                textRef={(el) => {
                  texts.current[i] = el
                }}
              />
            ))}
          </main>

          <p className="film__counter" aria-live="polite">
            <span className="visually-hidden">Chapter </span>
            {String(chapter + 1).padStart(2, '0')} <span aria-hidden="true">/</span>
            <span className="visually-hidden"> of </span> {String(count).padStart(2, '0')}
          </p>
          {chapter === 0 && (
            <p className="film__cue" aria-hidden="true">
              Scroll to discover
            </p>
          )}
          <div className="film__progress" aria-hidden="true">
            <div ref={progressBar} className="film__progress-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
