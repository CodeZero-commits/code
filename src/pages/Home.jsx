import Navbar from "./../components/layout/Navbar";
import Hero from "./../components/sections/Hero";
import About from "./../components/sections/About";
import Skills from "./../components/sections/Skills";
import Projects from "./../components/sections/Projects";
import Experience from "./../components/sections/Experience";
import Laboratory from "./../components/sections/Laboratory";
import Articles from "./../components/sections/Articles";
import Contact from "./../components/sections/Contact";
import Footer from "./../components/layout/Footer";
import ScrollProgress from "./../components/ui/ScrollProgress";

function Home() {
  return (
    <div className="App">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Laboratory />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
