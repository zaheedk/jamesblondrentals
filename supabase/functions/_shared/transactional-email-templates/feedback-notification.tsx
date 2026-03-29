/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface FeedbackProps {
  rating?: number
  customerName?: string
  customerEmail?: string
  bookingReference?: string
  suggestions?: string
  feedbackId?: string
}

const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

const FeedbackNotificationEmail = (props: FeedbackProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New feedback received - Rating: {props.rating || 0}/5</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Booking Experience Feedback</Heading>
        <Text style={ratingStyle}>{stars(props.rating || 0)} {props.rating}/5</Text>

        <Section style={detailsBox}>
          <Text style={value}><strong>Customer:</strong> {props.customerName || 'N/A'}</Text>
          <Text style={value}><strong>Email:</strong> {props.customerEmail || 'N/A'}</Text>
          <Text style={value}><strong>Booking Ref:</strong> {props.bookingReference || 'N/A'}</Text>
        </Section>

        {props.suggestions ? (
          <>
            <Text style={label}>Suggestions</Text>
            <Text style={messageText}>{props.suggestions}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>Feedback ID: {props.feedbackId || 'N/A'}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: FeedbackNotificationEmail,
  subject: (data: Record<string, any>) => `Booking Experience Feedback - Rating: ${data.rating || 0}/5`,
  to: 'zaheed@jamesblond.co.nz',
  displayName: 'Feedback notification',
  previewData: { rating: 4, customerName: 'John Smith', customerEmail: 'john@example.com', bookingReference: 'BK20250101-ABC123', suggestions: 'Great service, very friendly staff!', feedbackId: 'fb-001' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#002244', margin: '0 0 12px' }
const ratingStyle = { fontSize: '24px', color: '#f59e0b', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '0 0 20px' }
const label = { fontSize: '12px', fontWeight: 'bold' as const, color: '#64748b', textTransform: 'uppercase' as const, margin: '0 0 4px', letterSpacing: '0.5px' }
const value = { fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 6px' }
const messageText = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '4px 0 20px', whiteSpace: 'pre-wrap' as const }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '0' }
