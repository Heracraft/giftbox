import React, { useState, useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { GripHorizontal } from 'lucide-react'

interface LetterNoteProps {
  content: string
  onChange: (content: string) => void
  color: string
  readOnly?: boolean
}

export const LetterNote: React.FC<LetterNoteProps> = ({ content, onChange, color, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (readOnly || isEditing || !touchStartRef.current) return

    const dx = e.clientX - touchStartRef.current.x
    const dy = e.clientY - touchStartRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // If the movement is less than 5px, treat it as a tap/click to edit
    if (distance < 5) {
      setIsEditing(true)
      // Focus after state update
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
    touchStartRef.current = null
  }

  return (
    <div 
      className={`${color} pt-8 pb-4 px-4 shadow-lg border border-stone-300 transition-all duration-300 ease-in-out hover:shadow-2xl rounded-md w-48 z-10 relative`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {!readOnly && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
          <GripHorizontal size={20} />
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={readOnly ? '' : "Type your note here..."}
        className={`w-full h-32 resize-none bg-transparent border-none shadow-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 font-mono ${(readOnly || !isEditing) ? 'pointer-events-none' : ''}`}
        onBlur={() => setIsEditing(false)}
        readOnly={readOnly}
      />
    </div>
  )
}

