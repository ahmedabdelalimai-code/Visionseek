'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const method = [
  ['VS-01', 'SIGNAL', 'Observe', 'Collect weak signals across domains before they become obvious.'],
  ['VS-02', 'PATTERN', 'Understand', 'Find repetitions, frictions and anomalies sitting between established fields.'],
  ['VS-03', 'BRIDGE', 'Connect', 'Bring mature pieces from unrelated worlds into one new possibility.'],
  ['VS-04', 'THESIS', 'Define value', 'Name who benefits, why now and what makes the opportunity worth pursuing.'],
  ['VS-05', 'PROOF', 'Validate', 'Test the idea against reality before committing to a full build.'],
  ['VS-06', 'VENTURE', 'Build', 'Turn the validated insight into a product, system or operating company.'],
  ['VS-07', 'COMPOUND', 'Scale', 'Convert learning, distribution and capability into cumulative advantage.'],
];

const domains = ['AI', 'Healthcare', 'Education', 'Mobility', 'Research', 'Capital'];

function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let animation = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0 };
    const nodes = Array.from({ length: 72 }, (_, index) => ({
      x: ((index * 67) % 101) / 101,
      y: ((index * 43 + 17) % 97) / 97,
      phase: index * 0.37,
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const positions = nodes.map((node) => ({
        x: node.x * width + Math.sin(time * 0.00018 + node.phase) * 18 + pointer.x * 24,
        y: node.y * height + Math.cos(time * 0.00015 + node.phase) * 14 + pointer.y * 16,
      }));
      context.lineWidth = 0.65;
      positions.forEach((point, index) => {
        for (let j = index + 1; j < positions.length; j += 1) {
          const other = positions[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 145) {
            context.strokeStyle = `rgba(124,58,237,${0.16 * (1 - distance / 145)})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
        context.fillStyle = index % 13 === 0 ? '#7c3aed' : 'rgba(226,226,232,.72)';
        context.fillRect(point.x - 1.5, point.y - 1.5, index % 13 === 0 ? 5 : 3, index % 13 === 0 ? 5 : 3);
      });
      animation = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
    animation = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return <canvas ref={canvasRef} className="graph-canvas" aria-hidden="true" />;
}

export function VisionSeekExperience() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (domain: string) => setSelected((current) => current.includes(domain) ? current.filter((item) => item !== domain) : current.length < 2 ? [...current, domain] : [domain]);

  return <main className="public-site">
    <nav className="public-nav">
      <Link href="/" className="public-brand">VISIONSEEK <small>/os</small></Link>
      <div><a href="#lens">The Lens</a><a href="#origins">Origins</a><a href="#method">Method</a><a href="#bridge">The Bridge</a><Link href="/en">Enter OS ↗</Link></div>
    </nav>

    <section className="public-hero">
      <KnowledgeGraph />
      <div className="hero-content">
        <p className="hero-kicker"><b>●</b> A VALUE DISCOVERY OPERATING SYSTEM</p>
        <h1>Seeing what<br />others don&apos;t.</h1>
        <p className="hero-sub">We don&apos;t invent from scratch.<br />We connect what already exists — in new ways.</p>
        <div className="hero-actions"><a href="#lens">Look Through the Lens <span>→</span></a><a href="#bridge" className="ghost">Try the Bridge</a></div>
      </div>
      <div className="hero-foot"><span>The world already contains the pieces.</span><span>The opportunity is in the connection.</span></div>
    </section>

    <section id="lens" className="public-section lens-section">
      <div className="section-wrap"><p className="section-label"><b>01</b> THE LENS</p><h2>Everyone sees the same world.<br />Not everyone sees the same things.</h2><p className="section-lede">VisionSeek looks underneath familiar institutions to find the hidden systems, constraints and unrealized capabilities inside them.</p>
        <div className="lens-grid">{[
          ['A hospital.', 'A supply chain wearing a white coat.'],
          ['A law firm.', 'A pattern-matching engine billing by the hour.'],
          ['A classroom.', 'A learning system still organized for 1850.'],
          ['A robot.', 'Autonomy waiting for a business model.'],
        ].map(([surface, underneath]) => <article key={surface}><span>WHAT MOST SEE</span><h3>{surface}</h3><div><span>WHAT WE SEE</span><p>{underneath}</p></div></article>)}</div>
      </div>
    </section>

    <section id="origins" className="public-section origins-section"><div className="section-wrap"><p className="section-label"><b>02</b> ORIGINS OF BREAKTHROUGHS</p><div className="pieces"><article><strong>Screw Press</strong><span>WINE MAKING</span></article><i /><article><strong>Movable Type</strong><span>METALLURGY</span></article><i /><article><strong>Oil-Based Ink</strong><span>PAINTING</span></article></div><p className="equation">= THE PRINTING PRESS, 1440</p><h2>Gutenberg invented nothing.</h2><p className="section-lede centered">He saw that three mature technologies, living in separate rooms, belonged in the same one. The opportunity was in the connection.</p></div></section>

    <section id="method" className="public-section method-section"><div className="section-wrap"><p className="section-label"><b>03</b> THE VISIONSEEK METHOD</p><h2>One engine.<br />From signal to scale.</h2><div className="method-list">{method.map(([code, name, plain, description]) => <article key={code}><span className="method-dot"/><code>{code}</code><strong>{name}</strong><em>{plain}</em><p>{description}</p></article>)}</div></div></section>

    <section id="bridge" className="public-section bridge-section"><div className="section-wrap"><p className="section-label"><b>04</b> THE BRIDGE</p><h2>Choose two worlds.<br />See the connection.</h2><div className="domain-chips">{domains.map((domain) => <button key={domain} onClick={() => toggle(domain)} className={selected.includes(domain) ? 'selected' : ''}>{domain}</button>)}</div><div className="bridge-output">{selected.length < 2 ? <p><b>●</b> {selected.length === 0 ? 'AWAITING INPUT: SELECT TWO DOMAINS' : `${selected[0].toUpperCase()} SELECTED — CHOOSE ONE MORE`}</p> : <><header><span>bridge://{selected.join('—').toLowerCase()}</span><b>● CONNECTION FOUND</b></header><div><h3>{selected[0]} × {selected[1]}</h3><p>The strongest opportunities often emerge where one field&apos;s mature capability resolves another field&apos;s persistent constraint.</p><small>NEW VALUE</small><strong>A testable venture thesis at the intersection of two existing worlds.</strong></div></>}</div></div></section>

    <section className="public-cta"><p>ONE TIMELESS BELIEF</p><h2>The future belongs to those<br />who can see <span>what others don&apos;t.</span></h2><a href="mailto:hello@visionseek.com">Start a Conversation →</a></section>
    <footer className="public-footer"><strong>VISIONSEEK</strong><span>The pieces already exist. The opportunity is in the connection.</span><span>© 2026</span></footer>
  </main>;
}
