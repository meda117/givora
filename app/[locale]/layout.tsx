import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from '@/components/shared/theme-provider';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: {
    default: 'Givora | جيفورا — متجر الهدايا الفاخرة والمخصصة',
    template: '%s | Givora',
  },
  description: 'Givora — براند الهدايا الفاخرة والمخصصة في مصر. بوكسات هدايا راقية، هدايا تريندي ومخصصة بالاسم والحفر وتوصيل لجميع المحافظات.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    languages: {
      'ar': '/ar',
      'en': '/en',
    },
  },
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!['ar', 'en'].includes(locale)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? 'font-arabic' : 'font-sans';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontClass} bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-150`}
      >
        <Script
          id="givora-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('givora-theme')||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==='system'&&d)){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}var s=function(){try{var el=document.querySelectorAll('[bis_skin_checked],[bis_register],[__processed_]');for(var i=0;i<el.length;i++){el[i].removeAttribute('bis_skin_checked');el[i].removeAttribute('bis_register');}}catch(e){}};s();if(window.MutationObserver){var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var t=m[i];if(t.type==='attributes'&&(t.attributeName==='bis_skin_checked'||t.attributeName==='bis_register'||(t.attributeName&&t.attributeName.indexOf('__processed')===0))){t.target.removeAttribute(t.attributeName);}}});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked','bis_register']});setTimeout(function(){o.disconnect();},4000);}})();`,
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <ToastProvider />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
