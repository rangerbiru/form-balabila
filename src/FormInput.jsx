import { useState, useEffect } from "react";
import supabase from "./database/SupaClient";
import images from "./assets/images.jpg";
import tf from "./assets/tf.png";
import ImageUpload from "./components/ImageUpload";
import jersey from "./assets/jersey.jpg";
import FileUpload from "./components/FileUpload";
import UploadImageTf from "./components/functions/UploadImageTf";
import UploadImageDok from "./components/functions/UploadImageDok";
import { Rings } from "react-loader-spinner";
import Swal from "sweetalert2";

const FormInput = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  // State Input Form
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRace, setSelectedRace] = useState("");
  const [selectFileUpload, setSelectFileUpload] = useState(null);
  const [telepon, setTelepon] = useState("");
  const [platSepeda, setPlatSepeda] = useState("");
  const [ukuranJersey, setUkuraJersey] = useState("");
  const [asal, setAsal] = useState("");

  const [time, setTime] = useState(new Date().setHours(0));

  useEffect(() => {
    // Mengambil data perlombaan dari Supabase
    const fetchRaces = async () => {
      try {
        const { data, error } = await supabase.from("races").select("*");

        if (error) {
          console.error("Error fetching races:", error.message);
        } else {
          setRaces(data);
        }
      } finally {
        // Setelah mendapatkan data, atur loading menjadi false
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const handleRaceChange = (raceId) => {
    setIsChecked(!isChecked);
    setSelectedRace(raceId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingBtn(true);

    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Image Tf Function Work
    <UploadImageTf />;

    await UploadImageTf(selectedImage);

    const { data: imageUrl } = supabase.storage
      .from("bukti_tf")
      .getPublicUrl(`images/${hours}-${minutes}_${selectedImage.name}`);

    // End Handle Image Tf

    // Start File Upload To Storage
    <UploadImageDok />;

    await UploadImageDok(selectFileUpload);

    const { data: fileUpload } = supabase.storage
      .from("file_upload")
      .getPublicUrl(
        `berkas_dokumen/${hours}-${minutes}_${selectFileUpload.name}`
      );

    //End Handle File Upload

    // Check if the user has already registered for the selected race
    const { data: existingRegistrationCount, error: existingError } =
      await supabase
        .from("registrations")
        .select("count", { count: "exact" })
        .eq("name", name)
        .eq("race_id", selectedRace)
        .single();

    if (existingError) {
      console.error(
        "Error checking existing registration:",
        existingError.message
      );
      return;
    }

    const count = existingRegistrationCount.count;

    if (count > 0) {
      alert("Anda sudah terdaftar pada perlombaan ini.");
      return;
    }

    // Mengambil data kuota tersisa dari Supabase
    const { data: raceData, error: raceError } = await supabase
      .from("races")
      .select("quota")
      .eq("nama_lomba", selectedRace)
      .single();

    if (raceError) {
      console.error("Error fetching race data:", raceError.message);
      return;
    }

    const remainingQuota = raceData.quota;

    if (remainingQuota > 0) {
      // Mengurangi kuota dan mengirim data pendaftaran ke Supabase
      const { data: newRegistration, error: regError } = await supabase
        .from("registrations")
        .upsert([
          {
            race_id: selectedRace,
            name,
            telepon: telepon,
            plat_sepeda: platSepeda,
            ukuran_jersey: ukuranJersey,
            asal_komunitas: asal,
            image_url: imageUrl.publicUrl,
            file_upload: fileUpload.publicUrl,
          },
        ]);

      if (regError) {
        console.error("Error submitting registration:", regError.message);
      } else {
        console.log("Registration submitted successfully:", newRegistration);
      }

      // Mengupdate kuota tersisa di tabel perlombaan
      await supabase
        .from("races")
        .update({
          quota: remainingQuota - 1,
        })
        .eq("nama_lomba", selectedRace);

      Swal.fire({
        title: "Selamat!",
        text: "Anda Sudah Berhasil Mendaftar!",
        icon: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      alert("Kuota pendaftaran untuk perlombaan ini sudah habis");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center flex-col">
          <Rings
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="rings-loading"
          />

          <h2 className="font-bold uppercase">Tunggu Sebentar...</h2>
        </div>
      ) : (
        <>
          <div className=" flex flex-col items-center bg-slate-300">
            <div className="max-lg:w-full w-1/2 flex flex-col items-center bg-white shadow-xl p-5">
              <div className="title">
                <img
                  src={images}
                  alt="image"
                  className="w-full object-cover max-lg:h-96 max-lg:object-cover"
                />
                <div className="text-center my-5">
                  <h2 className="text-4xl font-bold">ANNIVERSARACE</h2>
                  <span className="text-gray-600 ">
                    50TH DINIYYAH PUTRI LAMPUNG
                  </span>
                </div>

                <img src={tf} alt="transfer" className=" object-cover" />
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="my-8">
                  <ImageUpload
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                  />
                </div>

                <div className="my-8">
                  <h2 className="mb-2">
                    PILIH SALAH SATU KELASMU RIDERS!!{" "}
                    <span className="text-red-600">*</span>
                  </h2>
                  <div className="flex flex-col w-96 border-2 max-xl:w-full">
                    {races.map((race) => (
                      <label
                        key={race.id}
                        className="flex items-center gap-2 border-b-2 p-4 cursor-pointer bg-white hover:bg-green-50"
                      >
                        <input
                          type="checkbox"
                          value={race.nama_lomba}
                          checked={selectedRace === race.nama_lomba}
                          onChange={() => handleRaceChange(race.nama_lomba)}
                          disabled={race.quota == 0}
                          className="border border-gray-300 rounded-md w-6 h-6 checked:bg-blue-500 checked:border-transparent focus:outline-none"
                        />
                        {race.quota == 0 ? (
                          <>
                            <p className="flex w-full items-center">
                              <strike className="text-gray-400">{`${race.nama_lomba}`}</strike>
                              <span className="text-sm text-gray-400 italic font-bold ml-auto">
                                Tidak Tersedia
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="flex w-full items-center">
                              {`${race.nama_lomba}`}
                              <span className="text-sm text-green-700 italic font-bold ml-auto">{`${race.quota} Tersedia`}</span>
                            </p>
                          </>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="my-8">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="uppercase mb-2">
                      Nama Anak <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="border-0 outline-none p-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                      id="name"
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="my-8">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="uppercase mb-2">
                      Nomor Hp <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 outline-none p-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                    />
                  </div>
                </div>

                <div className="my-8">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="uppercase mb-2">
                      Nomor Plat Sepeda <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={platSepeda}
                      onChange={(e) => setPlatSepeda(e.target.value)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 outline-none p-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                    />
                  </div>
                </div>

                <div className="image-jersey">
                  <img src={jersey} alt="jersey" />
                </div>

                <div className="my-8">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="uppercase mb-2">
                      Ukuran Jersey <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={ukuranJersey}
                      onChange={(e) => setUkuraJersey(e.target.value)}
                      className="border-0 outline-none p-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                    />
                  </div>
                </div>

                <div className="my-8">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="uppercase mb-2">
                      ASAL KOMUNITAS/TEAM/KOTA{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={asal}
                      onChange={(e) => setAsal(e.target.value)}
                      className="border-0 outline-none p-3 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                    />
                  </div>
                </div>

                <FileUpload
                  selectFileUpload={selectFileUpload}
                  setSelectFileUpload={setSelectFileUpload}
                />

                {loadingBtn ? (
                  <>
                    <button
                      type="submit"
                      className="py-2 px-4 border bg-green-600 text-white"
                    >
                      Tunggu yaa...
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="py-2 px-4 border bg-green-600 text-white"
                    >
                      Daftar
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormInput;
