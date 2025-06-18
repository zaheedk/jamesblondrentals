
interface EmailTemplateProps {
  title: string
  children: React.ReactNode
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ title, children }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #007bff;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>James Blond Car Rentals</h1>
      </div>
      <div class="content">
        ${children}
      </div>
      <div class="footer">
        <p>James Blond Car Rentals<br>
        4004 Great North Road, Glen Eden, Auckland 0602<br>
        Phone: 0800 525 663 | Email: info@jamesblond.co.nz</p>
      </div>
    </body>
    </html>
  `;
}
