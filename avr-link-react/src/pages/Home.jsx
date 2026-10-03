import { usePageSetup } from '../hooks/usePageSetup';
import { useDeviceClass } from '../hooks/useDeviceClass';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Explainer from '../components/Explainer';
import FeatureShowcase from '../components/FeatureShowcase';
import Ecosystem from '../components/Ecosystem';
import Simulator from '../components/Simulator';
import Compatibility from '../components/Compatibility';
import SupportBanner from '../components/SupportBanner';
import Footer from '../components/Footer';
import MobileNotice from '../components/MobileNotice';
import '../styles/home.css';

export default function Home() {
  usePageSetup({ title: 'AVR Link — Seamless AV Receiver Control', theme: 'dark' });
  useDeviceClass();

  return (
    <>
      <MobileNotice />
      <Nav />
      <main className="site-main">
        <Hero />
        <Explainer />
        <FeatureShowcase />
        <Ecosystem />
        <Simulator />
        <Compatibility />
        <SupportBanner />
      </main>
      <Footer />
    </>
  );
}
