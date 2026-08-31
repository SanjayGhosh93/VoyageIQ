// frontend/src/layouts/MainLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SihDemoModal } from '../components/SihDemoModal';

export const MainLayout = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('MainLayout video autoplay prevented:', error);
        });
      }
    }
  }, []);

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Live Full Video Background running behind the whole website */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105 opacity-75 dark:opacity-65 filter brightness-105 contrast-105 transition-opacity duration-500"
        >
          <source
            src="https://res.cloudinary.com/q5farw7j/video/upload/v1788187150/Person_standing_by_cargo_ship_202608301651_online-video-cutter.com.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Translucent Glass Tint */}
        <div
          data-video-overlay="true"
          className="video-overlay absolute inset-0 backdrop-blur-[0.5px]"
        />
      </div>

      {/* Main Workspace Area (Sidebar + Scrollable Main Content) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar onOpenDemo={() => setDemoOpen(true)} />

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar onOpenDemo={() => setDemoOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth bg-transparent transition-colors">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet context={{ openDemo: () => setDemoOpen(true) }} />
            </div>
          </main>
        </div>
      </div>

      {/* Attached Full-Width Footer */}
      <div className="relative z-20 w-full shrink-0">
        <Footer />
      </div>

      {/* Global SIH 1-Click Demo Modal */}
      <SihDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default MainLayout;

