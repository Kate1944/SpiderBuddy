import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './TrashCan.css';

function TrashCan() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [score, setScore] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Matter.js engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 250,
        height: 300,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    // Create ground and walls
    const ground = Matter.Bodies.rectangle(125, 290, 250, 20, {
      isStatic: true,
      render: { fillStyle: '#8b7355' }
    });

    const wallLeft = Matter.Bodies.rectangle(5, 200, 10, 300, {
      isStatic: true,
      render: { fillStyle: '#8b7355' }
    });

    const wallRight = Matter.Bodies.rectangle(245, 200, 10, 300, {
      isStatic: true,
      render: { fillStyle: '#8b7355' }
    });

    Matter.World.add(engine.world, [ground, wallLeft, wallRight]);

    // Run the engine and renderer
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const addCrumbledPaper = () => {
    if (!engineRef.current) return;

    // Create a crumpled paper ball
    const x = Math.random() * 150 + 50;
    const y = -20;
    const radius = Math.random() * 15 + 10;

    const paper = Matter.Bodies.circle(x, y, radius, {
      restitution: 0.6,
      friction: 0.3,
      density: 0.001,
      render: {
        fillStyle: '#f4f4f4',
        strokeStyle: '#ddd',
        lineWidth: 2
      }
    });

    Matter.World.add(engineRef.current.world, paper);

    // Remove paper after 5 seconds
    setTimeout(() => {
      if (engineRef.current) {
        Matter.World.remove(engineRef.current.world, paper);
      }
    }, 5000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    console.log('Task dropped:', taskId);
    
    // Add crumpled paper animation
    addCrumbledPaper();
    
    // Increase score
    setScore(prev => prev + 10);
  };

  return (
    <div
      className={`trash-can ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="trash-header">
        <h3>���️ Trash</h3>
        <div className="score">Score: {score}</div>
      </div>
      <div ref={canvasRef} className="trash-canvas" />
    </div>
  );
}

export default TrashCan;
