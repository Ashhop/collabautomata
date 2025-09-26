import React, { useState, useRef, useEffect } from 'react';

interface State {
  id: string;
  x: number;
  y: number;
  isStart: boolean;
  isAccept: boolean;
  isReject: boolean;
  label: string;
}

interface Transition {
  from: string;
  to: string;
  read: string;
  write: string;
  move: 'L' | 'R';
}

interface TuringMachineEditorProps {
  inputString: string;
  isExecuting: boolean;
}

const TuringMachineEditor: React.FC<TuringMachineEditorProps> = ({ inputString, isExecuting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [states, setStates] = useState<State[]>([
    { id: 'q0', x: 150, y: 200, isStart: true, isAccept: false, isReject: false, label: 'q0' },
    { id: 'q1', x: 350, y: 150, isStart: false, isAccept: false, isReject: false, label: 'q1' },
    { id: 'qaccept', x: 550, y: 200, isStart: false, isAccept: true, isReject: false, label: 'qaccept' },
    { id: 'qreject', x: 350, y: 280, isStart: false, isAccept: false, isReject: true, label: 'qreject' }
  ]);
  const [transitions, setTransitions] = useState<Transition[]>([
    { from: 'q0', to: 'q1', read: '1', write: 'X', move: 'R' },
    { from: 'q1', to: 'q1', read: '1', write: '1', move: 'R' },
    { from: 'q1', to: 'qaccept', read: 'B', write: 'B', move: 'R' },
    { from: 'q0', to: 'qreject', read: '0', write: '0', move: 'R' }
  ]);
  const [currentState, setCurrentState] = useState<string>('q0');
  const [tape, setTape] = useState<string[]>([]);
  const [headPosition, setHeadPosition] = useState<number>(0);
  const [executionStep, setExecutionStep] = useState<number>(-1);

  useEffect(() => {
    if (inputString) {
      setTape([...inputString.split(''), 'B', 'B', 'B']); // Add blank symbols
      setHeadPosition(0);
    }
  }, [inputString]);

  useEffect(() => {
    draw();
  }, [states, transitions, currentState, tape, headPosition, executionStep]);

  useEffect(() => {
    if (isExecuting && inputString) {
      executeString();
    }
  }, [isExecuting, inputString]);

  const executeString = async () => {
    setCurrentState('q0');
    setHeadPosition(0);
    setExecutionStep(0);
    let currentTape = [...inputString.split(''), 'B', 'B', 'B'];
    let currentPos = 0;
    let currentSt = 'q0';
    
    for (let step = 0; step < 20; step++) { // Max 20 steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentSymbol = currentTape[currentPos] || 'B';
      const transition = transitions.find(t => 
        t.from === currentSt && t.read === currentSymbol
      );
      
      if (!transition) break;
      
      // Apply transition
      currentTape[currentPos] = transition.write;
      currentPos += transition.move === 'R' ? 1 : -1;
      currentSt = transition.to;
      
      // Extend tape if needed
      if (currentPos < 0) {
        currentTape.unshift('B');
        currentPos = 0;
      } else if (currentPos >= currentTape.length) {
        currentTape.push('B');
      }
      
      setTape([...currentTape]);
      setHeadPosition(currentPos);
      setCurrentState(currentSt);
      setExecutionStep(step + 1);
      
      // Check for halt states
      if (states.find(s => s.id === currentSt)?.isAccept || 
          states.find(s => s.id === currentSt)?.isReject) {
        break;
      }
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
        drawTransition(ctx, fromState, toState, transition);
      }
    });

    // Draw states
    states.forEach(state => {
      drawState(ctx, state, state.id === currentState && isExecuting);
    });

    // Draw tape
    if (tape.length > 0) {
      drawTape(ctx);
    }
  };

  const drawState = (ctx: CanvasRenderingContext2D, state: State, isActive: boolean) => {
    const radius = 35;

    // State circle
    ctx.beginPath();
    ctx.arc(state.x, state.y, radius, 0, 2 * Math.PI);
    let fillColor = '#F3F4F6';
    if (isActive) fillColor = '#3B82F6';
    else if (state.isStart) fillColor = '#10B981';
    else if (state.isAccept) fillColor = '#10B981';
    else if (state.isReject) fillColor = '#EF4444';
    
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    let strokeColor = '#6B7280';
    if (state.isAccept) strokeColor = '#10B981';
    else if (state.isReject) strokeColor = '#EF4444';
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Accept/Reject state double circle
    if (state.isAccept || state.isReject) {
      ctx.beginPath();
      ctx.arc(state.x, state.y, radius - 8, 0, 2 * Math.PI);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Start state arrow
    if (state.isStart) {
      ctx.beginPath();
      ctx.moveTo(state.x - radius - 25, state.y);
      ctx.lineTo(state.x - radius, state.y);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(state.x - radius, state.y);
      ctx.lineTo(state.x - radius - 10, state.y - 6);
      ctx.lineTo(state.x - radius - 10, state.y + 6);
      ctx.closePath();
      ctx.fillStyle = '#10B981';
      ctx.fill();
    }

    // State label
    ctx.fillStyle = isActive ? '#FFFFFF' : (state.isAccept || state.isReject ? '#FFFFFF' : '#1F2937');
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.label, state.x, state.y);
  };

  const drawTransition = (ctx: CanvasRenderingContext2D, from: State, to: State, transition: Transition) => {
    if (from.id === to.id) {
      // Self loop
      const loopRadius = 30;
      ctx.beginPath();
      ctx.arc(from.x, from.y - 50, loopRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const label = `${transition.read}/${transition.write},${transition.move}`;
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, from.x, from.y - 50 - loopRadius - 15);
      return;
    }

    // Calculate arrow position with curve
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;

    const startX = from.x + unitX * 35;
    const startY = from.y + unitY * 35;
    const endX = to.x - unitX * 35;
    const endY = to.y - unitY * 35;

    // Add curve
    const perpX = -unitY * 30;
    const perpY = unitX * 30;
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
    const angle = Math.atan2(endY - controlY, endX - controlX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - 12 * Math.cos(angle - Math.PI/6), endY - 12 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(endX - 12 * Math.cos(angle + Math.PI/6), endY - 12 * Math.sin(angle + Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = '#6B7280';
    ctx.fill();

    // Transition label
    const label = `${transition.read}/${transition.write},${transition.move}`;
    const labelWidth = ctx.measureText(label).width + 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(controlX - labelWidth/2, controlY - 15, labelWidth, 30);
    ctx.strokeStyle = '#6B7280';
    ctx.strokeRect(controlX - labelWidth/2, controlY - 15, labelWidth, 30);
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, controlX, controlY);
  };

  const drawTape = (ctx: CanvasRenderingContext2D) => {
    const cellSize = 40;
    const startX = 100;
    const tapeY = 450;
    
    // Draw tape cells
    for (let i = Math.max(0, headPosition - 5); i < Math.min(tape.length, headPosition + 8); i++) {
      const x = startX + (i - Math.max(0, headPosition - 5)) * cellSize;
      
      // Cell background
      ctx.fillStyle = i === headPosition ? '#FEF3C7' : '#FFFFFF';
      ctx.fillRect(x, tapeY, cellSize, cellSize);
      
      // Cell border
      ctx.strokeStyle = i === headPosition ? '#F59E0B' : '#6B7280';
      ctx.lineWidth = i === headPosition ? 3 : 1;
      ctx.strokeRect(x, tapeY, cellSize, cellSize);
      
      // Cell content
      ctx.fillStyle = '#1F2937';
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tape[i] || 'B', x + cellSize/2, tapeY + cellSize/2);
    }
    
    // Head indicator
    const headX = startX + (headPosition - Math.max(0, headPosition - 5)) * cellSize + cellSize/2;
    ctx.beginPath();
    ctx.moveTo(headX, tapeY - 10);
    ctx.lineTo(headX - 8, tapeY - 25);
    ctx.lineTo(headX + 8, tapeY - 25);
    ctx.closePath();
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    
    // Tape label
    ctx.fillStyle = '#1F2937';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Tape:', 20, tapeY + 20);
    ctx.fillText(`Head Position: ${headPosition}`, 20, tapeY + 50);
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
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-72">
        <h3 className="font-semibold text-gray-900 mb-2">Turing Machine Information</h3>
        <div className="space-y-2 text-sm">
          <div>States: {states.length}</div>
          <div>Transitions: {transitions.length}</div>
          <div>Current State: <span className="font-mono text-blue-600">{currentState}</span></div>
          <div>Head Position: <span className="font-mono">{headPosition}</span></div>
          <div>Current Symbol: <span className="font-mono">{tape[headPosition] || 'B'}</span></div>
          {executionStep >= 0 && (
            <div>Execution Step: <span className="font-mono">{executionStep}</span></div>
          )}
          {inputString && (
            <div>
              Machine Status: 
              <span className={`ml-1 font-semibold ${
                states.find(s => s.id === currentState)?.isAccept 
                  ? 'text-green-600' 
                  : states.find(s => s.id === currentState)?.isReject
                    ? 'text-red-600'
                    : 'text-blue-600'
              }`}>
                {states.find(s => s.id === currentState)?.isAccept 
                  ? 'Accept' 
                  : states.find(s => s.id === currentState)?.isReject
                    ? 'Reject'
                    : 'Running'
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuringMachineEditor;