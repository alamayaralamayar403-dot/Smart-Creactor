/**
 * مكون عرض مكتبة الأوامر
 * الفئة الثانية من الـ 4 Quadrants
 * Author: عمر المقطري
 */

import { useState } from 'react';
import { ArrowLeft, Search, Copy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PROMPTS_LIBRARY } from '@/lib/prompts';

export default function PromptLibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = Array.from(new Set(PROMPTS_LIBRARY.map((p) => p.category)));

  const filteredPrompts = PROMPTS_LIBRARY.filter((prompt) => {
    const matchesSearch =
      prompt.title.includes(searchTerm) ||
      prompt.description.includes(searchTerm) ||
      prompt.template.includes(searchTerm);

    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyPrompt = (id: string, template: string) => {
    navigator.clipboard.writeText(template);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neon-orange hover:text-neon-orange/80 transition-colors"
        >
          <ArrowLeft size={24} />
          <span>العودة</span>
        </button>
        <h1 className="text-3xl font-bold text-neon-orange glow-text">مكتبة الأوامر</h1>
        <div className="w-32"></div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3 text-neon-orange/50" size={20} />
        <input
          type="text"
          placeholder="ابحث عن أمر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-neon-orange/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-orange/60"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedCategory === null
              ? 'bg-neon-orange/30 text-neon-orange border border-neon-orange'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-neon-orange/50'
          }`}
        >
          الكل
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category
                ? 'bg-neon-orange/30 text-neon-orange border border-neon-orange'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-neon-orange/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="bg-slate-900/50 border-neon-orange/30 hover:border-neon-orange/60 p-4 transition-all hover:shadow-lg hover:shadow-neon-orange/20"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neon-orange">{prompt.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{prompt.description}</p>
              </div>
              <button
                onClick={() => handleToggleFavorite(prompt.id)}
                className="p-2 hover:bg-neon-orange/20 rounded transition-colors ml-2"
              >
                <Heart
                  size={20}
                  className={favorites.has(prompt.id) ? 'fill-red-500 text-red-500' : 'text-slate-500'}
                />
              </button>
            </div>

            {/* Prompt Template */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-3 max-h-24 overflow-y-auto">
              <p className="text-sm text-slate-300 font-mono">{prompt.template}</p>
            </div>

            {/* Tags & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {prompt.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs bg-neon-orange/20 text-neon-orange px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleCopyPrompt(prompt.id, prompt.template)}
                className={`p-2 rounded transition-all ${
                  copiedId === prompt.id
                    ? 'bg-neon-green/30 text-neon-green'
                    : 'hover:bg-neon-orange/20 text-neon-orange'
                }`}
              >
                <Copy size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-neon-orange mb-2">لم يتم العثور على أوامر</h3>
          <p className="text-slate-400">حاول البحث بكلمات مختلفة أو اختر فئة أخرى</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 p-4 bg-slate-900/50 border border-neon-orange/30 rounded-lg text-center">
        <p className="text-slate-400">
          تم العثور على <span className="text-neon-orange font-semibold">{filteredPrompts.length}</span> أمر من أصل{' '}
          <span className="text-neon-orange font-semibold">{PROMPTS_LIBRARY.length}</span>
        </p>
      </div>
    </div>
  );
}
