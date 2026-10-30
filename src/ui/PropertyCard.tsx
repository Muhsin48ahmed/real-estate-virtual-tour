import { ArrowRight } from 'lucide-react'
import type { Property } from '../data/types'
import { formatArea, formatPrice } from '../lib/format'
import { interiorArea } from '../lib/geometry'
import { tourStore } from '../state/store'

/** Overview panel: the headline facts and a way into the guided tour. */
export function PropertyCard({ property }: { readonly property: Property }) {
  const facts = [
    { label: 'Bedrooms', value: property.bedrooms },
    { label: 'Bathrooms', value: property.bathrooms },
    { label: 'Interior', value: formatArea(interiorArea(property.rooms)) },
    { label: 'Completion', value: property.completion },
  ]
  return (
    <section className="glass panel" aria-labelledby="property-name">
      <p className="eyebrow">Off-plan · {property.location}</p>
      <h1 id="property-name" className="panel__title">
        {property.name}
      </h1>
      <p className="panel__lead">{property.tagline}</p>
      <dl className="facts">
        {facts.map((f) => (
          <div key={f.label} className="facts__item">
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="price">
        <span className="price__label">From</span> {formatPrice(property.priceFrom, property.currency)}
      </p>
      <div className="panel__actions">
        <button type="button" className="button button--primary" onClick={() => tourStore.getState().enterRoom(property.tour[0])}>
          Start guided tour <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" className="button button--ghost" onClick={() => tourStore.getState().openInquiry()}>
          Request brochure
        </button>
      </div>
    </section>
  )
}
