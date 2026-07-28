import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import AdminLayout from "../../layouts/AdminLayout";
import { getEvents } from "../../services/eventService";
import { getParticipantsByEvent } from "../../services/participantService";
import { scanAttendance } from "../../services/attendanceService";

type EventType = {
  id: number;
  title: string;
  location: string;
  event_date: string;
};

type ParticipantType = {
  id: number;
  name: string;
  nim: string;
  attendance_status: boolean | number | string;
  attended_at?: string | null;
  updated_at?: string | null;
};

type ScanResult = {
  participant?: ParticipantType;
  data?: ParticipantType;
  message?: string;
};

export default function ValidateQrPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanLockedRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedParticipant, setScannedParticipant] = useState<ParticipantType | null>(null);

  const selectedEvent = events.find((event) => String(event.id) === String(selectedEventId));

  const fetchParticipants = async (eventId: string) => {
    try {
      const data = await getParticipantsByEvent(eventId);
      setParticipants(data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const isParticipantPresent = (participant: ParticipantType) => {
    const status = participant.attendance_status;
    return status === true || status === 1 || status === "1";
  };

  const getAttendanceTime = (participant: ParticipantType) => {
    return participant.attended_at || participant.updated_at || null;
  };

  const formatTime = (dateValue: string | null) => {
    if (!dateValue) return "-";
    if (dateValue.includes("T")) return dateValue.slice(11, 19);
    if (dateValue.includes(" ")) return dateValue.slice(11, 19);
    return dateValue;
  };

  const stopCamera = async () => {
    try {
      if (!scannerRef.current) {
        setIsScanning(false);
        return;
      }
      const scanner = scannerRef.current;
      try { await scanner.stop(); } catch (e) { console.log(e); }
      try { await scanner.clear(); } catch (e) { console.log(e); }
      scannerRef.current = null;
      scanLockedRef.current = false;
      setIsScanning(false);
    } catch (error: unknown) {
      console.log(error);
      setIsScanning(false);
    }
  };

  const startCamera = async () => {
    try {
      if (isScanning || !selectedEventId) return;
      setScanMessage("");
      setScannedParticipant(null);
      scanLockedRef.current = false;

      if (scannerRef.current) await stopCamera();

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (scanLockedRef.current) return;
          scanLockedRef.current = true;

          try { await html5QrCode.stop(); } catch (e) { console.log(e); }
          try { await html5QrCode.clear(); } catch (e) { console.log(e); }

          scannerRef.current = null;
          setIsScanning(false);

          try {
            const result = await scanAttendance({
              qr_token: decodedText,
              event_id: selectedEventId,
            });
            setScanMessage(result.message || "Berhasil!");
            setScanSuccess(true);
            setScannedParticipant(result.participant || result.data || null);
            await fetchParticipants(selectedEventId);
          } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setScanMessage(err.response?.data?.message || "QR gagal divalidasi");
            setScanSuccess(false);
            setScannedParticipant(null);
          }
        },
        () => {},
      );

      setIsScanning(true);
    } catch (error: unknown) {
      console.log(error);
      setScanMessage("Gagal mengakses kamera");
      setScanSuccess(false);
    }
  };

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
    fetchParticipants(selectedEventId);
    setScanMessage("");
    setScannedParticipant(null);
  }, [selectedEventId]);

  useEffect(() => {
    return () => {
      if (!scannerRef.current) return;
      scannerRef.current
        .stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
  }, []);

  const presentCount = participants.filter(isParticipantPresent).length;

  const handleUploadQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEventId) return;

    try {
      setScanMessage("");
      setScannedParticipant(null);
      scanLockedRef.current = false;

      if (scannerRef.current) await stopCamera();

      const html5QrCode = new Html5Qrcode("qr-reader-upload");
      const decodedText = await html5QrCode.scanFile(file, true);

      const result: ScanResult = await scanAttendance({
        qr_token: decodedText,
        event_id: selectedEventId,
      });

      setScanMessage(result.message || "QR berhasil divalidasi");
      setScanSuccess(true);
      setScannedParticipant(result.participant || result.data || null);
      await fetchParticipants(selectedEventId);
      await html5QrCode.clear();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setScanMessage(err.response?.data?.message || "QR gagal dibaca atau divalidasi");
      setScanSuccess(false);
      setScannedParticipant(null);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Absensi</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Scan Kehadiran</h1>
            <p className="text-sm text-slate-500 mt-0.5">Validasi QR Code peserta</p>
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

        {/* Event Info */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 text-white shadow-lg shadow-blue-600/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">{selectedEvent?.title || "Pilih Event"}</h2>
              <p className="text-sm text-blue-100 truncate">
                {selectedEvent?.location} - {selectedEvent?.event_date}
              </p>
            </div>
            <div className="flex items-center gap-6 text-center shrink-0">
              <div>
                <p className="text-2xl font-extrabold">{participants.length}</p>
                <p className="text-xs text-blue-100">Total</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-extrabold">{presentCount}</p>
                <p className="text-xs text-blue-100">Hadir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Pindai QR Code</h3>

            {/* Camera */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square mb-4">
              <div id="qr-reader" className="w-full h-full" />

              {isScanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative w-56 h-56">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent scan-line" />
                  </div>
                </div>
              )}

              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center text-slate-400 px-6">
                    <svg className="w-14 h-14 mx-auto mb-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-sm">Kamera tidak aktif</p>
                    <p className="text-xs mt-1 text-slate-500">Tekan tombol di bawah untuk mulai</p>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startCamera}
                disabled={isScanning || !selectedEventId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-600/30"
              >
                {isScanning ? "Memindai..." : "Nyalakan Kamera"}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                disabled={!isScanning}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Matikan
              </button>
            </div>

            {/* Upload Manual QR */}
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-semibold text-slate-700">Upload QR Manual</p>
              </div>
              <p className="mb-3 text-xs text-slate-500">Gunakan jika kamera sulit membaca QR Code.</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadQr}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold cursor-pointer"
              />
              <div id="qr-reader-upload" className="hidden" />
            </div>

            {/* Result */}
            {scanMessage && (
              <div
                className={`mt-4 p-4 rounded-xl animate-scale-in ${scanSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${scanSuccess ? "bg-green-500" : "bg-red-500"}`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {scanSuccess ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${scanSuccess ? "text-green-700" : "text-red-700"}`}>
                      {scanMessage}
                    </p>
                    {scannedParticipant && (
                      <div className="mt-2 pt-2 border-t border-green-200 space-y-0.5">
                        <p className="text-sm text-slate-600"><strong>Nama:</strong> {scannedParticipant.name}</p>
                        <p className="text-sm text-slate-600"><strong>NIM:</strong> {scannedParticipant.nim}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attendance List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">Data Kehadiran</h3>
            </div>

            <div className="overflow-y-auto max-h-[520px]">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Nama</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Waktu</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-slate-400">Belum ada peserta</td>
                    </tr>
                  ) : (
                    participants.map((participant) => {
                      const isPresent = isParticipantPresent(participant);
                      return (
                        <tr key={participant.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-slate-800 font-medium">{participant.name}</td>
                          <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">
                            {isPresent ? formatTime(getAttendanceTime(participant)) : "-"}
                          </td>
                          <td className="px-4 py-2.5">
                            {isPresent ? (
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
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
