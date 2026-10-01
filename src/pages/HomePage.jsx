import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  GraduationCap,
  MapPin,
  Network,
  Sparkles,
  Users,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';


/* =========================================================
   COLLABORATION CERTIFICATES
========================================================= */

const collaborations = [
  {
    id: 1,
    name: 'Insead-UAE Campus',
    image: '/collaboration/insead-logo.png',
  },
  {
    id: 2,
    name: 'Emerland Group Publishing-UK',
    image: 'collaboration/emerland.jpg',
  },
  {
    id: 3,
    name: 'Anzmac-Australia',
    image: 'collaboration/anzmac.jpg',
  },
  {
    id: 4,
    name: 'The Case Center-UK ',
    image: 'collaboration/case.webp',
  },
  {
    id: 5,
    name: 'SmartPLS-Germany',
    image: 'collaboration/SMART.png',
  },
  {
    id: 6,
    name: 'European Marketing Academcy-Belgium',
    image: 'collaboration/european.jpg',
  },
  {
    id: 7,
    name: 'Zayed University-UAE',
    image: 'collaboration/zayed.png',
  },
  {
    id: 8,
    name: 'IBA Karachi-PK',
    image: 'collaboration/IBA.jpg',
  },
];


/* =========================================================
   WHAT WE DO
========================================================= */

const focusAreas = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Research',
    text: 'Discover research initiatives, academic collaborations and opportunities designed for scholars.',
    link: '/research',
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Conferences',
    text: 'Connect with academics and research leaders through conferences, forums and scholarly events.',
    link: '/conferences/upcoming',
  },
  {
    icon: Users,
    number: '03',
    title: 'Membership',
    text: 'Join an international community built around knowledge sharing, collaboration and professional growth.',
    link: '/membership',
  },
  {
    icon: GraduationCap,
    number: '04',
    title: 'Training',
    text: 'Strengthen research, teaching and professional capabilities through focused development programs.',
    link: '/training',
  },
];


/* =========================================================
   LATEST UPDATES
========================================================= */

const updates = [
  {
    category: 'Featured Event',
    title: 'Research, Collaboration and the Future of Academic Communities',
    text: 'A new international forum bringing researchers and institutions together.',
    meta: 'Coming Soon',
  },
  {
    category: 'Research Opportunity',
    title: 'International Academic Collaboration Initiative',
    text: 'Explore new opportunities for research partnerships and cross-border collaboration.',
    meta: 'Open',
  },
  {
    category: 'ASMMR Update',
    title: 'Growing Our Global Research Community',
    text: 'New scholars, universities and academic partners are joining the network.',
    meta: 'Latest',
  },
];


/* =========================================================
   MEMBERSHIP BENEFITS
========================================================= */

const benefits = [
  'Global research networking',
  'Academic development opportunities',
  'Conferences and scholarly events',
  'Professional visibility',
];


/* =========================================================
   KNOWLEDGE
========================================================= */

const knowledgeCards = [
  {
    icon: BookOpen,
    title: 'Asian Business Research',
    text: 'Explore scholarly work focusing on management, marketing and emerging business environments.',
  },
  {
    icon: GraduationCap,
    title: 'Research Resources',
    text: 'Access academic resources, research guidance and professional development content.',
  },
  {
    icon: Sparkles,
    title: 'Global Opportunities',
    text: 'Discover calls for papers, fellowships, partnerships and research opportunities.',
  },
];


/* =========================================================
   PARTNERS
========================================================= */

const partners = [
  'Academic Institutions',
  'Research Networks',
  'Universities',
  'Professional Bodies',
  'International Partners',
];


/* =========================================================
   TIMELINE
========================================================= */

const timeline = [
  {
    year: '2012',
    title: 'The Beginning',
    text: 'ASMMR began building a platform for researchers and academic collaboration.',
  },
  {
    year: '2013',
    title: 'International Expansion',
    text: 'The research community expanded through international academic engagement.',
  },
  {
    year: '2014',
    title: 'Global Conferences',
    text: 'Researchers and institutions connected across borders through major academic events.',
  },
  {
    year: 'Today',
    title: 'A Growing Community',
    text: 'ASMMR continues developing a global ecosystem for research, learning and collaboration.',
  },
];


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
}) {
  return (
    <div
      className={`home-section-heading ${
        align === 'center'
          ? 'home-section-heading--center'
          : ''
      }`}
    >
      <p className="home-eyebrow">
        {eyebrow}
      </p>

      <h2>
        {title}
      </h2>

      {text && (
        <p className="home-section-description">
          {text}
        </p>
      )}
    </div>
  );
}


