/**
 * مكون عرض Notion Template
 * الفئة الأولى من الـ 4 Quadrants
 * Author: عمر المقطري
 */

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
}

export default function NotionTemplateView() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'مشروع تسويقي جديد',
      description: 'حملة تسويقية متكاملة للربع الثاني',
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      window.history.back();
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleNewProject = () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      title: 'مشروع جديد',
      description: 'اضغط لتعديل الوصف',
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
  };

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-neon-blue hover:text-neon-blue/80 transition-colors"
          >
            <ArrowLeft size={24} />
            <span>العودة</span>
          </button>
          <h1 className="text-2xl font-bold text-neon-blue glow-text">تفاصيل المشروع</h1>
        </div>

        {/* Project Details */}
        <Card className="bg-slate-900/50 border-neon-blue/30 p-6 mb-6">
          <div className="mb-4">
            <label className="text-neon-orange text-sm mb-2 block">عنوان المشروع</label>
            <input
              type="text"
              value={selectedProject.title}
              onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
              className="w-full bg-slate-800/50 border border-neon-blue/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue/50"
            />
          </div>

          <div className="mb-4">
            <label className="text-neon-purple text-sm mb-2 block">الوصف</label>
            <textarea
              value={selectedProject.description}
              onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
              className="w-full bg-slate-800/50 border border-neon-purple/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-purple/50 min-h-32"
            />
          </div>

          <div className="mb-6">
            <label className="text-neon-green text-sm mb-2 block">الحالة</label>
            <select
              value={selectedProject.status}
              onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value as any })}
              className="w-full bg-slate-800/50 border border-neon-green/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-green/50"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50"
            >
              حفظ وإغلاق
            </Button>
            <Button
              onClick={() => setSelectedProject(null)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              إلغاء
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neon-blue hover:text-neon-blue/80 transition-colors"
        >
          <ArrowLeft size={24} />
          <span>العودة</span>
        </button>
        <h1 className="text-3xl font-bold text-neon-blue glow-text">قالب Notion</h1>
        <Button
          onClick={handleNewProject}
          className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 flex items-center gap-2"
        >
          <Plus size={20} />
          مشروع جديد
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-slate-900/50 border-neon-blue/30 hover:border-neon-blue/60 p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-neon-blue/20"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-neon-blue">{project.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                  className="p-1 hover:bg-neon-orange/20 rounded transition-colors"
                >
                  <Edit2 size={16} className="text-neon-orange" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-3">{project.description}</p>

            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'draft'
                    ? 'bg-neon-orange/20 text-neon-orange'
                    : project.status === 'published'
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-slate-700 text-slate-300'
                }`}
              >
                {project.status === 'draft' ? 'مسودة' : project.status === 'published' ? 'منشور' : 'مؤرشف'}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(project.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-neon-blue mb-2">لا توجد مشاريع بعد</h3>
          <p className="text-slate-400 mb-6">ابدأ بإنشاء مشروع جديد الآن</p>
          <Button
            onClick={handleNewProject}
            className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 flex items-center gap-2"
          >
            <Plus size={20} />
            إنشاء مشروع جديد
          </Button>
        </div>
      )}
    </div>
  );
}
