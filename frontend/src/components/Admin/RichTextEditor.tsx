import { useRef, useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const RichTextEditor = ({ value, onChange, placeholder, disabled, className = '' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateValue()
  }

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    updateValue()
  }

  const insertLink = () => {
    const url = prompt('Entrez l\'URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  return (
    <div className={`border border-primary-500/20 rounded-lg overflow-hidden ${className}`}>
      {/* Barre d'outils */}
      <div className="flex items-center gap-1 p-2 bg-secondary-800/50 [data-theme='light']:bg-secondary-100 border-b border-primary-500/20">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Gras (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Italique (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Souligné (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-primary-500/20 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-primary-500/20 mx-1" />
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded hover:bg-primary-500/20 text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={disabled}
          title="Insérer un lien"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={updateValue}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[150px] p-4 bg-secondary-800/30 [data-theme='light']:bg-white text-white [data-theme='light']:text-dark-500 focus:outline-none ${
          isFocused ? 'ring-2 ring-primary-500/50' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: disabled ? 'rgba(31, 41, 55, 0.3)' : undefined,
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        [contenteditable] li {
          margin-bottom: 0.25rem;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        [contenteditable] strong {
          font-weight: 700;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor

