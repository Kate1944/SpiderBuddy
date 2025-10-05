import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './TrashCan.css';
import trashcanSvg from './assets/trashcan2.svg';
import crumbledPaperImg from './assets/paperball.png';

interface TrashCanProps {
  score: number;
}

function TrashCan({ score }: TrashCanProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 250,
        height: 360,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    // The SVG trash body starts around y=90 and ends around y=1860
    // Scaled to 340px canvas height: 
    // Top of body: ~16px, Bottom: ~330px
    
    // Left wall - narrower at top, wider at bottom (angled outward)
    const leftWall = Matter.Bodies.fromVertices(
      69, // x center position
      150, // y center position
      [[
        { x: -5, y: -130 },   // Top left (narrower)
        { x: 5, y: -130 },    // Top right
        { x: -15, y: 135 },   // Bottom right (wider)
        { x: -25, y: 135 }    // Bottom left
      ]],
      {
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
          
        }
      }
    );

    // Right wall - narrower at top, wider at bottom (angled outward)
    const rightWall = Matter.Bodies.fromVertices(
      185, // x center position
      150, // y center position
      [[
        { x: -5, y: -130 },   // Top left
        { x: 5, y: -130 },    // Top right (narrower)
        { x: 25, y: 135 },    // Bottom right (wider)
        { x: 15, y: 135 }     // Bottom left
      ]],
      {
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
        }
      }
    );

    // Bottom of trash can
    const bottom = Matter.Bodies.rectangle(125, 257, 115, 10, {
      isStatic: true,
      render: { 
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 1
      }
    });

    // Invisible sensor at the top to detect when trash is full
    const topSensor = Matter.Bodies.rectangle(125, 80, 115, 5, {
      isStatic: true,
      isSensor: true, // This makes it non-physical (balls pass through)
      render: { 
        fillStyle: 'rgba(255, 0, 0, 0.3)', // Visible for debugging, change to transparent later
      },
      label: 'topSensor' // Label to identify it
    });

    Matter.Composite.add(engine.world, [bottom, leftWall, rightWall, topSensor]);

    // Collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        // Check if a ball touched the top sensor
        if (pair.bodyA.label === 'topSensor' || pair.bodyB.label === 'topSensor') {
          // Clear all balls
          const bodies = Matter.Composite.allBodies(engine.world);
          const papers = bodies.filter(body => !body.isStatic && body.label !== 'topSensor');
          
          papers.forEach(paper => {
            Matter.Composite.remove(engine.world, paper);
          });
        }
      });
    });
    
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const addCrumbledPaper = () => {
  if (!engineRef.current) return;

  const x = 125 + (Math.random() - 0.5) * 60;
  const y = 100;
  const radius = Math.random() * 8 + 12;

  const paper = Matter.Bodies.circle(x, y, radius, {
    restitution: 0.5,
    friction: 0.1,
    density: 0.002,
    render: {
      sprite: {
        texture: crumbledPaperImg,
        xScale: (radius * 2) / 150, // Adjust these scale values based on your image size
        yScale: (radius * 2) / 150
      }
    }
  });

  Matter.Body.setVelocity(paper, {
    x: (Math.random() - 0.5) * 1,
    y: 2
  });

  Matter.Composite.add(engineRef.current.world, paper);
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
    addCrumbledPaper();
  };

  return (
    <div
      className={`trash-can ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="trash-header">
        <h3>🗑️ Trash</h3>
        <div className="score">Score: {score}</div>
      </div>
      
      <div className="trash-svg-container">
        <img src={trashcanSvg} alt="Trash Can" className="trash-svg" />
      </div>
      
      <div ref={canvasRef} className="trash-canvas" />
    </div>
  );
}

export default TrashCan;