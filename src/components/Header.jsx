import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [''];

export default function Header({ light = false }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown((current) => current === name ? null : name);
  };

  const closeNavigation = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className={`site-header ${light ? 'site-header--light' : ''}`}>
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="ASMMR home">
          <img src="/asmmr-logo.png" alt="ASMMR" />
        </Link>
        <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link} to={link === 'Home' ? '/' : `/#${link.toLowerCase()}`} onClick={closeNavigation}>
              {link}
            </NavLink>
          ))}
          <div className={`nav-dropdown ${openDropdown === 'about' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="About us pages" aria-haspopup="true" aria-expanded={openDropdown === 'about'} onClick={() => toggleDropdown('about')}>
              About us <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/aboutus/vision&mission" onClick={closeNavigation}>Vision &amp; Mission</Link>
              <Link to="/aboutus/leadership" onClick={closeNavigation}>Leadership Team</Link>
              <Link to="/aboutus/advisory-board" onClick={closeNavigation}>Advisory Board</Link>
              <Link to="/aboutus/partners&collaboration" onClick={closeNavigation}>Partners &amp; Collaborations</Link>
            </div>
          </div>
          <div className={`nav-dropdown ${openDropdown === 'conferences' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="Conferences and Events pages" aria-haspopup="true" aria-expanded={openDropdown === 'conferences'} onClick={() => toggleDropdown('conferences')}>
              Conferences <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/conferences/upcoming" onClick={closeNavigation}>Upcoming Conferences</Link>
              <Link to="/conferences/previous" onClick={closeNavigation}>Previous Conferences</Link>
              <Link to="/conferences/proceedings" onClick={closeNavigation}>Conference Proceedings</Link>
            </div>
          </div>
         
          <div className={`nav-dropdown ${openDropdown === 'training' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="Training and Development pages" aria-haspopup="true" aria-expanded={openDropdown === 'training'} onClick={() => toggleDropdown('training')}>
              Training <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/training/workshops" onClick={closeNavigation}>Workshops &amp; Trainings</Link>
              <Link to="/training/seminars" onClick={closeNavigation}>Seminars &amp; Webinars</Link>
            </div>
          </div>
          <div className={`nav-dropdown ${openDropdown === 'publications' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="Publication pages" aria-haspopup="true" aria-expanded={openDropdown === 'publications'} onClick={() => toggleDropdown('publications')}>
              Publications <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/publications/journal" onClick={closeNavigation}>Journal</Link>
              <Link to="/publications/case-studies" onClick={closeNavigation}>Case Studies</Link>
            </div>
          </div>
          <div className={`nav-dropdown ${openDropdown === 'resources' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="Resource pages" aria-haspopup="true" aria-expanded={openDropdown === 'resources'} onClick={() => toggleDropdown('resources')}>
              Resources <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/resources/funding" onClick={closeNavigation}>Funding &amp; Grants</Link>
              <Link to="/resources/fellowship" onClick={closeNavigation}>Fellowships</Link>
              <Link to="/resources/scholarship" onClick={closeNavigation}>Scholarships</Link>
              <Link to="/resources/survey" onClick={closeNavigation}>Survey Form</Link>
            </div>
          </div>
           <div className={`nav-dropdown ${openDropdown === 'membership' ? 'is-expanded' : ''}`}>
            <button type="button" className="nav-dropdown-trigger" aria-label="Membership pages" aria-haspopup="true" aria-expanded={openDropdown === 'membership'} onClick={() => toggleDropdown('membership')}>
              Membership <ChevronDown size={15} />
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/membership/network" onClick={closeNavigation}>Membership Network</Link>
              <Link to="/membership/benefits" onClick={closeNavigation}>Membership Benefits</Link>
            </div>
          </div>
          <a href="/#contact" onClick={closeNavigation}>Contact</a>
          <button className="icon-button nav-search" aria-label="Search"><Search size={18} /></button>
          <Link className="button button--small" to={user ? (user.role === 'admin' ? '/admin' : user.role === 'reviewer' ? '/reviewer' : '/portal') : '/auth'} onClick={closeNavigation}>{user ? (user.role === 'admin' ? 'Admin' : user.role === 'reviewer' ? 'Reviewer' : 'My portal') : 'Sign in'}</Link>
        </nav>
        <button className="icon-button menu-button" onClick={() => { setOpen(!open); setOpenDropdown(null); }} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
