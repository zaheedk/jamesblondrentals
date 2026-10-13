/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface QuoteReminderProps {
  customerName?: string
  vehicleName?: string
  pickupDate?: string
  dropoffDate?: string
  totalCost?: string
  /** 'commercial' for trucks, cargo vans and utes; anything else uses passenger wording */
  vehicleType?: string
}

const QuoteReminderEmail = ({
  customerName, vehicleName, pickupDate, dropoffDate, totalCost, vehicleType,
}: QuoteReminderProps) => {
  const isCommercial = vehicleType === 'commercial'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your James Blond quote — {vehicleName || 'your vehicle'} from {pickupDate || ''}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your James Blond quote</Heading>
          <Text style={text}>Hi {customerName || 'there'},</Text>
          <Text style={text}>
            You recently received a quote for a <strong>{vehicleName}</strong>, picking up on{' '}
            <strong>{pickupDate}</strong> and returning <strong>{dropoffDate}</strong>, with a
            quoted total of <strong>{totalCost}</strong>.
          </Text>

          {isCommercial ? (
            <Text style={text}>
              If you still need the vehicle for your move or work, we'd love to help you get
              booked in. <strong>Our commercial rates don't change with demand, but availability
              can become limited.</strong> Your quote does not reserve a vehicle, so please get
              in touch to check availability and complete your booking.
            </Text>
          ) : (
            <Text style={text}>
              If you're still planning your trip, we'd love to help you get booked in.{' '}
              <strong>Availability can become limited, and prices can change as demand picks
              up.</strong> Your quote does not reserve a vehicle, so please get in touch to
              check availability and complete your booking.
            </Text>
          )}

          <Section style={box}>
            <Text style={boxLine}>
              <strong>Ready to go ahead?</strong> Reply to this email or call{' '}
              <strong>0800 525 663</strong>.
            </Text>
            <Text style={boxLine}>
              If your plans have changed or you need different dates or a different-sized
              vehicle, let us know and we'll arrange a new quote.
            </Text>
          </Section>

          <Text style={text}>Kind regards,</Text>
          <Text style={text}>The James Blond Rentals team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz · www.jamesblond.co.nz
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteReminderEmail,
  subject: (data: Record<string, any>) =>
    `Your James Blond quote — ${data.vehicleName || 'your vehicle'} from ${data.pickupDate || ''}`,
  displayName: 'Quote reminder',
  previewData: {
    customerName: 'Jane',
    vehicleName: 'Toyota Corolla',
    pickupDate: '20/Oct/2026',
    dropoffDate: '24/Oct/2026',
    totalCost: '$312.00',
    vehicleType: 'passenger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px' }
const box = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px 18px', margin: '0 0 24px' }
const boxLine = { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 10px' }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }
