import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import Promotions from './sections/Promotions';
import Testimonials from './sections/Testimonials';
import Guarantees from './sections/Guarantees';
import Contacts from './sections/Contacts';
import Legal from './pages/Legal';
import ScrollToTop from './components/ui/ScrollToTop';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RainEffect from './components/effects/RainEffect';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      
      {/* Дождь на фоне всего сайта, кроме админки */}
      {!isAdminRoute && (
        <RainEffect backgroundImage="https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=2000&auto=format&fit=crop" />
      )}

      {/* Шапка сайта */}
      {!isAdminRoute && <Header />}
      
      {/* Основной контент */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Portfolio />
              <Promotions />
              <Testimonials />
              <Guarantees />
              <Contacts />
            </>
          } />
          
          {/* Юридические страницы */}
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/consent" element={<Legal />} />
          
          {/* Админ-панель */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Подвал сайта */}
      {!isAdminRoute && <Footer />}
      
      {/* Нижняя навигация для мобильных устройств */}
      {!isAdminRoute && <BottomNav />}
    </div>
  );
}