/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Img, Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Alternative { name: string; price: string; imageUrl?: string; url: string }
interface Props {
  customerName?: string
  vehicleName?: string
  pickupDate?: string
  dropoffDate?: string
  reservationRef?: string
  vehicleType?: string
  alternatives?: Alternative[]
  openPixelUrl?: string
}

const QuoteAlternativesEmail = ({
  customerName, vehicleName, pickupDate, dropoffDate, reservationRef, vehicleType, alternatives = [], openPixelUrl,
}: Props) => {
  const isCommercial = vehicleType === 'commercial'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your {vehicleName || 'vehicle'} is no longer available — similar options for your dates</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your quoted vehicle is no longer available</Heading>
          <Text style={text}>Hi {customerName || 'there'},</Text>
          <Text style={text}>
            The <strong>{vehicleName}</strong> in your saved quote is no longer available for{' '}
            <strong>{pickupDate}</strong> to <strong>{dropoffDate}</strong>, but these similar
            vehicles are available for your dates:
          </Text>
          {alternatives.map((a) => (
            <Section key={a.url} style={card}>
              {a.imageUrl ? <Img src={a.imageUrl} alt={a.name} width="220" style={img} /> : null}
              <Text style={carName}>{a.name}</Text>
              <Text style={carPrice}>{a.price} for your dates</Text>
              <Button style={button} href={a.url}>Book this instead</Button>
            </Section>
          ))}
          <Text style={text}>
            {isCommercial
              ? 'Our commercial rates stay the same, but availability can change quickly, so we recommend booking soon.'
              : 'Prices can change with demand and vehicles aren’t held until you book, so we recommend booking soon.'}
          </Text>
          <Section style={box}>
            <Text style={boxLine}>
              <strong>Prefer to talk?</strong> Reply to this email or call{' '}
              <strong>0800 525 663</strong> and we'll sort out the right vehicle for you.
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
  component: QuoteAlternativesEmail,
  subject: (data: Record<string, any>) =>
    `Your ${data.vehicleName || 'vehicle'} is no longer available — similar options for ${data.pickupDate || 'your dates'}`,
  displayName: 'Quote alternatives (vehicle unavailable)',
  previewData: {
    customerName: 'Jane', vehicleName: '3 Ton Box Truck', pickupDate: '20/10/2026', dropoffDate: '21/10/2026',
    reservationRef: '0358332E6BC88E0', vehicleType: 'commercial',
    alternatives: [
      { name: '3 Ton Box (19m³-20m³) Tail Lift', price: '$249.00', url: 'https://www.jamesblond.co.nz/vehicles' },
      { name: '2 Ton Box (9m³-12m³) Tail Lift', price: '$189.00', url: 'https://www.jamesblond.co.nz/vehicles' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px' }
const card = { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 18px', margin: '0 0 16px' }
const img = { display: 'block', margin: '0 0 10px', maxWidth: '100%' }
const carName = { fontSize: '16px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 4px' }
const carPrice = { fontSize: '15px', color: '#334155', margin: '0 0 14px' }
const box = { backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px 18px', margin: '24px 0 24px' }
const boxLine = { fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0' }
const button = { backgroundColor: '#0a7a3b', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '8px', padding: '12px 24px', textDecoration: 'none' }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }
