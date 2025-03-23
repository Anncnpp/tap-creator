
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProcessFlow from '@/components/ProcessFlow';
import FileUpload from '@/components/FileUpload';
import TagManagement from '@/components/TagManagement';
import ResultsDisplay from '@/components/ResultsDisplay';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        window.scrollTo({
          top: (target as HTMLElement).offsetTop - 80, // Adjust for header
          behavior: 'smooth'
        });
      });
    });
  }, []);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
        <FileUpload />
        <ProcessFlow />
        <TagManagement />
        <ResultsDisplay />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
