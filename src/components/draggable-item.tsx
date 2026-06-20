import React, { useState } from 'react'
import { LetterItem } from '@/components/canvas-editor'
import { Button } from "@/components/ui/button"
import { X, ArrowUp, ArrowDown } from 'lucide-react'

interface DraggableItemProps {
  item: LetterItem
  onDelete: () => void
  handleDragStart: (e: React.MouseEvent | React.TouchEvent, item: LetterItem) => void
  isDragging: boolean
  moveForward: () => void
  moveBackward: () => void
  isPubliclyEditable?: boolean
  children: React.ReactNode
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  onDelete, 
  handleDragStart, 
  isDragging,
  moveForward,
  moveBackward,
  isPubliclyEditable = true,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const style: React.CSSProperties = {
    position: 'absolute',
    left: item.position.x,
    top: item.position.y,
    transform: `rotate(${item.rotation}deg)`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    transition: isDragging ? 'none' : 'all 0.3s ease-out',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    zIndex: item.zIndex || 1
  }

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
      (e.target as HTMLElement).tagName === 'TEXTAREA' ||
      (e.target as HTMLElement).closest('button')) {
      return;
    }
    e.preventDefault();
    handleDragStart(e, item);
  };

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group touch-none"
    >
      {children}
      {isHovered && isPubliclyEditable && (
        <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <Button
            variant="ghost"
            size="icon"
            className="bg-blue-500 text-white rounded-full p-1 h-6 w-6 hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              moveForward();
            }}
          >
            <ArrowUp className="h-3 w-3 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-blue-500 text-white rounded-full p-1 h-6 w-6 hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              moveBackward();
            }}
          >
            <ArrowDown className="h-3 w-3 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-red-500 text-white rounded-full p-1 h-6 w-6 hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-3 w-3 text-white" />
          </Button>
        </div>
      )}
    </div>
  )
}

