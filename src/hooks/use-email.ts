
import { supabase } from '@/lib/supabase-client'

export interface EmailData {
  to: string
  subject: string
  html: string
  type: 'signup' | 'password-reset' | 'booking-confirmation' | 'general' | 'winz-quote'
}

export const useEmail = () => {
  const sendEmail = async (emailData: EmailData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      })

      if (error) {
        console.error('Error invoking email function:', error)
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  const sendSignupWelcomeEmail = async (email: string, userName?: string) => {
    const html = `
      <h2>Welcome to James Blond Car Rentals!</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Thank you for creating an account with James Blond Car Rentals. We're excited to help you with your vehicle rental needs.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our fleet of vehicles</li>
        <li>Make online bookings</li>
        <li>Manage your reservations</li>
        <li>View your booking history</li>
      </ul>
      <p>If you have any questions, please don't hesitate to contact us at info@jamesblond.co.nz or call 0800 525 663.</p>
      <p>Best regards,<br>The James Blond Team</p>
    `

    return sendEmail({
      to: email,
      subject: 'Welcome to James Blond Car Rentals!',
      html,
      type: 'signup'
    })
  }

  const sendPasswordResetEmail = async (email: string, resetLink: string) => {
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi there,</p>
      <p>You recently requested to reset your password for your James Blond Car Rentals account.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>This link will expire in 24 hours for security reasons.</p>
      <p>Best regards,<br>The James Blond Team</p>
    `

    return sendEmail({
      to: email,
      subject: 'Reset Your Password - James Blond Car Rentals',
      html,
      type: 'password-reset'
    })
  }

  const sendBookingConfirmationEmail = async (email: string, bookingDetails: any) => {
    const html = `
      <h2>Booking Confirmation</h2>
      <p>Hi there,</p>
      <p>Thank you for your booking with James Blond Car Rentals!</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Vehicle: ${bookingDetails.vehicle}</li>
        <li>Pickup Date: ${bookingDetails.pickupDate}</li>
        <li>Return Date: ${bookingDetails.returnDate}</li>
        <li>Pickup Location: ${bookingDetails.pickupLocation}</li>
        <li>Total Cost: $${bookingDetails.totalCost}</li>
      </ul>
      <p>We'll send you further details closer to your pickup date.</p>
      <p>If you need to make any changes or have questions, please contact us at info@jamesblond.co.nz or call 0800 525 663.</p>
      <p>Best regards,<br>The James Blond Team</p>
    `

    return sendEmail({
      to: email,
      subject: 'Booking Confirmation - James Blond Car Rentals',
      html,
      type: 'booking-confirmation'
    })
  }

  return {
    sendEmail,
    sendSignupWelcomeEmail,
    sendPasswordResetEmail,
    sendBookingConfirmationEmail
  }
}
