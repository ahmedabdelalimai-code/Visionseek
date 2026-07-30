'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const method = [
  ['VS-01', 'SIGNAL', 'Observe', 'Wide, patient attention. We collect weak signals across domains before they become obvious.'],
  ['VS-02', 'PATTERN', 'See what repeats', 'Find anomalies, frictions and repetitions that experts dismiss because they sit between fields.'],
  ['VS-03', 'BRIDGE', 'Connect', 'Combine mature pieces from unrelated worlds into a possibility that did not exist yesterday.'],
  ['VS-04', 'THESIS', 'Name the value', 'Define who benefits, how much and why now. If it cannot be written clearly, we do not proceed.'],
  ['VS-05', 'PROOF', 'Validate', 'Reality is the only reviewer we trust: cheap, fast and honest, before building too much.'],
  ['VS-06', 'VENTURE', 'Build', 'The insight becomes a team, a product and an operating system with its own gravity.'],
  ['VS-07', 'COMPOUND', 'Scale', 'Double down on what works, retire what does not and stack advantage cycle after cycle.'],
  ['VS-∞', 'LOOP', 'Repeat', 'Every cycle feeds the next. The engine’s output becomes its next input.'],
] as const;

const domains = ['AI', 'Law', 'Robotics', 'Aging', 'Healthcare', 'Logistics', 'Education', 'Energy', 'Behavior', 'Capital'];

type BridgeInsight = { hidden: string; value: string };

const bridgeInsights: Record<string, BridgeInsight> = {
  'AI|Law': {
    hidden: 'Precedent is structured data disguised as prose. Judgment, not retrieval, is the real product.',
    value: 'Legal research that took days becomes a conversation.',
  },
  'Aging|Robotics': {
    hidden: 'The aging market is framed around care. But older people are buying autonomy, which is a different product.',
    value: 'Independence measured in years, not features.',
  },
  'AI|Healthcare': {
    hidden: 'The bottleneck in medicine was never information. It is synthesis under pressure.',
    value: 'Minutes of clarity where there were hours of searching.',
  },
  'Behavior|Energy': {
    hidden: 'Energy consumption is identity, not only economics. Price signals fail where social signals succeed.',
    value: 'Demand shaped by design, not only by tariffs.',
  },
  'Healthcare|Logistics': {
    hidden: 'A hospital is a supply chain wearing a white coat. Its worst outcomes are often routing failures.',
    value: 'Clinical capacity recovered without building a new ward.',
  },
  'AI|Education': {
    hidden: 'One-to-one tutoring was always the strongest teaching model and always too expensive. The cost structure has now changed.',
    value: 'Mastery-based learning at the marginal cost of software.',
  },
  'Capital|Robotics': {
    hidden: 'Robots are difficult to sell as machines. Sold as outcomes per month, the same system becomes easier to adopt.',
    value: 'Capital expenditure anxiety converted into operational adoption.',
  },
  'Behavior|Law': {
    hidden: 'Contracts are written by lawyers, for lawyers, and read by almost no one. Comprehension is a design problem.',
    value: 'Agreements people understand and are therefore more likely to honor.',
  },
  'Aging|Capital': {
    hidden: 'The largest wealth transfer in history still has no clear interface. Inheritance remains paperwork and grief.',
    value: 'A system for continuity, not only custody.',
  },
  'Education|Logistics': {
    hidden: 'Skills expire faster than degrees are issued. Learning must move like freight: routed, tracked and delivered just in time.',
    value: 'Workforce readiness treated as an operations problem.',
  },
};

const bridgeKey = (pair: string[]) => [...pair].sort((a, b) => a.localeCompare(b)).join('|');

