import { supabase } from "@/integrations/supabase/client";

export const uploadVehiclePhoto = async (filePath: string, file: File) => {
  const formData = new FormData();
  formData.append("path", filePath);
  formData.append("file", file, file.name);

  const { data, error } = await supabase.functions.invoke("upload-vehicle-photo", {
    body: formData,
  });

  if (error) {
    throw new Error(error.message || "Photo upload failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as { path: string; publicUrl: string };
};