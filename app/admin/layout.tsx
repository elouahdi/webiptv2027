import { ThemeProvider } from '@/components/ui/ThemeProvider';
import AdminLayoutContent from './AdminLayoutContent';
import '../globals.css';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}
