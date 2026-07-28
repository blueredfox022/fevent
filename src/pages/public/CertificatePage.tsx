import { useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import { checkCertificate } from "../../services/certificateService";
export default function CertificatePage() {
  const [nim, setNim] = useState("");
  const [result, setResult] = useState<{
    name: string;
    certificate_url: string;
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

              <a
                href={result.certificate_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-xl bg-green-600 py-3 text-center font-semibold text-white"
              >
                Download Sertifikat
              </a>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
