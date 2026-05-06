import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Lightbulb,
  Sparkles,
  Send,
  RefreshCw,
  TrendingUp,
  Clock,
  Star,
  Copy,
  Check,
} from 'lucide-react';

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  qualityScore: number;
  promptsUsed: string[];
  createdAt: Date;
  synced: boolean;
}

export default function IdeaCenter() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Simulate idea generation
  const generateDailyIdeas = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newIdeas: GeneratedIdea[] = [
        {
          id: '1',
          title: 'استراتيجية تسويق المحتوى للعام الجديد',
          description:
            'خطة شاملة لتسويق المحتوى تركز على القنوات الرقمية والتفاعل مع الجمهور',
          category: 'تسويق',
          qualityScore: 9.2,
          promptsUsed: ['استراتيجية تسويق', 'تحليل السوق', 'جمهور مستهدف'],
          createdAt: new Date(),
          synced: false,
        },
        {
          id: '2',
          title: 'دليل شامل لإنشاء محتوى فيديو احترافي',
          description:
            'خطوات عملية لإنتاج محتوى فيديو عالي الجودة يجذب المشاهدين',
          category: 'إنتاج محتوى',
          qualityScore: 8.8,
          promptsUsed: ['إنتاج فيديو', 'السيناريو', 'المونتاج'],
          createdAt: new Date(),
          synced: false,
        },
        {
          id: '3',
          title: 'تحسين معدل التحويل في المتجر الإلكتروني',
          description:
            'تقنيات مثبتة لزيادة مبيعاتك وتحسين تجربة العميل',
          category: 'تحسين',
          qualityScore: 9.1,
          promptsUsed: ['تحسين UX', 'تحليل بيانات', 'اختبار A/B'],
          createdAt: new Date(),
          synced: false,
        },
        {
          id: '4',
          title: 'بناء مجتمع قوي حول علامتك التجارية',
          description:
            'استراتيجيات فعالة لبناء مجتمع مخلص ومتفاعل',
          category: 'تفاعل',
          qualityScore: 8.5,
          promptsUsed: ['بناء مجتمع', 'التفاعل', 'الولاء'],
          createdAt: new Date(),
          synced: false,
        },
        {
          id: '5',
          title: 'تحليل المنافسين واستخراج الفرص',
          description:
            'كيفية تحليل منافسيك واكتشاف الفجوات في السوق',
          category: 'تحليل',
          qualityScore: 8.9,
          promptsUsed: ['تحليل منافسين', 'بحث سوق', 'فرص نمو'],
          createdAt: new Date(),
          synced: false,
        },
      ];

      setIdeas(newIdeas);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToNotion = async (idea: GeneratedIdea) => {
    try {
      // Simulate sending to Notion
      const updatedIdeas = ideas.map((i) =>
        i.id === idea.id ? { ...i, synced: true } : i
      );
      setIdeas(updatedIdeas);
      setSelectedIdea(null);

      // Show success message
      alert('تم إرسال الفكرة إلى Notion بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء الإرسال');
    }
  };

  const handleCopyIdea = (idea: GeneratedIdea) => {
    const text = `${idea.title}\n\n${idea.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    // Generate ideas on component mount
    generateDailyIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-500/10 border border-purple-500/30">
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">مركز الأفكار الذكي</h1>
                <p className="text-sm text-gray-400">توليد أفكار عالية الجودة بشكل تلقائي</p>
              </div>
            </div>
            <Button
              onClick={generateDailyIdeas}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  توليد أفكار جديدة
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-4">
            <p className="text-xs text-purple-400 font-semibold mb-1">الأفكار المولدة اليوم</p>
            <p className="text-2xl font-bold text-white">{ideas.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-4">
            <p className="text-xs text-green-400 font-semibold mb-1">الأفكار المرسلة</p>
            <p className="text-2xl font-bold text-white">{ideas.filter((i) => i.synced).length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4">
            <p className="text-xs text-blue-400 font-semibold mb-1">متوسط الجودة</p>
            <p className="text-2xl font-bold text-white">
              {(ideas.reduce((sum, i) => sum + i.qualityScore, 0) / ideas.length).toFixed(1)}
            </p>
          </Card>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-purple-500/20 hover:border-purple-500/50 p-6 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group"
              onClick={() => setSelectedIdea(idea)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {idea.category}
                    </span>
                    {idea.synced && (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                        مرسلة
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {idea.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{idea.description}</p>

              {/* Quality Score */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-white">{idea.qualityScore}/10</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    style={{ width: `${(idea.qualityScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Prompts Used */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">الأوامر المستخدمة:</p>
                <div className="flex flex-wrap gap-2">
                  {idea.promptsUsed.map((prompt) => (
                    <span
                      key={prompt}
                      className="inline-block px-2 py-1 rounded text-xs bg-slate-800 text-gray-300 border border-slate-700"
                    >
                      {prompt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyIdea(idea);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white gap-2"
                >
                  {copiedId === idea.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      نسخ
                    </>
                  )}
                </Button>
                {!idea.synced && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendToNotion(idea);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2"
                  >
                    <Send className="w-4 h-4" />
                    إرسال
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {ideas.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد أفكار مولدة</h3>
            <p className="text-gray-400 mb-6">اضغط على الزر أعلاه لتوليد أفكار جديدة</p>
            <Button
              onClick={generateDailyIdeas}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2"
            >
              <Sparkles className="w-4 h-4" />
              توليد أفكار الآن
            </Button>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIdea(null)}
        >
          <Card
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdea(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded transition-colors"
            >
              <span className="text-2xl text-gray-400">×</span>
            </button>

            {/* Content */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedIdea.category}
                </span>
                <span className="text-sm text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {selectedIdea.createdAt.toLocaleString('ar-SA')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{selectedIdea.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedIdea.description}</p>
            </div>

            {/* Quality Score */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">درجة الجودة</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    style={{ width: `${(selectedIdea.qualityScore / 10) * 100}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-white">{selectedIdea.qualityScore}/10</span>
              </div>
            </div>

            {/* Prompts */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">الأوامر المستخدمة</p>
              <div className="flex flex-wrap gap-2">
                {selectedIdea.promptsUsed.map((prompt) => (
                  <span
                    key={prompt}
                    className="inline-block px-3 py-2 rounded-lg bg-slate-800 text-gray-300 border border-slate-700 text-sm"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleCopyIdea(selectedIdea)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white gap-2"
              >
                <Copy className="w-4 h-4" />
                نسخ الفكرة
              </Button>
              {!selectedIdea.synced && (
                <Button
                  onClick={() => handleSendToNotion(selectedIdea)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  إرسال إلى Notion
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
