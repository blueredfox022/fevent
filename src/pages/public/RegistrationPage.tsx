import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";
import { registerParticipant } from "../../services/eventService";

export default function RegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!id || !name || !nim || !email || !phone || !faculty || !department) {
      setError("Lengkapi semua field terlebih dahulu.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await registerParticipant(id, {
        name: name.trim(),
        nim: nim.trim(),
        email: email.trim(),
        phone: phone.trim(),
        faculty: faculty.trim(),
        department: department.trim(),
      });

      navigate("/registration-success", {
        state: {
          participant: response.participant,
          qrUrl: response.qr_url,
          downloadQrUrl: response.download_qr_url,
        },
      });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(
        errorObj.response?.data?.message ??
          "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClasses =
    "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all";

  const labelClasses = "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg">
        <Link
          to={`/events/${id}`}
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
          {/* Header */}
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
                    d="M15 19v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m2 0v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">Daftar Event</h1>
                <p className="text-sm text-blue-100">Lengkapi data diri Anda</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-scale-in">
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className={labelClasses}>
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                NIM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nomor induk mahasiswa"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="alamat@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                No HP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClasses}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  Fakultas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Fakultas Teknik"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Informatika"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 p-3.5 text-sm text-blue-700 border border-blue-100">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
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
                Pastikan data Anda benar. QR code akan digunakan untuk absensi.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/30"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
