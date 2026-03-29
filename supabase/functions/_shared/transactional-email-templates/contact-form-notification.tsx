/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'James Blond Car Rentals'

interface ContactFormNotificationProps {
  name?: string
  email?: string
  phone?: string
  message?: string
  source?: string
}

const ContactFormNotificationEmail = ({ name, email, phone, message, source }: ContactFormNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Submission</Heading>
        <Section style={detailsBox}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || 'Not provided'}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>
          <Text style={label}>Phone</Text>
          <Text style={value}>{phone || 'Not provided'}</Text>
        </Section>
        <Text style={label}>Message</Text>
        <Text style={messageText}>{message || 'No message provided'}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          {source ? `Submitted via the ${source} contact form on jamesblond.co.nz` : 'Submitted via jamesblond.co.nz'}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormNotificationEmail,
  subject: (data: Record<string, any>) => `Contact Form: ${data.name || 'New Enquiry'} - ${data.email || ''}`,
  to: 'info@jamesblond.co.nz',
  displayName: 'Contact form notification',
  previewData: { name: 'John Smith', email: 'john@example.com', phone: '021 123 4567', message: 'I would like to enquire about van hire for next week.', source: 'Auckland' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '0 0 20px' }
const label = { fontSize: '12px', fontWeight: 'bold' as const, color: '#64748b', textTransform: 'uppercase' as const, margin: '12px 0 2px', letterSpacing: '0.5px' }
const value = { fontSize: '15px', color: '#1e293b', margin: '0 0 8px', lineHeight: '1.4' }
const messageText = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '4px 0 20px', whiteSpace: 'pre-wrap' as const }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' as const, margin: '0' }
