'use client';

import { useEffect, useRef } from 'react';

interface NeuralNetworkProps {
  className?: string;
}

export function NeuralNetwork({ className }: NeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; layer: number }> = [];
    const layers = 4;
    const nodesPerLayer = 6;

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        nodes.push({
          x: (canvas.width / (layers + 1)) * (layer + 1),
          y: (canvas.height / (nodesPerLayer + 1)) * (i + 1),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          layer
        });
      }
    }

    let pulsePhase = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulsePhase += 0.02;

      // Update node positions slightly
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce back towards original position
        const targetX = (canvas.width / (layers + 1)) * (node.layer + 1);
        node.vx += (targetX - node.x) * 0.001;
        
        // Add some randomness
        node.vx += (Math.random() - 0.5) * 0.01;
        node.vy += (Math.random() - 0.5) * 0.01;
        
        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;
      });

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          if (Math.abs(node.layer - otherNode.layer) === 1) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            
            if (distance < 200) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              
              const opacity = Math.sin(pulsePhase + i * 0.1) * 0.3 + 0.4;
              const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
              gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity * (1 - distance / 200)})`);
              gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * (1 - distance / 200)})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1 + Math.sin(pulsePhase + i * 0.1) * 0.5;
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4 + Math.sin(pulsePhase + i * 0.2) * 2, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 6);
        gradient.addColorStop(0, `rgba(6, 182, 212, ${0.8 + Math.sin(pulsePhase + i * 0.2) * 0.2})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
