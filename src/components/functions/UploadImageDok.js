import supabase from "../../database/SupaClient";

const UploadImageDok = async (file) => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  try {
    const { data, error } = await supabase.storage
      .from("file_upload")
      .upload(`berkas_dokumen/${hours}-${minutes}_${file.name}`, file);

    if (error) {
      console.error("Error uploading image to storage:", error);
      return;
    }

    // Return the URL of the uploaded image
    return data.Key;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default UploadImageDok;
