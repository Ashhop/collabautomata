import React from 'react';
import { X, User, Eye, CreditCard as Edit3, MessageCircle } from 'lucide-react';

interface CollaborationPanelProps {
  onClose: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ onClose }) => {
  const users = [
    { id: '1', name: 'Alice Johnson', avatar: 'A', status: 'editing', lastSeen: 'now' },
    { id: '2', name: 'Bob Smith', avatar: 'B', status: 'viewing', lastSeen: '2 min ago' },
    { id: '3', name: 'Carol Davis', avatar: 'C', status: 'editing', lastSeen: 'now' }
  ];

  const recentChanges = [
    { user: 'Alice Johnson', action: 'Added state q3', time: '1 min ago' },
    { user: 'Bob Smith', action: 'Modified transition q0 → q1', time: '3 min ago' },
    { user: 'Carol Davis', action: 'Changed start state', time: '5 min ago' },
    { user: 'Alice Johnson', action: 'Added test string "101"', time: '7 min ago' }
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Collaboration</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Active Users</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  user.status === 'editing' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {user.status === 'editing' ? (
                    <>
                      <Edit3 className="w-3 h-3" />
                      <span>Editing</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Viewing</span>
                    </>
                  )}
                  <span>• {user.lastSeen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Changes */}
      <div className="p-4 border-b border-gray-200 flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Changes</h3>
        <div className="space-y-3">
          {recentChanges.map((change, index) => (
            <div key={index} className="text-sm">
              <div className="text-gray-900 font-medium">{change.user}</div>
              <div className="text-gray-600">{change.action}</div>
              <div className="text-gray-400 text-xs">{change.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Team Chat</h3>
        </div>
        
        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
          <div className="text-xs">
            <span className="font-medium text-blue-600">Alice:</span>
            <span className="text-gray-600 ml-1">Looking good! The NFA example is clear.</span>
          </div>
          <div className="text-xs">
            <span className="font-medium text-green-600">Bob:</span>
            <span className="text-gray-600 ml-1">Should we add more test cases?</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;