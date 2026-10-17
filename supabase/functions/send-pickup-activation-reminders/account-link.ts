export const LOGIN_URL = 'https://www.jamesblond.co.nz/login'
export const ACTIVATION_REDIRECT_URL = 'https://www.jamesblond.co.nz/reset-password'

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