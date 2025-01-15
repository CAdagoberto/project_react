import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import NewProject from './components/pages/NewProject';
import Container from './components/layout/Container';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Projects from './components/pages/Projects';
import Project from './components/pages/Project';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Container> <Home /></Container>} />
        <Route path="/projects" element={<Container> <Projects /> </Container>} />
        <Route path="/contact" element={<Container> <Contact /> </Container>} />
        <Route path="/newproject" element={<Container> <NewProject /> </Container>} />
        <Route path="/project/:id" element={<Container> <Project /> </Container>} />
      </Routes>
      <Footer />
    </Router>
  );
}
