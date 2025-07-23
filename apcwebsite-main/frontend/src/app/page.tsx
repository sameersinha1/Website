'use client';

// 1. React and core libraries
import React, { useState, useEffect } from 'react';

// 2. Third-party animation and UI libraries
import { motion, AnimatePresence, HTMLMotionProps} from 'framer-motion';
import Lenis from 'lenis';

// 3. Next.js specific components
import Image from 'next/image';

// 4. All lucide-react icons (consolidated)
import {
  Mail, Phone, Twitter, Linkedin, Github, MessagesSquare,
  Calendar, Clock, MapPin, Users, Code, Sparkles,
  ArrowRight, ChevronDown, Menu, X, Award, Zap,
  ChevronLeft, ChevronRight, Eye, Star, Trophy, Heart
} from 'lucide-react';

// 5. Local components
import RegistrationForm from './f';
import { Typewriter } from 'react-simple-typewriter'


/* ──────────────────────────────────────────────────
   Mock Data
   ────────────────────────────────────────────────── */
const upcomingEvent = {
  title: 'AI/ML Workshop',
  subtitle: 'Building Your First Neural Network',
  date: 'Aug 15, 2025',
  time: '2:00 – 5:00 PM',
  location: 'Tech Lab A',
  description: 'Dive into ML fundamentals. Perfect for beginners!',
  spots: 25,
  registered: 18
};

const pastEvents = [
  /* ↓ add / replace images with real assets ↓ */
  {
    id: 1,
    title: 'HackFest 2025',
    date: 'June 20-22, 2025',
    participants: 150,
    duration: '48 hours',
    location: 'Main Campus',
    shortDescription: 'Epic 48-hour coding marathon',
    fullDescription:
      'Our biggest hackathon yet! Teams battled through the night building innovative solutions across multiple tracks including AI/ML, Web3 and Social Impact. Winners received cash prizes up to $5000 and internship opportunities.',
    highlights: [
      '25 teams competed',
      '$10 000 in total prizes',
      'Industry mentors from Google, Microsoft',
      '3 problem tracks'
    ],
    images: ['/hackathon1.jpg', '/hackathon2.jpg'],
    technologies: ['React', 'Python', 'TensorFlow', 'Blockchain'],
    winners: {
      first: 'AI Health Assistant',
      second: 'EcoTrack App',
      third: 'DeFi Portfolio Manager'
    },
    rating: 4.9,
    category: 'Competition'
  },
  {
    id: 2,
    title: 'React.js Masterclass',
    date: 'May 18, 2025',
    participants: 80,
    duration: '6 hours',
    location: 'Tech Lab B',
    shortDescription: 'Advanced React patterns workshop',
    fullDescription:
      'Deep dive into React 18 features, advanced patterns, and performance optimisation. Led by senior engineers from top tech companies.',
    highlights: [
      'React 18 new features',
      'Performance optimisation',
      'Custom hooks workshop',
      'Real projects built'
    ],
    images: ['/react1.jpg', '/react2.jpg'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    instructor: 'Sarah Chen – Senior Engineer at Meta',
    projects: ['Real-time Chat App', 'E-commerce Dashboard'],
    rating: 4.8,
    category: 'Workshop'
  },
  {
    id: 3,
    title: 'Open Source Contribution Day',
    date: 'April 25, 2025',
    participants: 60,
    duration: '4 hours',
    location: 'Innovation Hub',
    shortDescription: 'Learn to contribute to open source',
    fullDescription:
      'Beginner-friendly session on contributing to open-source projects. Participants made their first PRs to popular repositories and learned about Git workflows, code reviews and community guidelines.',
    highlights: [
      '40+ first-time contributors',
      '15 successful PRs merged',
      'Git / GitHub mastery',
      'Open-source best practices'
    ],
    images: ['/opensource1.jpg', '/opensource2.jpg'],
    technologies: ['Git', 'GitHub', 'Various Languages'],
    achievements: { totalPRs: 23, repositories: 8, newContributors: 42 },
    rating: 4.7,
    category: 'Workshop'
  },
  {
    id: 4,
    title: 'Blockchain & DeFi Summit',
    date: 'March 30, 2025',
    participants: 90,
    duration: 'Full day',
    location: 'Auditorium',
    shortDescription: 'Crypto and smart-contract deep dive',
    fullDescription:
      'Comprehensive introduction to blockchain technology, cryptocurrency fundamentals and DeFi protocols. Featured guest speakers from leading crypto companies.',
    highlights: [
      'Industry expert speakers',
      'Smart-contract deployment',
      'DeFi protocol analysis',
      'Networking with crypto professionals'
    ],
    images: ['/blockchain1.jpg', '/blockchain2.jpg'],
    technologies: ['Solidity', 'Web3.js', 'Ethereum', 'MetaMask'],
    speakers: [
      'Alex Johnson – Ethereum Foundation',
      'Maria Rodriguez – Chainlink Labs'
    ],
    rating: 4.6,
    category: 'Conference'
  }
];

const stats = [
  { icon: Users, value: '500+', label: 'Active Members' },
  { icon: Award, value: '50+', label: 'Events Hosted' },
  { icon: Github, value: '200+', label: 'Projects Built' },
  { icon: Zap, value: '10+', label: 'Industry Partners' }
];

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
}

