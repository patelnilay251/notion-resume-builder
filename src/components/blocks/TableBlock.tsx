'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { BaseBlock } from '@/types/blocks';

interface TableBlockType extends BaseBlock {
    type: 'table';
    properties: {
        title?: string;
        rows?: string[][];
        headers?: string[];
    };
}

interface TableBlockProps {
    block: TableBlockType;
    isSelected: boolean;
    onUpdate: (blockId: string, updates: Partial<TableBlockType>) => void;
    onEnter: (blockId: string) => void;
    onBackspace: (blockId: string, atStart: boolean) => void;
    onFocus: (blockId: string) => void;
}

export function TableBlock({
    block,
    isSelected,
    onUpdate,
    onEnter,
    onBackspace,
    onFocus,
}: TableBlockProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);
    
    const rows = block.properties.rows || [['', ''], ['', '']];
    const headers = block.properties.headers || ['Column 1', 'Column 2'];

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        onUpdate(block.id, {
            properties: { ...block.properties, rows: newRows },
        });
    };

    const updateHeader = (colIndex: number, value: string) => {
        const newHeaders = [...headers];
        newHeaders[colIndex] = value;
        onUpdate(block.id, {
            properties: { ...block.properties, headers: newHeaders },
        });
    };

    const addRow = () => {
        const newRow = new Array(headers.length).fill('');
        const newRows = [...rows, newRow];
        onUpdate(block.id, {
            properties: { ...block.properties, rows: newRows },
        });
    };

    const addColumn = () => {
        const newHeaders = [...headers, `Column ${headers.length + 1}`];
        const newRows = rows.map(row => [...row, '']);
        onUpdate(block.id, {
            properties: { ...block.properties, headers: newHeaders, rows: newRows },
        });
    };

    const deleteRow = (rowIndex: number) => {
        if (rows.length > 1) {
            const newRows = rows.filter((_, index) => index !== rowIndex);
            onUpdate(block.id, {
                properties: { ...block.properties, rows: newRows },
            });
        }
    };

    const deleteColumn = (colIndex: number) => {
        if (headers.length > 1) {
            const newHeaders = headers.filter((_, index) => index !== colIndex);
            const newRows = rows.map(row => row.filter((_, index) => index !== colIndex));
            onUpdate(block.id, {
                properties: { ...block.properties, headers: newHeaders, rows: newRows },
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Navigate to next cell
            if (colIndex < headers.length - 1) {
                const nextCell = document.querySelector(
                    `[data-cell="${rowIndex}-${colIndex + 1}"]`
                ) as HTMLElement;
                nextCell?.focus();
            } else if (rowIndex < rows.length - 1) {
                const nextCell = document.querySelector(
                    `[data-cell="${rowIndex + 1}-0"]`
                ) as HTMLElement;
                nextCell?.focus();
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (rowIndex === rows.length - 1 && colIndex === headers.length - 1) {
                onEnter(block.id);
            }
        }
    };

    return (
        <motion.div
            className="notion-table-block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => onFocus(block.id)}
        >
            <div className="notion-table-wrapper">
                <table className="notion-table">
                    <thead>
                        <tr>
                            {headers.map((header, colIndex) => (
                                <th
                                    key={colIndex}
                                    className="notion-table-header"
                                    onMouseEnter={() => setHoveredCol(colIndex)}
                                    onMouseLeave={() => setHoveredCol(null)}
                                >
                                    <input
                                        type="text"
                                        value={header}
                                        onChange={(e) => updateHeader(colIndex, e.target.value)}
                                        className="notion-table-header-input"
                                        placeholder="Header"
                                    />
                                    {hoveredCol === colIndex && headers.length > 1 && (
                                        <motion.button
                                            className="notion-table-delete-col"
                                            onClick={() => deleteColumn(colIndex)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={14} />
                                        </motion.button>
                                    )}
                                </th>
                            ))}
                            <th className="notion-table-add-col">
                                <motion.button
                                    onClick={addColumn}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Plus size={16} />
                                </motion.button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onMouseEnter={() => setHoveredRow(rowIndex)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="notion-table-cell">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                            className="notion-table-cell-input"
                                            placeholder=""
                                            data-cell={`${rowIndex}-${colIndex}`}
                                        />
                                    </td>
                                ))}
                                <td className="notion-table-row-actions">
                                    {hoveredRow === rowIndex && rows.length > 1 && (
                                        <motion.button
                                            className="notion-table-delete-row"
                                            onClick={() => deleteRow(rowIndex)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={14} />
                                        </motion.button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <motion.button
                    className="notion-table-add-row"
                    onClick={addRow}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={16} />
                    <span>Add row</span>
                </motion.button>
            </div>
        </motion.div>
    );
}