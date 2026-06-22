import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-16 border border-white/5 shadow-2xl">
        {/* Background Gradient Blurs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            #1 Sports Equipment Rental in Town
          </span>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            SEWA ALAT & BARANG{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              UKM OLAHRAGA
            </span>{' '}
            <br className="hidden sm:block" />
            POLITEKNIK NEGERI LAMPUNG
          </h1>
          
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Temukan berbagai macam peralatan olahraga berkualitas tinggi mulai dari Futsal, Badminton, Basket, hingga Voli dengan harga terjangkau.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/alat"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-200 text-center cursor-pointer"
            >
              Mulai Sewa Sekarang
            </Link>
            <a
              href="#fitur"
              className="w-full sm:w-auto rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3.5 text-base font-bold text-gray-200 hover:text-white transition-all text-center cursor-pointer"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { number: '50+', label: 'Alat Olahraga Siap Sewa', color: 'text-emerald-400' },
          { number: '5+', label: 'Kategori Cabang Olahraga', color: 'text-cyan-400' },
          { number: '1,000+', label: 'Transaksi Sukses', color: 'text-purple-400' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-8 rounded-2xl text-center border border-white/5">
            <p className={`text-4xl font-extrabold ${stat.color} mb-2`}>{stat.number}</p>
            <p className="text-gray-400 text-sm font-semibold">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Why Choose Us Section */}
      <section id="fitur" className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">Kenapa Memilih UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG?</h2>
          <p className="text-gray-400 max-w-lg mx-auto">Kami menyediakan pelayanan penyewaan alat olahraga dengan standar kenyamanan dan kualitas terbaik.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            {
              title: 'Alat Berkualitas',
              desc: 'Semua alat dirawat secara berkala dan dijamin dalam kondisi baik saat disewa.',
              icon: (
                <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              )
            },
            {
              title: 'Harga Bersahabat',
              desc: 'Tarif sewa dihitung per hari dengan harga yang sangat ekonomis bagi semua kalangan.',
              icon: (
                <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: 'Proses Cepat',
              desc: 'Pengajuan sewa secara online dalam hitungan menit, tinggal verifikasi pembayaran dan ambil barang.',
              icon: (
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            {
              title: 'Denda Transparan',
              desc: 'Aturan keterlambatan, kerusakan, dan kehilangan dijelaskan secara rinci tanpa biaya tersembunyi.',
              icon: (
                <svg className="h-8 w-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="p-3 bg-white/5 inline-block rounded-xl">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