/* ──────────────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 12 }
  }
};

/* ──────────────────────────────────────────────────
   UI Primitives
   ────────────────────────────────────────────────── */
const Card = ({
  children,
  className = '',
  ...props
}: CardProps) => (
  <motion.div
    className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 200 }}
    {...props}
  >
    {children}
  </motion.div>
);

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...props
}: ButtonProps & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const baseClasses =
    'font-semibold rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-slate-500/30';

  const variants = {
    primary:
      'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-slate-800/50 border border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white',
    ghost:
      'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/* ──────────────────────────────────────────────────
   Floating Particles
   ────────────────────────────────────────────────── */
const FloatingElements = () => {
  const elements = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute bg-gradient-to-r from-slate-400/20 to-slate-500/20 rounded-full blur-sm"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.size}px`,
            height: `${el.size}px`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: el.delay
          }}
        />
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────────────
   Event Detail Modal
   ────────────────────────────────────────────────── */
const EventDetailModal = ({
  event,
  isOpen,
  onClose
}: {
  event: (typeof pastEvents)[number] | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Competition':
        return Trophy;
      case 'Workshop':
        return Code;
      case 'Conference':
        return Users;
      default:
        return Star;
    }
  };

  const CategoryIcon = getCategoryIcon(event?.category);

  return (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 rounded-t-3xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-800/50 rounded-xl">
                      <CategoryIcon className="text-slate-400" size={20} />
                    </div>
                    <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="mr-1" size={14} fill="currentColor" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Calendar className="mr-1" size={14} />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1" size={14} />
                      {event.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1" size={14} />
                      {event.participants} participants
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  About This Event
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/30"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-3" />
                      <span className="text-slate-300 text-sm">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Technologies Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-600/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conditional Sections */}
              {event.winners && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🏆 Winners
                  </h3>
                  {(['first', 'second', 'third'] as const).map((pos) => (
                    <div
                      key={pos}
                      className={`flex justify-between p-3 rounded-xl mb-2 ${
                        pos === 'first'
                          ? 'bg-yellow-500/10 border border-yellow-500/20'
                          : 'bg-slate-800/40 border border-slate-700/30'
                      }`}
                    >
                      <span className="font-medium text-slate-300 capitalize">
                        {pos === 'first' ? '🥇 1st' : pos === 'second' ? '🥈 2nd' : '🥉 3rd'}
                      </span>
                      <span className="text-white">{event.winners[pos]}</span>
                    </div>
                  ))}
                </div>
              )}
              {event.projects && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Projects Built
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.projects.map((p) => (
                      <div
                        key={p}
                        className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30"
                      >
                        <span className="text-slate-300">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {event.speakers && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Featured Speakers
                  </h3>
                  {event.speakers.map((s) => (
                    <div
                      key={s}
                      className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30 mb-2"
                    >
                      <span className="text-slate-300">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Location */}
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-slate-400" size={18} />
                  <span className="text-slate-300">Held at {event.location}</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Heart className="mr-1" size={16} />
                  <span className="text-sm">{event.participants} attended</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ──────────────────────────────────────────────────
   Sliding Past Events
   ────────────────────────────────────────────────── */
const SlidingPastEvents = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<(typeof pastEvents)[number] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerView = 3;
  const totalSlides = Math.ceil(pastEvents.length / itemsPerView);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + totalSlides) % totalSlides);

  const openEvent = (e: (typeof pastEvents)[number]) => {
    setSelectedEvent(e);
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <motion.h2
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          📸 Event Gallery
        </motion.h2>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={prevSlide}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="text-slate-400" size={18} />
          </motion.button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full ${
                  i === currentSlide ? 'bg-slate-400' : 'bg-slate-700'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextSlide}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight className="text-slate-400" size={18} />
          </motion.button>
        </div>
      </div>

      {/* Sliding Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          animate={{ x: `${-currentSlide * 100}%` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIdx) => (
            <div key={slideIdx} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1">
                {pastEvents
                  .slice(slideIdx * itemsPerView, (slideIdx + 1) * itemsPerView)
                  .map((event, idx) => (
                    <motion.div
                      key={event.id}
                      className="group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => openEvent(event)}
                    >
                      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 hover:bg-slate-800/80 transition-all group-hover:scale-[1.02] group-hover:shadow-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  event.category === 'Competition'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : event.category === 'Workshop'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : event.category === 'Conference'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-green-500/20 text-green-400'
                                }`}
                              >
                                {event.category}
                              </span>
                              <div className="flex items-center text-yellow-400">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs ml-1">{event.rating}</span>
                              </div>
                            </div>
                            <h3 className="font-bold text-white text-sm mb-1 truncate">
                              {event.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2">
                              {event.shortDescription}
                            </p>
                          </div>
                          <div className="p-1.5 bg-slate-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <Eye size={14} className="text-slate-300" />
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar className="mr-1.5" size={12} />
                            {event.date.split(',')[0]}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-slate-400">
                              <Users className="mr-1.5" size={12} />
                              {event.participants}
                            </div>
                            <div className="flex items-center text-slate-400">
                              <Clock className="mr-1.5" size={12} />
                              {event.duration}
                            </div>
                          </div>
                        </div>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.technologies.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs"
                            >
                              {t}
                            </span>
                          ))}
                          {event.technologies.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">
                              +{event.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-slate-500">
                            <MapPin className="mr-1" size={10} />
                            {event.location}
                          </div>
                          <motion.button
                            className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye size={12} />
                            Details
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────────── */
export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ... your existing state/hooks ...

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,        // scroll duration (seconds)
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // custom ease
      orientation: 'vertical'
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.stop();  // cleanup on unmount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'stats', 'upcoming', 'past', 'join-us'];
      const scrollPos = window.scrollY + 100;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'upcoming', label: 'Events' },
    { id: 'past', label: 'Gallery' },
    { id: 'join-us', label: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-slate-100 overflow-x-hidden">
      <FloatingElements />

      {/* Registration Form */}
      <RegistrationForm isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />

      {/* ───────── Header ───────── */}
      <motion.header
        className="w-full py-4 bg-slate-900/90 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-slate-700/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo / Brand */}
          <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
            <Image
              src="/logo.png"
              alt="APC Logo"
              width={45}
              height={45}
              className="rounded-xl shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">
                APC
              </h1>
              <p className="text-xs text-slate-400">Amity Programming Club</p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => scrollTo(n.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeSection === n.id
                        ? 'text-white bg-slate-700/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA / Mobile Menu */}
          <div className="flex items-center space-x-3">
            <Button size="sm" onClick={() => setIsRegistrationOpen(true)} className="hidden sm:block">
              Join Now
            </Button>

            <motion.button
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {navItems.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => scrollTo(n.id)}
                    className="block w-full text-left px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-lg"
                  >
                    {n.label}
                  </button>
                ))}
                <Button className="w-full mt-4" onClick={() => setIsRegistrationOpen(true)}>
                  Join Programming Club
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ───────── Hero ───────── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center text-center px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        <motion.div
          className="relative z-10 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-full text-sm text-slate-300">
              🚀 Building the future, one line at a time
            </span>
          </motion.div>

          <motion.h2 className="text-5xl md:text-7xl font-black leading-tight mb-8" variants={itemVariants}>
            Code Your
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
            <Typewriter
          words={['Digital Future', 'Own Legacy', 'Love For Technology']}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={50}
          deleteSpeed={20}
          delaySpeed={1500}
        />
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-300 leading-relaxed"
            variants={itemVariants}
          >
            Join our vibrant community of developers, innovators and problem-solvers. Transform ideas into reality through code.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => scrollTo('upcoming')} className="group flex items-center gap-2">
              Explore Events
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="text-slate-400" size={28} />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────── Stats ───────── */}
      <motion.section
        id="stats"
        className="py-20 bg-slate-800/30 backdrop-blur-sm border-y border-slate-700/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700/50 rounded-2xl mb-4">
                  <s.icon className="text-slate-300" size={24} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-slate-400 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ───────── Main Content ───────── */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Event */}
          <motion.section
            id="upcoming"
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-8" variants={itemVariants}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">
                🎯 Next Event
              </span>
            </motion.h2>

            <Card className="p-6 border-slate-600/50" variants={cardVariants}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{upcomingEvent.title}</h3>
                  <p className="text-slate-400 text-sm">{upcomingEvent.subtitle}</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  {upcomingEvent.spots - upcomingEvent.registered} spots left
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-slate-400">
                  <Calendar className="mr-2" size={16} />
                  {upcomingEvent.date}
                </div>
                <div className="flex items-center text-slate-400">
                  <Clock className="mr-2" size={16} />
                  {upcomingEvent.time}
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="mr-2" size={16} />
                  {upcomingEvent.location}
                </div>
                <div className="flex items-center text-slate-400">
                  <Users className="mr-2" size={16} />
                  {upcomingEvent.registered}/{upcomingEvent.spots}
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">{upcomingEvent.description}</p>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => setIsRegistrationOpen(true)}>
                  <Users className="mr-2" size={16} /> Register Now
                </Button>
              </div>
            </Card>
          </motion.section>

          {/* Past Events (Sliding) */}
          <motion.section
            id="past"
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SlidingPastEvents />
          </motion.section>
        </div>
      </main>

      {/* ───────── Join Us ───────── */}
      <motion.section
        id="join-us"
        className="relative py-20 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.1),transparent_70%)]" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-slate-700/50 border border-slate-600/30 rounded-full text-sm text-slate-300 mb-6">
              Ready to start coding?
            </span>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Join Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">
                Community
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of something bigger. Learn, build and grow with passionate developers.
            </p>

            <Button size="lg" className="group" onClick={() => setIsRegistrationOpen(true)}>
              <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" size={20} /> Start Your Journey
            </Button>
          </motion.div>
        </div>
      </motion.section>

            {/* ───────── Contact Us Footer ───────── */}
      {/* ───────── Contact Us Footer ───────── */}
<motion.footer
  id="contact-us"
  className="bg-slate-900/90 backdrop-blur-xl text-slate-200 py-12 mt-16"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
    {/* Contact Info */}
    <div>
      <h3 className="text-xl font-bold mb-4">Contact Us</h3>
      <p className="text-sm">
        Have questions or want to collaborate? Reach out to us:
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center">
          <Mail className="mr-2 text-slate-400 hover:text-white transition-colors" size={16} />
          <a href="mailto:programmingclub@example.com" className="hover:text-white">
            programmingclub@example.com
          </a>
        </li>
        <li className="flex items-center">
          <Phone className="mr-2 text-slate-400 hover:text-white transition-colors" size={16} />
          <a href="tel:+1234567890" className="hover:text-white">
            +1 (234) 567-890
          </a>
        </li>
        <li className="flex items-center">
          <MapPin className="mr-2 text-slate-400 hover:text-white transition-colors" size={16} />
          123 Tech Lane, Innovation City
        </li>
      </ul>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-bold mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <button onClick={() => scrollTo('hero')} className="hover:text-white">
            Home
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo('upcoming')} className="hover:text-white">
            Events
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo('past')} className="hover:text-white">
            Gallery
          </button>
        </li>
        <li>
          <button onClick={() => scrollTo('join-us')} className="hover:text-white">
            Join Us
          </button>
        </li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="text-xl font-bold mb-4">Follow Us</h3>
      <div className="flex space-x-4">
        <a href="https://twitter.com/" className="hover:text-white" title="Twitter">
          <Twitter size={24} />
        </a>
        <a href="https://linkedin.com/in/" className="hover:text-white" title="LinkedIn">
          <Linkedin size={24} />
        </a>
        <a href="https://github.com/" className="hover:text-white" title="GitHub">
          <Github size={24} />
        </a>
        <a href="https://whatsapp.com/send?phone=8002350236" className="hover:text-white" title="WhatsApp">
          <MessagesSquare size={24} />
        </a>
      </div>
    </div>
  </div>

  <div className="border-t border-slate-700/50 mt-8 pt-6 text-center text-sm text-slate-500">
    © {new Date().getFullYear()} APC Programming Club. All rights reserved.
  </div>
</motion.footer>

      {/* ───────── Scrollbar Styles ───────── */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}