'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Block, TodoBlock as TodoBlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface TodoBlockProps {
    block: TodoBlockType;
    isSelected?: boolean;
    onUpdate?: (id: string, updates: Partial<Block>) => void;
    onEnter?: (id: string) => void;
    onBackspace?: (id: string, atStart?: boolean) => void;
    onFocus?: (id: string) => void;
}

export function TodoBlock({
    block,
    isSelected = false,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: TodoBlockProps) {
    const [content, setContent] = useState(block.properties.title || '');
    const [checked, setChecked] = useState(block.properties.checked || false);
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

    const handleCheckboxClick = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        onUpdate?.(block.id, {
            properties: { ...block.properties, checked: newChecked },
        });
    };

    return (
        <div
            className={cn(
                'notion-block',
                isSelected && 'focused'
            )}
        >
            <div className="notion-todo">
                <div
                    className={cn(
                        'notion-todo-checkbox',
                        checked && 'checked'
                    )}
                    onClick={handleCheckboxClick}
                />
                <div
                    ref={contentRef}
                    className={cn(
                        'notion-todo-content notion-block-content',
                        checked && 'completed'
                    )}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    data-placeholder="To-do"
                >
                    {content}
                </div>
            </div>
        </div>
    );
}