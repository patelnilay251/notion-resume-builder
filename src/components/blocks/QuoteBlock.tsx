'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { QuoteBlock as QuoteBlockType } from '@/types/blocks';

interface QuoteBlockProps {
    block: QuoteBlockType;
    isSelected: boolean;
    onUpdate: (blockId: string, updates: Partial<QuoteBlockType>) => void;
    onEnter: (blockId: string) => void;
    onBackspace: (blockId: string, atStart: boolean) => void;
    onFocus: (blockId: string) => void;
}

export function QuoteBlock({
    block,
    isSelected,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: QuoteBlockProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSelected && contentRef.current) {
            contentRef.current.focus();
        }
    }, [isSelected]);

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
            className="notion-quote-block"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="notion-quote-icon">
                <Quote size={20} />
            </div>
            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                className="notion-quote-content"
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                onFocus={() => onFocus(block.id)}
                placeholder="Empty quote"
                dangerouslySetInnerHTML={{
                    __html: block.properties.title || '',
                }}
            />
        </motion.div>
    );
}