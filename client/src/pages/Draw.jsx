import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, Undo, Redo, Send } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';

const COLORS = [
    '#000000', '#FF3B30', '#FF2D55', '#AF52DE', '#007AFF', '#34C759', '#FFCC00'
];

const Draw = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { sendDrawing } = useSocket();

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);
    const [context, setContext] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [lastPoint, setLastPoint] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;

        // Set display size (css pixels)
        const displayWidth = parent.clientWidth;
        const displayHeight = parent.clientHeight;

        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        // Set display size
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        const ctx = canvas.getContext('2d', { alpha: true });

        // Scale all drawing operations by the dpr
        ctx.scale(dpr, dpr);

        // Enable anti-aliasing and smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Set line properties for smooth, clean drawing
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        setContext(ctx);

        // Save initial blank state
        saveState(canvas);

        const handleResize = () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

            const newDisplayWidth = parent.clientWidth;
            const newDisplayHeight = parent.clientHeight;

            canvas.width = newDisplayWidth * dpr;
            canvas.height = newDisplayHeight * dpr;
            canvas.style.width = newDisplayWidth + 'px';
            canvas.style.height = newDisplayHeight + 'px';

            ctx.scale(dpr, dpr);
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (context) {
            context.strokeStyle = color;
            context.lineWidth = brushSize;
        }
    }, [color, brushSize, context]);

    const saveState = (canvas) => {
        const dataUrl = canvas.toDataURL();
        setHistory(prev => [...prev.slice(0, historyStep + 1), dataUrl]);
        setHistoryStep(prev => prev + 1);
    };

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        setLastPoint({ x: offsetX, y: offsetY });
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = getCoordinates(e);

        if (lastPoint) {
            // Use quadratic curve for smooth lines
            const midX = (lastPoint.x + offsetX) / 2;
            const midY = (lastPoint.y + offsetY) / 2;

            context.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
            context.stroke();

            setLastPoint({ x: offsetX, y: offsetY });
        } else {
            context.lineTo(offsetX, offsetY);
            context.stroke();
            setLastPoint({ x: offsetX, y: offsetY });
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            context.closePath();
            setIsDrawing(false);
            setLastPoint(null);
            saveState(canvasRef.current);
        }
    };

    const getCoordinates = (e) => {
        if (e.touches && e.touches[0]) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const handleUndo = () => {
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            restoreState(history[newStep]);
            setHistoryStep(newStep);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            restoreState(history[newStep]);
            setHistoryStep(newStep);
        }
    };

    const restoreState = (dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            context.drawImage(img, 0, 0);
        };
    };

    const clearCanvas = () => {
        if (context && canvasRef.current) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            saveState(canvasRef.current);
        }
    };

    const [searchParams] = useSearchParams();
    const isOnboarding = searchParams.get('onboarding') === 'true';

    const handleSend = () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL();

        if (isOnboarding) {
            navigate('/onboarding/preview', { state: { drawing: dataUrl } });
        } else {
            sendDrawing(dataUrl);
            alert('Drawing sent!');
            clearCanvas();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 pb-24">
            {/* Header */}
            {/* Header Removed */}
            <div className="pt-6"></div>

            {/* Controls */}
            <div className="px-6 py-6 bg-gray-50 flex flex-col gap-6">
                {/* Colors */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</span>
                    <div className="flex justify-between items-center">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Brush Size */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Brush Size</span>
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                        <div
                            className="rounded-full bg-black transition-all duration-200"
                            style={{ width: `${brushSize}px`, height: `${brushSize}px` }}
                        />
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 px-4 pb-4">
                <div className="w-full h-full bg-white rounded-3xl overflow-hidden touch-none relative">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full cursor-crosshair"
                    />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-8 pb-8 pt-2 flex justify-between items-center text-gray-400">
                <div className="flex gap-8">
                    <button onClick={handleUndo} disabled={historyStep <= 0} className="disabled:opacity-30 hover:text-black transition-colors">
                        <Undo size={24} />
                    </button>
                    <button onClick={handleRedo} disabled={historyStep >= history.length - 1} className="disabled:opacity-30 hover:text-black transition-colors">
                        <Redo size={24} />
                    </button>
                    <button onClick={clearCanvas} className="text-red-500 hover:text-red-600 transition-colors">
                        <Trash2 size={24} />
                    </button>
                </div>
                <button onClick={handleSend} className="text-[#fa9a00] hover:text-[#e08a00] transition-colors flex items-center gap-2 font-semibold">
                    <Send size={24} />
                    <span>Send</span>
                </button>
            </div>
        </div>

    );
};

export default Draw;
