import { NextRequest, NextResponse } from 'next/server';
import { EditorState } from '@/types/blocks';

// In a real application, you would use a database like PostgreSQL, MongoDB, or Supabase
// For this demo, we'll use a simple in-memory store
const resumeStore = new Map<string, EditorState>();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || 'default';

    try {
        const resume = resumeStore.get(id);

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: resume,
        });
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id = 'default', state } = body;

        if (!state || typeof state !== 'object') {
            return NextResponse.json(
                { error: 'Invalid resume state' },
                { status: 400 }
            );
        }

        // Validate the state structure
        if (!state.blocks || !state.page || typeof state.blocks !== 'object') {
            return NextResponse.json(
                { error: 'Invalid resume state structure' },
                { status: 400 }
            );
        }

        // Store the resume
        resumeStore.set(id, state as EditorState);

        return NextResponse.json({
            success: true,
            message: 'Resume saved successfully',
            id,
        });
    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json(
            { error: 'Failed to save resume' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || 'default';

    try {
        const existed = resumeStore.has(id);
        resumeStore.delete(id);

        if (!existed) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}

// GET /api/resume/list - List all resume IDs
export async function PUT(request: NextRequest) {
    try {
        const ids = Array.from(resumeStore.keys());

        return NextResponse.json({
            success: true,
            data: ids,
        });
    } catch (error) {
        console.error('Error listing resumes:', error);
        return NextResponse.json(
            { error: 'Failed to list resumes' },
            { status: 500 }
        );
    }
}