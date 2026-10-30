import { CheckCircle2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ThankYouProps {
  readonly firstName: string
  readonly mode: 'remote' | 'demo'
  readonly onClose: () => void
}

/** Confirmation that replaces the form; it takes focus so screen readers announce it. */
export function ThankYou({ firstName, mode, onClose }: ThankYouProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <div className="thanks" role="status">
      <CheckCircle2 className="thanks__icon" size={44} aria-hidden="true" />
      <h2 ref={headingRef} tabIndex={-1} className="panel__title">
        Thank you, {firstName}
      </h2>
      <p className="panel__lead">
        A sales consultant will be in touch within one business day with the brochure, floor plans and current availability.
      </p>
      {mode === 'demo' && (
        <p className="notice">
          Demo mode: this inquiry was saved in this browser only. Set <code>VITE_INQUIRY_ENDPOINT</code> to deliver leads.
        </p>
      )}
      <button type="button" className="button button--primary" onClick={onClose}>
        Back to the tour
      </button>
    </div>
  )
}
