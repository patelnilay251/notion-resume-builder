'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Settings, Menu, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    if (!isOpen) {
        return (
            <motion.button
                onClick={onToggle}
                className="notion-sidebar-toggle"
                title="Open sidebar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <Menu size={16} />
            </motion.button>
        );
    }

    return (
        <motion.aside
            className="notion-sidebar"
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="notion-sidebar-header">
                <motion.h2
                    className="notion-sidebar-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    Resume Builder
                </motion.h2>
                <motion.button
                    onClick={onToggle}
                    className="notion-sidebar-close"
                    title="Close sidebar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={14} />
                </motion.button>
            </div>

            <nav className="notion-sidebar-nav">
                <motion.div
                    className="notion-sidebar-item active"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ x: 2 }}
                >
                    <FileText size={16} />
                    <span>My Resume</span>
                </motion.div>

                <motion.button
                    className="notion-sidebar-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ x: 2 }}
                >
                    <Plus size={16} />
                    <span>Add a page</span>
                </motion.button>

                <motion.div
                    className="h-px"
                    style={{
                        backgroundColor: 'var(--notion-border-light)',
                        margin: 'var(--notion-space-4) 0'
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="px-3 py-2 text-xs font-medium uppercase tracking-wide"
                    style={{ color: 'var(--notion-text-tertiary)' }}
                >
                    Templates
                </motion.div>

                <motion.button
                    className="notion-sidebar-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ x: 2 }}
                >
                    <FileText size={16} />
                    <span>Software Engineer</span>
                </motion.button>

                <motion.button
                    className="notion-sidebar-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ x: 2 }}
                >
                    <FileText size={16} />
                    <span>Product Manager</span>
                </motion.button>

                <motion.button
                    className="notion-sidebar-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ x: 2 }}
                >
                    <FileText size={16} />
                    <span>Designer</span>
                </motion.button>
            </nav>

            <motion.div
                className="mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <motion.div
                    className="notion-sidebar-item"
                    whileHover={{ x: 2 }}
                >
                    <Settings size={16} />
                    <span>Settings</span>
                </motion.div>
            </motion.div>
        </motion.aside>
    );
}