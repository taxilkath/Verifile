import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface TagItem {
  id: string;
  name: string;
  color: string;
  count: number;
}

const TagsSettings = () => {
  const [tags, setTags] = useState<TagItem[]>([
    { id: '1', name: 'Financial', color: '#3b82f6', count: 12 },
    { id: '2', name: 'Legal', color: '#10b981', count: 8 },
    { id: '3', name: 'Marketing', color: '#f59e0b', count: 5 }
  ]);
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#6366f1'  // indigo
  ];

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error('This tag already exists');
      return;
    }
    
    // Add new tag
    const newTag = {
      id: Date.now().toString(),
      name: newTagName,
      color: newTagColor,
      count: 0
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
    toast.success('Tag created successfully');
  };

  const handleRemoveTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (tag && tag.count > 0) {
      toast.error(`Cannot remove tag "${tag.name}" because it's used by ${tag.count} documents`);
      return;
    }
    
    setTags(tags.filter(tag => tag.id !== id));
    toast.success('Tag removed successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tags</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage tags to categorize your documents and data rooms
        </p>
      </div>

      {/* Create Tag */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create Tag</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tag Name
            </label>
            <input
              id="tagName"
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tag Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    newTagColor === color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 rounded-full text-white text-sm" style={{ backgroundColor: newTagColor }}>
              {newTagName || 'Tag Preview'}
            </div>
            
            <button
              onClick={handleAddTag}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Existing Tags */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Existing Tags
        </h3>
        
        {tags.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{tag.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {tag.count} {tag.count === 1 ? 'document' : 'documents'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className={`p-1 text-slate-400 hover:text-red-500 transition-colors ${
                      tag.count > 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={tag.count > 0}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No tags yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first tag to categorize your documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsSettings;