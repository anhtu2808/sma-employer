import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Select } from 'antd';
import {
    Link as LinkIcon, Unlink, Image as ImageIcon,
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Code,
    IndentDecrease, IndentIncrease
} from 'lucide-react';

const MenuBar = ({ editor }) => {
    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    // Format options for Select
    const formatOptions = [
        { value: 'paragraph', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
    ];

    const currentFormat = editor.isActive('heading', { level: 1 }) ? 'h1'
        : editor.isActive('heading', { level: 2 }) ? 'h2'
            : editor.isActive('heading', { level: 3 }) ? 'h3'
                : 'paragraph';

    const handleFormatChange = (value) => {
        if (value === 'paragraph') editor.chain().focus().setParagraph().run();
        else if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
        else if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
        else if (value === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
    };

    const ToolbarButton = ({ onClick, isActive, icon: Icon, disabled }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors 
                ${isActive ? 'bg-gray-200 text-black' : ''} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        </button>
    );

    const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            {/* Paragraph Format */}
            <Select
                value={currentFormat}
                onChange={handleFormatChange}
                options={formatOptions}
                variant="borderless"
                className="w-32"
                popupMatchSelectWidth={false}
            />

            <Divider />

            {/* Text Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                icon={UnderlineIcon}
            />

            <Divider />

            {/* Alignment */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                icon={AlignLeft}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                icon={AlignCenter}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                icon={AlignRight}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                icon={AlignJustify}
            />

            <Divider />

            {/* Lists & Indent */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon={List}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon={ListOrdered}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                disabled={!editor.can().sinkListItem('listItem')}
                icon={IndentIncrease}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                disabled={!editor.can().liftListItem('listItem')}
                icon={IndentDecrease}
            />

            <Divider />

            {/* Code */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                icon={Code}
            />
        </div>
    );
};

const TiptapEditor = ({ value, onChange, placeholder, disabled }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Image,
        ],
        content: value || '',
        editable: !disabled,
        preserveWhitespace: 'full',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    return (
        <div className={`border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}>
            {!disabled && <MenuBar editor={editor} />}
            <div className={`p-4 min-h-[200px] ${disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-text bg-white'}`} onClick={() => !disabled && editor?.chain().focus().run()}>
                <EditorContent editor={editor} className="tiptap-content outline-none" />
            </div>
        </div>
    );
};

export default TiptapEditor;