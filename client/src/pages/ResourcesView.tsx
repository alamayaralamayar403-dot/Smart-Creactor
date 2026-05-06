/**
 * مكون عرض الموارد والمشاريع
 * الفئة الرابعة من الـ 4 Quadrants
 * Author: عمر المقطري
 */

import { useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  rating: number;
  downloads: number;
  isFavorite: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'قالب تسويق رقمي',
    description: 'قالب شامل لحملات التسويق الرقمي مع جميع الأدوات اللازمة',
    category: 'قوالب',
    url: '#',
    rating: 4.8,
    downloads: 1250,
    isFavorite: false,
  },
  {
    id: '2',
    title: 'دليل كتابة المحتوى',
    description: 'دليل عملي شامل لكتابة محتوى احترافي وجذاب',
    category: 'أدلة',
    url: '#',
    rating: 4.9,
    downloads: 2100,
    isFavorite: false,
  },
  {
    id: '3',
    title: 'أداة تحليل الأداء',
    description: 'أداة متقدمة لتحليل أداء المحتوى والحملات',
    category: 'أدوات',
    url: '#',
    rating: 4.7,
    downloads: 890,
    isFavorite: false,
  },
];

export default function ResourcesView() {
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(resources.map((r) => r.category)));

  const filteredResources = selectedCategory
    ? resources.filter((r) => r.category === selectedCategory)
    : resources;

  const handleToggleFavorite = (id: string) => {
    setResources(
      resources.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleDownload = (resource: Resource) => {
    // محاكاة التحميل
    alert(`جاري تحميل: ${resource.title}`);
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
          className="flex items-center gap-2 text-neon-green hover:text-neon-green/80 transition-colors"
        >
          <ArrowLeft size={24} />
          <span>العودة</span>
        </button>
        <h1 className="text-3xl font-bold text-neon-green glow-text">الموارد والمشاريع</h1>
        <div className="w-32"></div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedCategory === null
              ? 'bg-neon-green/30 text-neon-green border border-neon-green'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-neon-green/50'
          }`}
        >
          الكل ({resources.length})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category
                ? 'bg-neon-green/30 text-neon-green border border-neon-green'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-neon-green/50'
            }`}
          >
            {category} ({resources.filter((r) => r.category === category).length})
          </button>
        ))}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="bg-slate-900/50 border-neon-green/30 hover:border-neon-green/60 p-6 transition-all hover:shadow-lg hover:shadow-neon-green/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neon-green mb-2">{resource.title}</h3>
                <p className="text-slate-400 mb-3">{resource.description}</p>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-neon-green" />
                    <span>{resource.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={16} className="text-neon-green" />
                    <span>{resource.downloads.toLocaleString('ar-SA')} تحميل</span>
                  </div>
                  <span className="px-2 py-1 bg-neon-green/20 text-neon-green rounded text-xs">
                    {resource.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggleFavorite(resource.id)}
                className="p-2 hover:bg-neon-green/20 rounded transition-colors ml-4"
              >
                <Star
                  size={24}
                  className={resource.isFavorite ? 'fill-neon-green text-neon-green' : 'text-slate-500'}
                />
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleDownload(resource)}
                className="flex-1 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/50 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                تحميل
              </Button>
              <Button
                onClick={() => window.open(resource.url, '_blank')}
                className="flex-1 bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                عرض
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-neon-green mb-2">لا توجد موارد في هذه الفئة</h3>
          <p className="text-slate-400">اختر فئة أخرى أو عرض جميع الموارد</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-neon-green/30 p-4 text-center">
          <div className="text-3xl font-bold text-neon-green mb-2">{resources.length}</div>
          <p className="text-slate-400">إجمالي الموارد</p>
        </Card>
        <Card className="bg-slate-900/50 border-neon-green/30 p-4 text-center">
          <div className="text-3xl font-bold text-neon-green mb-2">
            {resources.filter((r) => r.isFavorite).length}
          </div>
          <p className="text-slate-400">المفضلة</p>
        </Card>
        <Card className="bg-slate-900/50 border-neon-green/30 p-4 text-center">
          <div className="text-3xl font-bold text-neon-green mb-2">
            {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)}
          </div>
          <p className="text-slate-400">متوسط التقييم</p>
        </Card>
      </div>
    </div>
  );
}
