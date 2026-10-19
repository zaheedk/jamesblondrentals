export const LOGIN_URL = 'https://www.jamesblond.co.nz/login'
export const ACTIVATION_URL = 'https://www.jamesblond.co.nz/reset-password'

// Customer-facing activation link: always on www.jamesblond.co.nz, never the auth provider domain.
// The reset page verifies the token_hash with the auth client (verifyOtp).
export function pickupActivationUrl(tokenHash: string) {
  return `${ACTIVATION_URL}?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`
}

// Resolve lazily after claiming a send; reuse the same one-time link across channels.
export function pickupAccountLink(activated: boolean, generateActivation: () => Promise<string | undefined>) {
  let pending: Promise<string> | undefined
  return () => {
    if (activated) return Promise.resolve(LOGIN_URL)
    pending ??= generateActivation().then(link => {
      if (!link) throw new Error('Could not create account activation link; reminder not sent')
      return link
    })
    return pending
  }
}
