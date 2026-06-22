import React from 'react'
import { Polaroid } from './polaroid'
import { NotePaper } from './note-paper'
import { Microphone } from './microphone'
import { CD } from './cd'
import { Pencil } from './pencil'
import { Share, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ToolbarProps {
  onAddPhoto: () => void
  onAddNote: (color: string) => void
  onRecordVoice: () => void
  onAddSpotify: (url: string) => void
  onAddDoodle: () => void
  onShare?: () => void
  onClear?: () => void
  isSaving?: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onAddPhoto, 
  onAddNote, 
  onRecordVoice, 
  onAddSpotify, 
  onAddDoodle,
  onShare,
  onClear,
  isSaving
}) => {
  return (
    <div className="pt-12 sm:pt-20 mb-2 sm:mb-4 mx-auto w-full max-w-4xl px-4 overflow-hidden relative">
        <div className="bg-white rounded-2xl h-20 sm:h-40 px-2 sm:px-12 relative flex justify-between items-end pb-2 sm:pb-0 shadow-lg border border-stone-200/60">
          <div className="w-12 sm:w-32 h-16 sm:h-40 flex items-end justify-center scale-[0.45] sm:scale-100 origin-bottom transition-all overflow-visible">
            <Polaroid onClick={onAddPhoto} />
          </div>
          <div className="w-12 sm:w-32 h-16 sm:h-40 flex items-end justify-center scale-[0.45] sm:scale-100 origin-bottom transition-all overflow-visible">
            <NotePaper onAddNote={onAddNote} />
          </div>
          <div className="w-12 sm:w-32 h-16 sm:h-40 flex items-end justify-center scale-[0.45] sm:scale-100 origin-bottom transition-all overflow-visible">
            <Microphone onClick={onRecordVoice} />
          </div>
          <div className="w-12 sm:w-32 h-16 sm:h-40 flex items-end justify-center scale-[0.45] sm:scale-100 origin-bottom transition-all overflow-visible">
            <CD onAddSpotify={onAddSpotify} />
          </div>
          <div className="w-12 sm:w-32 h-16 sm:h-40 flex items-end justify-center scale-[0.45] sm:scale-100 origin-bottom transition-all overflow-visible">
            <Pencil onClick={onAddDoodle} />
          </div>
        </div>
        {(onShare || onClear) && (
          <div className="absolute right-6 top-2 sm:top-4 flex gap-2">
            {onClear && (
              <Button 
                onClick={onClear}
                variant="outline"
                size="sm"
                className="rounded-full shadow-lg border-stone-300 hover:bg-stone-100 text-stone-600 hover:text-stone-900 bg-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Clear Canvas</span>
                <span className="inline sm:hidden">Clear</span>
              </Button>
            )}
            {onShare && (
              <Button 
                onClick={onShare} 
                disabled={isSaving}
                variant="default"
                size="sm"
                className="rounded-full shadow-lg"
              >
                <Share className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : (
                  <>
                    <span className="hidden sm:inline">Share Canvas</span>
                    <span className="inline sm:hidden">Share</span>
                  </>
                )}
              </Button>
            )}
          </div>
        )}
    </div>
  )
}

