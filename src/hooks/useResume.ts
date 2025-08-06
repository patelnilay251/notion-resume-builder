'use client';

import { useState, useCallback } from 'react';
import { EditorState } from '@/types/blocks';

interface ResumeMetadata {
    createdAt: string;
    updatedAt: string;
    version: number;
    font?: string;
    theme?: 'light' | 'dark';
}

interface UseResumeOptions {
    autoSave?: boolean;
    autoSaveDelay?: number;
}

interface UseResumeReturn {
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    errorCode?: string;
    saveResume: (state: EditorState, id?: string, metadata?: Partial<ResumeMetadata>) => Promise<void>;
    loadResume: (id?: string) => Promise<{ state: EditorState; metadata: ResumeMetadata } | null>;
    deleteResume: (id?: string) => Promise<void>;
    listResumes: () => Promise<Array<{ id: string; metadata: ResumeMetadata }>>;
}

export function useResume(options: UseResumeOptions = {}): UseResumeReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<string | undefined>();

    const saveResume = useCallback(async (
        state: EditorState, 
        id: string = 'default',
        metadata?: Partial<ResumeMetadata>
    ) => {
        setIsSaving(true);
        setError(null);
        setErrorCode(undefined);

        try {
            const response = await fetch('/api/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    state,
                    metadata,
                }),
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                setErrorCode(result.code);
                throw new Error(result.error || 'Failed to save resume');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save resume';
            setError(errorMessage);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const loadResume = useCallback(async (id: string = 'default'): Promise<{ state: EditorState; metadata: ResumeMetadata } | null> => {
        setIsLoading(true);
        setError(null);
        setErrorCode(undefined);

        try {
            const response = await fetch(`/api/resume?id=${id}`);
            const result = await response.json();

            if (response.status === 404) {
                return null; // Resume doesn't exist
            }

            if (!response.ok || !result.success) {
                setErrorCode(result.code);
                throw new Error(result.error || 'Failed to load resume');
            }

            return {
                state: result.data,
                metadata: result.metadata,
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load resume';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteResume = useCallback(async (id: string = 'default') => {
        setIsLoading(true);
        setError(null);
        setErrorCode(undefined);

        try {
            const response = await fetch(`/api/resume?id=${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                setErrorCode(result.code);
                throw new Error(result.error || 'Failed to delete resume');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete resume';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const listResumes = useCallback(async (): Promise<Array<{ id: string; metadata: ResumeMetadata }>> => {
        setIsLoading(true);
        setError(null);
        setErrorCode(undefined);

        try {
            const response = await fetch('/api/resume', {
                method: 'PUT',
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                setErrorCode(result.code);
                throw new Error(result.error || 'Failed to list resumes');
            }

            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to list resumes';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        isSaving,
        error,
        errorCode,
        saveResume,
        loadResume,
        deleteResume,
        listResumes,
    };
}