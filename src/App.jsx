import { useEffect } from 'react';
import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import LineSidebar from './components/LineSidebar';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
import About from './sections/About';
import Technology from './sections/Technology';
import Sdg from './sections/Sdg';
import Contact from './sections/Contact';

export default function App() {
  // Sections are sticky "cards". A card taller than the viewport must pin
  // at a negative top so its full content scrolls into view before the
  // next card slides over it — otherwise everything below the first
  // viewport-height of a section is unreachable (especially on mobile).
  useEffect(() => {
    const update = () => {
      document.querySelectorAll('main > section').forEach((el) => {
        const overflow = el.offsetHeight - window.innerHeight;
        el.style.top = overflow > 0 ? `-${overflow}px` : '0px';
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    // Section heights change as webfonts and images come in
    if (document.fonts?.ready) document.fonts.ready.then(update);
    const ro = new ResizeObserver(update);
    document.querySelectorAll('main > section').forEach((el) => ro.observe(el));
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <LineSidebar />

      <main>
        <Hero />
        <Intro />
        <About />
        <Technology />
        <Sdg />
        <Contact />
      </main>
    </>
  );
}
