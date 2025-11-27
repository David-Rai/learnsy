import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SelectACategory = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen w-full bg-bg flex items-center justify-center px-6 py-12 md:py-0 overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <section className="relative z-10 w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-lg w-full text-center space-y-10 md:space-y-14"
        >
          {/* Header */}
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text">
              Ready to <span className="text-primary">explore</span>?
            </h1>

            <p className="text-base sm:text-lg md:text-xl opacity-80 max-w-md mx-auto text-text">
              Pick a vibe, dive in, and let the endless scroll begin!
            </p>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/explore')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 md:px-10 md:py-6 text-lg md:text-xl font-bold rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />

            <span>Explore Categories</span>
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm md:text-base opacity-60 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Something awesome is waiting for you
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
};

export default SelectACategory;
