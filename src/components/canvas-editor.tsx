"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toolbar } from '@/components/toolbar'
import { LetterCanvas } from '@/components/letter-canvas'
import { PhotoUploader } from '@/components/photo-uploader'
import { VoiceRecorder } from '@/components/voice-recorder'
import { DoodleDrawer } from '@/components/doodle-drawer'
import { DottedBackground } from '@/components/dotted-background'
import { pb } from '@/lib/pocketbase'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ViewportGuides, ViewportBoundingBox, ViewportDevice } from '@/components/viewport-guides'

export interface LetterItem {
  id: string
  type: 'photo' | 'note' | 'voice' | 'spotify' | 'doodle'
  content: string | Blob
  position: { x: number; y: number }
  rotation: number
  scale?: number
  color?: string
  caption?: string
  offsetX?: number
  offsetY?: number
  zIndex?: number
}

export default function CanvasEditor({ 
  initialItems = [], 
  recordId = null,
  isPubliclyEditable = true
}: { 
  initialItems?: LetterItem[], 
  recordId?: string | null,
  isPubliclyEditable?: boolean
}) {
  const [items, setItems] = useState<LetterItem[]>(initialItems)
  const [isPhotoUploaderOpen, setIsPhotoUploaderOpen] = useState(false)
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false)
  const [isDoodleDrawerOpen, setIsDoodleDrawerOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentItem, setCurrentItem] = useState<LetterItem | null>(null)
  const [activeViewport, setActiveViewport] = useState<ViewportDevice>('none')
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)

  const contentBounds = useMemo(() => {
    if (items.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    items.forEach(item => {
      minX = Math.min(minX, item.position.x);
      minY = Math.min(minY, item.position.y);
      // Rough estimates of item sizes
      const w = 300;
      const h = 300;
      maxX = Math.max(maxX, item.position.x + w);
      maxY = Math.max(maxY, item.position.y + h);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [items]);

  const getRandomPosition = () => {
    // If a viewport is active, try to center items loosely around the middle
    if (activeViewport !== 'none' && typeof window !== 'undefined') {
       return {
         x: window.innerWidth / 2 + Math.floor((Math.random() - 0.5) * 200),
         y: window.innerHeight / 2 + Math.floor((Math.random() - 0.5) * 200)
       }
    }
    return { 
      x: Math.floor(Math.random() * 200), 
      y: Math.floor(Math.random() * 200) 
    }
  }
  
  const getRandomRotation = () => {
    return Math.floor((Math.random() - 0.5) * 10)
  }

  const normalizeZIndices = () => {
    setItems(prevItems => {
      
      const sortedItems = [...prevItems].sort((a, b) => 
        (a.zIndex || 0) - (b.zIndex || 0)
      );
      
      return sortedItems.map((item, index) => ({
        ...item,
        zIndex: index + 1
      }));
    });
  };

  const moveItemForward = (id: string) => {
    setItems(prevItems => {
      
      const sortedItems = [...prevItems].sort((a, b) => 
        (a.zIndex || 0) - (b.zIndex || 0)
      );
      
      const itemIndex = sortedItems.findIndex(item => item.id === id);
      if (itemIndex === -1 || itemIndex === sortedItems.length - 1) {
        return prevItems; 
      }
      
      const nextItem = sortedItems[itemIndex + 1];
      const currentItemZIndex = sortedItems[itemIndex].zIndex || 0;
      const nextItemZIndex = nextItem.zIndex || 0;
      
      return prevItems.map(item => {
        if (item.id === id) {
          return { ...item, zIndex: nextItemZIndex };
        } else if (item.id === nextItem.id) {
          return { ...item, zIndex: currentItemZIndex };
        }
        return item;
      });
    });
  };
  
  const moveItemBackward = (id: string) => {
    setItems(prevItems => {
      
      const sortedItems = [...prevItems].sort((a, b) => 
        (a.zIndex || 0) - (b.zIndex || 0)
      );
      
      const itemIndex = sortedItems.findIndex(item => item.id === id);
      if (itemIndex <= 0) {
        return prevItems; 
      }
      
      const prevItem = sortedItems[itemIndex - 1];
      const currentItemZIndex = sortedItems[itemIndex].zIndex || 0;
      const prevItemZIndex = prevItem.zIndex || 0;
      
      return prevItems.map(item => {
        if (item.id === id) {
          return { ...item, zIndex: prevItemZIndex };
        } else if (item.id === prevItem.id) {
          return { ...item, zIndex: currentItemZIndex };
        }
        return item;
      });
    });
  };
  useEffect(() => {
    normalizeZIndices();
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const preventOneFingerPan = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.touches.length === 1 && 
        target && 
        !target.closest('.draggable-item') && 
        !target.closest('.exclude-pan')
      ) {
        e.stopPropagation();
      }
    };

    const handleCanvasPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest('.draggable-item') && !target.closest('.exclude-pan')) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    canvasElement.addEventListener('touchstart', preventOneFingerPan, { capture: true });
    canvasElement.addEventListener('pointerdown', handleCanvasPointerDown, { capture: true });
    return () => {
      canvasElement.removeEventListener('touchstart', preventOneFingerPan, { capture: true });
      canvasElement.removeEventListener('pointerdown', handleCanvasPointerDown, { capture: true });
    };
  }, []);

  const addItem = (item: LetterItem) => {
    setItems((prevItems) => {
      
      const highestZIndex = prevItems.length > 0 
        ? Math.max(...prevItems.map(item => item.zIndex || 0)) 
        : 0;
      
      return [...prevItems, {
        ...item,
        zIndex: highestZIndex + 1
      }];
    });
  };

  const updateItemPosition = (id: string, position: { x: number; y: number }) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, position } : item
      )
    )
  }

  const updateItemRotation = (id: string, rotation: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, rotation } : item
      )
    )
  }

  const updateItemContent = (id: string, content: string, field: string = 'content') => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: content } : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, item: LetterItem) => {
    const position = 'touches' in e ? e.touches[0] : e
    
    setIsDragging(true)
    setCurrentItem(item)
    dragStartRef.current = {
      startX: position.clientX,
      startY: position.clientY,
      initialX: item.position.x,
      initialY: item.position.y
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !currentItem || !dragStartRef.current) return
    
    const position = 'touches' in e ? e.touches[0] : e
    
    let scale = 1
    const transformElement = document.querySelector('.react-transform-component > div') as HTMLElement
    if (transformElement) {
      const transformStyle = transformElement.style.transform
      const match = transformStyle.match(/scale\(([^)]+)\)/)
      if (match) {
        scale = parseFloat(match[1])
      }
    }

    const dx = (position.clientX - dragStartRef.current.startX) / scale
    const dy = (position.clientY - dragStartRef.current.startY) / scale

    const x = dragStartRef.current.initialX + dx
    const y = dragStartRef.current.initialY + dy

    updateItemPosition(currentItem.id, { x, y })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setCurrentItem(null)
    dragStartRef.current = null
  }

  const addNote = (color: string) => {
    addItem({
      id: Date.now().toString(),
      type: 'note',
      content: '',
      position: getRandomPosition(),
      rotation: getRandomRotation(),
      color: color
    })
  }

  const addSpotifyPlayer = (spotifyUrl: string) => {
    addItem({
      id: Date.now().toString(),
      type: 'spotify',
      content: spotifyUrl,
      position: getRandomPosition(),
      rotation: getRandomRotation()
    })
  }

  const addDoodle = (doodleUrl: string) => {
    addItem({
      id: Date.now().toString(),
      type: 'doodle',
      content: doodleUrl,
      position: getRandomPosition(),
      rotation: getRandomRotation()
    })
  }

  const handleShare = async () => {
    if (items.length === 0) {
      alert("Add some items to the canvas before sharing!");
      return;
    }
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      const itemsToSave = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (typeof item.content === 'string' && (item.content.startsWith('data:image/') || item.content.startsWith('blob:'))) {
          // Both photo and doodle base64/blob
          const res = await fetch(item.content);
          const blob = await res.blob();
          const ext = item.type === 'doodle' ? 'svg' : 'jpg';
          const filename = `${item.type}_${item.id}.${ext}`;
          
          const file = new File([blob], filename, { type: blob.type });
          formData.append('media', file);
          
          itemsToSave.push({
            ...item,
            content: `pocketbase_file:${filename}`
          });
        } else if (item.type === 'voice' && item.content instanceof Blob) {
          const filename = `voice_${item.id}.wav`;
          const file = new File([item.content], filename, { type: 'audio/wav' });
          formData.append('media', file);
          
          itemsToSave.push({
            ...item,
            content: `pocketbase_file:${filename}`
          });
        } else {
          itemsToSave.push(item);
        }
      }

      formData.append('data', JSON.stringify(itemsToSave));
      
      let record;
      if (recordId) {
        // If we are editing an existing record
        record = await pb.collection('boxes').update(recordId, formData);
      } else {
        // Creating a new record
        formData.append('isPubliclyEditable', 'true');
        record = await pb.collection('boxes').create(formData);
      }
      
      const shareUrl = `${window.location.origin}/b/${record.id}`;
      
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(`Canvas saved! Link copied to clipboard:\n${shareUrl}`);
      } catch {
        alert(`Canvas saved! Link:\n${shareUrl}`);
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Failed to save canvas.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen overflow-hidden bg-stone-200 flex flex-col relative">
        <DottedBackground />
        <main 
          className="flex-1 relative overflow-hidden z-20 canvas-background"
          ref={canvasRef}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <TransformWrapper
            minScale={0.1}
            maxScale={4}
            initialScale={1}
            centerOnInit={false}
            limitToBounds={false}
            onInit={(ref) => {
               if (!isPubliclyEditable && items.length > 0) {
                 setTimeout(() => {
                   ref.zoomToElement('canvas-content-bounds', 1, 300, 'easeOut');
                 }, 50);
               }
            }}
            panning={{
              disabled: isDragging,
              excluded: ['exclude-pan', 'lucide'] // exclude specific UI elements and icons from triggering pan
            }}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
          >
            <>
              {isPubliclyEditable && (
                <div className="absolute top-4 right-4 z-50">
                  <ViewportGuides activeViewport={activeViewport} onChange={setActiveViewport} />
                </div>
              )}
              <TransformComponent 
                wrapperStyle={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0 }}
                contentStyle={{ width: '100vw', height: '100vh' }}
              >
                {contentBounds && (
                  <div 
                    id="canvas-content-bounds" 
                    className="absolute pointer-events-none opacity-0"
                    style={{ 
                      left: contentBounds.x - (contentBounds.width * 0.1) - 50, 
                      top: contentBounds.y - (contentBounds.height * 0.1) - 50, 
                      width: contentBounds.width * 1.2 + 100, 
                      height: contentBounds.height * 1.2 + 100 
                    }}
                  />
                )}
                <ViewportBoundingBox activeViewport={activeViewport} />
                <LetterCanvas 
                  items={items} 
                  updateItemPosition={updateItemPosition}
                  updateItemContent={updateItemContent}
                  updateItemRotation={updateItemRotation}
                  deleteItem={deleteItem}
                  handleDragStart={handleDragStart}
                  isDragging={isDragging}
                  currentItem={currentItem}
                  moveItemForward={moveItemForward}
                  moveItemBackward={moveItemBackward}
                  isPubliclyEditable={isPubliclyEditable}
                />
              </TransformComponent>
            </>
          </TransformWrapper>
        </main>
        {isPubliclyEditable && (
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <Toolbar
              onAddPhoto={() => setIsPhotoUploaderOpen(true)}
              onAddNote={addNote}
              onRecordVoice={() => setIsVoiceRecorderOpen(true)}
              onAddSpotify={addSpotifyPlayer}
              onAddDoodle={() => setIsDoodleDrawerOpen(true)}
              onShare={handleShare}
              isSaving={isSaving}
            />
          </div>
        )}
        {isPhotoUploaderOpen && (
          <PhotoUploader
            onClose={() => setIsPhotoUploaderOpen(false)}
            onPhotoAdd={(photoUrl) => {
              addItem({
                id: Date.now().toString(),
                type: 'photo',
                content: photoUrl,
                position: getRandomPosition(),
                rotation: getRandomRotation(),
                caption: ''
              })
              setIsPhotoUploaderOpen(false)
            }}
          />
        )}
        {isVoiceRecorderOpen && (
          <VoiceRecorder
            onClose={() => setIsVoiceRecorderOpen(false)}
            onVoiceAdd={(audioBlob) => {
              addItem({
                id: Date.now().toString(),
                type: 'voice',
                content: audioBlob,
                position: getRandomPosition(),
                rotation: getRandomRotation()
              })
              setIsVoiceRecorderOpen(false)
            }}
          />
        )}
        {isDoodleDrawerOpen && (
          <DoodleDrawer
            onClose={() => setIsDoodleDrawerOpen(false)}
            onDoodleAdd={(doodleUrl) => {
              addDoodle(doodleUrl)
              setIsDoodleDrawerOpen(false)
            }}
          />
        )}
      </div>
    </DndProvider>
  )
}