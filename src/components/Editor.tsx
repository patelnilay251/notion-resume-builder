'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block as BlockType, BlockId, EditorState } from '@/types/blocks';
import { createTextBlock, createBlock, createHeadingBlock, createListBlock, insertBlockAtIndex, removeBlockFromParent, updateBlockContent } from '@/lib/blocks';
import { Block } from './blocks/Block';
import { useResume } from '@/hooks/useResume';
import { Save, AlertCircle } from 'lucide-react';
import { FontSelector } from './FontSelector';

interface EditorProps {
    initialState?: EditorState;
    onStateChange?: (state: EditorState) => void;
}

// Create a default page with some initial blocks
function createInitialState(): EditorState {
    const pageId = 'page-1';

    // Create professional resume blocks
    const nameBlock = createHeadingBlock('John Doe', 1, pageId);
    const titleBlock = createHeadingBlock('Senior Software Engineer', 2, pageId);

    // Contact info with subtle styling
    const contactBlock = createTextBlock('📧 john.doe@email.com • 📱 +1 (555) 123-4567 • 🌐 linkedin.com/in/johndoe • 📍 San Francisco, CA', 'paragraph', pageId);

    // Professional Summary
    const summaryHeading = createHeadingBlock('Professional Summary', 3, pageId);
    const summaryBlock = createTextBlock('Experienced software engineer with 5+ years building scalable web applications and distributed systems. Passionate about creating user-centric solutions, leading high-performing development teams, and driving technical innovation in fast-paced environments.', 'paragraph', pageId);

    // Experience Section
    const experienceHeading = createHeadingBlock('Professional Experience', 3, pageId);
    const job1Title = createTextBlock('Senior Software Engineer • TechCorp Inc. • 2021 - Present', 'paragraph', pageId);
    const job1Desc = createListBlock('Led development of microservices architecture serving 1M+ daily active users', 'bulleted_list', pageId);
    const job1Desc2 = createListBlock('Mentored team of 5 junior developers and established code review processes', 'bulleted_list', pageId);
    const job1Desc3 = createListBlock('Reduced system latency by 40% through performance optimization and caching strategies', 'bulleted_list', pageId);
    const job1Desc4 = createListBlock('Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes', 'bulleted_list', pageId);

    const job2Title = createTextBlock('Software Engineer • StartupXYZ • 2019 - 2021', 'paragraph', pageId);
    const job2Desc = createListBlock('Built responsive web applications using React, TypeScript, and Node.js', 'bulleted_list', pageId);
    const job2Desc2 = createListBlock('Designed and implemented RESTful APIs serving 100K+ requests per day', 'bulleted_list', pageId);
    const job2Desc3 = createListBlock('Collaborated with product team to define technical requirements and user stories', 'bulleted_list', pageId);

    // Skills section with callout
    const skillsHeading = createHeadingBlock('Technical Skills', 3, pageId);
    const skillsCallout = createBlock('callout', {
        title: '💻 Languages: JavaScript, TypeScript, Python, Java, Go\n🚀 Frontend: React, Next.js, Vue.js, Tailwind CSS\n⚙️ Backend: Node.js, Express, Django, PostgreSQL, MongoDB\n☁️ Cloud: AWS, Docker, Kubernetes, Terraform, CI/CD',
        icon: '🛠️'
    }, pageId);

    // Education
    const educationHeading = createHeadingBlock('Education', 3, pageId);
    const educationBlock = createTextBlock('Bachelor of Science in Computer Science • University of California, Berkeley • 2015 - 2019', 'paragraph', pageId);

    // Projects
    const projectsHeading = createHeadingBlock('Key Projects', 3, pageId);
    const project1 = createTextBlock('🎯 E-commerce Platform: Built scalable marketplace with 50K+ products using microservices', 'paragraph', pageId);
    const project2 = createTextBlock('📊 Analytics Dashboard: Real-time data visualization serving 10+ enterprise clients', 'paragraph', pageId);

    const blocks = [
        nameBlock, titleBlock, contactBlock,
        summaryHeading, summaryBlock,
        experienceHeading, job1Title, job1Desc, job1Desc2, job1Desc3, job1Desc4,
        job2Title, job2Desc, job2Desc2, job2Desc3,
        skillsHeading, skillsCallout,
        educationHeading, educationBlock,
        projectsHeading, project1, project2
    ];

    const blocksRecord: Record<string, BlockType> = {
        [pageId]: {
            id: pageId,
            type: 'paragraph', // Fixed: use valid block type
            properties: { title: 'John Doe - Resume' },
            content: blocks.map(b => b.id),
            parentId: null,
            created_time: Date.now(),
            last_edited_time: Date.now(),
        } as BlockType,
    };

    blocks.forEach(block => {
        blocksRecord[block.id] = block;
    });

    return {
        blocks: blocksRecord,
        page: {
            id: pageId,
            title: 'John Doe - Resume',
        },
        selection: {
            blockId: nameBlock.id,
            start: 0,
            end: 0,
        },
    };
}

