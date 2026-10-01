import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--f-serif', display: 'swap' });
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--f-sans', display: 'swap' });
export const metadata = { title: 'Methma & Virajitha — Wedding Invitation', description: 'You are warmly invited to celebrate the wedding of Methma & Virajitha.', robots: { index: false, follow: false } };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2a1712' };
export default function RootLayout({ children }) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