/* =========================================================
   COLLABORATION CAROUSEL
========================================================= */

function CollaborationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] =
    useState(true);
  const [paused, setPaused] = useState(false);

  /*
    Duplicating all certificates makes the ending
    transition look continuous before we reset to 0.
  */
  const loopItems = [
    ...collaborations,
    ...collaborations,
  ];


  useEffect(() => {
    if (paused) return;

    const slider = setInterval(() => {
      setTransitionEnabled(true);

      setCurrentIndex((previous) => previous + 1);
    }, 3000);

    return () => clearInterval(slider);
  }, [paused]);


  function handleTransitionEnd() {
    if (currentIndex >= collaborations.length) {
      setTransitionEnabled(false);
      setCurrentIndex(0);
    }
  }


  function nextSlide() {
    setTransitionEnabled(true);

    setCurrentIndex((previous) => previous + 1);
  }


  function previousSlide() {
    setTransitionEnabled(true);

    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(collaborations.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          setCurrentIndex(
            collaborations.length - 1
          );
        });
      });

      return;
    }

    setCurrentIndex((previous) => previous - 1);
  }


  return (
    <section className="home-collaboration-bar">

      <div className="container">

        {/* Heading */}
        <div className="home-collaboration-header">

          <div clas
>
            <h2 className="home-collaboration-eyebrow">
              Global Collaborations
            </h2>

            

        

          </div>

        </div>


        {/* Carousel */}
        <div
          className="home-collaboration-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          <div
            className={`home-collaboration-track ${
              transitionEnabled
                ? 'home-collaboration-track--animated'
                : ''
            }`}
            style={{
              '--carousel-index': currentIndex,
            }}
            onTransitionEnd={handleTransitionEnd}
          >

            {loopItems.map((item, index) => (

              <div
                className="home-collaboration-slide"
                key={`${item.id}-${index}`}
              >

                <div className="home-certificate-item">

                  <div className="home-certificate-ring">

                    <div className="home-certificate-circle">

                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />

                    </div>

                  </div>

                  <h3>
                    {item.name}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Bottom Line */}
        <div className="home-collaboration-footer">

          <span />

          <p>
            Academic • Institutional • Research
            Collaboration
          </p>

          <span />

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  return (
    <div className="home-page">

      {/* ===================================================
          HERO
      ==================================================== */}

      <div className="home-hero-shell">

        <Header />

        <section className="home-hero">

          <div className="container home-hero-grid">

            {/* LEFT */}
            <div className="home-hero-copy">

            


              <h1>
                Connecting Researchers.
                <span>
                  Advancing Knowledge.
                </span>
                Creating Global Impact.
              </h1>


              <p>
                
              </p>


              <div className="home-hero-actions">

                <Link
                  to="/join"
                  className="home-button home-button--primary"
                >
                  Join ASMMR
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/about"
                  className="home-button home-button--secondary"
                >
                  Explore Our Work
                </Link>

              </div>


          

            </div>


            {/* RIGHT VISUAL */}
            <div className="home-hero-visual">

              <div className="home-network-orbit home-network-orbit--one" />

              <div className="home-network-orbit home-network-orbit--two" />


              <div className="home-network-globe">

                <Globe2 />

                <span className="home-network-dot home-network-dot--one" />

                <span className="home-network-dot home-network-dot--two" />

                <span className="home-network-dot home-network-dot--three" />

                <span className="home-network-dot home-network-dot--four" />

              </div>


              <div className="home-floating-card home-floating-card--top">

                <div className="home-floating-icon">
                  <Users size={20} />
                </div>

                <div>
                  <strong>
                    Global Community
                  </strong>

                  <span>
                    Researchers across borders
                  </span>
                </div>

              </div>


              <div className="home-floating-card home-floating-card--bottom">

                <div className="home-floating-icon">
                  <Network size={20} />
                </div>

                <div>
                  <strong>
                    Academic Network
                  </strong>

                  <span>
                    Connect. Collaborate. Grow.
                  </span>
                </div>

              </div>


              <div className="home-visual-badge">

                <Sparkles size={16} />

                Research without borders

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* ===================================================
          NEW COLLABORATION CAROUSEL
      ==================================================== */}

      <CollaborationCarousel />


      {/* ===================================================
          TRUST STRIP
      ==================================================== */}

      <section className="home-trust-strip">

        <div className="container home-trust-grid">

          <div>

            <Globe2 />

            <span>
              <strong>
                Global Network
              </strong>

              International academic community
            </span>

          </div>


          <div>

            <CalendarDays />

            <span>
              <strong>
                Academic Events
              </strong>

              Conferences & workshops
            </span>

          </div>


          <div>

            <BookOpen />

            <span>
              <strong>
                Knowledge
              </strong>

              Research & publications
            </span>

          </div>


          <div>

            <Building2 />

            <span>
              <strong>
                Collaboration
              </strong>

              Institutions & researchers
            </span>

          </div>

        </div>

      </section>


      {/* ===================================================
          WHAT WE DO
      ==================================================== */}

      <section className="home-focus-section">

        <div className="container">

          <SectionHeading
            eyebrow="What We Do"
            title="Built for the research community."
            text="ASMMR connects people, ideas and institutions through four core areas designed to strengthen academic collaboration."
          />


          <div className="home-focus-grid">

            {focusAreas.map((item) => {

              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="home-focus-card"
                >

                  <div className="home-focus-card-top">

                    <div className="home-focus-icon">
                      <Icon size={25} />
                    </div>

                    <span className="home-focus-number">
                      {item.number}
                    </span>

                  </div>


                  <h3>
                    {item.title}
                  </h3>


                  <p>
                    {item.text}
                  </p>


                  <span className="home-focus-link">

                    Explore

                    <ArrowRight size={17} />

                  </span>

                </Link>
              );

            })}

          </div>

        </div>

      </section>


     


      {/* ===================================================
          MEMBERSHIP
      ==================================================== */}

      <section className="home-membership-section">

        <div className="container home-membership-grid">

          <div className="home-membership-copy">

            <p className="home-eyebrow">
              Membership
            </p>


            <h2>
              A community built
              <span>
                {' '}for researchers.
              </span>
            </h2>


            <p>
              Build meaningful academic connections,
              discover professional opportunities and
              become part of a growing international
              research community.
            </p>


            <div className="home-benefits">

              {benefits.map((benefit) => (

                <div key={benefit}>

                  <CheckCircle2 size={18} />

                  {benefit}

                </div>

              ))}

            </div>


            <Link
              to="/join"
              className="home-button home-button--dark"
            >
              Become a Member

              <ArrowRight size={18} />
            </Link>

          </div>


          <div className="home-membership-visual">

            <div className="home-member-visual-card">

              <p>
                ASMMR Community
              </p>


              <h3>
                Connect with scholars across borders.
              </h3>


              <div className="home-member-avatars">

                <span>AM</span>

                <span>RK</span>

                <span>SN</span>

                <span>+25</span>

              </div>


              <div className="home-member-network-line" />


              <div className="home-member-stat">

                <Globe2 />

                <span>

                  <strong>
                    Global Academic Network
                  </strong>

                  Connecting knowledge across regions

                </span>

              </div>

            </div>


            <div className="home-membership-shape home-membership-shape--one" />

            <div className="home-membership-shape home-membership-shape--two" />

          </div>

        </div>

      </section>


      {/* ===================================================
          CONFERENCES
      ==================================================== */}

      <section className="home-conference-section">

        <div className="container">

          <SectionHeading
            eyebrow="Conferences & Events"
            title="Where ideas and researchers meet."
            text="ASMMR conferences create spaces for academics, institutions and research leaders to exchange knowledge and build meaningful connections."
          />


          <div className="home-conference-feature">

            <div className="home-conference-art">

              <span className="home-conference-year">
                ASMMR
              </span>


              <div className="home-conference-symbol">
                <Globe2 />
              </div>


              <div className="home-conference-art-copy">

                <span>
                  Academic Conference
                </span>

                <strong>
                  Research
                  <br />
                  Without Borders
                </strong>

              </div>

            </div>


            <div className="home-conference-copy">

              <span className="home-content-tag home-content-tag--light">
                Featured Conference
              </span>


              <h3>
                International Research & Academic
                Collaboration Conference
              </h3>


              <p>
                Join researchers, academics and
                institutional leaders for an exchange of
                research, perspectives and ideas.
              </p>


              <div className="home-conference-meta">

                <span>

                  <CalendarDays size={18} />

                  Coming Soon

                </span>


                <span>

                  <MapPin size={18} />

                  International

                </span>

              </div>


              <Link
                to="/conferences/upcoming"
                className="home-button home-button--primary"
              >
                Explore Conferences

                <ArrowRight size={18} />
              </Link>

            </div>

          </div>


          <div className="home-conference-links">

            <Link to="/conferences/upcoming">

              <span>
                Upcoming Conferences
              </span>

              <ArrowRight />

            </Link>


            <Link to="/conferences/previous">

              <span>
                Previous Conferences
              </span>

              <ArrowRight />

            </Link>


            <Link to="/conferences/proceedings">

              <span>
                Conference Proceedings
              </span>

              <ArrowRight />

            </Link>

          </div>

        </div>

      </section>


      {/* ===================================================
          KNOWLEDGE
      ==================================================== */}

      <section className="home-knowledge-section">

        <div className="container">

          <SectionHeading
            eyebrow="Knowledge & Resources"
            title="Knowledge without borders."
            text="Explore research, publications and resources developed to support the global academic community."
            align="center"
          />


          <div className="home-knowledge-grid">

            {knowledgeCards.map((item) => {

              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="home-knowledge-card"
                >

                  <div className="home-knowledge-icon">
                    <Icon />
                  </div>


                  <h3>
                    {item.title}
                  </h3>


                  <p>
                    {item.text}
                  </p>


                  <Link to="/resources">

                    Discover more

                    <ArrowRight size={17} />

                  </Link>

                </article>
              );

            })}

          </div>

        </div>

      </section>


      {/* ===================================================
          JOURNAL
      ==================================================== */}

      <section className="home-journal-section">

        <div className="container home-journal-card">

          <div className="home-journal-copy">

            <p className="home-eyebrow">
              ASMMR Publications
            </p>


            <h2>
              Journal of Asian
              <br />
              Business Research
            </h2>


            <p>
              Supporting scholarly research in business,
              management, marketing and emerging market
              contexts.
            </p>


            <div className="home-journal-actions">

              <Link
                to="/jabr"
                className="home-button home-button--primary"
              >
                Explore Journal

                <ArrowRight size={18} />
              </Link>


              <Link
                to="/jabr"
                className="home-inline-link"
              >
                Submit Research
              </Link>

            </div>

          </div>


          <div className="home-journal-cover-wrap">

            <div className="home-journal-cover">

              <div className="home-journal-cover-top">

                <span>
                  ASMMR
                </span>

                <Globe2 />

              </div>


              <div className="home-journal-cover-middle">

                <small>
                  Journal of
                </small>


                <strong>
                  Asian
                  <br />
                  Business
                  <br />
                  Research
                </strong>

              </div>


              <div className="home-journal-cover-bottom">
                Research • Management • Marketing
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          PARTNERS
      ==================================================== */}

      <section className="home-partners-section">

        <div className="container">

          <SectionHeading
            eyebrow="Collaboration"
            title="Connected with the global academic community."
            text="ASMMR works to build meaningful relationships with researchers, institutions and professional networks."
            align="center"
          />


          <div className="home-partner-row">

            {partners.map((partner, index) => (

              <div
                key={partner}
                className="home-partner-item"
              >

                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {partner}

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ===================================================
          LEGACY
      ==================================================== */}

      <section className="home-legacy-section">

        <div className="container">

          <div className="home-legacy-header">

            <div>

              <p className="home-eyebrow">
                Our Journey
              </p>


              <h2>
                A legacy of connecting
                <br />
                researchers.
              </h2>

            </div>


            <p>
              From academic events to international
              research networks, ASMMR continues building
              connections that move knowledge forward.
            </p>

          </div>


          <div className="home-timeline">

            {timeline.map((item, index) => (

              <div
                key={item.year}
                className="home-timeline-item"
              >

                <div className="home-timeline-marker">

                  <span />

                  {index !== timeline.length - 1 && (
                    <i />
                  )}

                </div>


                <p>
                  {item.year}
                </p>


                <h3>
                  {item.title}
                </h3>


                <span className="home-timeline-copy">
                  {item.text}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ===================================================
          FINAL CTA
      ==================================================== */}

      <section className="home-final-section">

        <div className="container">

          <div className="home-final-card">

            <div className="home-final-copy">

              <p className="home-eyebrow">
                Join the Community
              </p>


              <h2>
                Be part of something
                <span>
                  {' '}bigger than research.
                </span>
              </h2>


              <p>
                Connect with researchers, discover
                academic opportunities and contribute to
                a growing international community.
              </p>


              <div className="home-final-actions">

                <Link
                  to="/join"
                  className="home-button home-button--white"
                >
                  Join ASMMR

                  <ArrowRight size={18} />
                </Link>


                <Link
                  to="/membership"
                  className="home-final-link"
                >
                  Explore Membership
                </Link>

              </div>

            </div>


            <div className="home-final-visual">

              <div className="home-final-globe">
                <Globe2 />
              </div>


              <div className="home-final-ring home-final-ring--one" />

              <div className="home-final-ring home-final-ring--two" />


              <span className="home-final-node home-final-node--one" />

              <span className="home-final-node home-final-node--two" />

              <span className="home-final-node home-final-node--three" />

            </div>

          </div>

        </div>

      </section>


      <Footer />

    </div>
  );
}