'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, ChevronDown } from 'lucide-react';

interface Font {
    name: string;
    family: string;
    category: 'sans' | 'serif' | 'mono' | 'display';
}

const fonts: Font[] = [
    { name: 'Default', family: 'var(--notion-font-family)', category: 'sans' },
    { name: 'Inter', family: 'Inter, sans-serif', category: 'sans' },
    { name: 'System UI', family: 'system-ui, sans-serif', category: 'sans' },
    { name: 'Georgia', family: 'Georgia, serif', category: 'serif' },
    { name: 'Times New Roman', family: '"Times New Roman", serif', category: 'serif' },
    { name: 'Garamond', family: 'Garamond, serif', category: 'serif' },
    { name: 'JetBrains Mono', family: '"JetBrains Mono", monospace', category: 'mono' },
    { name: 'Fira Code', family: '"Fira Code", monospace', category: 'mono' },
    { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'display' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'display' },
];

interface FontSelectorProps {
    currentFont?: string;
    onChange: (font: string) => void;
}

export function FontSelector({ currentFont = fonts[0].family, onChange }: FontSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const current = fonts.find(f => f.family === currentFont) || fonts[0];

    return (
        <div className="font-selector">
            <motion.button
                className="font-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Type size={16} />
                <span>{current.name}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={14} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="font-selector-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className="font-selector-dropdown"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="font-selector-groups">
                                {['sans', 'serif', 'mono', 'display'].map((category) => (
                                    <div key={category} className="font-selector-group">
                                        <div className="font-selector-group-label">
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </div>
                                        {fonts
                                            .filter(f => f.category === category)
                                            .map((font) => (
                                                <motion.button
                                                    key={font.family}
                                                    className={`font-selector-option ${
                                                        font.family === currentFont ? 'active' : ''
                                                    }`}
                                                    onClick={() => {
                                                        onChange(font.family);
                                                        setIsOpen(false);
                                                    }}
                                                    style={{ fontFamily: font.family }}
                                                    whileHover={{ x: 4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {font.name}
                                                </motion.button>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}