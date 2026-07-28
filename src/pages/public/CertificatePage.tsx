import { useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import { checkCertificate } from "../../services/certificateService";
export default function CertificatePage() {
  const [nim, setNim] = useState("");
  const [result, setResult] = useState<{
    name: string;
    download_url: string;
  } | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Sertifikat tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!result?.download_url) {
      alert("Sertifikat tidak tersedia.");
      return;
    }

    try {
      const response = await fetch(result.download_url);

      if (!response.ok) {
        throw new Error("Gagal mengambil sertifikat.");
      }

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
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-xl font-bold text-slate-800">
            Cek Sertifikat
          </h1>

          <p className="mb-6 text-sm text-slate-500">
            Masukkan NIM untuk melihat sertifikat event.
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">NIM</label>

              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Masukkan NIM"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
            >
              {loading ? "Mencari..." : "Cari Sertifikat"}
            </button>
          </form>

          {result && (
            <div className="mt-6 rounded-xl bg-green-50 p-4">
              <p className="text-sm text-slate-500">
                Sertifikat tersedia untuk:
              </p>

              <p className="font-bold text-slate-800">{result.name}</p>

              <button
                onClick={() => {
                  const link = document.createElement("a");

                  link.href = result.download_url;
                  link.download = `Sertifikat-${result.name}.pdf`;

                  document.body.appendChild(link);

                  link.click();

                  document.body.removeChild(link);
                }}
                className="mt-4 block w-full rounded-xl bg-green-600 py-3 text-center font-semibold text-white"
              >
                Download Sertifikat
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
