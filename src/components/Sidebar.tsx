import React from 'react';
import { Circle, Plus, Move, Trash2, Settings } from 'lucide-react';

interface SidebarProps {
  activeType: 'dfa' | 'nfa' | 'turing';
}

const Sidebar: React.FC<SidebarProps> = ({ activeType }) => {
  const tools = [
    { id: 'select', icon: Move, label: 'Select', description: 'Select and move states' },
    { id: 'state', icon: Circle, label: 'Add State', description: 'Add new state' },
    { id: 'transition', icon: Plus, label: 'Add Transition', description: 'Connect states' },
    { id: 'delete', icon: Trash2, label: 'Delete', description: 'Delete elements' },
  ];

  const getTypeSpecificInfo = () => {
    switch (activeType) {
      case 'dfa':
        return {
          title: 'DFA Editor',
          description: 'Deterministic Finite Automaton',
          features: [
            'Single transition per symbol',
            'Exactly one active state',
            'Deterministic execution'
          ]
        };
      case 'nfa':
        return {
          title: 'NFA Editor',
          description: 'Non-deterministic Finite Automaton',
          features: [
            'Multiple transitions per symbol',
            'Epsilon (ε) transitions',
            'Multiple active states'
          ]
        };
      case 'turing':
        return {
          title: 'Turing Machine Editor',
          description: 'Turing Machine',
          features: [
            'Read/Write tape operations',
            'Left/Right head movement',
            'Infinite tape simulation'
          ]
        };
    }
  };

  const info = getTypeSpecificInfo();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h2>
        <p className="text-sm text-gray-600">{info.description}</p>
      </div>

      {/* Tools */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
        <div className="space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={tool.description}
            >
              <tool.icon className="w-5 h-5" />
              <span className="text-sm">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Properties */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Properties</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Grid Snap</label>
            <div className="flex items-center mt-1">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Enabled</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Auto-layout</label>
            <div className="flex items-center mt-1">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="ml-2 text-sm text-gray-700">Disabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Type-specific features */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
        <div className="space-y-1">
          {info.features.map((feature, index) => (
            <div key={index} className="text-xs text-gray-600 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-600"></div>
            <span className="text-xs text-gray-600">Start State</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-600"></div>
            <span className="text-xs text-gray-600">Accept State</span>
          </div>
          {activeType === 'turing' && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-600"></div>
              <span className="text-xs text-gray-600">Reject State</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-600"></div>
            <span className="text-xs text-gray-600">Active State</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;