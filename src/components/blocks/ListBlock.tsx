'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Block, ListBlock as ListBlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface ListBlockProps {
    block: ListBlockType;
    index?: number;
    isSelected?: boolean;
    onUpdate?: (id: string, updates: Partial<Block>) => void;
    onEnter?: (id: string) => void;
    onBackspace?: (id: string, atStart?: boolean) => void;
    onFocus?: (id: string) => void;
}

export function ListBlock({
    block,
    index = 1,
    isSelected = false,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: ListBlockProps) {
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
        <div
            className={cn(
                'notion-block notion-list-item',
                isSelected && 'focused'
            )}
        >
            {block.type === 'bulleted_list' && (
                <div className="notion-list-bullet" />
            )}
            {block.type === 'numbered_list' && (
                <div className="notion-list-number">{index}.</div>
            )}
            <div
                ref={contentRef}
                className="notion-block-content"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                data-placeholder="List item"
            >
                {content}
            </div>
        </div>
    );
}