'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

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
    const nodes = Array.from({ length: 54 }, (_, index) => ({
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
        x: node.x * width + (reducedMotion ? 0 : Math.sin(time * 0.00018 + node.phase) * 15 + pointer.x * 18),
        y: node.y * height + (reducedMotion ? 0 : Math.cos(time * 0.00015 + node.phase) * 12 + pointer.y * 12),
      }));

      context.lineWidth = 0.55;
      positions.forEach((point, index) => {
        for (let j = index + 1; j < positions.length; j += 1) {
          const other = positions[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 150) {
            context.strokeStyle = `rgba(124,58,237,${0.13 * (1 - distance / 150)})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        context.fillStyle = index % 11 === 0 ? '#7c3aed' : 'rgba(228,228,231,.54)';
        const size = index % 11 === 0 ? 4.5 : 2.4;
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

const steps = [
  ['01', 'Observe', 'We notice signals, patterns and overlooked possibilities.'],
  ['02', 'Connect', 'We connect ideas, technologies and capabilities across fields.'],
  ['03', 'Build', 'We turn the strongest connections into ventures and systems.'],
];

const services = [
  ['AI Strategy', 'Helping leaders understand where AI can create real strategic value.'],
  ['Venture Building', 'Turning high-potential ideas into focused, testable ventures.'],
  ['Research', 'Exploring markets, technologies and models before others see the opportunity.'],
  ['Cross-Industry Innovation', 'Applying proven capabilities from one field to another in new ways.'],
];

export function VisionSeekExperience() {
  return (
    <main className="public-site">
      <nav className="public-nav" aria-label="Primary navigation">
        <Link href="/" className="public-brand">VISIONSEEK</Link>
        <div>
          <a href="#approach">Approach</a>
          <a href="#about">About</a>
          <a href="#services">What we do</a>
          <a href="mailto:hello@visionseek.com" className="nav-cta">Talk with us ↗</a>
        </div>
      </nav>

      <section className="public-hero">
        <KnowledgeGraph />
        <div className="hero-content">
          <p className="hero-kicker"><b>●</b> VENTURE STUDIO &amp; STRATEGY LAB</p>
          <h1>Seeing what<br />others don&apos;t.</h1>
          <p className="hero-sub">We help organizations discover opportunities hidden in plain sight — and turn them into ventures, products and systems.</p>
          <div className="hero-actions">
            <a href="#approach">Explore VisionSeek <span>→</span></a>
            <a href="mailto:hello@visionseek.com" className="ghost">Talk with us</a>
          </div>
        </div>
      </section>

      <section id="approach" className="public-section approach-section">
        <div className="section-wrap">
          <p className="section-label"><b>01</b> HOW WE THINK</p>
          <h2>We don&apos;t invent from scratch.<br />We connect what already exists in new ways.</h2>
          <div className="steps-grid">
            {steps.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="public-section about-section">
        <div className="section-wrap about-grid">
          <p className="section-label"><b>02</b> WHAT VISIONSEEK IS</p>
          <div>
            <h2>A venture studio built around one capability: seeing new value before it becomes obvious.</h2>
            <p>VisionSeek combines strategic thinking, research, technology and venture building. We work across industries, but our method stays the same: observe deeply, connect intelligently and build deliberately.</p>
          </div>
        </div>
      </section>

      <section id="services" className="public-section services-section">
        <div className="section-wrap">
          <p className="section-label"><b>03</b> WHAT WE DO</p>
          <h2>From insight to execution.</h2>
          <div className="services-grid">
            {services.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-cta">
        <p>START WITH A POSSIBILITY</p>
        <h2>Let&apos;s build something<br />worth seeing.</h2>
        <a href="mailto:hello@visionseek.com">Start a conversation →</a>
      </section>

      <footer className="public-footer">
        <strong>VISIONSEEK</strong>
        <span>Strategy. Research. Ventures.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
