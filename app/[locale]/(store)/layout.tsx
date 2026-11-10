import { StoreHeader } from '@/components/store/layout/header';
import { StoreFooter } from '@/components/store/layout/footer';
import { AnnouncementBar } from '@/components/store/layout/announcement-bar';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <StoreHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <StoreFooter />
    </>
  );
}
