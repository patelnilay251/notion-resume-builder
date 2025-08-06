'use client';

import React from 'react';
import { Block as BlockType } from '@/types/blocks';
import { ParagraphBlock } from './ParagraphBlock';
import { HeadingBlock } from './HeadingBlock';
import { ListBlock } from './ListBlock';
import { TodoBlock } from './TodoBlock';
import { QuoteBlock } from './QuoteBlock';
import { CodeBlock } from './CodeBlock';
import { ToggleBlock } from './ToggleBlock';
import { TableBlock } from './TableBlock';

interface BlockProps {
    block: BlockType;
    index?: number;
    isSelected?: boolean;
    onUpdate?: (id: string, updates: Partial<BlockType>) => void;
    onEnter?: (id: string) => void;
    onBackspace?: (id: string, atStart?: boolean) => void;
    onFocus?: (id: string) => void;
    children?: React.ReactNode;
}

export function Block({
    block,
    index = 0,
    isSelected = false,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
    children,
}: BlockProps) {
    const commonProps = {
        isSelected,
        onUpdate: onUpdate || (() => {}),
        onEnter: onEnter || (() => {}),
        onBackspace: onBackspace || (() => {}),
        onFocus: onFocus || (() => {}),
    };

    switch (block.type) {
        case 'paragraph':
            return <ParagraphBlock block={block} {...commonProps} />;

        case 'heading1':
        case 'heading2':
        case 'heading3':
            return <HeadingBlock block={block} {...commonProps} />;

        case 'bulleted_list':
        case 'numbered_list':
            return <ListBlock block={block} index={index + 1} {...commonProps} />;

        case 'to_do':
            return <TodoBlock block={block} {...commonProps} />;

        case 'quote':
            return <QuoteBlock block={block} {...commonProps} />;

        case 'code':
            return <CodeBlock block={block} {...commonProps} />;

        case 'toggle':
            return <ToggleBlock block={block} {...commonProps}>{children}</ToggleBlock>;

        case 'table':
            return <TableBlock block={block as any} {...commonProps} />;

        case 'divider':
            return (
                <div className="notion-block">
                    <hr className="notion-divider" />
                </div>
            );

        case 'callout':
            return (
                <div className="notion-block">
                    <div className="notion-callout">
                        <div className="notion-callout-icon">
                            {block.properties.icon || '💡'}
                        </div>
                        <div className="notion-callout-content">
                            {block.properties.title || 'Callout content'}
                        </div>
                    </div>
                </div>
            );

        default:
            return <ParagraphBlock block={block as any} {...commonProps} />;
    }
}