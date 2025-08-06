import { v4 as uuidv4 } from 'uuid';
import { Block, BlockId, BlockType, RichText, BaseBlock } from '@/types/blocks';

// Block factory functions
export function createBlock(
    type: BlockType,
    properties: Record<string, unknown> = {},
    parentId?: BlockId
): Block {
    const now = Date.now();
    const base: BaseBlock = {
        id: uuidv4(),
        type,
        properties: {
            title: '',
            ...properties,
        },
        content: [],
        parentId,
        created_time: now,
        last_edited_time: now,
    };

    return base as Block;
}

export function createTextBlock(
    text: string = '',
    type: BlockType = 'paragraph',
    parentId?: BlockId
): Block {
    return createBlock(type, { title: text }, parentId);
}

export function createHeadingBlock(
    text: string = '',
    level: 1 | 2 | 3 = 1,
    parentId?: BlockId
): Block {
    const type = `heading${level}` as BlockType;
    return createBlock(type, { title: text }, parentId);
}

export function createListBlock(
    text: string = '',
    listType: 'bulleted_list' | 'numbered_list' = 'bulleted_list',
    parentId?: BlockId
): Block {
    return createBlock(listType, { title: text }, parentId);
}

export function createTodoBlock(
    text: string = '',
    checked: boolean = false,
    parentId?: BlockId
): Block {
    return createBlock('to_do', { title: text, checked }, parentId);
}

// Rich text utilities
export function createRichText(
    content: string,
    format?: Partial<RichText['format']>
): RichText {
    return {
        content,
        format: format || {},
    };
}

export function richTextToPlainText(richText: RichText[]): string {
    return richText.map(rt => rt.content).join('');
}

export function plainTextToRichText(text: string): RichText[] {
    if (!text) return [];
    return [createRichText(text)];
}

// Block manipulation utilities
export function insertBlockAtIndex(
    blocks: Record<BlockId, Block>,
    parentId: BlockId,
    block: Block,
    index: number
): Record<BlockId, Block> {
    const parent = blocks[parentId];
    if (!parent) return blocks;

    const newContent = [...parent.content];
    newContent.splice(index, 0, block.id);

    return {
        ...blocks,
        [block.id]: { ...block, parentId },
        [parentId]: {
            ...parent,
            content: newContent,
            last_edited_time: Date.now(),
        },
    };
}

export function removeBlockFromParent(
    blocks: Record<BlockId, Block>,
    blockId: BlockId
): Record<BlockId, Block> {
    const block = blocks[blockId];
    if (!block || !block.parentId) return blocks;

    const parent = blocks[block.parentId];
    if (!parent) return blocks;

    const newContent = parent.content.filter(id => id !== blockId);
    const { [blockId]: removed, ...remainingBlocks } = blocks;

    return {
        ...remainingBlocks,
        [parent.id]: {
            ...parent,
            content: newContent,
            last_edited_time: Date.now(),
        },
    };
}

export function updateBlockContent(
    blocks: Record<BlockId, Block>,
    blockId: BlockId,
    updates: Partial<Block>
): Record<BlockId, Block> {
    const block = blocks[blockId];
    if (!block) return blocks;

    return {
        ...blocks,
        [blockId]: {
            ...block,
            ...updates,
            last_edited_time: Date.now(),
        },
    };
}

export function moveBlock(
    blocks: Record<BlockId, Block>,
    blockId: BlockId,
    newParentId: BlockId,
    newIndex: number
): Record<BlockId, Block> {
    // First remove from current parent
    let updatedBlocks = removeBlockFromParent(blocks, blockId);

    // Then insert at new location
    const block = updatedBlocks[blockId] || blocks[blockId];
    if (!block) return blocks;

    return insertBlockAtIndex(updatedBlocks, newParentId, block, newIndex);
}

// Tree traversal utilities
export function getChildBlocks(
    blocks: Record<BlockId, Block>,
    parentId: BlockId
): Block[] {
    const parent = blocks[parentId];
    if (!parent) return [];

    return parent.content
        .map(id => blocks[id])
        .filter(Boolean);
}

export function getAllDescendantBlocks(
    blocks: Record<BlockId, Block>,
    parentId: BlockId
): Block[] {
    const children = getChildBlocks(blocks, parentId);
    const descendants = [...children];

    children.forEach(child => {
        descendants.push(...getAllDescendantBlocks(blocks, child.id));
    });

    return descendants;
}

export function findBlockPath(
    blocks: Record<BlockId, Block>,
    blockId: BlockId,
    rootId: BlockId
): BlockId[] {
    function findPath(currentId: BlockId, targetId: BlockId, path: BlockId[]): BlockId[] | null {
        const newPath = [...path, currentId];

        if (currentId === targetId) {
            return newPath;
        }

        const block = blocks[currentId];
        if (!block) return null;

        for (const childId of block.content) {
            const result = findPath(childId, targetId, newPath);
            if (result) return result;
        }

        return null;
    }

    return findPath(rootId, blockId, []) || [];
}

// Block type checking utilities
export function isTextBlock(block: Block): boolean {
    return ['paragraph', 'heading1', 'heading2', 'heading3'].includes(block.type);
}

export function isListBlock(block: Block): boolean {
    return ['bulleted_list', 'numbered_list'].includes(block.type);
}

export function isHeadingBlock(block: Block): boolean {
    return ['heading1', 'heading2', 'heading3'].includes(block.type);
}

export function canHaveChildren(block: Block): boolean {
    return ['page', 'toggle', 'bulleted_list', 'numbered_list', 'to_do'].includes(block.type);
}

// Validation utilities
export function validateBlockStructure(
    blocks: Record<BlockId, Block>,
    rootId: BlockId
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const visited = new Set<BlockId>();

    function validateBlock(blockId: BlockId): void {
        if (visited.has(blockId)) {
            errors.push(`Circular reference detected at block ${blockId}`);
            return;
        }

        visited.add(blockId);
        const block = blocks[blockId];

        if (!block) {
            errors.push(`Missing block ${blockId}`);
            return;
        }

        // Validate children
        block.content.forEach(childId => {
            const child = blocks[childId];
            if (!child) {
                errors.push(`Missing child block ${childId} referenced by ${blockId}`);
                return;
            }

            if (child.parentId !== blockId) {
                errors.push(`Parent-child relationship mismatch: ${childId} parent should be ${blockId} but is ${child.parentId}`);
            }

            validateBlock(childId);
        });
    }

    validateBlock(rootId);

    return {
        isValid: errors.length === 0,
        errors,
    };
}