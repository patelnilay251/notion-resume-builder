'use client';

import React from 'react';
import { BlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';

interface BlockToolbarProps {
    visible: boolean;
    currentType: BlockType;
    onTypeChange: (type: BlockType) => void;
    position?: { x: number; y: number };
}

const blockTypes: Array<{ type: BlockType; label: string; shortcut?: string }> = [
    { type: 'paragraph', label: 'Text', shortcut: 'P' },
    { type: 'heading1', label: 'Heading 1', shortcut: 'H1' },
    { type: 'heading2', label: 'Heading 2', shortcut: 'H2' },
    { type: 'heading3', label: 'Heading 3', shortcut: 'H3' },
    { type: 'bulleted_list', label: 'Bullet List', shortcut: '•' },
    { type: 'numbered_list', label: 'Numbered List', shortcut: '1.' },
    { type: 'to_do', label: 'To-do', shortcut: '☐' },
    { type: 'quote', label: 'Quote', shortcut: '❝' },
    { type: 'callout', label: 'Callout', shortcut: '💡' },
    { type: 'code', label: 'Code', shortcut: '</>' },
    { type: 'divider', label: 'Divider', shortcut: '—' },
];

export function BlockToolbar({ visible, currentType, onTypeChange, position }: BlockToolbarProps) {
    if (!visible) return null;

    const style = position ? { left: position.x, top: position.y } : {};

    return (
        <div className="notion-toolbar" style={style}>
            {blockTypes.map(({ type, label, shortcut }) => (
                <button
                    key={type}
                    className={cn(
                        'notion-toolbar-button',
                        currentType === type && 'active'
                    )}
                    onClick={() => onTypeChange(type)}
                    title={label}
                >
                    <span className="text-xs">{shortcut}</span>
                    <span className="hidden sm:inline ml-1">{label}</span>
                </button>
            ))}
        </div>
    );
}