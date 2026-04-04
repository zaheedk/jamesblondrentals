import jsPDF from "jspdf";

export interface DeclarationData {
  // Agency (To)
  agencyName: string;
  agencyAddress: string; // newline-separated

  // Infringement details
  vehicleRegistration: string;
  noticeNumber: string;
  offenceDate: string; // dd/MM/yyyy HH:mm format
  
  // Hirer details
  rentalAgreementNumber: string;
  driverName: string;
  driverAddress: string;
  driverDOB: string;
  driverLicenceNo: string;
  licenceIssuedIn: string;
  driverEmail: string;

  // Declarant
  declarantName: string;
  companyName: string;
  companyAddress: string;
  declarationDate: string; // formatted date string
}

export function generateDeclarationPDF(data: DeclarationData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 25;
  const rightMargin = pageWidth - 25;
  const labelX = 30;
  const valueX = 95;
  let y = 25;

  const addLine = (increment = 6) => { y += increment; };

  // From address
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("From:", leftMargin, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.companyName, leftMargin + 15, y);
  addLine();
  doc.setFont("helvetica", "normal");
  const companyLines = data.companyAddress.split("\n");
  companyLines.forEach((line) => {
    doc.text(line.trim(), leftMargin + 15, y);
    addLine(5);
  });

  addLine(4);

  // To address
  doc.text("To:", leftMargin, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.agencyName, leftMargin + 15, y);
  addLine();
  doc.setFont("helvetica", "normal");
  const agencyLines = data.agencyAddress.split("\n");
  agencyLines.forEach((line) => {
    doc.text(line.trim(), leftMargin + 15, y);
    addLine(5);
  });

  addLine(4);

  // Date
  doc.text("Date:", leftMargin, y);
  doc.text(data.declarationDate, leftMargin + 15, y);
  addLine(12);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("STATUTORY DECLARATION", pageWidth / 2, y, { align: "center" });
  addLine(12);

  // Clause 1
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const clause1 = `1.  I, ${data.declarantName} of ${data.companyAddress.split("\n").join(" ")}, from ${data.companyName} solemnly and sincerely declare that:`;
  const clause1Lines = doc.splitTextToSize(clause1, rightMargin - leftMargin - 5);
  doc.text(clause1Lines, leftMargin, y);
  y += clause1Lines.length * 5;
  addLine(2);

  const authText = `I am authorized representative of the following incorporated body who received notification of a moving/stationery vehicle offence: ${data.companyName}`;
  const authLines = doc.splitTextToSize(authText, rightMargin - leftMargin - 5);
  doc.text(authLines, leftMargin + 5, y);
  y += authLines.length * 5;
  addLine(6);

  // Clause 2
  doc.text("2.  The vehicle allegedly involved in the moving/stationery offence is", leftMargin, y);
  addLine(8);

  // Vehicle details table
  const drawRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, labelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, valueX, y);
    // Draw lines
    doc.setDrawColor(200);
    doc.line(labelX, y + 2, rightMargin - 10, y + 2);
    addLine(7);
  };

  drawRow("Vehicle Registration #:", data.vehicleRegistration);
  drawRow("The number of the relevant notice", data.noticeNumber);
  drawRow("The Date of the alleged offence", data.offenceDate);

  addLine(4);

  // Clause 3
  doc.text(
    "3.  At the time of the alleged offence the person lawfully entitled to the vehicle at the of the offence was:",
    leftMargin,
    y,
    { maxWidth: rightMargin - leftMargin - 5 }
  );
  addLine(10);

  drawRow("Rental Agreement #:", data.rentalAgreementNumber);
  drawRow("Driver's Name:", data.driverName);
  
  // Handle multi-line address
  doc.setFont("helvetica", "bold");
  doc.text("Address:", labelX, y);
  doc.setFont("helvetica", "normal");
  const addrLines = doc.splitTextToSize(data.driverAddress, rightMargin - valueX - 5);
  doc.text(addrLines, valueX, y);
  doc.setDrawColor(200);
  doc.line(labelX, y + (addrLines.length * 5) + 1, rightMargin - 10, y + (addrLines.length * 5) + 1);
  y += addrLines.length * 5 + 3;
  addLine(4);
  
  drawRow("Date of Birth:", data.driverDOB);
  drawRow("Licence No.:", data.driverLicenceNo);
  drawRow("Issued In:", data.licenceIssuedIn);
  drawRow("Email:", data.driverEmail);

  addLine(6);

  // Declaration text
  const declText =
    "And I make this solemn declaration conscientiously believing the same to be true by virtue of the Oaths and Declarations Act 1957.";
  const declLines = doc.splitTextToSize(declText, rightMargin - leftMargin - 5);
  doc.text(declLines, leftMargin, y);
  y += declLines.length * 5;
  addLine(10);

  // Declared line
  doc.text("Declared:", leftMargin + 5, y);
  doc.text(`Auckland this ${data.declarationDate}`, valueX, y);
  addLine(7);

  doc.text("Declarant:", leftMargin + 5, y);
  doc.text(data.declarantName, valueX, y);
  addLine(12);

  // Signature lines
  doc.text("Signature", leftMargin + 5, y);
  doc.text("……………………………………………………..", valueX, y);
  addLine(12);

  doc.text("Witness:", leftMargin + 5, y);
  doc.text("……………………………………………………..", valueX, y);
  addLine(7);

  doc.text("Occupation:", leftMargin + 5, y);
  addLine(7);

  doc.setFont("helvetica", "bold");
  doc.text("Signature:", leftMargin + 5, y);
  doc.setFont("helvetica", "normal");
  doc.text("……………………………………………………..", valueX, y);
  addLine(7);

  doc.text(`Declared at Auckland this day of ${data.declarationDate}`, leftMargin + 5, y);

  return doc;
}