function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const positions = nodes.map((node) => ({
        x: node.x * width + (reducedMotion ? 0 : Math.sin(time * 0.00018 + node.phase) * 18 + pointer.x * 24),
        y: node.y * height + (reducedMotion ? 0 : Math.cos(time * 0.00015 + node.phase) * 14 + pointer.y * 16),
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
        const size = index % 13 === 0 ? 5 : 3;
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });

      if (!reducedMotion) animation = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reducedMotion) window.addEventListener('pointermove', move);
    draw();

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
  const toggle = (domain: string) => setSelected((current) => current.includes(domain)
    ? current.filter((item) => item !== domain)
    : current.length < 2 ? [...current, domain] : [domain]);

  const insight = useMemo(() => selected.length === 2 ? bridgeInsights[bridgeKey(selected)] : undefined, [selected]);

  return <main className="public-site">
    <nav className="public-nav" aria-label="Primary navigation">
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
      <div className="section-wrap"><p className="section-label"><b>01</b> THE LENS</p><h2>Everyone sees the same world.<br />Not everyone sees the same things.</h2><p className="section-lede">Move across the surface. What most people read is on top. What we read is underneath.</p>
        <div className="lens-grid">{[
          ['A hospital.', 'A supply chain wearing a white coat.'],
          ['A law firm.', 'A pattern-matching engine billing by the hour.'],
          ['A contract.', 'A user interface no one designed.'],
          ['A classroom.', 'A one-size algorithm from 1850.'],
          ['A power grid.', 'A behavioral system priced like a commodity.'],
          ['A robot.', 'Autonomy waiting for a business model.'],
        ].map(([surface, underneath]) => <article key={surface} tabIndex={0}><span>WHAT MOST SEE</span><h3>{surface}</h3><div><span>WHAT WE SEE</span><p>{underneath}</p></div></article>)}</div>
      </div>
    </section>

    <section id="origins" className="public-section origins-section"><div className="section-wrap"><p className="section-label"><b>02</b> ORIGINS OF BREAKTHROUGHS</p><div className="pieces"><article><strong>Screw Press</strong><span>WINE MAKING</span></article><i /><article><strong>Movable Type</strong><span>METALLURGY</span></article><i /><article><strong>Oil-Based Ink</strong><span>PAINTING</span></article></div><p className="equation">= THE PRINTING PRESS, 1440</p><h2>Gutenberg invented nothing.</h2><p className="section-lede centered">Three mature technologies stood in three different rooms. He saw that they belonged in the same one. Every breakthrough we study follows this shape — and so does every venture we build.</p></div></section>

    <section id="method" className="public-section method-section"><div className="section-wrap"><p className="section-label"><b>03</b> THE VISIONSEEK METHOD</p><h2>Eight stages. One engine.<br />Drawn as you descend.</h2><div className="method-list">{method.map(([code, name, plain, description]) => <article key={code}><span className="method-dot"/><code>{code}</code><strong>{name}</strong><em>{plain}</em><p>{description}</p></article>)}</div></div></section>

    <section id="bridge" className="public-section bridge-section"><div className="section-wrap"><p className="section-label"><b>04</b> THE BRIDGE</p><h2>Choose two worlds.<br />See the connection.</h2><div className="domain-chips" aria-label="Choose two domains">{domains.map((domain) => <button type="button" key={domain} onClick={() => toggle(domain)} className={selected.includes(domain) ? 'selected' : ''} aria-pressed={selected.includes(domain)}>{domain}</button>)}</div><div className="bridge-output" aria-live="polite">{selected.length < 2 ? <p><b>●</b> {selected.length === 0 ? 'AWAITING INPUT: SELECT TWO DOMAINS' : `${selected[0].toUpperCase()} SELECTED — CHOOSE ONE MORE`}</p> : <><header><span>bridge://{selected.join('—').toLowerCase()}</span><b>● {insight ? 'CONNECTION FOUND' : 'UNMAPPED INTERSECTION'}</b></header><div><h3>{selected[0]} × {selected[1]}</h3><p>{insight?.hidden ?? 'This intersection is unmapped. Which is exactly where we begin. The highest-value opportunities often live in connections no one has examined yet.'}</p><small>NEW VALUE</small><strong>{insight?.value ?? 'A new question worth investigating.'}</strong><button type="button" className="bridge-reset" onClick={() => setSelected([])}>Reset selection</button></div></>}</div></div></section>

    <section className="public-cta"><p>ONE TIMELESS BELIEF</p><h2>The future belongs to those<br />who can see <span>what others don&apos;t.</span></h2><a href="mailto:hello@visionseek.com">Start a Conversation →</a></section>
    <footer className="public-footer"><strong>VISIONSEEK</strong><span>The pieces already exist. The opportunity is in the connection.</span><span>© 2026</span></footer>
  </main>;
}
