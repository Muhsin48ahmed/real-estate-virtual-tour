import { z } from 'zod'
import { PROPERTIES } from '../data/properties'

export const INTENTS = [
  { id: 'live', label: 'A home to live in' },
  { id: 'invest', label: 'An investment' },
] as const

export const BUDGETS = [
  { id: 'under-750k', label: 'Under $750k' },
  { id: '750k-1m', label: '$750k – $1M' },
  { id: '1m-2m', label: '$1M – $2M' },
  { id: '2m-plus', label: '$2M+' },
] as const

export const CONTACT_METHODS = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone call' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const

const MAX_MESSAGE = 1000
const MAX_EMAIL = 254
/** C0 control characters except tab and newline; CR is dropped so text can't smuggle header breaks. */
// oxlint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g
const LINE_BREAKS = /[\r\n]+/g

const cleanLine = (value: string) => value.replace(CONTROL_CHARS, '').replace(LINE_BREAKS, ' ')
const cleanText = (value: string) => value.replace(CONTROL_CHARS, '')
const ids = <T extends readonly { id: string }[]>(options: T) => options.map((o) => o.id) as [T[number]['id'], ...T[number]['id'][]]

export const inquirySchema = z
  .object({
    name: z
      .string()
      .transform(cleanLine)
      .pipe(z.string().trim().min(2, 'Please enter your full name').max(80, 'Keep your name under 80 characters')),
    email: z.string().trim().max(MAX_EMAIL, 'That email address is too long').pipe(z.email('Enter a valid email address')),
    phone: z
      .string()
      .trim()
      .max(25, 'That phone number looks too long')
      .regex(/^[+\d\s()-]*$/, 'Use digits, spaces, + ( ) or - only'),
    propertyId: z.enum(PROPERTIES.map((p) => p.id) as [string, ...string[]], 'Choose a property'),
    intent: z.enum(ids(INTENTS), 'Tell us what you are buying for'),
    budget: z.enum(ids(BUDGETS), 'Choose a budget range'),
    contactMethod: z.enum(ids(CONTACT_METHODS), 'Choose how we should contact you'),
    message: z
      .string()
      .transform(cleanText)
      .pipe(z.string().trim().max(MAX_MESSAGE, `Keep your message under ${MAX_MESSAGE} characters`)),
    consent: z.literal(true, 'Please agree so we can reply to you'),
  })
  .refine((v) => v.contactMethod === 'email' || v.phone.replace(/\D/g, '').length >= 7, {
    path: ['phone'],
    message: 'Add a phone number so we can call or message you',
  })

export type InquiryInput = z.infer<typeof inquirySchema>

export interface InquiryPayload extends InquiryInput {
  readonly roomsViewed: readonly string[]
  readonly submittedAt: string
}
