'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Block, ParagraphBlock as ParagraphBlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface ParagraphBlockProps {
    block: ParagraphBlockType;
    isSelected?: boolean;
    onUpdate?: (id: string, updates: Partial<Block>) => void;
    onEnter?: (id: string) => void;
    onBackspace?: (id: string, atStart?: boolean) => void;
    onFocus?: (id: string) => void;
}

export function ParagraphBlock({
    block,
    isSelected = false,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: ParagraphBlockProps) {
    const [content, setContent] = useState(block.properties.title || '');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSelected && contentRef.current) {
            contentRef.current.focus();
        }
    }, [isSelected]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.textContent || '';
        setContent(newContent);
        onUpdate?.(block.id, {
            properties: { ...block.properties, title: newContent },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnter?.(block.id);
        } else if (e.key === 'Backspace') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.startOffset === 0 && range.endOffset === 0) {
                    e.preventDefault();
                    onBackspace?.(block.id, true);
                } else if (content === '') {
                    e.preventDefault();
                    onBackspace?.(block.id, false);
                }
            }
        }
    };

    const handleFocus = () => {
        onFocus?.(block.id);
    };

    return (
        <motion.div
            className={cn(
                'notion-block',
                isSelected && 'focused'
            )}
            whileHover={{
                backgroundColor: 'rgba(55, 53, 47, 0.03)'
            }}
            transition={{ duration: 0.1 }}
        >
            <motion.div
                ref={contentRef}
                className="notion-block-content"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                data-placeholder="Type something..."
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                    fontSize: 'var(--notion-text-md)',
                    lineHeight: 'var(--notion-leading-normal)',
                    color: 'var(--notion-text-primary)',
                }}
            >
                {content}
            </motion.div>
        </motion.div>
    );
}