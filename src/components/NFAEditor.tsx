import React, { useState, useRef, useEffect } from 'react';

interface State {
  id: string;
  x: number;
  y: number;
  isStart: boolean;
  isAccept: boolean;
  label: string;
}

interface Transition {
  from: string;
  to: string;
  symbol: string;
}

interface NFAEditorProps {
  inputString: string;
  isExecuting: boolean;
}

const NFAEditor: React.FC<NFAEditorProps> = ({ inputString, isExecuting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [states, setStates] = useState<State[]>([
    { id: 'q0', x: 150, y: 200, isStart: true, isAccept: false, label: 'q0' },
    { id: 'q1', x: 350, y: 150, isStart: false, isAccept: false, label: 'q1' },
    { id: 'q2', x: 350, y: 250, isStart: false, isAccept: true, label: 'q2' }
  ]);
  const [transitions, setTransitions] = useState<Transition[]>([
    { from: 'q0', to: 'q1', symbol: 'a' },
    { from: 'q0', to: 'q2', symbol: 'a' },
    { from: 'q1', to: 'q2', symbol: 'b' },
    { from: 'q2', to: 'q1', symbol: 'ε' }
  ]);
  const [activeStates, setActiveStates] = useState<Set<string>>(new Set(['q0']));
  const [executionStep, setExecutionStep] = useState<number>(-1);

  useEffect(() => {
    draw();
  }, [states, transitions, activeStates, executionStep]);

  useEffect(() => {
    if (isExecuting && inputString) {
      executeString();
    }
  }, [isExecuting, inputString]);

  const executeString = async () => {
    setActiveStates(new Set(['q0']));
    setExecutionStep(-1);
    
    let currentStates = new Set(['q0']);
    
    for (let i = 0; i < inputString.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExecutionStep(i);
      
      const currentChar = inputString[i];
      const newStates = new Set<string>();
      
      currentStates.forEach(stateId => {
        const validTransitions = transitions.filter(t => 
          t.from === stateId && t.symbol === currentChar
        );
        validTransitions.forEach(t => newStates.add(t.to));
      });
      
      currentStates = newStates;
      setActiveStates(new Set(currentStates));
    }
    
    setTimeout(() => setExecutionStep(-1), 1000);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw transitions
    transitions.forEach(transition => {
      const fromState = states.find(s => s.id === transition.from);
      const toState = states.find(s => s.id === transition.to);
      
      if (fromState && toState) {
        drawTransition(ctx, fromState, toState, transition.symbol);
      }
    });

    // Draw states
    states.forEach(state => {
      drawState(ctx, state, activeStates.has(state.id) && isExecuting);
    });

    // Draw input string visualization
    if (isExecuting && inputString) {
      drawInputString(ctx);
    }
  };

  const drawState = (ctx: CanvasRenderingContext2D, state: State, isActive: boolean) => {
    const radius = 30;

    // State circle
    ctx.beginPath();
    ctx.arc(state.x, state.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isActive ? '#3B82F6' : (state.isStart ? '#10B981' : '#F3F4F6');
    ctx.fill();
    ctx.strokeStyle = state.isAccept ? '#2563EB' : '#6B7280';
    ctx.lineWidth = state.isAccept ? 3 : 2;
    ctx.stroke();

    // Accept state double circle
    if (state.isAccept) {
      ctx.beginPath();
      ctx.arc(state.x, state.y, radius - 5, 0, 2 * Math.PI);
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Start state arrow
    if (state.isStart) {
      ctx.beginPath();
      ctx.moveTo(state.x - radius - 20, state.y);
      ctx.lineTo(state.x - radius, state.y);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(state.x - radius, state.y);
      ctx.lineTo(state.x - radius - 8, state.y - 5);
      ctx.lineTo(state.x - radius - 8, state.y + 5);
      ctx.closePath();
      ctx.fillStyle = '#10B981';
      ctx.fill();
    }

    // State label
    ctx.fillStyle = isActive ? '#FFFFFF' : '#1F2937';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.label, state.x, state.y);
  };

  const drawTransition = (ctx: CanvasRenderingContext2D, from: State, to: State, symbol: string) => {
    if (from.id === to.id) {
      // Self loop
      const loopRadius = 25;
      ctx.beginPath();
      ctx.arc(from.x, from.y - 40, loopRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#1F2937';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(symbol, from.x, from.y - 40 - loopRadius - 10);
      return;
    }

    // Calculate curve for multiple transitions
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;

    // Add curve offset for NFA
    const perpX = -unitY * 20;
    const perpY = unitX * 20;

    const startX = from.x + unitX * 30;
    const startY = from.y + unitY * 30;
    const endX = to.x - unitX * 30;
    const endY = to.y - unitY * 30;
    
    const controlX = (startX + endX) / 2 + perpX;
    const controlY = (startY + endY) / 2 + perpY;

    // Draw curved arrow
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arrow head
    const headLength = 10;
    const angle = Math.atan2(endY - controlY, endX - controlX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI/6), endY - headLength * Math.sin(angle - Math.PI/6));
    ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI/6), endY - headLength * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = '#6B7280';
    ctx.fill();

    // Transition label
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(controlX - 15, controlY - 12, 30, 24);
    ctx.strokeStyle = '#6B7280';
    ctx.strokeRect(controlX - 15, controlY - 12, 30, 24);
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, controlX, controlY);
  };

  const drawInputString = (ctx: CanvasRenderingContext2D) => {
    const startX = 50;
    const startY = 50;
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Input: ', startX, startY);
    
    for (let i = 0; i < inputString.length; i++) {
      const x = startX + 80 + i * 25;
      const char = inputString[i];
      
      if (i === executionStep) {
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(x - 12, startY - 18, 24, 24);
        ctx.fillStyle = '#FFFFFF';
      } else if (i < executionStep) {
        ctx.fillStyle = '#10B981';
      } else {
        ctx.fillStyle = '#6B7280';
      }
      
      ctx.textAlign = 'center';
      ctx.fillText(char, x, startY);
    }
  };

  return (
    <div className="h-full bg-white">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
      />
      
      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
        <h3 className="font-semibold text-gray-900 mb-2">NFA Information</h3>
        <div className="space-y-2 text-sm">
          <div>States: {states.length}</div>
          <div>Transitions: {transitions.length}</div>
          <div>Active States: 
            <div className="font-mono text-blue-600 text-xs mt-1">
              {Array.from(activeStates).join(', ') || 'None'}
            </div>
          </div>
          {inputString && (
            <div>
              Input Status: 
              <span className={`ml-1 font-semibold ${
                Array.from(activeStates).some(stateId => 
                  states.find(s => s.id === stateId)?.isAccept
                ) ? 'text-green-600' : 'text-red-600'
              }`}>
                {Array.from(activeStates).some(stateId => 
                  states.find(s => s.id === stateId)?.isAccept
                ) ? 'Accept' : 'Reject'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFAEditor;