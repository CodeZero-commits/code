import Navbar from "./../components/layout/Navbar";
import Hero from "./../components/sections/Hero";
import About from "./../components/sections/About";
import Skills from "./../components/sections/Skills";
import Projects from "./../components/sections/Projects";
import CodePenProjects from "./../components/sections/CodePenProjects";
import ArticlesPublications from "./../components/sections/ArticlesPublications";
import Experience from "./../components/sections/Experience";
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
        <CodePenProjects />
        <ArticlesPublications />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
