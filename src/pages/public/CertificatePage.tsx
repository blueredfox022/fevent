import { useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import { checkCertificate } from "../../services/certificateService";

export default function CertificatePage() {
  const [nim, setNim] = useState("");
  const [result, setResult] = useState<{
    name: string;
    certificate_file: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const certificateUrl = result?.certificate_file
    ? `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${result.certificate_file}`
    : null;

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!nim) {
      setError("Masukkan NIM terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      const data = await checkCertificate(nim);
      setResult(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message ?? "Sertifikat tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificateUrl) {
      alert("Sertifikat tidak tersedia.");
      return;
    }

    try {
      const response = await fetch(certificateUrl);
      if (!response.ok) throw new Error("Gagal mengambil sertifikat.");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `Sertifikat-${nim}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunduh sertifikat.");
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Cek Sertifikat</h1>
          <p className="text-sm text-slate-500">
            Masukkan NIM untuk melihat dan mengunduh sertifikat event Anda.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">NIM</label>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Masukkan NIM"
                  className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-scale-in">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mencari...
                </>
              ) : (
                <>
                  Cari Sertifikat
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-6 rounded-xl bg-green-50 border border-green-100 p-5 animate-scale-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-green-600 font-medium">Sertifikat tersedia untuk</p>
                  <p className="font-bold text-slate-800 truncate">{result.name}</p>
                </div>
              </div>
              <button
                onClick={handleDownloadCertificate}
                className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Sertifikat
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
