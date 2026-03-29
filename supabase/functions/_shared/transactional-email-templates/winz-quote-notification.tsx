/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface WinzQuoteProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  winzClientNumber?: string
  vehicleType?: string
  pickupDate?: string
  returnDate?: string
  pickupLocation?: string
  returnLocation?: string
  additionalRequirements?: string
}

const WinzQuoteNotificationEmail = (props: WinzQuoteProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>WINZ Quote Request from {props.firstName || ''} {props.lastName || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New WINZ Quote Request</Heading>

        <Section style={sectionBox}>
          <Text style={sectionTitle}>Customer Information</Text>
          <Text style={value}><strong>Name:</strong> {props.firstName} {props.lastName}</Text>
          <Text style={value}><strong>Email:</strong> {props.email}</Text>
          <Text style={value}><strong>Phone:</strong> {props.phone}</Text>
          <Text style={value}><strong>WINZ Client Number:</strong> {props.winzClientNumber}</Text>
        </Section>

        <Section style={sectionBoxBlue}>
          <Text style={sectionTitle}>Rental Details</Text>
          <Text style={value}><strong>Vehicle Type:</strong> {props.vehicleType}</Text>
          <Text style={value}><strong>Pickup Date:</strong> {props.pickupDate}</Text>
          <Text style={value}><strong>Return Date:</strong> {props.returnDate}</Text>
          <Text style={value}><strong>From:</strong> {props.pickupLocation}</Text>
          <Text style={value}><strong>To:</strong> {props.returnLocation}</Text>
        </Section>

        {props.additionalRequirements ? (
          <Section style={sectionBoxOrange}>
            <Text style={sectionTitle}>Additional Requirements</Text>
            <Text style={value}>{props.additionalRequirements}</Text>
          </Section>
        ) : null}

        <Section style={sectionBoxGreen}>
          <Text style={sectionTitle}>Quote Includes</Text>
          <Text style={value}>• Best Insurance for vehicles</Text>
          <Text style={value}>• Comprehensive Insurance for trailers</Text>
          <Text style={value}>• $1000 bond for vehicle or trailer hire</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>Submitted via the WINZ Quote form on jamesblond.co.nz</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WinzQuoteNotificationEmail,
  subject: (data: Record<string, any>) => `WINZ Quote Request: ${data.firstName || ''} ${data.lastName || ''} - ${data.winzClientNumber || ''}`,
  to: 'info@jamesblond.co.nz',
  displayName: 'WINZ quote notification',
  previewData: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '021 987 6543', winzClientNumber: '123456789', vehicleType: 'Van', pickupDate: '2025-02-01', returnDate: '2025-02-08', pickupLocation: '123 Queen St, Auckland', returnLocation: '456 High St, Auckland' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 20px' }
const sectionBox = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '0 0 16px' }
const sectionBoxBlue = { backgroundColor: '#f0f8ff', padding: '16px 20px', borderRadius: '8px', margin: '0 0 16px' }
const sectionBoxOrange = { backgroundColor: '#fff8f0', padding: '16px 20px', borderRadius: '8px', margin: '0 0 16px' }
const sectionBoxGreen = { backgroundColor: '#e8f5e8', padding: '16px 20px', borderRadius: '8px', margin: '0 0 16px' }
const sectionTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 8px' }
const value = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 6px' }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' as const, margin: '0' }
