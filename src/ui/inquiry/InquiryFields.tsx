import { PROPERTIES } from '../../data/properties'
import { BUDGETS, CONTACT_METHODS, INTENTS } from '../../inquiry/schema'
import { ChoiceGroup, Field } from '../FormField'

export interface FormValues {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly propertyId: string
  readonly intent: string
  readonly budget: string
  readonly contactMethod: string
  readonly message: string
  readonly consent: boolean
}

export type Errors = Partial<Record<keyof FormValues, string>>

interface FieldsProps {
  readonly values: FormValues
  readonly errors: Errors
  readonly update: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void
}

function ContactFields({ values, errors, update }: FieldsProps) {
  return (
    <>
      <Field id="name" label="Full name" error={errors.name}>
        {(aria) => <input {...aria} name="name" autoComplete="name" value={values.name} onChange={(e) => update('name', e.target.value)} />}
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        {(aria) => (
          <input {...aria} name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update('email', e.target.value)} />
        )}
      </Field>
      <Field id="contactMethod" label="Contact me by" error={errors.contactMethod}>
        {(aria) => (
          <select {...aria} name="contactMethod" value={values.contactMethod} onChange={(e) => update('contactMethod', e.target.value)}>
            {CONTACT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="phone" label="Phone" hint="Needed if you’d like a call or WhatsApp" error={errors.phone}>
        {(aria) => (
          <input {...aria} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update('phone', e.target.value)} />
        )}
      </Field>
    </>
  )
}

function InterestFields({ values, errors, update }: FieldsProps) {
  return (
    <>
      <Field id="propertyId" label="Property" error={errors.propertyId}>
        {(aria) => (
          <select {...aria} name="propertyId" value={values.propertyId} onChange={(e) => update('propertyId', e.target.value)}>
            {PROPERTIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="budget" label="Budget" error={errors.budget}>
        {(aria) => (
          <select {...aria} name="budget" value={values.budget} onChange={(e) => update('budget', e.target.value)}>
            <option value="" disabled>
              Select a range
            </option>
            {BUDGETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        )}
      </Field>
    </>
  )
}

/** Every visible input of the inquiry form, in on-screen order. */
export function InquiryFields(props: FieldsProps) {
  const { values, errors, update } = props
  return (
    <>
      <div className="inquiry__grid">
        <ContactFields {...props} />
        <InterestFields {...props} />
      </div>
      <ChoiceGroup name="intent" legend="I’m buying" options={INTENTS} value={values.intent} error={errors.intent} onChange={(v) => update('intent', v)} />
      <Field id="message" label="Message (optional)" error={errors.message}>
        {(aria) => (
          <textarea
            {...aria}
            name="message"
            rows={3}
            placeholder="Questions about payment plans, finishes, viewing the show home…"
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
          />
        )}
      </Field>
      <div className={`field consent${errors.consent ? ' field--invalid' : ''}`}>
        <label className="consent__label">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            onChange={(e) => update('consent', e.target.checked)}
          />
          <span>I agree to Aurelia Estates contacting me about this property. We never share your details.</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="field__error">
            {errors.consent}
          </p>
        )}
      </div>
    </>
  )
}
