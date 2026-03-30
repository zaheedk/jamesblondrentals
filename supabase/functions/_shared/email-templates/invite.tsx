/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thank you for your booking with James Blond Rentals – activate your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img
            src="https://jlwvqbrtdzwrcwelyylv.supabase.co/storage/v1/object/public/blog-images/jb-logo.png"
            width="160"
            height="auto"
            alt="James Blond Rentals"
            style={{ margin: '0 auto' }}
          />
        </Section>

        <Hr style={divider} />

        <Heading style={h1}>Thank You for Your Booking!</Heading>

        <Text style={text}>
          We appreciate you choosing James Blond Rentals for your vehicle hire. To make your experience even better, we've created an account for you on our website.
        </Text>

        <Text style={text}>
          By activating your account, you'll be able to:
        </Text>

        <Text style={listItem}>✓ View and manage your bookings</Text>
        <Text style={listItem}>✓ Speed up future reservations with saved details</Text>
        <Text style={listItem}>✓ Access your rental history anytime</Text>

        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Activate My Account
          </Button>
        </Section>

        <Text style={smallText}>
          You can also sign in with Google if your email is linked to a Google account.
        </Text>

        <Hr style={divider} />

        <Text style={footer}>
          If you didn't make a booking with us, you can safely ignore this email.
        </Text>
        <Text style={footer}>
          James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz
        </Text>
        <Text style={footer}>
          129 Andrew Baxter Drive, Māngere, Auckland 2022
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = {
  backgroundColor: '#f4f7f6',
  fontFamily: "'Segoe UI', Arial, sans-serif",
}
const container = {
  backgroundColor: '#ffffff',
  maxWidth: '560px',
  margin: '40px auto',
  borderRadius: '8px',
  overflow: 'hidden' as const,
}
const headerSection = {
  backgroundColor: '#002147',
  padding: '24px 30px',
  textAlign: 'center' as const,
}
const divider = {
  borderColor: '#e2e8f0',
  margin: '0',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#002147',
  margin: '24px 30px 16px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 30px 16px',
}
const listItem = {
  fontSize: '15px',
  color: '#0d6b3d',
  lineHeight: '1.6',
  margin: '4px 30px 4px 40px',
  fontWeight: '600' as const,
}
const buttonSection = {
  textAlign: 'center' as const,
  margin: '24px 30px',
}
const button = {
  backgroundColor: '#0d6b3d',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 32px',
  textDecoration: 'none',
}
const smallText = {
  fontSize: '13px',
  color: '#64748b',
  lineHeight: '1.5',
  margin: '0 30px 24px',
  textAlign: 'center' as const,
}
const footer = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '12px 30px 0',
  textAlign: 'center' as const,
}
