import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, FileText, CalendarDays, ShieldCheck, Workflow, Sparkles, Menu, X, CircleCheckBig, Layers3 } from 'lucide-react';
import './styles.css';

const NAV = [
  ['How it works', '#how'],
  ['What you get', '#features'],
  ['Mini vs Custom', '#plans'],
  ['FAQ', '#faq'],
];

const steps = [
  { n:'01', title:'Map your QMS', text:'Start with your actual processes, areas, people and existing documents — not a generic template.' },
  { n:'02', title:'Connect the evidence', text:'Link controlled documents, records and evidence from Microsoft 365 or the systems you already use.' },
  { n:'03', title:'Run the system', text:'Reviews, approvals, audits, findings and follow-ups move through one clear workspace.' },
  { n:'04', title:'See readiness', text:'Turn scattered compliance work into visible ownership, status and ISO 9001 readiness.' },
];

const features = [
  { icon: FileText, k:'Controlled documents', d:'Review status, revisions, ownership and linked evidence without replacing your document storage.' },
  { icon: Workflow, k:'Process-first workspace', d:'Organize the QMS around how the company actually operates, not around disconnected folders.' },
  { icon: CalendarDays, k:'Audit planning', d:'Schedule audits, assign auditors, capture findings and keep the follow-up visible.' },
  { icon: ShieldCheck, k:'Readiness overview', d:'See what is clear, what needs attention and where critical gaps remain.' },
];

const faqs = [
  ['Is iQMS Mini a full enterprise QMS?', 'No. Mini is intentionally focused: a clean front-end QMS workspace for smaller teams that want structure without a heavy enterprise implementation.'],
  ['Can it be customized?', 'Yes. That is the main offer. We start from the Mini foundation and adapt modules, terminology, fields, workflows, integrations and branding to your process.'],
  ['Do we need to upload documents into iQMS?', 'Not necessarily. iQMS can be designed to reference documents from your existing Microsoft 365 / SharePoint environment, depending on the implementation.'],
  ['Is this an ISO certification guarantee?', 'No software guarantees certification. iQMS is designed to make the management system easier to organize, operate, evidence and review.'],
];

