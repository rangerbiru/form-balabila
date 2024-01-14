import { useState } from "react";

const ImageUpload = ({ setSelectedImage }) => {
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center flex-col mt-8">
      <label className="inline-block mb-2 uppercase">
        Upload Bukti Transfer <span className="text-red-600">*</span>
      </label>
      <div className="w-full rounded-lg shadow-sm bg-gray-50">
        <div className="m-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-52 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-7 h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="pt-2 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    Masukkan Gambar Disini
                  </p>
                </div>
              )}
              <input
                type="file"
                className="opacity-0"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
