import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import { getEventDetail, updateEvent } from "../../services/eventService";

type EventDetail = {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time?: string;
  quota: number;
  use_certificate: boolean;
  banner?: string | null;
};

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [quota, setQuota] = useState("");

  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [oldBanner, setOldBanner] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [useCertificate, setUseCertificate] = useState(false);

  useEffect(() => {
    if (!id) return;

    getEventDetail(id)
      .then((data: EventDetail) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setLocation(data.location || "");
        setEventDate(data.event_date || "");
        setEventTime(data.event_time || "");
        setQuota(String(data.quota || ""));
        setOldBanner(data.banner || "");
        setUseCertificate(Boolean(data.use_certificate));
      })
      .catch((error: unknown) => console.log(error))
      .finally(() => setIsFetching(false));
  }, [id]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("event_date", eventDate);
      formData.append("event_time", eventTime);
      formData.append("quota", quota);
      formData.append("use_certificate", useCertificate ? "1" : "0");
      if (banner) {
        formData.append("banner", banner);
      }

      await updateEvent(id, formData);
      alert("Event berhasil diupdate");
      navigate("/admin/events");
    } catch (error: unknown) {
      console.log(error);
      alert("Gagal mengupdate event");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClasses =
    "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all";
  const labelClasses = "mb-1.5 block text-sm font-semibold text-slate-700";

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="max-w-2xl space-y-4">
          <div className="h-5 w-24 skeleton rounded" />
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="h-20 skeleton" />
            <div className="p-6 space-y-4">
              <div className="h-10 w-full skeleton rounded-xl" />
              <div className="h-10 w-full skeleton rounded-xl" />
              <div className="h-10 w-full skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <Link
          to="/admin/events"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg
            className="h-4 w-4"
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

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-5 text-white">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">Edit Event</h1>
                <p className="text-sm text-amber-100">
                  Perbarui informasi event
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
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
                placeholder="Lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className={labelClasses}>Waktu</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Kuota <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Jumlah"
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={useCertificate}
                onChange={(e) => setUseCertificate(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Event menyediakan sertifikat
              </span>
            </label>
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

              {preview ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 animate-scale-in">
                  <img
                    src={preview}
                    alt="Preview Banner"
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : oldBanner ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={`${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${oldBanner}`}
                    alt="Banner Lama"
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-4 flex h-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                  Belum ada banner
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Kosongkan jika tidak ingin mengganti banner.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/30"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
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