export function Editor({ initialState, onStateChange }: EditorProps) {
    const [editorState, setEditorState] = useState<EditorState>(
        initialState || createInitialState()
    );
    const [selectedBlockId, setSelectedBlockId] = useState<BlockId | null>(
        editorState.selection?.blockId || null
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [currentFont, setCurrentFont] = useState('var(--notion-font-family)');
    const { saveResume, loadResume, isSaving, error } = useResume();

    const updateState = useCallback((newState: EditorState) => {
        setEditorState(newState);
        setHasChanges(true);
        onStateChange?.(newState);
    }, [onStateChange]);

    // Auto-save functionality
    useEffect(() => {
        if (!hasChanges) return;

        const timeoutId = setTimeout(async () => {
            try {
                await saveResume(editorState, 'default', { font: currentFont });
                setHasChanges(false);
            } catch (err) {
                console.error('Auto-save failed:', err);
            }
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
    }, [editorState, hasChanges, saveResume, currentFont]);

    // Load initial data on mount
    useEffect(() => {
        if (initialState) return; // Don't load if initial state is provided

        const loadInitialData = async () => {
            try {
                const result = await loadResume();
                if (result) {
                    setEditorState(result.state);
                    setSelectedBlockId(result.state.selection?.blockId || null);
                    if (result.metadata.font) {
                        setCurrentFont(result.metadata.font);
                    }
                }
            } catch (err) {
                console.error('Failed to load resume:', err);
            }
        };

        loadInitialData();
    }, [initialState, loadResume]);

    const handleManualSave = useCallback(async () => {
        try {
            await saveResume(editorState, 'default', { font: currentFont });
            setHasChanges(false);
        } catch (err) {
            console.error('Manual save failed:', err);
        }
    }, [editorState, saveResume, currentFont]);

    const handleBlockUpdate = useCallback((blockId: string, updates: Partial<BlockType>) => {
        const newBlocks = updateBlockContent(editorState.blocks, blockId, updates);
        updateState({
            ...editorState,
            blocks: newBlocks,
        });
    }, [editorState, updateState]);

    const handleBlockFocus = useCallback((blockId: string) => {
        setSelectedBlockId(blockId);
        updateState({
            ...editorState,
            selection: {
                blockId,
                start: 0,
                end: 0,
            },
        });
    }, [editorState, updateState]);

    const handleEnter = useCallback((blockId: string) => {
        const currentBlock = editorState.blocks[blockId];
        if (!currentBlock || !currentBlock.parentId) return;

        const parent = editorState.blocks[currentBlock.parentId];
        if (!parent) return;

        // Create a new paragraph block
        const newBlock = createTextBlock('', 'paragraph', currentBlock.parentId);

        // Find the index of the current block in parent's content
        const currentIndex = parent.content.indexOf(blockId);

        // Insert the new block right after the current block
        const newBlocks = insertBlockAtIndex(
            editorState.blocks,
            currentBlock.parentId,
            newBlock,
            currentIndex + 1
        );

        updateState({
            ...editorState,
            blocks: newBlocks,
            selection: {
                blockId: newBlock.id,
                start: 0,
                end: 0,
            },
        });

        setSelectedBlockId(newBlock.id);
    }, [editorState, updateState]);

    const handleBackspace = useCallback((blockId: string, atStart: boolean = false) => {
        const currentBlock = editorState.blocks[blockId];
        if (!currentBlock || !currentBlock.parentId) return;

        const parent = editorState.blocks[currentBlock.parentId];
        if (!parent) return;

        // Find the current and previous block indices
        const currentIndex = parent.content.indexOf(blockId);
        if (currentIndex < 0) return;

        // If at start of block and not the first block, merge with previous
        if (atStart && currentIndex > 0) {
            const previousBlockId = parent.content[currentIndex - 1];
            const previousBlock = editorState.blocks[previousBlockId];
            
            if (previousBlock && previousBlock.type === currentBlock.type) {
                // Merge content with previous block
                const mergedContent = (previousBlock.properties.title || '') + (currentBlock.properties.title || '');
                const cursorPosition = (previousBlock.properties.title || '').length;
                
                // Update previous block with merged content
                const updatedBlocks = updateBlockContent(editorState.blocks, previousBlockId, {
                    properties: { ...previousBlock.properties, title: mergedContent }
                });
                
                // Remove current block
                const newBlocks = removeBlockFromParent(updatedBlocks, blockId);
                
                updateState({
                    ...editorState,
                    blocks: newBlocks,
                    selection: {
                        blockId: previousBlockId,
                        start: cursorPosition,
                        end: cursorPosition,
                    },
                });
                
                setSelectedBlockId(previousBlockId);
            } else if (previousBlock) {
                // Different block types or can't merge - just move cursor to end of previous block
                const prevContent = previousBlock.properties.title || '';
                updateState({
                    ...editorState,
                    selection: {
                        blockId: previousBlockId,
                        start: prevContent.length,
                        end: prevContent.length,
                    },
                });
                setSelectedBlockId(previousBlockId);
            }
        } else if (!atStart && currentBlock.properties.title === '' && parent.content.length > 1) {
            // Empty block and not at start - delete it
            const newIndex = Math.max(0, currentIndex - 1);
            const targetBlockId = parent.content[newIndex];
            
            const newBlocks = removeBlockFromParent(editorState.blocks, blockId);
            
            updateState({
                ...editorState,
                blocks: newBlocks,
                selection: {
                    blockId: targetBlockId,
                    start: 0,
                    end: 0,
                },
            });
            
            setSelectedBlockId(targetBlockId);
        }
    }, [editorState, updateState]);

    const handlePageTitleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        const newTitle = e.currentTarget.value;
        updateState({
            ...editorState,
            page: {
                ...editorState.page,
                title: newTitle,
            },
        });
    }, [editorState, updateState]);

    // Get the root page block
    const rootBlock = editorState.blocks[editorState.page.id];
    if (!rootBlock) return null;

    return (
        <motion.div
            className="notion-page"
            style={{ fontFamily: currentFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <header className="notion-page-header">
                <div className="notion-header-controls">
                    <div className="notion-header-left">
                        <motion.input
                            type="text"
                            className="notion-page-title"
                            value={editorState.page.title}
                            onChange={handlePageTitleChange}
                            placeholder="Untitled"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        />
                    </div>

                    <div className="notion-header-right">
                        <FontSelector 
                            currentFont={currentFont}
                            onChange={setCurrentFont}
                        />
                        
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    className="notion-save-status error"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <AlertCircle size={16} />
                                    <span>Save failed</span>
                                </motion.div>
                            )}

                            {isSaving && !error && (
                                <motion.div
                                    className="notion-save-status saving"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <div className="notion-save-spinner" />
                                    <span>Saving...</span>
                                </motion.div>
                            )}

                            {!isSaving && !error && hasChanges && (
                                <motion.div
                                    className="notion-save-status"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <span>Unsaved changes</span>
                                </motion.div>
                            )}

                            {!isSaving && !error && !hasChanges && (
                                <motion.div
                                    className="notion-save-status saved"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <span>Saved</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={handleManualSave}
                            disabled={isSaving || !hasChanges}
                            className="notion-save-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Save size={14} />
                            <span>Save</span>
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="notion-editor">
                <AnimatePresence initial={false}>
                    {rootBlock.content.map((blockId, index) => {
                        const block = editorState.blocks[blockId];
                        if (!block) return null;

                        return (
                            <motion.div
                                key={blockId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.02,
                                    ease: "easeOut"
                                }}
                                layout
                            >
                                <Block
                                    block={block}
                                    index={index}
                                    isSelected={selectedBlockId === blockId}
                                    onUpdate={handleBlockUpdate}
                                    onEnter={handleEnter}
                                    onBackspace={handleBackspace}
                                    onFocus={handleBlockFocus}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}