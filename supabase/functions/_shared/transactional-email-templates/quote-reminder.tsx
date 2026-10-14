/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Img,
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Link, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface QuoteReminderProps {
  customerName?: string
  vehicleName?: string
  pickupDate?: string
  dropoffDate?: string
  totalCost?: string
  reservationRef?: string
  completeUrl?: string
  /** Tracked redirect used for the button/link href (falls back to completeUrl) */
  clickUrl?: string
  /** 1x1 open-tracking image URL */
  openPixelUrl?: string
  /** 'commercial' for trucks, cargo vans and utes; anything else uses passenger wording */
  vehicleType?: string
}

const QuoteReminderEmail = ({
  customerName, vehicleName, pickupDate, dropoffDate, totalCost,
  reservationRef, completeUrl, vehicleType, clickUrl, openPixelUrl,
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

          <Text style={text}>
            Your quoted vehicle was available when we checked just before sending this email,
            but your quote <strong>does not reserve it</strong>. Other customers can book
            vehicles for the same dates, so if you wait too long your chosen vehicle may no
            longer be available. Please confirm your booking soon to avoid missing out.
          </Text>

          {isCommercial ? (
            <Text style={text}>
              Our commercial rates stay the same regardless of demand — the main concern is
              securing availability for your move or work.
            </Text>
          ) : (
            <Text style={text}>
              Prices can also change with demand, so we recommend confirming sooner rather than
              leaving it until the last minute.
            </Text>
          )}

          {completeUrl ? (
            <>
              <Button style={button} href={clickUrl || completeUrl}>
                Confirm my booking
              </Button>
              <Text style={smallText}>If the button doesn't work, copy and paste this link:</Text>
              <Link href={clickUrl || completeUrl} style={link}>{completeUrl}</Link>
            </>
          ) : null}

          <Section style={box}>
            <Text style={boxLine}>
              <strong>Prefer to talk?</strong> Reply to this email or call{' '}
              <strong>0800 525 663</strong> and we'll finish the booking for you.
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
            {reservationRef ? ` · Quote ref ${reservationRef}` : ''}
          </Text>
          {openPixelUrl ? <Img src={openPixelUrl} width="1" height="1" alt="" style={{ display: 'block', border: 0 }} /> : null}
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteReminderEmail,
  subject: (data: Record<string, any>) =>
    `Your ${data.vehicleName || 'vehicle'} quote — confirm soon to avoid missing out`,
  displayName: 'Quote reminder',
  previewData: {
    customerName: 'Jane',
    vehicleName: 'Toyota Corolla',
    pickupDate: '20/Oct/2026',
    dropoffDate: '24/Oct/2026',
    totalCost: '$312.00',
    reservationRef: '0358332E6BC88E0',
    completeUrl: 'https://www.jamesblond.co.nz/complete-booking/0358332E6BC88E0',
    vehicleType: 'passenger',
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
