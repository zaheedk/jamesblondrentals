import { supabase } from "@/integrations/supabase/client";

/**
 * Idempotently upsert a batch row so the Photo Gallery fast-path can show
 * this upload without a full storage scan. Fire-and-forget: failures are
 * non-fatal because the gallery still falls back to a storage scan.
 */
export const upsertPhotoBatch = async (params: {
  reservationNo: string;
  rego: string;
  batchId: string;
  batchLabel?: string;
  sortKey?: number;
}) => {
  const { reservationNo, rego, batchId } = params;
  if (!reservationNo || !batchId) return;

  const match = batchId.match(/batch-(\d+)/);
  const sortKey =
    params.sortKey ?? (match ? Number(match[1]) : Date.now());

  let batchLabel = params.batchLabel;
  if (!batchLabel) {
    if (batchId.startsWith("batch-") && match) {
      const d = new Date(Number(match[1]));
      batchLabel = isNaN(d.getTime())
        ? batchId
        : d.toLocaleString("en-NZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
    } else {
      batchLabel = "Earlier uploads";
    }
  }

  try {
    await supabase
      .from("photo_batches")
      .upsert(
        {
          reservation_no: reservationNo,
          rego: rego || "",
          batch_id: batchId,
          batch_label: batchLabel,
          sort_key: sortKey,
        },
        { onConflict: "reservation_no,rego,batch_id" },
      );
  } catch (err) {
    console.warn("Failed to upsert photo_batches row:", err);
  }
};