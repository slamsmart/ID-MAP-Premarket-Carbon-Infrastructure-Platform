import { Link } from 'react-router-dom';
import {
  MapPin, Leaf, QrCode,
  Ruler, Users, Search, Filter,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

type ProjectMode = 'Baseline' | 'New Project' | 'Growth Tracking';
type ProjectStatus = 'Feasibility' | 'MRV' | 'SRN Preparation' | 'Submitted' | 'Approved' | 'Market Ready';

interface Project {
  name: string;
  location: string;
  owner: string;
  area: string;
  estimatedCO2: string;
  mode: ProjectMode;
  status: ProjectStatus;
  fundingProgress: number;
  fundingCurrent: string;
  fundingTarget: string;
  qrisEligible: boolean;
}

const projects: Project[] = [
  {
    name: 'Restorasi Teluk Bintuni',
    location: 'Papua Barat',
    owner: 'Komunitas Bintuni Hijau',
    area: '1.250 ha',
    estimatedCO2: '45.200 tCO₂e',
    mode: 'Baseline',
    status: 'Market Ready',
    fundingProgress: 75,
    fundingCurrent: 'Rp 16,45 M',
    fundingTarget: 'Rp 22 M',
    qrisEligible: true,
  },
  {
    name: 'Desa Timbulsloko',
    location: 'Demak, Jawa Tengah',
    owner: 'Kelompok Tani Makmur',
    area: '320 ha',
    estimatedCO2: '12.800 tCO₂e',
    mode: 'New Project',
    status: 'MRV',
    fundingProgress: 43,
    fundingCurrent: 'Rp 5,30 M',
    fundingTarget: 'Rp 12,30 M',
    qrisEligible: true,
  },
  {
    name: 'Taman Nasional Sembilang',
    location: 'Sumatera Selatan',
    owner: 'Yayasan Sembilang Lestari',
    area: '2.100 ha',
    estimatedCO2: '78.500 tCO₂e',
    mode: 'Baseline',
    status: 'Approved',
    fundingProgress: 80,
    fundingCurrent: 'Rp 23,10 M',
    fundingTarget: 'Rp 28,90 M',
    qrisEligible: true,
  },
  {
    name: 'Kecamatan Kwandang',
    location: 'Gorontalo Utara',
    owner: 'Masyarakat Adat Kwandang',
    area: '580 ha',
    estimatedCO2: '18.900 tCO₂e',
    mode: 'Growth Tracking',
    status: 'SRN Preparation',
    fundingProgress: 40,
    fundingCurrent: 'Rp 3,80 M',
    fundingTarget: 'Rp 9,80 M',
    qrisEligible: false,
  },
  {
    name: 'Teluk Balikpapan',
    location: 'Kalimantan Timur',
    owner: 'Forum Mangrove Balikpapan',
    area: '890 ha',
    estimatedCO2: '32.100 tCO₂e',
    mode: 'Baseline',
    status: 'Submitted',
    fundingProgress: 62,
    fundingCurrent: 'Rp 7,20 M',
    fundingTarget: 'Rp 11,60 M',
    qrisEligible: true,
  },
  {
    name: 'Segara Anakan',
    location: 'Cilacap, Jawa Tengah',
    owner: 'Komunitas Nelayan Segara',
    area: '450 ha',
    estimatedCO2: '15.600 tCO₂e',
    mode: 'New Project',
    status: 'Feasibility',
    fundingProgress: 22,
    fundingCurrent: 'Rp 2,75 M',
    fundingTarget: 'Rp 12,50 M',
    qrisEligible: false,
  },
  {
    name: 'Nusa Lembongan',
    location: 'Bali',
    owner: 'Desa Adat Lembongan',
    area: '180 ha',
    estimatedCO2: '6.400 tCO₂e',
    mode: 'Growth Tracking',
    status: 'MRV',
    fundingProgress: 55,
    fundingCurrent: 'Rp 4,60 M',
    fundingTarget: 'Rp 8,40 M',
    qrisEligible: true,
  },
  {
    name: 'Pulau Rupat',
    location: 'Riau',
    owner: 'Kelompok Konservasi Rupat',
    area: '720 ha',
    estimatedCO2: '24.300 tCO₂e',
    mode: 'Baseline',
    status: 'SRN Preparation',
    fundingProgress: 47,
    fundingCurrent: 'Rp 6,90 M',
    fundingTarget: 'Rp 14,70 M',
    qrisEligible: true,
  },
];

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Platform', to: '/peta-mangrove' },
  { label: 'Marketplace', to: '/program' },
];

