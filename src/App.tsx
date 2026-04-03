import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Droplets, 
  Recycle, 
  Zap, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical,
  Factory,
  Leaf,
  Menu,
  X,
  Linkedin
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

// --- 3D Components ---

function ParticleField({ count = 100 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      dummy.scale.set(s * 0.2, s * 0.2, s * 0.2);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#2d5a27" roughness={0.1} metalness={0.8} transparent opacity={0.4} />
    </instancedMesh>
  );
}

function MolecularCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = window.scrollY / 1000;
    meshRef.current.rotation.x = Math.cos(t / 4) / 8 + scroll;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8 + scroll * 2;
    meshRef.current.rotation.z = Math.sin(t / 4) / 8;
    meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10 - scroll;
    meshRef.current.scale.setScalar(2.2 + scroll * 0.5);
  });

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.2}>
        <MeshDistortMaterial
          color="#2d5a27"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={1}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <MolecularCore />
        </PresentationControls>
        
        <ParticleField count={60} />
        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Technology', href: '#technology' },
    { name: 'Impact', href: '#impact' },
    { name: 'R&D', href: '#rd' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen selection:bg-pure-green/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pure-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">PURE</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-pure-green transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary text-sm py-2">Partner with Us</a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="#contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary text-center"
                >
                  Partner with Us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Scene />
        
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pure-green/5 via-transparent to-transparent"></div>
        
        <div className="section-container text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-pure-green/10 text-pure-green text-xs font-bold tracking-widest uppercase mb-6"
            >
              Student-Led Climate Initiative
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-8xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight"
            >
              Transforming Plastic <br />
              <span className="text-pure-green">into Pure Energy</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-serif leading-relaxed"
            >
              PURE is a student-led initiative tackling the global plastic crisis by converting low-value and non-recyclable plastic into usable fuel.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#contact" className="btn-primary flex items-center gap-2 shadow-xl shadow-pure-green/20">
                Partner with Us <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#about" className="btn-secondary bg-white/50 backdrop-blur-sm">Learn More</a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border-2 border-slate-200 rounded-full flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-pure-green rounded-full"></div>
          </motion.div>
        </motion.div>
      </header>

      {/* Conceptual Prototype Section */}
      <section className="relative -mt-20 pb-24 px-6 z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-video bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=2070" 
              alt="Plastic waste management concept" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-pure-green rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                  Conceptual Prototype
                </div>
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                  Early Validation Phase
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-display">Engineering for Impact</h3>
              <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
                Our exploratory trials inform the design of a self-sustaining pyrolysis unit, 
                converting low-value plastic into usable PyroFuel with minimal environmental footprint.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl mb-6">The Challenge</h2>
              <p className="text-lg mb-8">
                The global plastic crisis is escalating. Millions of tons of low-value, non-recyclable plastics accumulate in landfills and oceans, causing irreparable harm to ecosystems and wildlife.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-4xl font-bold text-pure-green">8M+</div>
                  <div>
                    <p className="font-sans font-bold text-slate-900">Tons of Plastic</p>
                    <p className="text-sm">Enter our oceans annually, disrupting marine life.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-4xl font-bold text-pure-green">9%</div>
                  <div>
                    <p className="font-sans font-bold text-slate-900">Recycling Rate</p>
                    <p className="text-sm">Only a fraction of plastic produced is globally recycled.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              className="bg-slate-50 p-10 rounded-2xl border border-slate-100"
            >
              <h3 className="text-2xl mb-4 text-pure-green">Our Vision</h3>
              <p className="text-lg italic">
                "To create a decentralised waste-to-energy system that reduces plastic accumulation while providing an alternative, usable fuel source for local communities."
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-slate-500">
                <Leaf className="w-5 h-5 text-pure-green" />
                <span>Ethical Engineering for a Circular Economy</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Our Approach</h2>
            <p className="max-w-2xl mx-auto text-lg">
              We leverage the process of pyrolysis to thermally decompose plastic waste in an oxygen-free environment.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { step: "01", title: "Collection", desc: "Sourcing low-value and non-recyclable plastic waste." },
              { step: "02", title: "Heating", desc: "Controlled thermal decomposition in an oxygen-free chamber." },
              { step: "03", title: "Condensation", desc: "Converting vapour into high-energy PyroFuel." },
              { step: "04", title: "Recovery", desc: "Capturing by-products like NCGs and Char for reuse." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                whileHover={{ y: -10, scale: 1.02, rotateX: 2, rotateY: 2 }}
                viewport={{ once: true }}
                className="card group cursor-default perspective-1000"
              >
                <span className="text-pure-green font-bold text-sm mb-4 block group-hover:scale-110 transition-transform origin-left">{item.step}</span>
                <h4 className="text-xl mb-2 group-hover:text-pure-green transition-colors">{item.title}</h4>
                <p className="text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-pure-green/10 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="text-pure-green w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl mb-2">Self-Sustaining Loop</h4>
                  <p>Non-Condensable Gases (NCGs) are captured and redirected to power the heating chamber, significantly reducing external energy requirements.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-pure-green/10 rounded-full flex items-center justify-center shrink-0">
                  <FlaskConical className="text-pure-green w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl mb-2">Catalytic Enhancement</h4>
                  <p>Our research focuses on using Char as a secondary by-product with planned catalytic treatments to improve fuel quality and yield.</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 font-sans">
                  <strong>Transparency Note:</strong> Energy balance calculations are preliminary and will be validated during full-scale prototype development.
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
                alt="Engineering diagram concept" 
                className="rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Circular Economy Model</h2>
            <p className="max-w-2xl mx-auto text-lg">
              Transforming waste into a resource through a closed-loop system.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {[
              { label: "Waste Processed", value: "TBD", unit: "kg" },
              { label: "Fuel Recovered", value: "TBD", unit: "L" },
              { label: "System Efficiency", value: "TBD", unit: "%" },
              { label: "Operation Time", value: "TBD", unit: "hrs" },
            ].map((metric, i) => (
              <div key={i} className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{metric.label}</p>
                <div className="text-4xl font-bold text-slate-900 mb-1">{metric.value}</div>
                <p className="text-xs text-slate-400">{metric.unit} (Planned Metrics)</p>
              </div>
            ))}
          </div>

          <div className="relative py-12 px-6 bg-pure-green/5 rounded-3xl overflow-hidden">
            <div className="flex flex-col md:row items-center justify-between gap-8 max-w-4xl mx-auto relative z-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Recycle className="text-pure-green w-8 h-8" />
                </div>
                <p className="font-bold text-sm">Plastic Waste</p>
              </div>
              <ChevronRight className="hidden md:block text-pure-green/30 w-8 h-8" />
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Factory className="text-pure-green w-8 h-8" />
                </div>
                <p className="font-bold text-sm">Pyrolysis</p>
              </div>
              <ChevronRight className="hidden md:block text-pure-green/30 w-8 h-8" />
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Droplets className="text-pure-green w-8 h-8" />
                </div>
                <p className="font-bold text-sm">PyroFuel</p>
              </div>
              <ChevronRight className="hidden md:block text-pure-green/30 w-8 h-8" />
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Zap className="text-pure-green w-8 h-8" />
                </div>
                <p className="font-bold text-sm">Clean Energy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* R&D Section */}
      <section id="rd" className="py-24 bg-slate-950 text-white">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl mb-6">Research & Development</h2>
              <p className="text-slate-400 text-lg mb-8">
                Our design is informed by exploratory trial setups and rigorous experimentation. These learnings are critical to building a safe and efficient final prototype.
              </p>
              <ul className="space-y-4">
                {[
                  "Shredding mechanics for optimal surface area",
                  "Chamber sealing techniques for oxygen-free environments",
                  "Condensation efficiency and temperature control",
                  "Safety protocols and pressure relief systems"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-pure-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-500 italic">
                "These were exploratory experiments conducted to inform design, not final prototypes."
              </p>
            </motion.div>
            <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-xl mb-2">Trial Documentation</h4>
              <p className="text-slate-500 text-sm">Video documentation coming soon as we progress through our validation phase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Our Journey</h2>
            <p className="max-w-2xl mx-auto text-lg mb-4">
              A transparent look at our development milestones and future goals.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">
              <AlertCircle className="w-3 h-3" />
              Preliminary experiments under validation
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-100"></div>
            
            <div className="space-y-20">
              {[
                { phase: "Phase 1", date: "Q2 2025", title: "Prototype Development", desc: "Design and build a functional small-scale pyrolysis unit with integrated safety controls." },
                { phase: "Phase 2", date: "TBD", title: "Analysis & Validation", desc: "Comprehensive fuel quality testing and energy balance analysis to verify efficiency." },
                { phase: "Phase 3", date: "TBD", title: "Pilot Deployment", desc: "Collaborating with partners for real-world testing in controlled environments." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-pure-green rounded-full border-4 border-white shadow-sm z-10"></div>
                  <div className={`w-[45%] ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <span className="text-pure-green font-bold text-xs uppercase tracking-widest">{item.phase} — {item.date}</span>
                    <h4 className="text-xl mt-1 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Student-Led Innovation</h2>
            <p className="max-w-3xl mx-auto text-lg">
              PURE is driven by an interdisciplinary team of Grade 12 students from Shiv Nadar School, Faridabad, passionate about sustainable solutions and ethical engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { name: "Aarush Chaturvedi", role: "Physics", focus: "Thermodynamics & energy systems" },
              { name: "Samrat Aneja", role: "Engineering", focus: "Mechanical design & safety" },
              { name: "Soham Mishra", role: "Sustainability & Research", focus: "Environmental impact & data analysis" },
            ].map((member, i) => (
              <div key={i} className="card text-center group">
                <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-pure-green/10 transition-colors">
                  <Users className="w-8 h-8 text-slate-400 group-hover:text-pure-green transition-colors" />
                </div>
                <h4 className="text-xl mb-1">{member.name}</h4>
                <p className="text-pure-green font-bold text-xs uppercase tracking-widest mb-3">{member.role}</p>
                <p className="text-sm text-slate-500">{member.focus}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, label: "Safety First" },
              { icon: <FlaskConical className="w-5 h-5" />, label: "Evidence-Based" },
              { icon: <Leaf className="w-5 h-5" />, label: "Ethical Engineering" },
            ].map((value, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 font-medium">
                <div className="text-pure-green">{value.icon}</div>
                <span>{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Connect with PURE</h2>
            <p className="max-w-2xl mx-auto text-lg">
              We are open to collaborations, research partnerships, and strategic guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* General Contact */}
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">General Inquiries</h3>
              <div className="space-y-6">
                <a 
                  href="mailto:pure.pyro.oil@gmail.com" 
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-pure-green/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-pure-green/10 rounded-xl flex items-center justify-center text-pure-green group-hover:bg-pure-green group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Email Us</p>
                    <p className="text-slate-900 font-medium">pure.pyro.oil@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/company/puresustainability" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-pure-green/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-pure-green/10 rounded-xl flex items-center justify-center text-pure-green group-hover:bg-pure-green group-hover:text-white transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">LinkedIn</p>
                    <p className="text-slate-900 font-medium">company/puresustainability</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-pure-green/10 rounded-xl flex items-center justify-center text-pure-green">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Location</p>
                    <p className="text-slate-900 font-medium">Faridabad, Haryana, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Contact */}
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Direct Team Contact</h3>
              <div className="space-y-4">
                {[
                  { name: "Soham Mishra", email: "sohammishra504@gmail.com" },
                  { name: "Aarush Chaturvedi", email: "aarrush469@gmail.com" },
                  { name: "Samrat Aneja", email: "anejasamrat@gmail.com" },
                ].map((member, i) => (
                  <a 
                    key={i}
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-pure-green/30 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <p className="text-slate-900 font-bold">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                    <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-pure-green group-hover:bg-pure-green/10 transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-8 p-4 bg-pure-green/5 rounded-2xl border border-pure-green/10">
                <p className="text-xs text-pure-green font-sans leading-relaxed">
                  <strong>Note:</strong> PURE is a student-led initiative. We appreciate your patience and will respond to all legitimate inquiries as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="section-container flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pure-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg tracking-tighter text-slate-900">PURE</span>
          </div>
          <p className="text-sm text-slate-500">© 2025 PURE. Student-led climate initiative.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-pure-green transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-pure-green transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
