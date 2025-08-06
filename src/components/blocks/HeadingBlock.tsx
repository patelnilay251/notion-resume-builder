'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Block, HeadingBlock as HeadingBlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface HeadingBlockProps {
    block: HeadingBlockType;
    isSelected?: boolean;
    onUpdate?: (id: string, updates: Partial<Block>) => void;
    onEnter?: (id: string) => void;
    onBackspace?: (id: string) => void;
    onFocus?: (id: string) => void;
}

export function HeadingBlock({
    block,
    isSelected = false,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: HeadingBlockProps) {
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
        } else if (e.key === 'Backspace' && content === '') {
            e.preventDefault();
            onBackspace?.(block.id);
        }
    };

    const handleFocus = () => {
        onFocus?.(block.id);
    };

    const getHeadingClass = () => {
        switch (block.type) {
            case 'heading1':
                return 'notion-heading1';
            case 'heading2':
                return 'notion-heading2';
            case 'heading3':
                return 'notion-heading3';
            default:
                return 'notion-heading1';
        }
    };

    const getPlaceholder = () => {
        switch (block.type) {
            case 'heading1':
                return 'Heading 1';
            case 'heading2':
                return 'Heading 2';
            case 'heading3':
                return 'Heading 3';
            default:
                return 'Heading';
        }
    };

    return (
        <div
            className={cn(
                'notion-block',
                isSelected && 'focused'
            )}
        >
            <div
                ref={contentRef}
                className={cn('notion-block-content', getHeadingClass())}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                data-placeholder={getPlaceholder()}
            >
                {content}
            </div>
        </div>
    );
}