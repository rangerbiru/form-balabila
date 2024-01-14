// import { useState } from "react";

const FileUpload = ({ setSelectFileUpload }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectFileUpload(file);

    console.log(file);
  };

  return (
    <div className="flex justify-center flex-col mt-8">
      <label className="inline-block mb-2 uppercase">
        FILE UPLOAD AKTA/KTA/KIA <span className="text-red-600">*</span>
      </label>
      <div className="w-full rounded-lg shadow-sm bg-gray-50">
        <div className="m-4">
          <label className="flex h-52 justify-center border-dashed border-4 items-center hover:bg-gray-100 hover:border-gray-300">
            <input type="file" required onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
