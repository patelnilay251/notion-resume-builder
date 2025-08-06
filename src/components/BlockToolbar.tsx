'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockType } from '@/types/blocks';
import { cn } from '@/lib/utils';
import { 
    Type, Heading1, Heading2, Heading3, 
    List, ListOrdered, CheckSquare, Quote, 
    Code2, ToggleLeft, Table, AlertCircle, 
    Minus 
} from 'lucide-react';

interface BlockToolbarProps {
    visible: boolean;
    currentType: BlockType;
    onTypeChange: (type: BlockType) => void;
    position?: { x: number; y: number };
}

const blockTypes: Array<{ 
    type: BlockType; 
    label: string; 
    icon: React.ReactNode;
    category: 'text' | 'list' | 'advanced' 
}> = [
    { type: 'paragraph', label: 'Text', icon: <Type size={16} />, category: 'text' },
    { type: 'heading1', label: 'Heading 1', icon: <Heading1 size={16} />, category: 'text' },
    { type: 'heading2', label: 'Heading 2', icon: <Heading2 size={16} />, category: 'text' },
    { type: 'heading3', label: 'Heading 3', icon: <Heading3 size={16} />, category: 'text' },
    { type: 'bulleted_list', label: 'Bullet List', icon: <List size={16} />, category: 'list' },
    { type: 'numbered_list', label: 'Numbered List', icon: <ListOrdered size={16} />, category: 'list' },
    { type: 'to_do', label: 'To-do', icon: <CheckSquare size={16} />, category: 'list' },
    { type: 'quote', label: 'Quote', icon: <Quote size={16} />, category: 'text' },
    { type: 'callout', label: 'Callout', icon: <AlertCircle size={16} />, category: 'advanced' },
    { type: 'code', label: 'Code', icon: <Code2 size={16} />, category: 'advanced' },
    { type: 'toggle', label: 'Toggle', icon: <ToggleLeft size={16} />, category: 'advanced' },
    { type: 'table', label: 'Table', icon: <Table size={16} />, category: 'advanced' },
    { type: 'divider', label: 'Divider', icon: <Minus size={16} />, category: 'advanced' },
];

export function BlockToolbar({ visible, currentType, onTypeChange, position }: BlockToolbarProps) {
    const style = position ? { left: position.x, top: position.y } : {};

    return (
        <AnimatePresence>
            {visible && (
                <motion.div 
                    className="notion-toolbar" 
                    style={style}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                >
                    <div className="notion-toolbar-sections">
                        {blockTypes.map(({ type, label, icon }, index) => (
                            <motion.button
                                key={type}
                                className={cn(
                                    'notion-toolbar-button',
                                    currentType === type && 'active'
                                )}
                                onClick={() => onTypeChange(type)}
                                title={label}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {icon}
                                <span className="notion-toolbar-label">{label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}