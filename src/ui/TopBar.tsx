import { Mail, Play } from 'lucide-react'
import { PROPERTIES } from '../data/properties'
import { tourStore, useTour } from '../state/store'

export const BRAND = 'Aurelia Estates'

export function TopBar() {
  const propertyId = useTour((s) => s.propertyId)
  return (
    <header className="topbar">
      <div className="brand" aria-label={BRAND}>
        <span className="brand__mark" aria-hidden="true">
          A
        </span>
        <span className="brand__name">{BRAND}</span>
      </div>
      <nav className="glass switcher" aria-label="Choose a property">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="switcher__option"
            aria-pressed={p.id === propertyId}
            onClick={() => p.id !== propertyId && tourStore.getState().selectProperty(p.id)}
          >
            <span className="switcher__type">{p.type}</span>
            {p.shortName}
          </button>
        ))}
      </nav>
      <div className="topbar__actions">
        <button type="button" className="button button--ghost topbar__film" onClick={() => tourStore.getState().showFilm()} aria-label="Watch the film">
          <Play size={16} aria-hidden="true" />
          <span>Film</span>
        </button>
        <button type="button" className="button button--primary topbar__cta" aria-label="Enquire" onClick={() => tourStore.getState().openInquiry()}>
          <Mail size={18} aria-hidden="true" />
          <span>Enquire</span>
        </button>
      </div>
    </header>
  )
}