function App(){
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress,[0,.18],[0,120]);
  const heroRotate = useTransform(scrollYProgress,[0,.18],[0,-6]);
  const heroScale = useTransform(scrollYProgress,[0,.18],[1,.9]);
  const [menu,setMenu]=useState(false);
  const [faq,setFaq]=useState(0);

  useEffect(()=>{ const h=()=>setMenu(false); window.addEventListener('resize',h); return()=>window.removeEventListener('resize',h)},[])

  return <div className="site-shell">
    <div className="noise" aria-hidden="true" />
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="iQMS home"><span className="brand-dot"/>iQMS</a>
      <nav className="desktop-nav">{NAV.map(([t,h])=><a key={t} href={h}>{t}</a>)}</nav>
      <a className="nav-cta" href="#contact">Talk about your QMS <ArrowRight size={15}/></a>
      <button className="menu-btn" onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button>
      <AnimatePresence>{menu&&<motion.div className="mobile-menu" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>{NAV.map(([t,h])=><a key={t} href={h}>{t}</a>)}<a href="#contact">Talk about your QMS</a></motion.div>}</AnimatePresence>
    </header>

    <main id="top">
      <section className="hero section-pad">
        <motion.div className="eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.15}}>ISO 9001 WORKSPACE · MINI + CUSTOM</motion.div>
        <div className="hero-copy">
          <motion.h1 initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.2,.8,.2,1]}}>Your QMS is<br/><span>not a folder.</span></motion.h1>
          <motion.div className="hero-side" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.7}}>
            <p>iQMS turns documents, audits, actions and ISO requirements into one understandable operating system — built around how your company actually works.</p>
            <div className="hero-actions"><a className="button primary" href="#plans">Explore iQMS Mini <ArrowRight size={17}/></a><a className="text-link" href="#how">See how it works</a></div>
          </motion.div>
        </div>

        <motion.div className="hero-stage" style={{y:heroY,rotate:heroRotate,scale:heroScale}}>
          <div className="stage-grid"/>
          <motion.div className="tile tile-a" animate={{y:[0,-10,0],rotate:[-5,-3,-5]}} transition={{repeat:Infinity,duration:6,ease:'easeInOut'}}><span>DOCUMENTS</span><strong>Controlled.<br/>Connected.</strong><FileText/></motion.div>
          <motion.div className="tile tile-b" animate={{y:[0,12,0],rotate:[4,2,4]}} transition={{repeat:Infinity,duration:7,ease:'easeInOut'}}><span>AUDITS</span><strong>Plan → Find →<br/>Follow through.</strong><CalendarDays/></motion.div>
          <motion.div className="tile tile-c" animate={{x:[0,8,0],rotate:[-1,1,-1]}} transition={{repeat:Infinity,duration:8,ease:'easeInOut'}}><span>READINESS</span><div className="readiness"><b>82%</b><div><i/><i/><i/></div></div><small>12 clear · 3 attention · 1 critical</small></motion.div>
          <motion.div className="tile tile-d" animate={{y:[0,-7,0],x:[0,-4,0]}} transition={{repeat:Infinity,duration:5,ease:'easeInOut'}}><Sparkles/><span>ONE SYSTEM</span><strong>Less chasing.<br/>More clarity.</strong></motion.div>
          <div className="stage-caption">Scroll to put the pieces together.</div>
        </motion.div>
      </section>

      <section className="statement section-pad">
        <div className="statement-kicker">THE PROBLEM</div>
        <motion.h2 initial={{opacity:.25}} whileInView={{opacity:1}} viewport={{amount:.5}} transition={{duration:.9}}>When quality lives across folders, spreadsheets, chats and memory, <em>compliance becomes detective work.</em></motion.h2>
      </section>

      <section id="how" className="how section-pad">
        <div className="section-head"><span>HOW IT WORKS</span><h2>From scattered pieces<br/>to a working system.</h2></div>
        <div className="steps">{steps.map((s,i)=><motion.article key={s.n} className="step" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{delay:i*.08}}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p><ArrowRight/></motion.article>)}</div>
      </section>

      <section className="sticky-story">
        <div className="story-copy section-pad"><span>BUILT AROUND THE PROCESS</span><h2>Not another dashboard<br/>full of static cards.</h2><p>Every status should come from somewhere. Every warning should lead to work. Every document should belong to a process. Every audit should close the loop.</p></div>
        <div className="story-screen-wrap section-pad"><motion.div className="story-screen" initial={{scale:.86,rotateX:8}} whileInView={{scale:1,rotateX:0}} viewport={{amount:.5}} transition={{duration:.9,ease:[.2,.8,.2,1]}}>
          <div className="mock-sidebar"><div className="mini-logo">iQ</div>{['Overview','Processes','Documents','Audits','Actions'].map((x,i)=><div key={x} className={i===0?'active':''}>{x}</div>)}</div>
          <div className="mock-main"><div className="mock-top"><span>ISO 9001 Readiness</span><button>View details</button></div><div className="score-row"><div className="score"><b>82%</b><span>Overall readiness</span></div><div className="segments"><i/><i/><i/></div></div><div className="mock-cards"><div><small>ALL CLEAR</small><b>12</b><span>requirements on track</span></div><div><small>NEEDS ATTENTION</small><b>3</b><span>items to review</span></div><div><small>CRITICAL</small><b>1</b><span>blocking gap</span></div></div><div className="mock-list"><div><CircleCheckBig/>Leadership & Context <span>Ready</span></div><div><CircleCheckBig/>Document Control <span>Ready</span></div><div><Layers3/>Internal Audit <span className="amber">Attention</span></div></div></div>
        </motion.div></div>
      </section>

      <section id="features" className="features section-pad">
        <div className="section-head light"><span>THE MINI FOUNDATION</span><h2>Small enough to start.<br/>Structured enough to grow.</h2></div>
        <div className="feature-grid">{features.map((f,i)=><motion.div className="feature" key={f.k} whileHover={{y:-8}} transition={{type:'spring',stiffness:250,damping:20}}><f.icon/><span>0{i+1}</span><h3>{f.k}</h3><p>{f.d}</p></motion.div>)}</div>
      </section>

      <section id="plans" className="plans section-pad">
        <div className="section-head"><span>START MINI. CUSTOMIZE WHEN IT MATTERS.</span><h2>One foundation.<br/>Two ways to use it.</h2></div>
        <div className="plan-grid">
          <motion.div className="plan mini" whileInView={{y:[25,0],opacity:[0,1]}} viewport={{once:true}}><div className="plan-tag">iQMS MINI</div><h3>A practical front-end QMS workspace.</h3><p>For teams that want a polished, usable starting point without commissioning the entire platform at once.</p><ul>{['Process & area structure','Document register / linked documents','Readiness overview','Audit workspace foundation','Responsive branded interface'].map(x=><li key={x}><Check/>{x}</li>)}</ul><a href="#contact" className="button dark">Start with Mini <ArrowRight/></a></motion.div>
          <motion.div className="plan custom" whileInView={{y:[35,0],opacity:[0,1]}} viewport={{once:true}} transition={{delay:.12}}><div className="plan-tag">CUSTOM IMPLEMENTATION</div><h3>Make iQMS fit the way your organization works.</h3><p>Extend Mini into your own quality system with tailored workflows, fields, integrations, permissions and modules.</p><ul>{['Custom workflow & approval rules','Microsoft 365 / SharePoint integration','Audit, NCR / CAPA & survey modules','Roles, permissions & organization structure','Custom dashboards, terminology & branding'].map(x=><li key={x}><Check/>{x}</li>)}</ul><a href="#contact" className="button primary">Plan a custom build <ArrowRight/></a></motion.div>
        </div>
      </section>

      <section className="marquee" aria-hidden="true"><div><span>PROCESS</span><i>•</i><span>DOCUMENTS</span><i>•</i><span>AUDITS</span><i>•</i><span>ACTIONS</span><i>•</i><span>READINESS</span><i>•</i><span>PROCESS</span><i>•</i><span>DOCUMENTS</span><i>•</i><span>AUDITS</span></div></section>

      <section id="faq" className="faq section-pad">
        <div className="section-head"><span>FAQ</span><h2>Before we build.</h2></div>
        <div className="faq-list">{faqs.map(([q,a],i)=><button className="faq-item" key={q} onClick={()=>setFaq(faq===i?-1:i)}><div><span>0{i+1}</span><h3>{q}</h3><b>{faq===i?'−':'+'}</b></div><AnimatePresence initial={false}>{faq===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{a}</motion.p>}</AnimatePresence></button>)}</div>
      </section>

      <section id="contact" className="contact section-pad">
        <motion.div className="contact-card" initial={{scale:.96,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true,amount:.4}}><span>YOUR QMS, WITHOUT THE CLUTTER</span><h2>Start with Mini.<br/><em>Shape it into yours.</em></h2><p>Tell us how your current quality process works and where the friction is. We’ll map the right iQMS starting point.</p><a href="mailto:hello@iqms.example" className="button cream">Start a conversation <ArrowRight/></a><small>Replace the email above with your preferred sales/contact channel.</small></motion.div>
      </section>
    </main>

    <footer className="footer section-pad"><a className="brand" href="#top"><span className="brand-dot"/>iQMS</a><p>Quality management that works like your business does.</p><span>© 2026 iQMS</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
