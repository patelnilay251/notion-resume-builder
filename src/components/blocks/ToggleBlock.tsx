'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ToggleBlock as ToggleBlockType } from '@/types/blocks';

interface ToggleBlockProps {
    block: ToggleBlockType;
    isSelected: boolean;
    onUpdate: (blockId: string, updates: Partial<ToggleBlockType>) => void;
    onEnter: (blockId: string) => void;
    onBackspace: (blockId: string, atStart: boolean) => void;
    onFocus: (blockId: string) => void;
    children?: React.ReactNode;
}

export function ToggleBlock({
    block,
    isSelected,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
    children,
}: ToggleBlockProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const isOpen = block.properties.isOpen ?? false;

    useEffect(() => {
        if (isSelected && contentRef.current) {
            contentRef.current.focus();
        }
    }, [isSelected]);

    const handleToggle = () => {
        onUpdate(block.id, {
            properties: { ...block.properties, isOpen: !isOpen },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnter(block.id);
        } else if (e.key === 'Backspace' && contentRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.startOffset === 0 && range.endOffset === 0) {
                    e.preventDefault();
                    onBackspace(block.id, true);
                }
            }
        }
    };

    const handleInput = () => {
        if (contentRef.current) {
            const newTitle = contentRef.current.textContent || '';
            onUpdate(block.id, {
                properties: { ...block.properties, title: newTitle },
            });
        }
    };

    return (
        <motion.div
            className="notion-toggle-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="notion-toggle-header">
                <motion.button
                    onClick={handleToggle}
                    className="notion-toggle-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight size={16} />
                    </motion.div>
                </motion.button>
                <div
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="notion-toggle-title"
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onFocus={() => onFocus(block.id)}
                    placeholder="Toggle"
                    dangerouslySetInnerHTML={{
                        __html: block.properties.title || '',
                    }}
                />
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className="notion-toggle-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2 }
                        }}
                    >
                        <div className="notion-toggle-children">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}