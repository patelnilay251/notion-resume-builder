'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="notion-app">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -240, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -240, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            opacity: { duration: 0.2 }
                        }}
                    >
                        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {!sidebarOpen && (
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            )}

            <motion.main
                className="notion-main"
                animate={{
                    marginLeft: sidebarOpen ? 240 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                {children}
            </motion.main>

            {/* Backdrop for mobile and desktop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-30 md:bg-opacity-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}