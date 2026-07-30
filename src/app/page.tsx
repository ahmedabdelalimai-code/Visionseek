import Link from 'next/link';
import './visionseek-site.css';

const stages = ['Observe', 'Discover', 'Connect', 'Design', 'Build', 'Scale'];
const domains = ['Artificial Intelligence', 'Health & Medicine', 'Research', 'Education', 'Mobility', 'Strategic Systems'];

function Geometry() {
  return <div className="vs-geometry" aria-hidden="true"><div className="vs-orbit orbit-a"/><div className="vs-orbit orbit-b"/><div className="vs-axis axis-x"/><div className="vs-axis axis-y"/><span className="node n1"/><span className="node n2"/><span className="node n3"/><span className="node n4"/><span className="node n5"/><div className="core"><span>VS</span></div></div>;
}

export default function RootPage() {
  return <main className="vs-site">
    <nav className="vs-nav"><Link className="vs-wordmark" href="/">VISIONSEEK<span>.</span></Link><div className="vs-links"><a href="#method">Method</a><a href="#build">What we build</a><a href="#explore">Explore</a><Link href="/en">VisionSeek OS ↗</Link></div></nav>

    <section className="vs-hero">
      <div className="hero-grid" aria-hidden="true"/>
      <div className="hero-copy"><p className="vs-kicker"><span/> Discovery · Systems · Venture Building</p><h1>Seeing what<br/><em>others don’t.</em></h1><p className="hero-lede">VisionSeek discovers overlooked possibilities, connects knowledge across disciplines, and turns insight into ventures, products, and systems.</p><div className="hero-actions"><a className="vs-button" href="#method">Explore VisionSeek <b>↘</b></a><a className="vs-text-link" href="#thinking">Our thinking <span>→</span></a></div></div>
      <Geometry/>
      <div className="hero-index"><span>01</span><span>VISION / SEEK</span><span>GLOBAL · 2026</span></div>
    </section>

    <section className="vs-statement"><p className="section-index">01 / CAPABILITY</p><div><p className="micro">OUR CORE CAPABILITY</p><h2>We look beyond the obvious.</h2><p className="statement-body">Not by predicting an imaginary future, but by seeing patterns, capabilities, constraints and connections that already exist — then asking what they could become.</p></div></section>

    <section id="method" className="vs-method"><div className="method-head"><p className="section-index">02 / METHOD</p><h2>We don’t invent from scratch.<br/><span>We connect what already exists in new ways.</span></h2></div><div className="connection-map"><div className="map-label ml1">KNOWLEDGE</div><div className="map-label ml2">TECHNOLOGY</div><div className="map-label ml3">MARKETS</div><div className="map-label ml4">CAPABILITY</div><svg viewBox="0 0 1000 420" role="img" aria-label="Connections converging into a new possibility"><path d="M70 70 C320 70 380 210 500 210"/><path d="M70 350 C300 350 370 210 500 210"/><path d="M930 70 C700 70 630 210 500 210"/><path d="M930 350 C700 350 630 210 500 210"/><circle cx="500" cy="210" r="55"/><circle cx="500" cy="210" r="5"/></svg><div className="map-center">NEW<br/>POSSIBILITY</div></div></section>

    <section id="build" className="vs-build"><div className="build-intro"><p className="section-index">03 / OUTPUT</p><p className="micro">WHAT WE BUILD</p><h2>Ideas become<br/>structures.</h2></div><div className="build-rows"><article><span>01</span><h3>Ventures</h3><p>New organizations and business models built around opportunities worth pursuing.</p><b>↗</b></article><article><span>02</span><h3>Products</h3><p>Focused tools and experiences that turn a clear insight into practical value.</p><b>↗</b></article><article><span>03</span><h3>Systems</h3><p>Repeatable structures that connect people, intelligence and execution at scale.</p><b>↗</b></article></div></section>

    <section className="vs-process"><p className="section-index">04 / PROCESS</p><div className="process-title"><p className="micro">FROM SIGNAL TO REALITY</p><h2>A disciplined path from observation to scale.</h2></div><div className="stage-line">{stages.map((stage,i)=><div className="stage" key={stage}><span>{String(i+1).padStart(2,'0')}</span><i/><strong>{stage}</strong></div>)}</div></section>

    <section id="explore" className="vs-domains"><div><p className="section-index">05 / EXPLORATION</p><p className="micro">AREAS OF EXPLORATION</p><h2>One method.<br/>Many frontiers.</h2><p>Our fields change. The capability does not. We follow high-leverage connections wherever they lead.</p></div><div className="domain-list">{domains.map((d,i)=><div key={d}><span>{String(i+1).padStart(2,'0')}</span><strong>{d}</strong><b>↗</b></div>)}</div></section>

    <section id="thinking" className="vs-thinking"><div className="thinking-grid"/><p className="section-index">06 / THINKING</p><div className="thinking-copy"><p className="micro">VISIONSEEK PERSPECTIVES</p><h2>Thinking is part<br/>of the build.</h2><p>Frameworks, research notes and perspectives from the questions we are exploring.</p><a href="#">Explore our thinking <span>→</span></a></div></section>

    <section className="vs-final"><p className="section-index">07 / NEXT</p><div><p className="micro">BUILD WITH VISIONSEEK</p><h2>What should<br/><em>exist next?</em></h2><p>Some opportunities are hidden in plain sight. The work begins by seeing them.</p><a className="vs-button light" href="mailto:hello@visionseek.com">Start a conversation <b>↗</b></a></div></section>

    <footer className="vs-footer"><Link className="vs-wordmark" href="/">VISIONSEEK<span>.</span></Link><p>Discovery · Systems · Venture Building</p><div><span>© 2026 VisionSeek</span><Link href="/en">VisionSeek OS ↗</Link></div></footer>
  </main>;
}
