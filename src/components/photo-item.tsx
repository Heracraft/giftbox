import React from "react";
import { GripHorizontal } from "lucide-react";

interface PhotoItemProps {
	url: string;
	caption: string;
	onCaptionChange: (caption: string) => void;
	readOnly?: boolean;
}

export const PhotoItem: React.FC<PhotoItemProps> = ({ url, caption, onCaptionChange, readOnly = false }) => {
	return (
		<div className="bg-white  py-4 px-4 shadow-md rounded-lg w-60 border border-stone-300 relative z-10 transition-all duration-300 ease-in-out hover:shadow-2xl">
			{!readOnly && (
				<div className="absolute top-0.5 left-1/2 -translate-x-1/2 opacity-30 cursor-grab active:cursor-grabbing drag-handle hover:opacity-100 transition-opacity">
					<GripHorizontal size={20} />
				</div>
			)}
			<img src={url} alt="User uploaded image" className="w-full h-auto pointer-events-none border border-stone-200 rounded-sm shadow-inner" draggable="false" />
			<div className="mt-2">
				<input
					type="text"
					value={caption}
					onChange={(e) => onCaptionChange(e.target.value)}
					placeholder={readOnly ? "" : "Add a caption..."}
					className="w-full text-sm text-center text-ellipsis overflow-hidden outline-none"
					onMouseDown={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					readOnly={readOnly}
					title={caption}
				/>
			</div>
		</div>
	);
};
