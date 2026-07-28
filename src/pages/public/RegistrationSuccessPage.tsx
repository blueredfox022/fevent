import { Link, useLocation } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";

interface Participant {
  id: number;
  name: string;
  nim: string;
  email: string;
  qr_image: string;
}
interface RegistrationSuccessState {
  participant: Participant;
  qrUrl: string;
  downloadQrUrl: string;
}

export default function RegistrationSuccessPage() {
  const location = useLocation();
  const state = location.state as RegistrationSuccessState | null;

  const participant = state?.participant;
  const qrUrl = state?.participant?.qr_image
    ? `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${state.participant.qr_image}`
    : null;
  const handleDownloadQr = async () => {
    if (!qrUrl || !participant) {
      alert("QR Code tidak tersedia.");
      return;
    }

    try {
      const response = await fetch(qrUrl);

      if (!response.ok) {
        throw new Error("Gagal mengambil QR Code.");
      }

      const blob = await response.blob();

      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `QR-${participant.nim}.png`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunduh QR Code.");
    }
  };

  if (!participant) {
    return (
      <PublicLayout>
        <div className="py-20 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mb-2 font-semibold text-slate-600">
            Data registrasi tidak ditemukan.
          </p>
          <p className="mb-6 text-sm text-slate-500">
            Halaman ini hanya dapat diakses setelah proses registrasi berhasil.
          </p>
          <Link to="/" className="font-medium text-blue-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
          {/* HEADER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm animate-scale-in">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-extrabold">Pendaftaran Berhasil!</h1>
              <p className="mt-2 text-sm text-green-100">
                QR Code berhasil dibuat
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5 sm:p-6">
            {/* QR */}
            <div className="mb-5 rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR Code ${participant.name}`}
                  className="mx-auto w-full max-w-xs object-contain"
                />
              ) : (
                <p className="text-red-500">QR Code tidak ditemukan.</p>
              )}
            </div>

            {/* DOWNLOAD */}
            <button
              type="button"
              onClick={handleDownloadQr}
              className="mb-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 shadow-lg shadow-green-600/30"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download QR Code
            </button>

            {/* DATA PESERTA */}
            <div className="mb-6 space-y-3 text-left">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 gap-3">
                <span className="text-xs text-slate-500 shrink-0">Nama</span>
                <span className="font-semibold text-slate-800 truncate text-right">
                  {participant.name}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 gap-3">
                <span className="text-xs text-slate-500 shrink-0">NIM</span>
                <span className="font-semibold text-slate-800">
                  {participant.nim}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 gap-3">
                <span className="text-xs text-slate-500 shrink-0">Email</span>
                <span className="font-semibold text-slate-800 truncate text-right text-sm">
                  {participant.email}
                </span>
              </div>
            </div>

            {/* INFORMASI */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left text-sm text-blue-700">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Simpan QR code ini dan tunjukkan kepada panitia saat tiba di
                lokasi untuk absensi. QR juga akan dikirim ke email Anda.
              </span>
            </div>

            {/* KEMBALI */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/30"
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
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
