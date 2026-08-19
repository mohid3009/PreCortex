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
