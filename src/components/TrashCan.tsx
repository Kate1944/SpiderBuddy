import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './TrashCan.css';
import trashcanSvg from './assets/trashcan.svg';
import trashcanSvg2 from './assets/trashcan2.svg';
import crumbledPaperImg from './assets/paperball.png';

interface TrashCanProps {
  score: number;
  onScoreIncrease: () => void;
}

function TrashCan({ score, onScoreIncrease }: TrashCanProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTrashCan, setCurrentTrashCan] = useState<'trash1' | 'trash2'>('trash2');
  const hasTriggeredRef = useRef(false);

  // Toggle between trash cans
  const toggleTrashCan = () => {
    setCurrentTrashCan(prev => prev === 'trash1' ? 'trash2' : 'trash1');
  };

  // Confetti celebration animation
  const celebrate = () => {
    if (!confettiCanvasRef.current) return;

    const canvas = confettiCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 250;
    canvas.height = 360;

    const confettiPieces: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#00b894'];

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: 125,
        y: 180,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece, index) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.3; // gravity
        piece.rotation += piece.rotationSpeed;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();

        // Remove pieces that fall off screen
        if (piece.y > canvas.height) {
          confettiPieces.splice(index, 1);
        }
      });

      if (confettiPieces.length > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  };

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

    // Left wall - narrower at top, wider at bottom (angled outward)
    const leftWall = Matter.Bodies.fromVertices(
      69,
      150,
      [[
        { x: -5, y: -130 },
        { x: 5, y: -130 },
        { x: -15, y: 135 },
        { x: -25, y: 135 }
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
      185,
      150,
      [[
        { x: -5, y: -130 },
        { x: 5, y: -130 },
        { x: 25, y: 135 },
        { x: 15, y: 135 }
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
      }
    });

    // Invisible sensor at the top to detect when trash is full
    const topSensor = Matter.Bodies.rectangle(125, 80, 115, 5, {
      isStatic: true,
      isSensor: true,
      render: { 
        fillStyle: 'rgba(255, 0, 0, 0.3)',
      },
      label: 'topSensor'
    });

    Matter.Composite.add(engine.world, [bottom, leftWall, rightWall, topSensor]);

    // Collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      // Check if ANY collision involves the sensor
      const sensorCollision = event.pairs.some((pair) => 
        pair.bodyA.label === 'topSensor' || pair.bodyB.label === 'topSensor'
      );
      
      if (sensorCollision && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        
        // Trigger confetti celebration
        celebrate();
        
        // Clear all balls after a short delay
        setTimeout(() => {
          const bodies = Matter.Composite.allBodies(engine.world);
          const papers = bodies.filter(body => !body.isStatic && body.label !== 'topSensor');
          
          papers.forEach(paper => {
            Matter.Composite.remove(engine.world, paper);
          });
          
          // Increment score by 1
          onScoreIncrease();
          
          // Reset trigger after clearing
          setTimeout(() => {
            hasTriggeredRef.current = false;
          }, 500);
        }, 300);
      }
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
  }, [onScoreIncrease]);

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
          xScale: (radius * 2) / 150,
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
    
    const numPapers = Math.floor(Math.random() * 3) + 3; // 3-5 papers
    for (let i = 0; i < numPapers; i++) {
      setTimeout(() => addCrumbledPaper(), i * 100);
    }
  }; 

  return (
    <div
      className={`trash-can ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="trash-header">
        <button 
          onClick={toggleTrashCan}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Click to change trash can style"
        >
          🗑️ Bins
        </button>
        <div className="score">Level: {score}</div>
      </div>
      
      <div className="trash-svg-container">
        <img 
          src={currentTrashCan === 'trash1' ? trashcanSvg : trashcanSvg2} 
          alt="Trash Can" 
          className="trash-svg" 
        />
      </div>
      
      <canvas
        ref={confettiCanvasRef}
        style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          width: '100%',
          height: '340px',
          pointerEvents: 'none',
          zIndex: 3
        }}
      />
      
      <div ref={canvasRef} className="trash-canvas" />
    </div>
  );
}

export default TrashCan;