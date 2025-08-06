import { NextRequest, NextResponse } from 'next/server';
import { EditorState, BlockType } from '@/types/blocks';

// Enhanced in-memory store with metadata
interface ResumeData {
    state: EditorState;
    metadata: {
        createdAt: string;
        updatedAt: string;
        version: number;
        font?: string;
        theme?: 'light' | 'dark';
    };
}

const resumeStore = new Map<string, ResumeData>();

// Validation helper
function validateBlockType(type: string): type is BlockType {
    const validTypes: BlockType[] = [
        'paragraph', 'heading1', 'heading2', 'heading3',
        'bulleted_list', 'numbered_list', 'to_do', 'quote',
        'divider', 'callout', 'toggle', 'image', 'code',
        'table', 'page'
    ];
    return validTypes.includes(type as BlockType);
}

function validateEditorState(state: any): state is EditorState {
    if (!state || typeof state !== 'object') return false;
    if (!state.blocks || typeof state.blocks !== 'object') return false;
    if (!state.page || typeof state.page !== 'object') return false;
    if (!state.page.id || !state.page.title) return false;
    
    // Validate all blocks
    for (const blockId in state.blocks) {
        const block = state.blocks[blockId];
        if (!block.id || !block.type || !validateBlockType(block.type)) {
            return false;
        }
        if (!block.properties || typeof block.properties !== 'object') {
            return false;
        }
    }
    
    return true;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || 'default';

    try {
        const resumeData = resumeStore.get(id);

        if (!resumeData) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Resume not found',
                    code: 'RESUME_NOT_FOUND' 
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: resumeData.state,
            metadata: resumeData.metadata,
        });
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch resume',
                code: 'FETCH_ERROR'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id = 'default', state, metadata = {} } = body;

        if (!validateEditorState(state)) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Invalid resume state structure',
                    code: 'INVALID_STATE'
                },
                { status: 400 }
            );
        }

        const existingData = resumeStore.get(id);
        const now = new Date().toISOString();
        
        const resumeData: ResumeData = {
            state,
            metadata: {
                createdAt: existingData?.metadata.createdAt || now,
                updatedAt: now,
                version: (existingData?.metadata.version || 0) + 1,
                font: metadata.font,
                theme: metadata.theme,
            }
        };

        resumeStore.set(id, resumeData);

        return NextResponse.json({
            success: true,
            message: 'Resume saved successfully',
            id,
            version: resumeData.metadata.version,
        });
    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to save resume',
                code: 'SAVE_ERROR'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || 'default';

    try {
        const existed = resumeStore.has(id);
        
        if (!existed) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Resume not found',
                    code: 'RESUME_NOT_FOUND'
                },
                { status: 404 }
            );
        }
        
        resumeStore.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to delete resume',
                code: 'DELETE_ERROR'
            },
            { status: 500 }
        );
    }
}

// List all resumes with metadata
export async function PUT(request: NextRequest) {
    try {
        const resumes = Array.from(resumeStore.entries()).map(([id, data]) => ({
            id,
            metadata: data.metadata,
        }));

        return NextResponse.json({
            success: true,
            data: resumes,
            total: resumes.length,
        });
    } catch (error) {
        console.error('Error listing resumes:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to list resumes',
                code: 'LIST_ERROR'
            },
            { status: 500 }
        );
    }
}