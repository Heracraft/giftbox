import CanvasEditor, { LetterItem } from '@/components/canvas-editor'
import { pb, getFileUrl } from '@/lib/pocketbase'
import { notFound } from 'next/navigation'

export default async function SharedCanvasPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const record = await pb.collection('boxes').getOne(id)
    
    // Parse the JSON data
    let items = []
    if (record.data) {
      // PocketBase JS SDK automatically parses JSON fields, so record.data is likely already an object/array.
      items = typeof record.data === 'string' ? JSON.parse(record.data) : record.data;
      
      const mediaFiles = record.media || [];
      
      // Replace file references with actual URLs
      items = items.map((item: LetterItem) => {
        if (typeof item.content === 'string' && item.content.startsWith('pocketbase_file:')) {
          const originalFilename = item.content.split(':')[1]
          const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
          const actualFilename = mediaFiles.find((f: string) => f.startsWith(baseName)) || originalFilename;
          
          return {
            ...item,
            content: getFileUrl(record, actualFilename)
          }
        }
        return item
      })
    }

    return (
      <CanvasEditor 
        initialItems={items} 
        recordId={record.id} 
        isPubliclyEditable={false} 
      />
    )
  } catch (error) {
    console.error("Error fetching canvas:", error)
    return notFound()
  }
}
