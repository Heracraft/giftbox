import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { GripHorizontal } from 'lucide-react'

interface LetterNoteProps {
  content: string
  onChange: (content: string) => void
  color: string
  readOnly?: boolean
}

export const LetterNote: React.FC<LetterNoteProps> = ({ content, onChange, color, readOnly = false }) => {
  return (
    <div 
      className={`${color} p-4 shadow-lg border border-stone-300 transition-all duration-300 ease-in-out hover:shadow-2xl rounded-md w-48 z-10 relative`}
    >
      {!readOnly && (
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 opacity-30 cursor-grab active:cursor-grabbing drag-handle hover:opacity-100 transition-opacity">
          <GripHorizontal size={20} />
        </div>
      )}
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={readOnly ? '' : "Type your note here..."}
        className={`w-full h-32 resize-none bg-transparent border-none shadow-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 font-mono overflow-y-auto exclude-pan ${readOnly ? 'pointer-events-none' : ''}`}
        readOnly={readOnly}
      />
    </div>
  )
}

