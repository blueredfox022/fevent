import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import { getParticipants } from "../../services/eventService";
import { getParticipantQr } from "../../services/participantService";

import type { Participant } from "../../types/participant";

const avatarColors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function ParticipantPage() {
  const { id } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) fetchParticipants(id);
  }, [id]);

  const fetchParticipants = async (eventId: string) => {
    try {
      setIsLoading(true);
      const data = await getParticipants(eventId);
      setParticipants(data);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQr = async (
    participantId: number,
    participantName: string,
  ) => {
    try {
      const result = await getParticipantQr(participantId);
      const link = document.createElement("a");
      link.href = result.download_url;
      link.download = `QR-${participantName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      alert("Gagal download QR");
    }
  };

  const presentCount = participants.filter((p) => p.attendance_status).length;
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nim.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
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

        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Peserta
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Daftar Peserta
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Kelola peserta event dan unduh QR peserta
            </p>
          </div>

          <div className="flex gap-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-3.5 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700">
                {presentCount} Hadir
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-700">
                {participants.length - presentCount} Belum
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari peserta berdasarkan nama atau NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-600">
                    Peserta
                  </th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-600">
                    Kontak
                  </th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-600">
                    Akademik
                  </th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-600">
                    Kehadiran
                  </th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-600">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">
                        {searchQuery
                          ? "Tidak ada peserta yang cocok"
                          : "Belum ada peserta"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant, index) => (
                    <tr
                      key={participant.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md shrink-0"
                            style={{ backgroundColor: avatarColors[index % 5] }}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {participant.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {participant.nim}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-600 truncate max-w-[180px]">
                          {participant.email}
                        </p>
                        <p className="text-xs text-slate-400">
                          {participant.phone || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p className="truncate max-w-[160px]">
                          {participant.department || "-"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {participant.faculty || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {participant.attendance_status ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Hadir
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {participant.attendance_status && (
                            <a
                              href={`http://127.0.0.1:8000/api/participants/${participant.id}/certificate`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Sertifikat
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadQr(participant.id, participant.name)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                            QR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
