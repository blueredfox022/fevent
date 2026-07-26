import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import { getEvents } from "../../services/eventService";

import type { Event } from "../../types/event";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 mb-12 text-white shadow-2xl shadow-blue-600/20">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-white/40 rounded-full animate-pulse hidden lg:block" />

        <div className="relative max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-blue-50 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Platform Event Kampus Modern
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-5">
            Kelola & Ikuti Event Kampus dengan Mudah
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
            Daftarkan diri dalam berbagai event kampus, dapatkan QR code
            kehadiran, dan raih sertifikat otomatis — semua dalam satu platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Jelajahi Event
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
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Cara Kerja
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14">
        {[
          {
            label: "Event Aktif",
            value: events.length,
            color: "blue",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            ),
          },
          {
            label: "Peserta Terdaftar",
            value: "500+",
            color: "green",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            ),
          },
          {
            label: "Sertifikat Terbit",
            value: "200+",
            color: "amber",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ),
          },
          {
            label: "Tingkat Kehadiran",
            value: "95%",
            color: "blue",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5"
              />
            ),
          },
        ].map((stat, index) => {
          const colorMap: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-50", text: "text-blue-600" },
            green: { bg: "bg-green-50", text: "text-green-600" },
            amber: { bg: "bg-amber-50", text: "text-amber-600" },
          };
          const c = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 mb-3 rounded-xl ${c.bg} flex items-center justify-center ${c.text}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {stat.icon}
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* Events Section */}
      <section id="events" className="mb-16 scroll-mt-20">
        <div className="flex items-end justify-between mb-7 gap-4">
          <div>
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Agenda
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Event Mendatang
            </h2>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
              Jangan lewatkan berbagai event menarik kampus
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-48 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 skeleton rounded" />
                  <div className="h-4 w-full skeleton rounded" />
                  <div className="h-4 w-1/2 skeleton rounded" />
                  <div className="h-10 w-full skeleton rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 sm:p-16 text-center border border-slate-200">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1.5">
              Belum Ada Event
            </h3>
            <p className="text-slate-500 text-sm">
              Event baru akan segera hadir, pantau terus!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {/* Banner */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  {event.banner ? (
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${event.banner}`}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-700" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-full font-semibold shadow-sm">
                      Event Kampus
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-semibold shadow-md shadow-blue-600/30">
                      {event.quota === 0
                        ? "Tanpa Batas"
                        : `${event.quota} Kuota`}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {event.description ||
                      "Event menarik yang wajib Anda ikuti."}
                  </p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-slate-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-slate-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all group-hover:shadow-md group-hover:shadow-blue-600/30"
                  >
                    Lihat Detail
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
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
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mb-16 scroll-mt-20">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Proses
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
            Cara Kerja
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Mengikuti event kampus kini lebih mudah dalam 3 langkah
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-amber-200" />
          {[
            {
              num: "01",
              title: "Pilih Event",
              desc: "Jelajahi berbagai event kampus menarik yang tersedia.",
              color: "blue",
            },
            {
              num: "02",
              title: "Daftar & Dapat QR",
              desc: "Isi data diri dan dapatkan QR code absensi otomatis.",
              color: "green",
            },
            {
              num: "03",
              title: "Hadir & Sertifikat",
              desc: "Scan QR saat hadir, sertifikat dikirim otomatis via email.",
              color: "amber",
            },
          ].map((step, index) => {
            const ringMap: Record<string, string> = {
              blue: "from-blue-500 to-blue-600",
              green: "from-green-500 to-green-600",
              amber: "from-amber-500 to-amber-600",
            };
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 animate-fade-up text-center md:text-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ringMap[step.color]} flex items-center justify-center text-white font-extrabold text-lg shadow-lg mb-4 mx-auto md:mx-0`}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mb-16 scroll-mt-20">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Keunggulan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
            Mengapa CampusEvent?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Solusi modern untuk pengelolaan event kampus
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              title: "QR Code Otomatis",
              desc: "Setiap peserta mendapatkan QR code unik untuk absensi yang cepat dan akurat.",
              color: "blue",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              ),
            },
            {
              title: "Sertifikat Digital",
              desc: "Sertifikat dikirim otomatis ke email peserta setelah absensi terverifikasi.",
              color: "green",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
            },
            {
              title: "Dashboard Lengkap",
              desc: "Pantau statistik event, peserta, dan tingkat kehadiran secara real-time.",
              color: "amber",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              ),
            },
          ].map((feature, index) => {
            const colorMap: Record<string, { bg: string; text: string }> = {
              blue: { bg: "bg-blue-50", text: "text-blue-600" },
              green: { bg: "bg-green-50", text: "text-green-600" },
              amber: { bg: "bg-amber-50", text: "text-amber-600" },
            };
            const c = colorMap[feature.color];
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 mb-4 rounded-2xl ${c.bg} flex items-center justify-center ${c.text}`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-10 sm:py-14 text-center text-white shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Siap Mengikuti Event?
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Jelajahi daftar event kampus dan daftarkan diri Anda sekarang.
            Gratis dan mudah!
          </p>
          <a
            href="#events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/40 hover:-translate-y-0.5"
          >
            Lihat Event Sekarang
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
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
