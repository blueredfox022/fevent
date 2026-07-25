import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import { createEvent } from "../../services/eventService";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [useCertificate, setUseCertificate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [quota, setQuota] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [eventTime, setEventTime] = useState("");
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("event_date", eventDate);
    formData.append("quota", quota);
    formData.append("event_time", eventTime);
    formData.append("use_certificate", useCertificate ? "1" : "0");
    if (banner) {
      formData.append("banner", banner);
    }

    try {
      setIsLoading(true);
      await createEvent(formData);

      alert("Event berhasil dibuat");
      navigate("/admin/events");
    } catch (error: unknown) {
      console.log(error);
      alert("Gagal membuat event");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClasses =
    "w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali
        </Link>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">Buat Event Baru</h1>
                <p className="text-sm text-blue-100">
                  Tambahkan event kampus baru
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className={labelClasses}>
                Nama Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama event"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Deskripsi</label>
              <textarea
                placeholder="Deskripsi event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${fieldClasses} resize-none`}
              />
            </div>
            <div>
              <label className={labelClasses}>
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Lokasi event"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={fieldClasses}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Jam
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Kuota <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={quota}
                  placeholder="Jumlah"
                  onChange={(e) => setQuota(e.target.value)}
                  className={fieldClasses}
                />
                <p>Masukkan 0 jika peserta tidak dibatasi.</p>
              </div>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={useCertificate}
                  onChange={(e) => setUseCertificate(e.target.checked)}
                />
                Event menyediakan sertifikat
              </label>
            </div>
            <div>
              <label className={labelClasses}>Banner Event</label>

              <div className="relative rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors px-4 py-3 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold cursor-pointer"
                />
              </div>

              {preview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 animate-scale-in">
                  <img
                    src={preview}
                    alt="Preview Banner"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/30"
              >
                {isLoading ? "Menyimpan..." : "Simpan Event"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
