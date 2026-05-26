import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import SwimDivider from './components/SwimDivider'
import HowIWork from './components/HowIWork'
import BikeDivider from './components/BikeDivider'
import Projects from './components/Projects'
import RunDivider from './components/RunDivider'
import Timeline from './components/Timeline'
import Contact from './components/Contact'
import KonamiEgg from './components/KonamiEgg'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <SwimDivider />
        <HowIWork />
        <BikeDivider />
        <Projects />
        <RunDivider />
        <Timeline />
        <Contact />
      </main>
      <KonamiEgg />
    </>
  )
}
