// Core block types based on Notion's architecture
// Reference: https://www.notion.so/blog/data-model-behind-notion

export type BlockId = string;

export interface BlockProperties {
    title?: string;
    [key: string]: unknown;
}

export type BlockType =
    | 'paragraph'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'bulleted_list'
    | 'numbered_list'
    | 'to_do'
    | 'quote'
    | 'divider'
    | 'callout'
    | 'toggle'
    | 'image'
    | 'code'
    | 'table'
    | 'page';

export interface TextFormat {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
    backgroundColor?: string;
    link?: string;
}

export interface RichText {
    content: string;
    format?: TextFormat;
}

export interface BaseBlock {
    id: BlockId;
    type: BlockType;
    properties: BlockProperties;
    content: BlockId[]; // Child blocks
    parentId?: BlockId;
    created_time: number;
    last_edited_time: number;
    richText?: RichText[];
}

// Specific block types
export interface ParagraphBlock extends BaseBlock {
    type: 'paragraph';
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading1' | 'heading2' | 'heading3';
}

export interface ListBlock extends BaseBlock {
    type: 'bulleted_list' | 'numbered_list';
}

export interface TodoBlock extends BaseBlock {
    type: 'to_do';
    properties: BlockProperties & {
        checked?: boolean;
    };
}

export interface QuoteBlock extends BaseBlock {
    type: 'quote';
}

export interface CalloutBlock extends BaseBlock {
    type: 'callout';
    properties: BlockProperties & {
        icon?: string;
        color?: string;
    };
}

export interface ToggleBlock extends BaseBlock {
    type: 'toggle';
    properties: BlockProperties & {
        isOpen?: boolean;
    };
}

export interface CodeBlock extends BaseBlock {
    type: 'code';
    properties: BlockProperties & {
        language?: string;
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    properties: BlockProperties & {
        source?: string;
        caption?: string;
    };
}

export interface DividerBlock extends BaseBlock {
    type: 'divider';
}

export interface TableBlock extends BaseBlock {
    type: 'table';
    properties: BlockProperties & {
        rows?: string[][];
        headers?: string[];
    };
}

export interface PageBlock extends BaseBlock {
    type: 'page';
    properties: BlockProperties & {
        icon?: string;
        cover?: string;
    };
}

export type Block =
    | ParagraphBlock
    | HeadingBlock
    | ListBlock
    | TodoBlock
    | QuoteBlock
    | CalloutBlock
    | ToggleBlock
    | CodeBlock
    | ImageBlock
    | DividerBlock
    | TableBlock
    | PageBlock;

// Editor state
export interface EditorState {
    blocks: Record<BlockId, Block>;
    selection?: {
        blockId: BlockId;
        start: number;
        end: number;
    };
    page: {
        id: BlockId;
        title: string;
        icon?: string;
        cover?: string;
    };
}

// Operations for real-time collaboration (inspired by Notion's transaction system)
export type OperationType =
    | 'insert_block'
    | 'update_block'
    | 'delete_block'
    | 'move_block';

export interface Operation {
    id: string;
    type: OperationType;
    blockId: BlockId;
    data?: Partial<Block>;
    parentId?: BlockId;
    index?: number;
    timestamp: number;
}

export interface Transaction {
    id: string;
    operations: Operation[];
    timestamp: number;
    userId?: string;
}