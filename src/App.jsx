import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import LineSidebar from './components/LineSidebar';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
import About from './sections/About';
import Features from './sections/Features';
import Technology from './sections/Technology';

import Contact from './sections/Contact';

export default function App() {
  return (
    <>
      <Navbar />
      <LineSidebar />

      <main>
        <Hero />
        <Intro />
        <About />
        <Features />
        <Technology />

        <Contact />
      </main>
    </>
  );
}
