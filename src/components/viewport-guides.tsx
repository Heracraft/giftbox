import React from 'react'
import { Smartphone, Tablet, Monitor, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useControls } from 'react-zoom-pan-pinch'

export type ViewportDevice = 'none' | 'iphone' | 'ipad' | 'laptop'

interface ViewportGuidesProps {
  activeViewport: ViewportDevice
  onChange: (viewport: ViewportDevice) => void
}

const DEVICES = [
  { id: 'none', label: 'Freeform', icon: null, width: 0, height: 0 },
  { id: 'iphone', label: 'iPhone 17', icon: Smartphone, width: 393, height: 852 },
  { id: 'ipad', label: 'iPad Pro', icon: Tablet, width: 1024, height: 1366 },
  { id: 'laptop', label: 'Laptop', icon: Monitor, width: 1440, height: 900 },
]

export const ViewportGuides: React.FC<ViewportGuidesProps> = ({ activeViewport, onChange }) => {
  const { zoomToElement, resetTransform } = useControls()

  const handleSelect = (deviceId: string) => {
    const device = deviceId as ViewportDevice;
    onChange(device);

    setTimeout(() => {
      if (device === 'none') {
        resetTransform();
      } else {
        zoomToElement('viewport-guide-box', 1, 300, 'easeOut');
      }
    }, 50); // slight delay to let DOM render the box
  }

  const activeDevice = DEVICES.find(d => d.id === activeViewport)
  const Icon = activeDevice?.icon || Smartphone

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm gap-2">
          {activeViewport !== 'none' ? <Icon className="w-4 h-4" /> : null}
          {activeViewport === 'none' ? 'Viewport Guides' : activeDevice?.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="flex flex-col">
          {DEVICES.map((device) => {
            const DeviceIcon = device.icon;
            return (
              <Button
                key={device.id}
                variant="ghost"
                className="justify-start gap-2 px-2"
                onClick={() => handleSelect(device.id)}
              >
                {DeviceIcon ? <DeviceIcon className="w-4 h-4 text-stone-500" /> : <div className="w-4 h-4" />}
                <span className="flex-1 text-left">{device.label}</span>
                {activeViewport === device.id && <Check className="w-4 h-4" />}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const ViewportBoundingBox: React.FC<{ activeViewport: ViewportDevice }> = ({ activeViewport }) => {
  if (activeViewport === 'none') return null;

  const device = DEVICES.find(d => d.id === activeViewport);
  if (!device) return null;

  return (
    <div
      id="viewport-guide-box"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-pink-400 pointer-events-none z-0"
      style={{
        width: `${device.width}px`,
        height: `${device.height}px`,
      }}
    >
      <div className="absolute -top-6 left-0 text-xs font-mono text-pink-500 font-semibold bg-white/80 px-2 py-0.5 rounded shadow-sm">
        {device.label} ({device.width}x{device.height})
      </div>
    </div>
  )
}
