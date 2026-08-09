/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Link, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface QuoteFollowUpProps {
  customerName?: string
  reservationRef?: string
  reservationNo?: string
  vehicleName?: string
  pickupDate?: string
  pickupTime?: string
  dropoffDate?: string
  dropoffTime?: string
  pickupLocation?: string
  dropoffLocation?: string
  totalCost?: string
  completeUrl?: string
}

const QuoteFollowUpEmail = ({
  customerName, reservationRef, reservationNo, vehicleName,
  pickupDate, pickupTime, dropoffDate, dropoffTime,
  pickupLocation, dropoffLocation, totalCost, completeUrl,
}: QuoteFollowUpProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your James Blond quote {reservationNo || reservationRef || ''} — confirm it in under 2 minutes</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your quote is ready</Heading>
        <Text style={text}>Hi {customerName || 'there'},</Text>
        <Text style={text}>
          Thanks for requesting a quote with James Blond Rentals. Your vehicle isn't reserved
          until payment is made — you can confirm it securely below.
        </Text>

        <Section style={box}>
          {vehicleName ? <Text style={boxLine}><strong>Vehicle:</strong> {vehicleName}</Text> : null}
          <Text style={boxLine}><strong>Pick-up:</strong> {pickupDate || ''} {pickupTime || ''} {pickupLocation ? `· ${pickupLocation}` : ''}</Text>
          <Text style={boxLine}><strong>Drop-off:</strong> {dropoffDate || ''} {dropoffTime || ''} {dropoffLocation ? `· ${dropoffLocation}` : ''}</Text>
          {totalCost ? <Text style={boxLine}><strong>Total:</strong> {totalCost}</Text> : null}
          <Text style={boxLine}><strong>Reference:</strong> {reservationNo || reservationRef || ''}</Text>
        </Section>

        <Button style={button} href={completeUrl || '#'}>
          Confirm my booking
        </Button>

        <Text style={smallText}>If the button doesn't work, copy and paste this link:</Text>
        <Link href={completeUrl || '#'} style={link}>{completeUrl || ''}</Link>

        <Text style={text}>
          Prefer to talk? Call us on 0800 525 663 and we'll finish the booking for you.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteFollowUpEmail,
  subject: (data: Record<string, any>) =>
    `Your James Blond quote ${data.reservationNo || data.reservationRef || ''} — confirm your booking`,
  displayName: 'Quote follow-up',
  previewData: {
    customerName: 'Jane',
    reservationRef: 'RES-12345',
    reservationNo: '12345',
    vehicleName: '2 Tonne Box Truck',
    pickupDate: '12/Aug/2026',
    pickupTime: '09:00',
    dropoffDate: '14/Aug/2026',
    dropoffTime: '09:00',
    pickupLocation: 'Auckland Airport',
    dropoffLocation: 'Auckland Airport',
    totalCost: '$285.00',
    completeUrl: 'https://www.jamesblond.co.nz/complete-booking/RES-12345',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px' }
const box = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px 18px', margin: '0 0 24px' }
const boxLine = { fontSize: '14px', color: '#334155', margin: '0 0 6px' }
const button = { backgroundColor: '#0a7a3b', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const smallText = { fontSize: '12px', color: '#94a3b8', margin: '20px 0 4px' }
const link = { fontSize: '12px', color: '#0a7a3b', wordBreak: 'break-all' as const }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }