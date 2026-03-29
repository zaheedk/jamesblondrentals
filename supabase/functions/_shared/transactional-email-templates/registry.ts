/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as contactFormNotification } from './contact-form-notification.tsx'
import { template as winzQuoteNotification } from './winz-quote-notification.tsx'
import { template as feedbackNotification } from './feedback-notification.tsx'
import { template as rentalAgreementLink } from './rental-agreement-link.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-form-notification': contactFormNotification,
  'winz-quote-notification': winzQuoteNotification,
  'feedback-notification': feedbackNotification,
  'rental-agreement-link': rentalAgreementLink,
}
