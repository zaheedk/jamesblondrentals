/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Link, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  vehicleName?: string
  pickupDate?: string
  dropoffDate?: string
  totalCost?: string
  reservationRef?: string
  completeUrl?: string
  vehicleType?: string
}

const QuoteFinalReminderEmail = ({
  customerName, vehicleName, pickupDate, dropoffDate, totalCost,
  reservationRef, completeUrl, vehicleType,
}: Props) => {
  const isCommercial = vehicleType === 'commercial'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Final reminder — your {vehicleName || 'vehicle'} pickup is {pickupDate || 'soon'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Final reminder: your pickup is almost here</Heading>
          <Text style={text}>Hi {customerName || 'there'},</Text>
          <Text style={text}>
            Your quote for a <strong>{vehicleName}</strong>, picking up on{' '}
            <strong>{pickupDate}</strong> and returning <strong>{dropoffDate}</strong>, is still
            open at <strong>{totalCost}</strong> — and the vehicle is still available right now.
          </Text>
          {isCommercial ? (
            <Text style={text}>
              Our commercial rates stay the same, but with only a few days to go{' '}
              <strong>availability is tight and the vehicle isn't held for you</strong> until you
              confirm.
            </Text>
          ) : (
            <Text style={text}>
              With only a few days to go, <strong>last-minute demand can take the remaining
              vehicles and lift prices</strong>. Your quote doesn't hold the vehicle until you
              confirm.
            </Text>
          )}
          {completeUrl ? (
            <>
              <Button style={button} href={completeUrl}>Confirm my booking</Button>
              <Text style={smallText}>If the button doesn't work, copy and paste this link:</Text>
              <Link href={completeUrl} style={link}>{completeUrl}</Link>
            </>
          ) : null}
          <Section style={box}>
            <Text style={boxLine}>
              <strong>Prefer to talk?</strong> Reply to this email or call{' '}
              <strong>0800 525 663</strong> and we'll finish the booking for you.
            </Text>
            <Text style={boxLine}>
              This is our last reminder about this quote. If your plans have changed, no action
              is needed.
            </Text>
          </Section>
          <Text style={text}>Kind regards,</Text>
          <Text style={text}>The James Blond Rentals team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz · www.jamesblond.co.nz
            {reservationRef ? ` · Quote ref ${reservationRef}` : ''}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteFinalReminderEmail,
  subject: (data: Record<string, any>) =>
    `Final reminder: your ${data.vehicleName || 'vehicle'} pickup on ${data.pickupDate || ''}`,
  displayName: 'Quote final reminder',
  previewData: {
    customerName: 'Jane', vehicleName: 'Toyota Corolla', pickupDate: '20/10/2026',
    dropoffDate: '24/10/2026', totalCost: '$312.00', reservationRef: '0358332E6BC88E0',
    completeUrl: 'https://www.jamesblond.co.nz/complete-booking/0358332E6BC88E0', vehicleType: 'passenger',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px' }
const box = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px 18px', margin: '24px 0 24px' }
const boxLine = { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 10px' }
const button = { backgroundColor: '#0a7a3b', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const smallText = { fontSize: '12px', color: '#94a3b8', margin: '20px 0 4px' }
const link = { fontSize: '12px', color: '#0a7a3b', wordBreak: 'break-all' as const }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }
