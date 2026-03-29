/**
 * Branded James Blond Rentals email HTML wrapper.
 * Pass the inner body HTML; returns a fully branded email.
 */

const LOGO_URL = 'https://www.jamesblond.co.nz/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png';
const PRIMARY = '#0d6b3d';
const SECONDARY = '#002147';

export function brandedEmailHtml(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:${SECONDARY};padding:24px 32px;text-align:center;">
              <img src="${LOGO_URL}" alt="James Blond Rentals" width="180" style="max-width:180px;height:auto;" />
            </td>
          </tr>
          <!-- Title Bar -->
          <tr>
            <td style="background-color:${PRIMARY};padding:16px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${title}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#333333;font-size:14px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${SECONDARY};padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#ffffff;font-size:13px;font-weight:bold;">James Blond Rentals</p>
              <p style="margin:0 0 4px;color:#cccccc;font-size:12px;">Tel: 0800 505 007 | Email: info@jamesblond.co.nz</p>
              <p style="margin:0 0 4px;color:#cccccc;font-size:12px;">Auckland • Wellington • Christchurch</p>
              <p style="margin:8px 0 0;color:#999999;font-size:11px;">
                <a href="https://www.jamesblond.co.nz" style="color:${PRIMARY};text-decoration:none;">www.jamesblond.co.nz</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
