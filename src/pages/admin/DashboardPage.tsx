import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import { getEvents } from "../../services/eventService";
import { getParticipantsByEvent } from "../../services/participantService";

type EventType = {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  quota: number;
  banner?: string | null;
};

type ParticipantType = {
  id: number;
  name: string;
  attendance_status: boolean;
};

export default function DashboardPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const eventData = await getEvents();
      setEvents(eventData);

      let participantCount = 0;
      let attendanceCount = 0;

      for (const event of eventData) {
        const participants = await getParticipantsByEvent(event.id);
        participantCount += participants.length;
        attendanceCount += participants.filter(
          (participant: ParticipantType) => participant.attendance_status,
        ).length;
      }

      setTotalParticipants(participantCount);
      setTotalAttendance(attendanceCount);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const attendanceRate =
    totalParticipants > 0
      ? Math.round((totalAttendance / totalParticipants) * 100)
      : 0;

  const stats = [
    {
      label: "Total Event",
      value: events.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "blue",
    },
    {
      label: "Total Peserta",
      value: totalParticipants,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "green",
    },
    {
      label: "Total Hadir",
      value: totalAttendance,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "amber",
    },
    {
      label: "Tingkat Kehadiran",
      value: `${attendanceRate}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "blue",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; grad: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", grad: "from-blue-500 to-blue-600" },
    green: { bg: "bg-green-50", text: "text-green-600", grad: "from-green-500 to-green-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", grad: "from-amber-500 to-amber-600" },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-600/20">
          <div className="absolute -top-16 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="relative">
            <span className="inline-block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Dashboard</span>
            <h1 className="text-xl sm:text-2xl font-extrabold mb-1">Selamat Datang, Administrator!</h1>
            <p className="text-blue-100 text-sm">Pantau dan kelola seluruh aktivitas event kampus dari sini.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center ${c.text}`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">
                  {isLoading ? <span className="inline-block w-12 h-6 skeleton rounded" /> : stat.value}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Events Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Event Terbaru</h2>
                <p className="text-xs text-slate-500 mt-0.5">5 event terakhir</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Nama Event</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Tanggal</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Lokasi</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Kuota</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-400">Memuat data...</td>
                    </tr>
                  ) : events.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-400">Belum ada event</td>
                    </tr>
                  ) : (
                    events.slice(0, 5).map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/30">
                              {event.title.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{event.event_date}</td>
                        <td className="px-4 py-3 text-slate-600">{event.location}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {event.quota}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <a
                  href="/admin/events/create"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 transition-opacity shadow-md shadow-blue-600/30"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold text-sm">Buat Event Baru</span>
                </a>

                <a
                  href="/admin/validate-qr"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-90 transition-opacity shadow-md shadow-green-600/30"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="font-semibold text-sm">Scan Kehadiran</span>
                </a>

                <a
                  href="/admin/certificates"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-amber-500/30"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-sm">Kirim Sertifikat</span>
                </a>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Status Sistem</h2>
              <div className="space-y-2.5">
                {[
                  { label: "Event Management", status: "Aktif" },
                  { label: "QR Attendance", status: "Aktif" },
                  { label: "Email Service", status: "Aktif" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-700 font-medium">{item.label}</span>
                    <span className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
