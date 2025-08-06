'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Check } from 'lucide-react';
import { CodeBlock as CodeBlockType } from '@/types/blocks';

interface CodeBlockProps {
    block: CodeBlockType;
    isSelected: boolean;
    onUpdate: (blockId: string, updates: Partial<CodeBlockType>) => void;
    onEnter: (blockId: string) => void;
    onBackspace: (blockId: string, atStart: boolean) => void;
    onFocus: (blockId: string) => void;
}

const LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
    'c++',
    'c#',
    'go',
    'rust',
    'html',
    'css',
    'sql',
    'bash',
    'json',
    'yaml',
    'markdown',
];

export function CodeBlock({
    block,
    isSelected,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: CodeBlockProps) {
    const contentRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isSelected && contentRef.current) {
            contentRef.current.focus();
        }
    }, [isSelected]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.shiftKey) {
            // Allow new line in code block with Shift+Enter
            return;
        } else if (e.key === 'Enter') {
            e.preventDefault();
            onEnter(block.id);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Insert tab character
            document.execCommand('insertText', false, '  ');
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
            const newCode = contentRef.current.textContent || '';
            onUpdate(block.id, {
                properties: { ...block.properties, title: newCode },
            });
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(block.id, {
            properties: { ...block.properties, language: e.target.value },
        });
    };

    const handleCopy = async () => {
        const code = block.properties.title || '';
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            className="notion-code-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="notion-code-header">
                <select
                    value={block.properties.language || 'javascript'}
                    onChange={handleLanguageChange}
                    className="notion-code-language"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
                <motion.button
                    onClick={handleCopy}
                    className="notion-code-copy"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {copied ? (
                        <Check size={14} className="text-green-500" />
                    ) : (
                        <Copy size={14} />
                    )}
                </motion.button>
            </div>
            <pre
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                className="notion-code-content"
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                onFocus={() => onFocus(block.id)}
                placeholder="// Type your code here..."
                dangerouslySetInnerHTML={{
                    __html: block.properties.title || '',
                }}
            />
        </motion.div>
    );
}