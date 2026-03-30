import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { Helmet } from "react-helmet-async";
import { rcmApi } from "@/lib/api/rcm-api";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Search, FileText, CheckCircle, Download, ShieldCheck, Camera, X, ImageIcon, Send, Upload, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import VehicleCamera from "@/components/VehicleCamera";
import type { RCMBookingInfoResponse } from "@/lib/api/rcm-api-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const parseMoneyValue = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const RentalAgreement = () => {
  const [searchParams] = useSearchParams();
  const [reservationRef, setReservationRef] = useState(searchParams.get("ref") || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);
  const [existingAdditionalSig, setExistingAdditionalSig] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<RCMBookingInfoResponse["results"] | null>(null);
  const [kmsOut, setKmsOut] = useState("");
  const [kmsIn, setKmsIn] = useState("");
  const [fuelOut, setFuelOut] = useState("");
  const [fuelIn, setFuelIn] = useState("");
  const [vehicleRego, setVehicleRego] = useState("");
  const hirerSigRef = useRef<SignatureCanvas>(null);
  const additionalDriverSigRef = useRef<SignatureCanvas>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [vehiclePhotos, setVehiclePhotos] = useState<{ url: string; name: string }[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState<{ url: string; name: string }[]>([]);
  const [resending, setResending] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [hiddenPhotos, setHiddenPhotos] = useState<string[]>([]);
  const [photoToDelete, setPhotoToDelete] = useState<{ url: string; name: string; source: 'existing' | 'uploaded' } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if current user is admin using the security definer function
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Admin check - session user:", session?.user?.email);
        if (session?.user) {
          // Use the is_admin_user() function which is a security definer
          const { data, error } = await supabase.rpc("is_admin_user");
          console.log("Admin check - is_admin_user result:", data, "error:", error);
          setIsAdmin(data === true);
        } else {
          console.log("Admin check - no session found");
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Admin check error:", err);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (searchParams.get("ref")) {
      fetchBookingInfo();
    }
  }, []);

  const fetchBookingInfo = async () => {
    if (!reservationRef.trim()) {
      toast.error("Please enter a reservation reference");
      return;
    }
    setLoading(true);
    setSaved(false);
    setAlreadySigned(false);
    setExistingSignature(null);
    setExistingAdditionalSig(null);
    setSignedAt(null);
    setPdfUrl(null);
    try {
      // Check if agreement already exists in Supabase
      const { data: existingAgreements } = await supabase
        .from("rental_agreements" as any)
        .select("*")
        .eq("reservation_ref", reservationRef.trim())
        .not("hirer_signature", "is", null);

      if (existingAgreements && (existingAgreements as any[]).length > 0) {
        const existing = (existingAgreements as any[])[0];
        setAlreadySigned(true);
        setSaved(true);
        setExistingSignature(existing.hirer_signature);
        setExistingAdditionalSig(existing.additional_driver_signature);
        setSignedAt(existing.signed_at);
      }

      // Load existing vehicle photos from storage (always, even without signature)
      await loadExistingPhotos(reservationRef.trim());

      const response = await rcmApi.getBookingInfoByReference(reservationRef.trim());
      if (response.status === "OK" && response.results) {
        console.log("RCM API full response:", JSON.stringify(response.results, null, 2));
        console.log("bookinginfo[0] keys:", Object.keys(response.results.bookinginfo?.[0] || {}));
        console.log("vehiclerego:", response.results.bookinginfo?.[0]?.vehiclerego);
        console.log("fueltype:", response.results.bookinginfo?.[0]?.fueltype);
        setBookingData(response.results);
        // Pre-fill fields from API data
        const booking = response.results.bookinginfo?.[0];
        if (booking) {
          setKmsOut(String(booking.kmsout || ""));
          setKmsIn(String(booking.kmsin || ""));
          setFuelOut(booking.fuelout || "");
          setFuelIn(booking.fuelin || "");
          setVehicleRego(booking.vehicle_registrationnumber || booking.vehiclerego || "");
        }
        toast.success("Booking data loaded");
      } else {
        toast.error(response.error || "Failed to fetch booking info");
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
      toast.error("Failed to fetch booking data. Please check the reservation reference.");
    } finally {
      setLoading(false);
    }
  };

  const convertImagesToDataUrls = async (container: HTMLElement) => {
    const images = container.querySelectorAll("img");
    const originalSrcs: { img: HTMLImageElement; src: string }[] = [];
    await Promise.all(
      Array.from(images).map(async (img) => {
        if (img.src && (img.src.startsWith("http://") || img.src.startsWith("https://"))) {
          try {
            // Fetch the image as a blob to avoid CORS canvas tainting
            const response = await fetch(img.src, { mode: "cors" });
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            originalSrcs.push({ img, src: img.src });
            img.src = dataUrl;
          } catch (e) {
            console.warn("Could not convert image to data URL:", img.src, e);
          }
        }
      })
    );
    return originalSrcs;
  };

  const generatePdf = async (): Promise<Blob | null> => {
    const element = document.getElementById("rental-agreement");
    if (!element) return null;

    const ignoreEls = Array.from(element.querySelectorAll("[data-html2canvas-ignore]")) as HTMLElement[];
    let originalSrcs: { img: HTMLImageElement; src: string }[] = [];

    try {
      originalSrcs = await convertImagesToDataUrls(element);
      ignoreEls.forEach((el) => {
        el.dataset.originalDisplay = el.style.display;
        el.style.display = "none";
      });

      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const SIDE_MARGIN_MM = 10;
      const TOP_MARGIN_MM = 10;
      const BOTTOM_MARGIN_MM = 10;
      const CONTENT_WIDTH_MM = A4_WIDTH_MM - SIDE_MARGIN_MM * 2;
      const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - TOP_MARGIN_MM - BOTTOM_MARGIN_MM;
      const SECTION_GAP_MM = 2;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const sections = Array.from(element.querySelectorAll("[data-pdf-section]")) as HTMLElement[];

      let currentY = TOP_MARGIN_MM;

      const addCanvasSlice = (
        sourceCanvas: HTMLCanvasElement,
        sliceStartPx: number,
        sliceHeightPx: number,
        yMM: number,
      ) => {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = sourceCanvas.width;
        sliceCanvas.height = Math.max(1, Math.floor(sliceHeightPx));

        const ctx = sliceCanvas.getContext("2d");
        if (!ctx) throw new Error("Unable to prepare PDF page slice");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          sourceCanvas,
          0,
          sliceStartPx,
          sourceCanvas.width,
          sliceCanvas.height,
          0,
          0,
          sourceCanvas.width,
          sliceCanvas.height,
        );

        const sliceHeightMM = (sliceCanvas.height / sliceCanvas.width) * CONTENT_WIDTH_MM;
        pdf.addImage(
          sliceCanvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          SIDE_MARGIN_MM,
          yMM,
          CONTENT_WIDTH_MM,
          sliceHeightMM,
        );

        return sliceHeightMM;
      };

      for (const section of sections) {
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: true,
        });

        const sectionHeightMM = (canvas.height / canvas.width) * CONTENT_WIDTH_MM;
        const allowSplit = section.dataset.pdfSplittable === "true";
        const remainingSpaceMM = A4_HEIGHT_MM - BOTTOM_MARGIN_MM - currentY;

        if (sectionHeightMM <= remainingSpaceMM) {
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            SIDE_MARGIN_MM,
            currentY,
            CONTENT_WIDTH_MM,
            sectionHeightMM,
          );
          currentY += sectionHeightMM + SECTION_GAP_MM;
          continue;
        }

        if (!allowSplit) {
          pdf.addPage();
          currentY = TOP_MARGIN_MM;
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            SIDE_MARGIN_MM,
            currentY,
            CONTENT_WIDTH_MM,
            sectionHeightMM,
          );
          currentY += sectionHeightMM + SECTION_GAP_MM;
          continue;
        }

        const pxPerMM = canvas.height / sectionHeightMM;
        let consumedPx = 0;

        while (consumedPx < canvas.height - 1) {
          const availableMM = A4_HEIGHT_MM - BOTTOM_MARGIN_MM - currentY;
          if (availableMM <= 1) {
            pdf.addPage();
            currentY = TOP_MARGIN_MM;
            continue;
          }

          const sliceHeightPx = Math.min(canvas.height - consumedPx, Math.floor(availableMM * pxPerMM));
          if (sliceHeightPx <= 0) break;

          const renderedHeightMM = addCanvasSlice(canvas, consumedPx, sliceHeightPx, currentY);
          consumedPx += sliceHeightPx;
          currentY += renderedHeightMM + SECTION_GAP_MM;

          if (consumedPx < canvas.height - 1) {
            pdf.addPage();
            currentY = TOP_MARGIN_MM;
          }
        }
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    } finally {
      ignoreEls.forEach((el) => {
        el.style.display = el.dataset.originalDisplay || "";
        delete el.dataset.originalDisplay;
      });
      originalSrcs.forEach(({ img, src }) => {
        img.src = src;
      });
    }
  };


  // Load existing photos from storage for a given reservation ref
  const loadExistingPhotos = async (ref: string) => {
    const { data: folders } = await supabase.storage
      .from("vehicle-photos")
      .list(ref, { limit: 100 });
    
    if (!folders || folders.length === 0) return;

    const allPhotos: { url: string; name: string }[] = [];

    for (const item of folders) {
      // Check if item is a folder (has no metadata/id typically) by listing inside it
      const { data: subFiles } = await supabase.storage
        .from("vehicle-photos")
        .list(`${ref}/${item.name}`, { limit: 100 });
      
      if (subFiles && subFiles.length > 0) {
        // It's a folder (rego subfolder)
        for (const f of subFiles) {
          if (f.name === '.emptyFolderPlaceholder') continue;
          const { data: urlData } = supabase.storage
            .from("vehicle-photos")
            .getPublicUrl(`${ref}/${item.name}/${f.name}`);
          allPhotos.push({ url: urlData.publicUrl, name: `${item.name}/${f.name}` });
        }
      } else if (item.id) {
        // It's a file directly in the ref folder (legacy)
        const { data: urlData } = supabase.storage
          .from("vehicle-photos")
          .getPublicUrl(`${ref}/${item.name}`);
        allPhotos.push({ url: urlData.publicUrl, name: item.name });
      }
    }
    
    if (allPhotos.length > 0) {
      setExistingPhotos(allPhotos);
    }
  };

  // Add date/time stamp overlay to a photo file using canvas
  const addTimestampToPhoto = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }

        ctx.drawImage(img, 0, 0);

        // Timestamp text
        const now = new Date();
        const stamp = now.toLocaleString("en-NZ", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        });

        const fontSize = Math.max(16, Math.floor(img.width / 40));
        ctx.font = `bold ${fontSize}px Arial`;
        const textWidth = ctx.measureText(stamp).width;
        const padding = 8;
        const x = img.width - textWidth - padding * 2;
        const y = img.height - padding * 2;

        // Semi-transparent background
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(x - padding, y - fontSize - padding, textWidth + padding * 2, fontSize + padding * 2);

        // White text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(stamp, x, y);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  };

  // Queue photos locally without uploading
  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPending: { file: File; previewUrl: string }[] = [];
    for (const file of Array.from(files)) {
      newPending.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    setPendingPhotos(prev => [...prev, ...newPending]);
    toast.success(`${newPending.length} photo(s) added`);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleCameraCapture = (file: File, previewUrl: string) => {
    setPendingPhotos(prev => [...prev, { file, previewUrl }]);
  };

  // Upload all pending photos at once with timestamp overlay
  const handleUploadAllPhotos = async () => {
    if (!pendingPhotos.length || !reservationRef.trim()) return;

    const rego = vehicleRego.trim() || "unknown-rego";

    setUploadingPhotos(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const pending of pendingPhotos) {
        // Add timestamp overlay
        const stampedFile = await addTimestampToPhoto(pending.file);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const filePath = `${reservationRef.trim()}/${rego}/${fileName}`;
        const { error } = await supabase.storage
          .from("vehicle-photos")
          .upload(filePath, stampedFile);

        if (!error) {
          const { data: urlData } = supabase.storage
            .from("vehicle-photos")
            .getPublicUrl(filePath);
          uploaded.push({ url: urlData.publicUrl, name: `${rego}/${fileName}` });
        } else {
          console.error("Error uploading photo:", error);
        }
      }
      setVehiclePhotos(prev => [...prev, ...uploaded]);
      // Revoke object URLs
      pendingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl));
      setPendingPhotos([]);
      toast.success(`${uploaded.length} photo(s) uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePendingPhoto = (index: number) => {
    setPendingPhotos(prev => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const confirmDeletePhoto = (photo: { url: string; name: string }, source: 'existing' | 'uploaded') => {
    setPhotoToDelete({ ...photo, source });
  };

  const handleDeletePhoto = () => {
    if (!photoToDelete) return;
    // Soft delete - just hide the photo, don't remove from storage
    setHiddenPhotos(prev => [...prev, photoToDelete.name]);
    if (photoToDelete.source === 'uploaded') {
      setVehiclePhotos(prev => prev.filter(p => p.name !== photoToDelete.name));
    } else {
      setExistingPhotos(prev => prev.filter(p => p.name !== photoToDelete.name));
    }
    setPhotoToDelete(null);
    toast.success("Photo deleted successfully");
  };

  const uploadPdfForEmail = async (pdfBlob: Blob, agreementRef: string) => {
    const safeRef = (agreementRef || reservationRef || "rental-agreement")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-");
    const fileName = `Rental-Agreement-${agreementRef}.pdf`;
    const filePath = `${safeRef}/${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("signed-agreements")
      .upload(filePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("signed-agreements")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate PDF download link");
    }

    return {
      fileName,
      publicUrl: publicUrlData.publicUrl,
    };
  };

  const sendAgreementEmail = async (
    customerEmail: string,
    customerData: any,
    bookingItem: any,
    pdfBlob: Blob
  ) => {
    const agreementRef = bookingItem?.reservationdocumentno || bookingItem?.reservationno || reservationRef;
    const vehicleName = bookingItem?.vehiclecategory || "Vehicle";
    const pickupDate = bookingItem?.pickupdate || "";
    const dropoffDate = bookingItem?.dropoffdate || "";
    const { fileName, publicUrl } = await uploadPdfForEmail(pdfBlob, agreementRef);

    console.log("Sending email with hosted PDF attachment:", publicUrl);

    const { data, error: emailError } = await supabase.functions.invoke('send-postmark-email', {
      body: {
        to: customerEmail,
        subject: `Your Signed Rental Agreement - ${agreementRef} | James Blond Rentals`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a365d; font-size: 24px;">James Blond Rentals</h1>
            <h2 style="color: #333; font-size: 18px;">Signed Rental Agreement Confirmation</h2>
            <p>Dear ${customerData?.firstname || 'Customer'},</p>
            <p>Thank you for signing your rental agreement. Please find your signed agreement attached as a PDF.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Agreement Ref:</td>
                <td style="padding: 8px;">${agreementRef}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Vehicle:</td>
                <td style="padding: 8px;">${vehicleName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Registration:</td>
                <td style="padding: 8px;">${vehicleRego || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Pickup:</td>
                <td style="padding: 8px;">${pickupDate} ${bookingItem?.pickuptime || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Return:</td>
                <td style="padding: 8px;">${dropoffDate} ${bookingItem?.dropofftime || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Total Cost:</td>
                <td style="padding: 8px;">$${Number(bookingItem?.totalcost || 0).toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: bold;">Signed By:</td>
                <td style="padding: 8px;">${customerData?.firstname} ${customerData?.lastname}</td>
              </tr>
            </table>
            <p style="color: #666; font-size: 13px;">This email confirms that the rental agreement has been electronically signed. A copy of the full terms and conditions was presented at the time of signing.</p>
            <p style="color: #666; font-size: 13px;">If you have any questions, please contact us at <a href="tel:0800525663">0800 525 663</a> or <a href="mailto:info@jamesblond.co.nz">info@jamesblond.co.nz</a>.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #999; font-size: 11px;">James Blond Rentals | GST: 140-174-963</p>
          </div>
        `,
        remoteAttachments: [
          {
            Name: fileName,
            Url: publicUrl,
            ContentType: "application/pdf"
          }
        ],
      },
    });

    if (emailError) throw emailError;
    if (data?.success === false) throw new Error(data.error || "Failed to send email");
    console.log("Email sent successfully, attachmentCount:", data?.attachmentCount);
    return data;
  };

  const handleResendEmail = async () => {
    if (!bookingData) return;
    const customerEmail = bookingData.customerinfo?.[0]?.email;
    if (!customerEmail) {
      toast.error("No customer email found");
      return;
    }

    setResending(true);
    try {
      toast.info("Generating PDF for email...");
      const pdfBlob = await generatePdf();
      if (!pdfBlob) throw new Error("Failed to generate PDF");

      await sendAgreementEmail(
        customerEmail,
        bookingData.customerinfo?.[0],
        bookingData.bookinginfo?.[0],
        pdfBlob
      );
      toast.success(`Signed agreement emailed to ${customerEmail}`);
    } catch (error: any) {
      console.error("Error resending agreement email:", error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setResending(false);
    }
  };

  const handleSave = async () => {
    if (!bookingData || alreadySigned) return;

    const hirerSignature = hirerSigRef.current?.isEmpty()
      ? null
      : hirerSigRef.current?.toDataURL("image/png");

    const additionalDriverSignature = additionalDriverSigRef.current?.isEmpty()
      ? null
      : additionalDriverSigRef.current?.toDataURL("image/png");

    if (!hirerSignature) {
      toast.error("Hirer signature is required");
      return;
    }

    setSaving(true);
    try {
      const customer = bookingData.customerinfo?.[0];
      const booking = bookingData.bookinginfo?.[0];
      const agreementRef = booking?.reservationdocumentno || booking?.reservationno || reservationRef;

      const { error } = await supabase.from("rental_agreements" as any).insert({
        reservation_ref: reservationRef,
        booking_data: bookingData as any,
        hirer_signature: hirerSignature,
        additional_driver_signature: additionalDriverSignature,
        signed_at: new Date().toISOString(),
        signed_by_name: customer ? `${customer.firstname} ${customer.lastname}` : "",
        kms_out: kmsOut,
        kms_in: kmsIn,
        fuel_out: fuelOut,
        fuel_in: fuelIn,
        vehicle_rego: vehicleRego,
      });

      if (error) throw error;
      setSaved(true);
      setAlreadySigned(true);
      setExistingSignature(hirerSignature);
      setExistingAdditionalSig(additionalDriverSignature);
      setSignedAt(new Date().toISOString());
      toast.success("Rental agreement saved successfully! You can now add photos and email the agreement.");
    } catch (error) {
      console.error("Error saving rental agreement:", error);
      toast.error("Failed to save rental agreement");
    } finally {
      setSaving(false);
    }
  };

  const booking = bookingData?.bookinginfo?.[0];
  const customer = bookingData?.customerinfo?.[0];
  const payments = bookingData?.paymentinfo;
  const extras = bookingData?.extrafees;
  const additionalDrivers = bookingData?.additionaldrivers;
  const extraDrivers = bookingData?.extradrivers;
  const allAdditionalDrivers = [
    ...(additionalDrivers || []),
    ...(extraDrivers || []),
  ];
  const rateInfo = bookingData?.rateinfo;
  const rentalDays = Math.max(1, parseMoneyValue(booking?.numberofdays) || 1);
  // Prefer rateinfo daily rate (after discount), fallback to bookinginfo dailyrate
  const rateInfoDailyRate = rateInfo?.[0]?.dailyrateafterdiscount ?? rateInfo?.[0]?.dailyratebeforediscount;
  const dailyRate = rateInfoDailyRate != null && rateInfoDailyRate > 0
    ? rateInfoDailyRate
    : parseMoneyValue(booking?.dailyrate);
  const insuranceAmount = parseMoneyValue(booking?.insuranceamount);
  const extrasTotal = (extras || []).reduce((sum, extra) => sum + parseMoneyValue(extra.fees), 0);
  const mandatoryFeesTotal = (booking?.mandatoryfees || []).reduce(
    (sum, fee) => sum + parseMoneyValue(fee.totalfeeamount ?? fee.amount),
    0
  );
  const totalCost = parseMoneyValue(booking?.totalcost);
  const totalRateAfterDiscount = parseMoneyValue(booking?.totalrateafterdiscount);
  // Sum rateinfo subtotals for multi-season rentals
  const rateInfoSubtotal = (rateInfo || []).reduce((sum, r) => sum + (r.ratesubtotal || 0), 0);
  const reconstructedRentalAmount = totalCost - insuranceAmount - extrasTotal - mandatoryFeesTotal;
  const rentalAmount = rateInfoSubtotal > 0
    ? rateInfoSubtotal
    : totalRateAfterDiscount > 0
    ? totalRateAfterDiscount
    : dailyRate > 0
      ? dailyRate * rentalDays
      : reconstructedRentalAmount > 0
        ? reconstructedRentalAmount
        : totalCost;

  return (
    <>
      <Helmet>
        <title>Rental Agreement | James Blond</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && !bookingData && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>{reservationRef ? "Unable to load this rental agreement. Please check the reservation reference." : "No reservation reference provided. Please use a valid rental agreement link."}</p>
              </CardContent>
            </Card>
          )}

          {!loading && bookingData && (
            <div className="bg-white shadow-none border-0" id="rental-agreement" style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif", color: "#1a1a1a" }}>
              <div className="px-8 md:px-10 py-6 md:py-8" style={{ fontSize: "11px", lineHeight: "1.45" }}>

              {/* Header */}
              <div data-pdf-section className="flex justify-between items-start pb-3 mb-4" style={{ borderBottom: "3px solid #0d6b3d" }}>
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png" 
                    alt="James Blond Rentals" 
                    style={{ height: "50px", width: "auto" }}
                  />
                  <div>
                    <div style={{ fontSize: "10px", color: "#555" }}>
                      {booking?.pickuplocationname || booking?.pickuplocation}
                    </div>
                    <div style={{ fontSize: "10px", color: "#555" }}>Tel: 0800 525 663 | info@jamesblond.co.nz</div>
                    <div style={{ fontSize: "10px", color: "#555" }}>GST: 140-174-963</div>
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#0d6b3d", letterSpacing: "-0.3px" }}>RENTAL AGREEMENT</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "2px" }}>
                    #{booking?.reservationdocumentno || booking?.reservationno || booking?.reservationref || reservationRef}
                  </div>
                </div>
              </div>

              {/* Hirer Details + Vehicle Details side by side */}
              <div data-pdf-section className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#0d6b3d", textTransform: "uppercase", marginBottom: "4px", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>Hirer's Details</div>
                  <table style={{ width: "100%", fontSize: "10.5px" }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", width: "80px", verticalAlign: "top" }}>Name:</td><td style={{ padding: "1px 0" }}>{customer?.firstname} {customer?.lastname}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>DOB:</td><td style={{ padding: "1px 0" }}>{customer?.dateofbirth}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Licence No:</td><td style={{ padding: "1px 0" }}>{customer?.licenseno}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Issued In:</td><td style={{ padding: "1px 0" }}>{customer?.licenseissued || customer?.country}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Expiry:</td><td style={{ padding: "1px 0" }}>{customer?.licenseexpires}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Phone:</td><td style={{ padding: "1px 0" }}>{customer?.phone || customer?.mobile}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Address:</td><td style={{ padding: "1px 0" }}>{[customer?.address, customer?.city, customer?.state, customer?.postcode].filter(Boolean).join(", ")}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Email:</td><td style={{ padding: "1px 0" }}>{customer?.email}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#0d6b3d", textTransform: "uppercase", marginBottom: "4px", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>Vehicle Details</div>
                  <table style={{ width: "100%", fontSize: "10.5px" }}>
                    <tbody>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", width: "80px", verticalAlign: "top" }}>Category:</td><td style={{ padding: "1px 0" }}>{booking?.vehiclecategory}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Description:</td><td style={{ padding: "1px 0" }}>{booking?.vehicledescription1}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Licence Plate:</td><td style={{ padding: "1px 0" }}>{vehicleRego || "N/A"}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Fuel Type:</td><td style={{ padding: "1px 0" }}>{booking?.fueltype || "N/A"}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Kms Out:</td><td style={{ padding: "1px 0" }}>{kmsOut || "N/A"}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Kms In:</td><td style={{ padding: "1px 0" }}>{kmsIn || "N/A"}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Fuel Out:</td><td style={{ padding: "1px 0" }}>{fuelOut || "N/A"}</td></tr>
                      <tr><td style={{ fontWeight: 600, padding: "1px 4px 1px 0", verticalAlign: "top" }}>Fuel In:</td><td style={{ padding: "1px 0" }}>{fuelIn || "N/A"}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rental Details */}
              <div data-pdf-section data-pdf-splittable="true" className="mb-4">
                <div className="grid grid-cols-3 gap-x-6" style={{ fontSize: "10.5px" }}>
                  <div><span style={{ fontWeight: 600 }}>Pickup:</span> {booking?.pickupdate} {booking?.pickuptime}</div>
                  <div><span style={{ fontWeight: 600 }}>Return:</span> {booking?.dropoffdate} {booking?.dropofftime}</div>
                  <div><span style={{ fontWeight: 600 }}>Days:</span> {booking?.numberofdays}</div>
                  <div><span style={{ fontWeight: 600 }}>Pickup Location:</span> {booking?.pickuplocationname || booking?.pickuplocation}</div>
                  <div><span style={{ fontWeight: 600 }}>Return Location:</span> {booking?.dropofflocationname || booking?.dropofflocation}</div>
                  <div><span style={{ fontWeight: 600 }}>Daily Rate:</span> ${Number(booking?.dailyrate || 0).toFixed(2)}</div>
                </div>
              </div>

              {/* Rates & Fees */}
              <div data-pdf-section className="mb-4">
                <table style={{ width: "100%", fontSize: "10.5px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #999" }}>
                      <th style={{ textAlign: "left", padding: "3px 0", fontWeight: 600 }}>Item</th>
                      <th style={{ textAlign: "right", padding: "3px 0", fontWeight: 600 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                      <td style={{ padding: "2px 0" }}>Vehicle Rental ({rentalDays} days × ${dailyRate.toFixed(2)})</td>
                      <td style={{ textAlign: "right", padding: "2px 0" }}>${rentalAmount.toFixed(2)}</td>
                    </tr>
                    {booking?.insuranceoption && (
                      <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                        <td style={{ padding: "2px 0" }}>{booking.insuranceoption}</td>
                        <td style={{ textAlign: "right", padding: "2px 0" }}>${Number(booking?.insuranceamount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                    {extras?.map((extra, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #e5e5e5" }}>
                        <td style={{ padding: "2px 0" }}>{extra.name}</td>
                        <td style={{ textAlign: "right", padding: "2px 0" }}>${Number(extra.fees || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {booking?.mandatoryfees?.map((fee, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #e5e5e5" }}>
                        <td style={{ padding: "2px 0" }}>{fee.name || "Mandatory Fee"}</td>
                        <td style={{ textAlign: "right", padding: "2px 0" }}>${Number(fee.totalfeeamount || fee.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: "2px solid #333" }}>
                      <td style={{ padding: "3px 0", fontWeight: 700 }}>Total</td>
                      <td style={{ textAlign: "right", padding: "3px 0", fontWeight: 700 }}>${Number(booking?.totalcost || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Details */}
              {payments && payments.length > 0 && (
                <div data-pdf-section className="mb-4">
                  <table style={{ width: "100%", fontSize: "10.5px", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1.5px solid #999" }}>
                        <th style={{ textAlign: "left", padding: "3px 0", fontWeight: 600 }}>Date</th>
                        <th style={{ textAlign: "left", padding: "3px 0", fontWeight: 600 }}>Method</th>
                        <th style={{ textAlign: "left", padding: "3px 0", fontWeight: 600 }}>Details</th>
                        <th style={{ textAlign: "right", padding: "3px 0", fontWeight: 600 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #e5e5e5" }}>
                          <td style={{ padding: "2px 0" }}>{payment.paymentdate}</td>
                          <td style={{ padding: "2px 0" }}>{payment.paymenttype || payment.paymentmethod || ""}</td>
                          <td style={{ padding: "2px 0" }}>{payment.paysource || payment.paymentdetails || ""}</td>
                          <td style={{ textAlign: "right", padding: "2px 0" }}>${Number(payment.paidamount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ textAlign: "right", fontWeight: 700, marginTop: "3px", fontSize: "11px" }}>
                    Balance Due: ${Number(booking?.balancedue || 0).toFixed(2)}
                  </div>
                </div>
              )}

              {/* Additional Drivers */}
              {allAdditionalDrivers.length > 0 && (
                <div data-pdf-section className="mb-4">
                  {allAdditionalDrivers.map((driver, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-x-4" style={{ fontSize: "10.5px", marginBottom: "2px" }}>
                      <div><span style={{ fontWeight: 600 }}>Name:</span> {driver.firstname} {driver.lastname}</div>
                      <div><span style={{ fontWeight: 600 }}>DOB:</span> {driver.dateofbirth}</div>
                      <div><span style={{ fontWeight: 600 }}>Licence:</span> {driver.licenseno}</div>
                      <div><span style={{ fontWeight: 600 }}>Expiry:</span> {driver.licenseexpires}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Terms & Conditions */}
              <div data-pdf-section className="mb-4">
                <div style={{ fontSize: "8.5px", lineHeight: "1.35", color: "#333", columnCount: 2, columnGap: "20px" }}>
                  <p style={{ fontWeight: 600, marginBottom: "3px" }}>
                    SUBJECT TO FOLLOWING TERMS AND CONDITIONS
                  </p>
                  <p style={{ marginBottom: "3px" }}>
                    Subject to the terms & conditions contained on the front and reverse hereof of which the hirer(s) acknowledges that they are aware, the hirer agrees to rent the above vehicle and elects to pay all amounts payable under this agreement by the method of payment of which details are given on this document. By signing this contract, you hereby agree to these terms and authorise Kanthawala Ltd charging your credit card for the rental, the bond and any additional costs incurred.
                  </p>

                  <p style={{ marginBottom: "1px" }}><strong>1. ACCIDENTS</strong></p>
                  <p style={{ marginBottom: "3px" }}>Any accident must be reported within twenty four(24) hours and must be accompanied by a police report. Should the hirer(s) fail to comply with any conditions of this contract, all losses and damages suffered by the owner arising out of such failure shall be borne by and paid for by the hirer(s).</p>

                  <p style={{ marginBottom: "1px" }}><strong>2. TRAFFIC INFRINGEMENTS</strong></p>
                  <p style={{ marginBottom: "3px" }}>The Hirer(s) accept responsibility for all traffic violations infringements, including parking, speeding and lane violations and impound fees incurred during the rental. A $35 administration fee will apply for any fines received.</p>

                  <p style={{ marginBottom: "1px" }}><strong>3. HIRER(S) RESPONSIBILITY</strong></p>
                  <p style={{ marginBottom: "2px" }}>Maintaining water and oil levels is the hirer(s) responsibility. Any approved cost incurred will be reimbursed upon production of a receipt. Should any malfunction of the vehicle occur, any warning light or any sign of overheating, you must stop the vehicle immediately and contact James Blond or you will be held liable and loss of bond may occur.</p>
                  <p style={{ marginBottom: "2px" }}>Vehicles are provided with a full tank of fuel, and must be returned with full tank of fuel. If not, hirer is liable for Fuel cost plus $50.00 fee.</p>
                  <p style={{ marginBottom: "2px" }}>Vehicles are provided in a clean and tidy manner and should be returned in a similar state otherwise a cleaning fee of $200.00 will apply.</p>
                  <p style={{ marginBottom: "3px" }}>The hirer accepts that SMOKING and/or transporting ANIMALS in the vehicle is strictly PROHIBITED. Doing so will incur a strict $200.00 Fine.</p>

                  <p style={{ marginBottom: "1px" }}><strong>4. LATE RETURNS</strong></p>
                  <p style={{ marginBottom: "3px" }}>Will be charged for at the rate at $20.00 per hour for up to 3 hours late, after which full 24 hours rental will be charged, including the insurance fee. A non-compliance fee of $200 will be charged if returned late without prior approval of James Blond Rentals.</p>

                  <p style={{ marginBottom: "1px" }}><strong>5. PERSONS WHO MAY DRIVE VEHICLE</strong></p>
                  <p style={{ marginBottom: "3px" }}>The vehicle may be driven during the period of hire only by the persons described in this agreement and only if such person holds a current driver's license appropriate for the vehicle at the time when they are driving the vehicle. Non-compliance will result in a $200 fine.</p>

                  <p style={{ marginBottom: "1px" }}><strong>6. PAYMENTS BY HIRER</strong></p>
                  <p style={{ marginBottom: "3px" }}>The hirer shall pay to the owner as payment for the hire of the vehicle, accessories, insurance upgrade options, and any extra charges incurred for the period of hire the sum as specified in this agreement. In addition the hirer shall pay to the owner on termination of the hiring a distance charge at the rate referred to in this agreement. The total distance that the hirer may run the vehicle during the period of hire shall not exceed the number of kilometres specified in this agreement. The hirer shall also pay for fuel (but not oil) used in the vehicle during the period of hire.</p>

                  <p style={{ marginBottom: "1px" }}><strong>7. INSURANCE</strong></p>
                  <p style={{ marginBottom: "3px" }}>The hirer shall ensure that all reasonable care is taken in handling and parking the vehicle, and that it is left securely locked when not in use. The insurance excess will be determined by the insurance option taken by the customer prior to checkout.</p>

                  <p style={{ marginBottom: "1px" }}><strong>8. INDEMNITY</strong></p>
                  <p style={{ marginBottom: "2px" }}>Subject to the exclusions set out below, the hirer and any driver authorised to drive the vehicle is:</p>
                  <p style={{ marginBottom: "2px", paddingLeft: "8px" }}>(a) fully indemnified in respect of any liability he/she might have to the owner in respect of loss or of damage to the vehicle and any consequential loss of revenue or other expenses of the owner including towing and salvage costs associated with the recovery of the vehicle and its accessories and spare parts.</p>
                  <p style={{ marginBottom: "3px", paddingLeft: "8px" }}>(b) indemnified to the extent of $NZ250,000 in respect of any liability he/she might have for damage to any property (including injury to any animal) belonging to any other 3rd party person and arising out of the use of the vehicle.</p>

                  <p style={{ marginBottom: "1px" }}><strong>9. EXCLUSIONS</strong></p>
                  <p style={{ marginBottom: "2px" }}>The indemnities referred to above shall not apply where the damage, injury or loss arises when:</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(a) The driver of the vehicle is under the influence of alcohol, or any drug which affects his/her ability to drive the vehicle;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(b) The vehicle is in an unsafe or un-roadworthy condition that arose during the course of the hire and that caused or contributed to the damage or loss, and the hirer or the driver was aware or ought to have been aware of the unsafe or un-roadworthy condition of the vehicle;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(c) The vehicle is operated in any race, speed test, rally or contest;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(d) Any damage caused to the vehicle above the height of the windscreen or third party damage to property caused by the vehicle above this height is excluded from our cover and will be the responsibility of the hirer;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(e) The vehicle is driven by any person who at the time when he/she drives the vehicle is disqualified from holding or has never held a driver's license appropriate for that vehicle;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(f) The vehicle is damaged due to driver abuse or negligence, or is wilfully or recklessly damaged by the hirer or any other person named in this agreement, or driving the vehicle under the authority of the hirer, or is lost as a result of the wilful or reckless behaviour of the hirer or any such person; This includes but is not limited to burnt out clutch, overloading, incorrect fuel etc;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(g) The vehicle is operated on any of the following roads: Skipper's Canyon Queenstown; Ball Hut Access Mt Cook; Crown Range Queenstown; unsealed section of SH1 far north beyond Waitiki Landing; all beaches and off-road unsealed areas;</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(h) The vehicle is operated outside the term of hire or any agreed extension of that term.</p>
                  <p style={{ marginBottom: "3px", paddingLeft: "8px" }}>(i) Any insurance claim received by any other party after the termination of the hire where the hirer has not advised the company will be deemed to be a claim against the hirer.</p>
                  <p style={{ marginBottom: "3px" }}>It is agreed between the owner and hirer that Section 11 of the Insurance Law Reform Act 1977 shall apply with respect to the above exclusions as if this clause constituted a contract of insurance.</p>

                  <p style={{ marginBottom: "1px" }}><strong>10. OWNERS OBLIGATIONS</strong></p>
                  <p style={{ marginBottom: "3px" }}>The owner shall supply the vehicle in a safe & roadworthy condition & shall be responsible for all ordinary costs of running the vehicle during the term of the hire except to the extent that by the terms of this agreement those costs are payable by the hirer.</p>

                  <p style={{ marginBottom: "1px" }}><strong>11. MECHANICAL REPAIRS & ACCIDENTS</strong></p>
                  <p style={{ marginBottom: "3px" }}>If the vehicle is damaged or requires repair or salvage, because of an accident or breakdown, the hirer shall advise the owner of the full circumstances by telephone or email as soon as possible but no later than 24 hours after the accident.</p>

                  <p style={{ marginBottom: "1px" }}><strong>12. REPAIRS/SALVAGE</strong></p>
                  <p style={{ marginBottom: "3px" }}>The hirer shall not arrange or undertake any repairs or salvage without the authority of the owner except to the extent to the extent that the repairs or salvage are necessary to prevent further damage to the vehicle or to other property.</p>

                  <p style={{ marginBottom: "1px" }}><strong>13. TAMPERING</strong></p>
                  <p style={{ marginBottom: "3px" }}>The hirer shall ensure that no person shall interfere with the distance recorder or speedometer or, except in an emergency, any part of the engine, transmission, braking, electrical or suspension systems of the vehicle.</p>

                  <p style={{ marginBottom: "1px" }}><strong>14. PUNCTURES, TYRE DAMAGE, GLASS, LENSES & HEADLIGHT DAMAGE</strong></p>
                  <p style={{ marginBottom: "3px" }}>Are at the hirer's expense unless they have upgraded to an insurance option providing extra cover for this.</p>

                  <p style={{ marginBottom: "1px" }}><strong>15. USE OF THE VEHICLE</strong></p>
                  <p style={{ marginBottom: "2px" }}>The hirer shall not:</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(a) use or permit the vehicle to be used for the carriage of passengers for hire or reward unless the vehicle is hired with the knowledge of the owner for use in passenger service licensed under part VII of the Transport Act 1962 or exempted from licensing under that Act.</p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(b) sublet or hire the vehicle to any other person nor permit the vehicle to be operated outside his/her authority;</p>
                  <p style={{ marginBottom: "3px", paddingLeft: "8px" }}>(c) operate the vehicle, or permit it to be operated or driven.</p>

                  <p style={{ marginBottom: "1px" }}><strong>16. RETURN OF THE VEHICLE</strong></p>
                  <p style={{ marginBottom: "1px", paddingLeft: "8px" }}>(a) The hirer shall, at or before the expiry of the term of hire, deliver the vehicle to the owner's place of business or the owner's agent at the agent's place of business, or obtain the owner's consent to the continuation of hire.</p>
                  <p style={{ marginBottom: "3px", paddingLeft: "8px" }}>(b) Where a vehicle remains overdue and no contact has been made by the hirer and outstanding rental payments are due, James Blond Ltd will consider the vehicle as stolen and will take appropriate measures to recover their vehicle passing all associated costs to the hirer.</p>

                  <p style={{ marginBottom: "1px" }}><strong>17. IMMEDIATE RETURN OF VEHICLE WHERE DEFAULT OR DAMAGE</strong></p>
                  <p style={{ marginBottom: "3px" }}>The owner shall have the right to terminate the hiring and take immediate possession of the vehicle if the hirer fails to comply with any of the terms of this agreement or if the vehicle is damaged. The termination of the hiring under the authority of this clause shall be without prejudice to the other rights of the owner and the rights of the hirer under this agreement or otherwise.</p>

                  <p style={{ marginBottom: "1px" }}><strong>18. CANCELLATION FEES</strong></p>
                  <p style={{ marginBottom: "3px" }}>Under any circumstances, a minimum Cancellation fee of $50.00 will apply. A cancellation fee of 1 days hireage at the total daily rate will be incurred if the rental is cancelled 24-72 hours prior to pick up, and a fee of either $150 or 50% of the total rental whichever is the greater will be incurred in the event of cancellation within 24 hrs or if you fail to collect the car.</p>

                  <p style={{ marginBottom: "1px" }}><strong>19. DAMAGE REPAIRS/REMEDIATION</strong></p>
                  <p style={{ marginBottom: "3px" }}>The owner will arrange for any repairs at his discretion with a repair agent/provider of his choosing.</p>

                  <div style={{ borderTop: "1px solid #999", marginTop: "4px", paddingTop: "4px" }}>
                    <p style={{ fontWeight: 600, marginBottom: "2px" }}>NOTE TO THE HIRER</p>
                    <p style={{ marginBottom: "2px" }}>The owner must give you at least one copy of this agreement. A copy must be kept in the vehicle throughout the term of the hire and produced on demand by any Police Officer, Traffic Officer or any other authorised employee of the Land Safety Transport Authority. Vehicle may be fitted and monitored with GPS Tracking Technology.</p>
                    <p>Please note that unless prior credit terms have been agreed and approved by James Blond Ltd, then your account is required to remain in credit at all times. When you return our vehicle, any shortfall is payable immediately upon return of the vehicle. Should you be unable to pay we will send the matter for immediate collection, holding you liable for all other costs that may be incurred in the pursuit of your debt. This may include, but is not limited to, additional collection agents' fees, legal costs and any court costs that we may incur in the pursuit of outstanding rental.</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Photos */}
              <div data-pdf-section className="mb-4">
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#0d6b3d", textTransform: "uppercase", marginBottom: "4px", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>
                  Vehicle Condition Photos
                </div>
                    <>
                      <p style={{ fontSize: "10px", color: "#666", marginBottom: "8px" }}>
                        Take photos of the vehicle condition. Capture all angles including any existing damage.
                      </p>

                      {/* Show existing photos (uploaded previously) */}
                      {existingPhotos.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                          {existingPhotos.filter(p => !hiddenPhotos.includes(p.name)).map((photo, idx) => (
                            <div key={idx} className="relative aspect-square overflow-hidden border group" style={{ borderRadius: "4px" }}>
                              <img src={photo.url} alt={`Vehicle photo ${idx + 1}`} className="w-full h-full object-cover" />
                              {isAdmin && (
                                <button
                                  onClick={() => confirmDeletePhoto(photo, 'existing')}
                                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-8 w-8 text-white" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Gallery input (multi-select) */}
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setCameraOpen(true)}
                          disabled={uploadingPhotos}
                          className="flex-1 min-h-[48px] text-base"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          📸 Take Photos {(pendingPhotos.length + vehiclePhotos.length) > 0 && `(${pendingPhotos.length + vehiclePhotos.length})`}
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={uploadingPhotos}
                          className="flex-1 min-h-[48px] text-base"
                        >
                          <ImageIcon className="h-5 w-5 mr-2" />
                          Select from Gallery
                        </Button>
                      </div>

                      {/* Pending (not yet uploaded) photos */}
                      {pendingPhotos.length > 0 && (
                        <>
                          <p style={{ fontSize: "10px", color: "#666", marginBottom: "4px" }}>
                            {pendingPhotos.length} photo(s) ready to upload:
                          </p>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                            {pendingPhotos.map((photo, idx) => (
                              <div key={idx} className="relative aspect-square overflow-hidden border group" style={{ borderRadius: "4px" }}>
                                <img src={photo.previewUrl} alt={`Pending photo ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => removePendingPhoto(idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <Button
                            size="lg"
                            onClick={handleUploadAllPhotos}
                            disabled={uploadingPhotos}
                            className="w-full min-h-[48px] text-base mb-3"
                            style={{ backgroundColor: "#0d6b3d", color: "#fff" }}
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            {uploadingPhotos ? "Uploading..." : `Finish & Upload All (${pendingPhotos.length})`}
                          </Button>
                        </>
                      )}

                      {/* Already uploaded photos */}
                      {vehiclePhotos.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {vehiclePhotos.map((photo, idx) => (
                            <div key={idx} className="relative aspect-square overflow-hidden border group" style={{ borderRadius: "4px" }}>
                              <img src={photo.url} alt={`Vehicle photo ${idx + 1}`} className="w-full h-full object-cover" />
                              {isAdmin && (
                                <button
                                  onClick={() => confirmDeletePhoto(photo, 'uploaded')}
                                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-8 w-8 text-white" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
              </div>

              {/* Signatures */}
              <div data-pdf-section>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#0d6b3d", textTransform: "uppercase", marginBottom: "4px", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>Signatures</div>
                <div className="space-y-4">
                  {alreadySigned ? (
                    <>
                      <div className="flex items-center gap-2 p-2" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "4px", fontSize: "11px" }}>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <div>
                          <p style={{ fontWeight: 600, color: "#166534" }}>This agreement has been signed</p>
                          {signedAt && (
                            <p style={{ fontSize: "10px", color: "#16a34a" }}>
                              Signed on: {new Date(signedAt).toLocaleString("en-NZ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p style={{ fontSize: "10px", fontWeight: 600, marginBottom: "4px" }}>
                            Signature of Hirer — {customer?.firstname} {customer?.lastname}
                          </p>
                          {existingSignature && (
                            <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "4px", background: "#fff" }}>
                              <img src={existingSignature} alt="Hirer signature" style={{ maxHeight: "80px" }} />
                            </div>
                          )}
                        </div>

                        {existingAdditionalSig && (
                          <div>
                            <p style={{ fontSize: "10px", fontWeight: 600, marginBottom: "4px" }}>
                              Signature of Additional Driver
                            </p>
                            <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "4px", background: "#fff" }}>
                              <img src={existingAdditionalSig} alt="Additional driver signature" style={{ maxHeight: "80px" }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center gap-3 flex-wrap" data-html2canvas-ignore="true">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={async () => {
                            const blob = await generatePdf();
                            if (blob) {
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `Rental-Agreement-${booking?.reservationdocumentno || reservationRef}.pdf`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          size="lg"
                          onClick={handleResendEmail}
                          disabled={resending}
                          style={{ backgroundColor: "#0d6b3d", color: "#fff" }}
                        >
                          {resending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                          {resending ? "Sending..." : "Email Agreement to Customer"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "10px", color: "#666", fontStyle: "italic" }}>
                        I accept the terms and conditions of this rental agreement. You should not sign this unless you are sure you understand its effect.
                      </p>

                      {/* Hirer Signature */}
                      <div>
                        <Label className="font-medium mb-2 block" style={{ fontSize: "11px" }}>
                          Signature of Hirer — {customer?.firstname} {customer?.lastname}
                        </Label>
                        <div className="border rounded-md bg-white">
                          <SignatureCanvas
                            ref={hirerSigRef}
                            canvasProps={{
                              className: "w-full h-32",
                              style: { width: "100%", height: "128px" },
                            }}
                            backgroundColor="white"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => hirerSigRef.current?.clear()}
                        >
                          Clear Signature
                        </Button>
                      </div>

                      {/* Additional Driver Signature */}
                      {allAdditionalDrivers.length > 0 && (
                        <div>
                          <Label className="font-medium mb-2 block" style={{ fontSize: "11px" }}>
                            Signature of Additional Driver — {allAdditionalDrivers[0]?.firstname} {allAdditionalDrivers[0]?.lastname}
                          </Label>
                          <div className="border rounded-md bg-white">
                            <SignatureCanvas
                              ref={additionalDriverSigRef}
                              canvasProps={{
                                className: "w-full h-32",
                                style: { width: "100%", height: "128px" },
                              }}
                              backgroundColor="white"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => additionalDriverSigRef.current?.clear()}
                          >
                            Clear Signature
                          </Button>
                        </div>
                      )}

                      <hr style={{ border: "none", borderTop: "1px solid #ddd" }} />

                      {/* Save Button */}
                      <div className="flex flex-col items-center gap-3">
                        {saved ? (
                          <>
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">Agreement Saved Successfully</span>
                            </div>
                            <p style={{ fontSize: "10px", color: "#666" }}>You can now add vehicle photos above and email the agreement to the customer.</p>
                            <Button
                              size="lg"
                              onClick={handleResendEmail}
                              disabled={resending}
                              style={{ backgroundColor: "#0d6b3d", color: "#fff" }}
                              className="px-12"
                            >
                              {resending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                              {resending ? "Sending..." : "Email Agreement to Customer"}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="lg"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-12"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              "Save Signed Agreement"
                            )}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              </div>
            </div>
          )}
        </div>
      </div>
      {cameraOpen && (
        <VehicleCamera
          onPhotoCaptured={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
          photoCount={pendingPhotos.length + vehiclePhotos.length}
        />
      )}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => { if (!open) setPhotoToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo from the agreement?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RentalAgreement;