const statusColors: Record<ProjectStatus, string> = {
  'Feasibility': 'bg-gray-100 text-gray-600',
  'MRV': 'bg-blue-50 text-blue-600',
  'SRN Preparation': 'bg-amber-50 text-amber-600',
  'Submitted': 'bg-purple-50 text-purple-600',
  'Approved': 'bg-emerald-50 text-emerald-700',
  'Market Ready': 'bg-primary/10 text-primary',
};

const modeColors: Record<ProjectMode, string> = {
  'Baseline': 'bg-deep text-white',
  'New Project': 'bg-primary text-white',
  'Growth Tracking': 'bg-primary-dark text-white',
};

export default function ProgramPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [modeFilter, setModeFilter] = useState<ProjectMode | 'All'>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesMode = modeFilter === 'All' || p.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  });

  return (
    <div className="min-h-screen bg-bg" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold text-deep tracking-tight">ID-MAP</Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((m) => (
              <Link
                key={m.label}
                to={m.to}
                className={`text-sm font-medium transition-colors ${m.to === '/program' ? 'text-primary font-bold' : 'text-muted hover:text-text'}`}
              >
                {m.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-bold text-muted hover:text-text transition-colors cursor-pointer">
                  Masuk
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-200 cursor-pointer">
                  Daftar Sekarang
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          <button
            className="lg:hidden p-2 text-muted cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-border px-6 py-4 space-y-3">
            {navLinks.map((m) => (
              <Link key={m.label} to={m.to} className="block text-sm font-medium text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>
                {m.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-border">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex-1 px-4 py-2.5 text-sm font-bold border border-border rounded-xl text-muted hover:text-text cursor-pointer">Masuk</button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="flex-1 px-4 py-2.5 text-sm font-bold bg-primary text-white rounded-xl cursor-pointer">Daftar</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-white" style={{ padding: '112px 24px 48px' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-primary mb-3" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Marketplace
          </p>
          <h1 className="text-text mb-4" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.2px' }}>
            Carbon Project Listing
          </h1>
          <p className="text-muted max-w-2xl mx-auto mb-10" style={{ fontSize: 16, lineHeight: 1.7 }}>
            Temukan proyek karbon terverifikasi. Dukung via QRIS sebagai kontributor atau hubungi tim untuk pembelian kredit karbon korporasi.
          </p>

          {/* Search & Filters */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Cari proyek, lokasi, atau komunitas..."
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <select
                  className="pl-9 pr-8 py-3 text-sm rounded-xl border border-border bg-white text-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'All')}
                >
                  <option value="All">Semua Status</option>
                  <option value="Feasibility">Feasibility</option>
                  <option value="MRV">MRV</option>
                  <option value="SRN Preparation">SRN Preparation</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Market Ready">Market Ready</option>
                </select>
              </div>
              <select
                className="px-4 py-3 text-sm rounded-xl border border-border bg-white text-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as ProjectMode | 'All')}
              >
                <option value="All">Semua Mode</option>
                <option value="Baseline">Baseline</option>
                <option value="New Project">New Project</option>
                <option value="Growth Tracking">Growth Tracking</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section style={{ padding: '24px 24px 80px' }}>
        <div className="max-w-[1200px] mx-auto">
          <p className="text-sm text-muted mb-6">{filteredProjects.length} proyek ditemukan</p>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl border border-border p-6 transition-all duration-200 hover:-translate-y-1"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-text truncate">{p.name}</h3>
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {p.location}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{p.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Ruler className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{p.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Leaf className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{p.estimatedCO2}</span>
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${modeColors[p.mode]}`}>
                      {p.mode}
                    </span>
                  </div>
                </div>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted">Pendanaan</span>
                    <span className="font-bold text-text">{p.fundingProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${p.fundingProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted">{p.fundingCurrent}</span>
                    <span className="text-muted">Target: {p.fundingTarget}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {p.qrisEligible && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors cursor-pointer">
                      <QrCode className="w-3.5 h-3.5" />
                      Dukung via QRIS
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold border border-border text-text rounded-xl hover:bg-bg transition-colors cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Corporate Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep text-white" style={{ padding: '48px 24px 24px' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-xl font-extrabold mb-2">ID-MAP</p>
          <p className="text-sm text-gray-400 mb-6">Pre-Market Carbon Infrastructure Platform</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
            {navLinks.map((m) => (
              <Link key={m.label} to={m.to} className="hover:text-white transition-colors">{m.label}</Link>
            ))}
          </div>
          <p className="text-xs text-gray-500">&copy; 2024 ID-MAP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
