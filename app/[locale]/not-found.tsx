import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center bg-bg-base pt-[120px] pb-80">
        <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center w-full">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-syne font-bold text-80 md:text-120 text-gradient mb-16 tracking-tighter">
              404
            </h1>
            <h2 className="font-syne font-bold text-24 md:text-36 text-text-primary mb-16 tracking-tight">
              Page non trouvée
            </h2>
            <p className="text-text-secondary text-sm md:text-base mb-32 max-w-md mx-auto leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée vers une autre adresse.
            </p>
            <div className="flex flex-col sm:flex-row gap-16 justify-center max-w-xs sm:max-w-none mx-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
              >
                Retour à l'accueil
              </Link>
              <Link
                href="/nos-plans"
                className="inline-flex items-center justify-center gap-8 px-32 py-16 bg-bg-elevated hover:bg-border border border-border hover:border-border-active text-text-primary font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
              >
                Voir nos abonnements
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
