import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import { getEvents } from "../../services/eventService";
import { getParticipantsByEvent } from "../../services/participantService";
import { sendCertificatesByEvent } from "../../services/certificateService";

type EventType = {
  id: number;
  title: string;
  location: string;
  event_date: string;
};

type ParticipantType = {
  id: number;
  name: string;
  attendance_status: boolean | number | string;
};

type SendResult = {
  message?: string;
  total_sent?: number;
};

export default function CertificatePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [message, setMessage] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedEvent = events.find(
    (event) => String(event.id) === String(selectedEventId),
  );

  const hadirParticipants = participants.filter(
    (participant) =>
      participant.attendance_status === true ||
      participant.attendance_status === 1 ||
      participant.attendance_status === "1",
  );

  useEffect(() => {
    getEvents()
      .then((data: EventType[]) => {
        setEvents(data);
        if (data.length > 0) setSelectedEventId(String(data[0].id));
      })
      .catch((error: unknown) => console.log(error));
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    getParticipantsByEvent(selectedEventId)
      .then((data: ParticipantType[]) => setParticipants(data))
      .catch((error: unknown) => console.log(error));
  }, [selectedEventId]);

  const handleSendAllCertificates = async () => {
    if (!selectedEventId) return;

    const confirmSend = confirm("Kirim sertifikat ke semua peserta yang hadir?");
    if (!confirmSend) return;

    try {
      setIsSending(true);
      setMessage("");

      const result: SendResult = await sendCertificatesByEvent(selectedEventId);
      setMessage(`${result.message}. Total terkirim: ${result.total_sent}`);
      setMessageSuccess(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err.response?.data?.message || "Gagal mengirim sertifikat");
      setMessageSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  const attendanceRate =
    participants.length > 0
      ? Math.round((hadirParticipants.length / participants.length) * 100)
      : 0;

  const avatarColors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Sertifikat</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Generate Sertifikat</h1>
            <p className="text-sm text-slate-500 mt-0.5">Kirim sertifikat ke peserta yang hadir</p>
          </div>

          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all bg-white max-w-full sm:max-w-xs"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-800 mb-4">Preview Sertifikat</h2>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 border border-amber-200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl" />
              <div className="relative bg-white p-5 sm:p-8 rounded-xl border-2 border-amber-200 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-serif tracking-widest text-amber-900 mb-2">SERTIFIKAT</h3>

                <p className="text-xs text-slate-500 mt-4 mb-1 tracking-wide">DIBERIKAN KEPADA</p>

                <p className="text-lg sm:text-xl font-serif italic text-slate-800 mt-2 truncate">
                  {hadirParticipants[0]?.name || "Nama Peserta"}
                </p>

                <div className="w-32 h-px mx-auto bg-amber-300 mt-3 mb-4" />

                <p className="text-sm text-slate-600">Sebagai peserta dalam acara</p>

                <p className="text-base font-bold text-blue-600 mt-3 line-clamp-2 px-2">
                  {selectedEvent?.title || "Nama Event"}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {selectedEvent?.event_date} - {selectedEvent?.location}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-bold text-slate-800 mb-4">Ringkasan</h2>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="p-3 sm:p-4 rounded-xl bg-green-50 border border-green-100 text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-green-700">{hadirParticipants.length}</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">Hadir</p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-blue-700">{hadirParticipants.length}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">Siap Kirim</p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-700">{attendanceRate}%</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">Kehadiran</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendAllCertificates}
                disabled={isSending || hadirParticipants.length === 0}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-600/30"
              >
                {isSending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Kirim Sertifikat ({hadirParticipants.length})
                  </>
                )}
              </button>

              {message && (
                <div
                  className={`mt-3 p-3.5 rounded-xl text-sm font-medium animate-scale-in ${
                    messageSuccess
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800">Peserta Hadir</h3>
              </div>

              <div className="overflow-y-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Nama</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hadirParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-10 text-center text-slate-400">
                          Belum ada peserta hadir
                        </td>
                      </tr>
                    ) : (
                      hadirParticipants.map((participant, index) => (
                        <tr key={participant.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: avatarColors[index % 5] }}
                              >
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-slate-800 font-medium truncate">{participant.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Siap Dikirim
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
