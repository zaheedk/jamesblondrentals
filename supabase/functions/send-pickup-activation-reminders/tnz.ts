const TNZ_URL = 'https://api.tnz.co.nz/api/v3.00'

export function pickupSms(name: string, date: string, time: string) {
  return `James Blond Rentals: Hi ${name || 'there'}, pick-up tomorrow (${date}${time ? ` ${time}` : ''}). Add your licence & details for a faster pick-up: https://www.jamesblond.co.nz/login?activate=1 (check your email). Call 0800 525 663. Reply STOP to opt out.`
}

export async function sendTnzSms(token: string, to: string, message: string, fetcher: typeof fetch = fetch): Promise<string> {
  if (!/^\+642\d{7,9}$/.test(to)) throw new Error('Invalid NZ mobile')
  const response = await fetcher(`${TNZ_URL}/sms`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    // Omit FromNumber: TNZ supplies its NZ short code, not a fabricated brand sender.
    body: JSON.stringify({ Destination: to, Message: message, Reference: 'James Blond pickup activation', SMSEmailReply: 'info@jamesblond.co.nz' }),
    signal: AbortSignal.timeout(20000),
  })
  const raw = await response.text()
  console.log(`TNZ SMS response [${response.status}]: ${raw.slice(0, 500)}`)
  if (!response.ok) throw new Error(`TNZ text submission failed [${response.status}]; check TNZ account settings`)
  let data: { Result?: string; MessageID?: string } = {}
  try { data = JSON.parse(raw) } catch { /* handled below */ }
  if (data.Result === 'Failed' || typeof data.MessageID !== 'string' || !data.MessageID) {
    throw new Error('TNZ did not confirm text submission; check TNZ message results')
  }
  return data.MessageID
}

export async function tnzSmsStatus(token: string, id: string) {
  const response = await fetch(`${TNZ_URL}/sms/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`TNZ status lookup failed [${response.status}]`)
  const data = await response.json()
  return { success: data.Success ?? 0, failed: data.Failed ?? 0, pending: data.Pending ?? 0,
    recipients: Array.isArray(data.Recipients) ? data.Recipients.map((r: { Status?: string }) => ({ status: r.Status })) : [] }
}