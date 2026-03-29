/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface RentalAgreementLinkProps {
  customerName?: string
  reservationRef?: string
  agreementUrl?: string
}

const RentalAgreementLinkEmail = ({ customerName, reservationRef, agreementUrl }: RentalAgreementLinkProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your rental agreement is ready to sign - {reservationRef || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your Rental Agreement</Heading>
        <Text style={text}>
          Hi {customerName || 'there'},
        </Text>
        <Text style={text}>
          Your rental agreement for reservation <strong>{reservationRef || ''}</strong> is ready to be signed.
          Please click the button below to review and sign your agreement:
        </Text>
        <Button style={button} href={agreementUrl || '#'}>
          Sign Your Agreement
        </Button>
        <Text style={smallText}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        <Link href={agreementUrl || '#'} style={link}>{agreementUrl || ''}</Link>
        <Hr style={hr} />
        <Text style={footer}>
          James Blond Car Rentals · 0800 525 663 · info@jamesblond.co.nz
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RentalAgreementLinkEmail,
  subject: (data: Record<string, any>) => `James Blond Car Rentals - Sign Your Rental Agreement (${data.reservationRef || ''})`,
  displayName: 'Rental agreement link',
  previewData: { customerName: 'Jane Smith', reservationRef: 'RES-12345', agreementUrl: 'https://jamesblond.co.nz/admin/rental-agreement?reservationref=RES-12345' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 20px' }
const button = { backgroundColor: '#0a7a3b', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const smallText = { fontSize: '12px', color: '#94a3b8', margin: '20px 0 4px' }
const link = { fontSize: '12px', color: '#0a7a3b', wordBreak: 'break-all' as const }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }
