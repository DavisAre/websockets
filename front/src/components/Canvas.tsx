import React, { useRef, useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/SocketContext'; // Adjust the path as needed

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const socket = useContext(SocketContext);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (contextRef.current && socket) {
      const { offsetX, offsetY } = nativeEvent;

      if (!isDrawing) {
        contextRef.current.beginPath();
      }

      contextRef.current.moveTo(offsetX, offsetY);

      // Emit drawing start to the server
      socket.emit('drawing:start', { x: offsetX, y: offsetY });
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (contextRef.current && socket && isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();

      // Emit drawing data to the server
      socket.emit('drawing:draw', { x: offsetX, y: offsetY });
    }
  };

  const endDrawing = () => {
    if (contextRef.current && socket && isDrawing) {
      contextRef.current.closePath();

      // Emit drawing end to the server
      socket.emit('drawing:end');
      setIsDrawing(false);
    }
  };

  // Listen for drawing updates from other clients
  useEffect(() => {
    if (socket) {
      socket.on('drawing:draw', (data: { x: number; y: number }) => {
        if (contextRef.current && isDrawing) {
          contextRef.current.lineTo(data.x, data.y);
          contextRef.current.stroke();
        }
      });
    }
  }, [socket, isDrawing]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
    />
  );
};
