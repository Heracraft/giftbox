import React from 'react'
import { Polaroid } from './polaroid'
import { NotePaper } from './note-paper'
import { Microphone } from './microphone'
import { CD } from './cd'
import { Pencil } from './pencil'
import { Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ToolbarProps {
  onAddPhoto: () => void
  onAddNote: (color: string) => void
  onRecordVoice: () => void
  onAddSpotify: (url: string) => void
  onAddDoodle: () => void
  onShare?: () => void
  isSaving?: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onAddPhoto, 
  onAddNote, 
  onRecordVoice, 
  onAddSpotify, 
  onAddDoodle,
  onShare,
  isSaving
}) => {
  return (
    <div className="pt-20 mb-4 mx-auto w-full max-w-4xl overflow-hidden relative">
        <div className="bg-white rounded-2xl h-40 px-4 sm:px-12 relative flex justify-between items-end">
          <Polaroid onClick={onAddPhoto} />
          <NotePaper onAddNote={onAddNote} />
          <Microphone onClick={onRecordVoice} />
          <CD onAddSpotify={onAddSpotify} />
          <Pencil onClick={onAddDoodle} />
        </div>
        {onShare && (
          <div className="absolute right-4 top-4">
            <Button 
              onClick={onShare} 
              disabled={isSaving}
              variant="default"
              size="sm"
              className="rounded-full shadow-lg"
            >
              <Share className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Share Canvas'}
            </Button>
          </div>
        )}
    </div>
  )
}

