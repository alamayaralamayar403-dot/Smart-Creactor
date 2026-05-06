import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Lightbulb,
  Library,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface QuadrantProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'purple' | 'green';
  onClick: () => void;
}

const Quadrant: React.FC<QuadrantProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: 'border-cyan-400 hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] text-cyan-400',
    orange: 'border-orange-400 hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] text-orange-400',
    purple: 'border-purple-400 hover:shadow-[0_0_20px_rgba(181,55,242,0.5)] text-purple-400',
    green: 'border-green-400 hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] text-green-400',
  };

  return (
    <Card
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer
        border-2 ${colorClasses[color]}
        bg-gradient-to-br from-slate-900/50 to-slate-800/30
        backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:scale-105 hover:border-opacity-100
        group
        min-h-[280px] flex flex-col justify-between
      `}
    >
      {/* Animated background gradient */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-10
          transition-opacity duration-300
          ${color === 'blue' && 'bg-cyan-500'}
          ${color === 'orange' && 'bg-orange-500'}
          ${color === 'purple' && 'bg-purple-500'}
          ${color === 'green' && 'bg-green-500'}
        `}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className={`mb-4 ${colorClasses[color]}`}>
          <div className="w-12 h-12 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
      </div>

      {/* Footer with arrow */}
      <div className="relative z-10 px-6 pb-6 flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${colorClasses[color]}`}>
          اكتشف المزيد
        </span>
        <ArrowRight
          size={18}
          className={`${colorClasses[color]} group-hover:translate-x-2 transition-transform`}
        />
      </div>

      {/* Neon glow effect on hover */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-20
          blur-xl transition-opacity duration-300
          pointer-events-none
          ${color === 'blue' && 'bg-cyan-500'}
          ${color === 'orange' && 'bg-orange-500'}
          ${color === 'purple' && 'bg-purple-500'}
          ${color === 'green' && 'bg-green-500'}
        `}
      />
    </Card>
  );
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Zap className="w-12 h-12 text-cyan-400" />
          </div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                نظام المبدع الذكي 2026
              </h1>
              <p className="text-sm text-gray-400">
                مرحباً {user?.name || 'المستخدم'}، اختر القسم الذي تريد الوصول إليه
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 font-semibold">الحالة</p>
                <p className="text-sm text-green-400">متصل ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            لوحة التحكم الرئيسية
          </h2>
          <p className="text-gray-400">
            اختر من الأقسام الأربعة الرئيسية لبدء العمل
          </p>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Notion Template - Blue */}
          <Quadrant
            title="قالب Notion"
            description="قالب متكامل لإدارة المحتوى والمشاريع مع 7 صفحات متخصصة"
            icon={<BookOpen size={24} />}
            color="blue"
            onClick={() => {
              setSelectedQuadrant('notion');
              setLocation('/notion-template');
            }}
          />

          {/* Prompt Library - Orange */}
          <Quadrant
            title="مكتبة الأوامر"
            description="200+ أمر ذكي مصنفة حسب الفئات لتسريع إنتاجيتك"
            icon={<Zap size={24} />}
            color="orange"
            onClick={() => {
              setSelectedQuadrant('prompts');
              setLocation('/prompt-library');
            }}
          />

          {/* Idea Center - Purple */}
          <Quadrant
            title="مركز الأفكار"
            description="توليد 5 أفكار عالية الجودة يومياً بشكل تلقائي"
            icon={<Lightbulb size={24} />}
            color="purple"
            onClick={() => {
              setSelectedQuadrant('ideas');
              setLocation('/ideas');
            }}
          />

          {/* Resources & Projects - Green */}
          <Quadrant
            title="الموارد والمشاريع"
            description="مركز الموارد والملفات والقوالب والأدوات المساعدة"
            icon={<Library size={24} />}
            color="green"
            onClick={() => {
              setSelectedQuadrant('resources');
              setLocation('/resources-view');
            }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 p-4">
            <p className="text-xs text-cyan-400 font-semibold mb-1">الأوامر المتاحة</p>
            <p className="text-2xl font-bold text-white">200+</p>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-4">
            <p className="text-xs text-orange-400 font-semibold mb-1">الأفكار اليومية</p>
            <p className="text-2xl font-bold text-white">5</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-4">
            <p className="text-xs text-purple-400 font-semibold mb-1">صفحات Notion</p>
            <p className="text-2xl font-bold text-white">7</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-4">
            <p className="text-xs text-green-400 font-semibold mb-1">الملفات المتاحة</p>
            <p className="text-2xl font-bold text-white">3</p>
          </Card>
        </div>
      </div>

      {/* Floating Action Button for Help */}
      <div className="fixed bottom-8 right-8">
        <Button
          className="rounded-full w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
          onClick={() => setLocation('/help')}
        >
          ?
        </Button>
      </div>
    </div>
  );
}
