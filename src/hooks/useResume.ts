'use client';

import { useState, useCallback } from 'react';
import { EditorState } from '@/types/blocks';

interface UseResumeOptions {
    autoSave?: boolean;
    autoSaveDelay?: number;
}

interface UseResumeReturn {
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    saveResume: (state: EditorState, id?: string) => Promise<void>;
    loadResume: (id?: string) => Promise<EditorState | null>;
    deleteResume: (id?: string) => Promise<void>;
    listResumes: () => Promise<string[]>;
}

export function useResume(options: UseResumeOptions = {}): UseResumeReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveResume = useCallback(async (state: EditorState, id: string = 'default') => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    state,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save resume');
            }

            const result = await response.json();
            if (!result.success) {
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

    const loadResume = useCallback(async (id: string = 'default'): Promise<EditorState | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resume?id=${id}`);

            if (response.status === 404) {
                return null; // Resume doesn't exist
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load resume');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to load resume');
            }

            return result.data;
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

        try {
            const response = await fetch(`/api/resume?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete resume');
            }

            const result = await response.json();
            if (!result.success) {
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

    const listResumes = useCallback(async (): Promise<string[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/resume', {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to list resumes');
            }

            const result = await response.json();
            if (!result.success) {
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
        saveResume,
        loadResume,
        deleteResume,
        listResumes,
    };
}