import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Beranda", to: "/", hash: false },
    { label: "Daftar Event", to: "/#events", hash: true },
    { label: "Fitur", to: "/#features", hash: true },
    { label: "Cara Kerja", to: "/#how-it-works", hash: true },
    { label: "Cek Sertifikat", to: "/certificate/check", hash: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25 transition-transform group-hover:scale-105">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-lg font-extrabold text-slate-900 leading-none">
                  CampusEvent
                </h1>

                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                  Event Kampus Terpadu
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.hash ? (
                  <a
                    key={link.label}
                    href={link.to}
                    className="px-4 py-2 rounded-lg font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive(link.to)
                        ? "text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}

              <Link
                to="/admin/login"
                className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/25"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-1">
              {navLinks.map((link) =>
                link.hash ? (
                  <a
                    key={link.label}
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg font-medium text-sm ${
                      isActive(link.to)
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}

              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 text-white text-center mt-2"
              >
                Login Admin
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="font-extrabold text-slate-900 text-lg mb-3">
                CampusEvent
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Platform pengelolaan event kampus terpadu. Daftar, absensi QR
                Code, dan dapatkan sertifikat digital dalam satu tempat.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                Fitur
              </h4>

              <ul className="space-y-2 text-sm text-slate-500">
                <li>Pendaftaran Online</li>
                <li>Absensi QR Code</li>
                <li>Sertifikat Digital</li>
                <li>Dashboard Analitik</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                Tautan
              </h4>

              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-slate-500 hover:text-blue-600">
                    Beranda
                  </Link>
                </li>

                <li>
                  <a
                    href="#events"
                    className="text-slate-500 hover:text-blue-600"
                  >
                    Daftar Event
                  </a>
                </li>

                <li>
                  <a
                    href="#features"
                    className="text-slate-500 hover:text-blue-600"
                  >
                    Fitur
                  </a>
                </li>

                <li>
                  <Link
                    to="/certificate/check"
                    className="text-slate-500 hover:text-blue-600"
                  >
                    Cek Sertifikat
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/login"
                    className="text-slate-500 hover:text-blue-600"
                  >
                    Login Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} CampusEvent. Dibuat untuk kampus.
            </p>

            <p className="text-xs text-slate-400">
              Platform event kampus modern
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
