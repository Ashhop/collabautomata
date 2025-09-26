import React, { useState } from 'react';
import { Play, Users, Download, Upload, RotateCcw, Zap } from 'lucide-react';
import DFAEditor from './components/DFAEditor';
import NFAEditor from './components/NFAEditor';
import TuringMachineEditor from './components/TuringMachineEditor';
import Sidebar from './components/Sidebar';
import CollaborationPanel from './components/CollaborationPanel';

type AutomataType = 'dfa' | 'nfa' | 'turing';

function App() {
  const [activeType, setActiveType] = useState<AutomataType>('dfa');
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [inputString, setInputString] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    // Simulate execution
    setTimeout(() => setIsExecuting(false), 2000);
  };

  const renderEditor = () => {
    switch (activeType) {
      case 'dfa':
        return <DFAEditor inputString={inputString} isExecuting={isExecuting} />;
      case 'nfa':
        return <NFAEditor inputString={inputString} isExecuting={isExecuting} />;
      case 'turing':
        return <TuringMachineEditor inputString={inputString} isExecuting={isExecuting} />;
      default:
        return <DFAEditor inputString={inputString} isExecuting={isExecuting} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CollabAutomata</h1>
            </div>
            <div className="text-sm text-gray-500">Real-Time Collaborative Automata Visualizer</div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCollabOpen(!isCollabOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">3 Active</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Automata Type Selector */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'dfa', label: 'DFA', description: 'Deterministic Finite Automaton' },
              { id: 'nfa', label: 'NFA', description: 'Non-deterministic Finite Automaton' },
              { id: 'turing', label: 'Turing Machine', description: 'Turing Machine' }
            ].map(({ id, label, description }) => (
              <button
                key={id}
                onClick={() => setActiveType(id as AutomataType)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeType === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                title={description}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input Testing Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Test Input:</label>
              <input
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                placeholder="Enter string to test..."
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">{isExecuting ? 'Running...' : 'Execute'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeType={activeType} />
        
        <main className="flex-1 relative">
          {renderEditor()}
        </main>

        {isCollabOpen && <CollaborationPanel onClose={() => setIsCollabOpen(false)} />}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>Ready for execution • {activeType.toUpperCase()} Mode</div>
          <div>CS Core Project • Real-time Collaboration Active</div>
        </div>
      </footer>
    </div>
  );
}

export default App;