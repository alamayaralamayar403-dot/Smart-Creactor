import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Chapter {
  id: number;
  title: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  content: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "الفصل 1: مقدمة عن نظام المبدع الذكي 2026",
    sections: [
      {
        id: "1-1",
        title: "ما هو نظام المبدع الذكي؟",
        content: `نظام المبدع الذكي 2026 هو منظومة متكاملة تجمع بين الذكاء الاصطناعي والاستراتيجيات المثبتة لمساعدة صناع المحتوى على:

- إنتاج محتوى عالي الجودة 5 مرات أسرع
- تنظيم الأفكار بطريقة احترافية
- فهم ما ينجح وما لا ينجح
- توزيع المحتوى بذكاء على 5 منصات
- بناء جمهور مخلص ومتفاعل`
      },
      {
        id: "1-2",
        title: "من يستفيد من هذا النظام؟",
        content: `- منشئو محتوى على إنستغرام وتيك توك
- مدونون وكتاب
- مسوقون رقميون
- رواد أعمال
- أي شخص يريد بناء حضور رقمي قوي`
      },
      {
        id: "1-3",
        title: "ماذا ستحصل عليه؟",
        content: `1. دليل استراتيجي شامل (50+ صفحة)
2. قالب Notion متقدم - جاهز للاستخدام
3. 200+ أمر ذكي - منظمة حسب الاستخدام
4. نصائح حصرية - من خبراء المحتوى
5. دعم مدى الحياة - تحديثات مستمرة`
      }
    ]
  },
  {
    id: 2,
    title: "الفصل 2: فهم خوارزميات 2026",
    sections: [
      {
        id: "2-1",
        title: "كيف تعمل الخوارزميات الحديثة؟",
        content: `الخوارزميات الحديثة تعتمد على 4 عوامل أساسية:

1. الوقت المقضي (Watch Time)
   - كل ثانية يقضيها المستخدم تزيد من قوة المنشور
   - المحتوى الذي يحافظ على المشاهدين أطول = أداء أفضل
   - النصيحة: اجعل أول 3 ثوان حاسمة جداً

2. معدل التفاعل (Engagement Rate)
   - التعليقات والإعجابات والمشاركات مهمة جداً
   - التعليقات أقوى من الإعجابات
   - المشاركات أقوى من التعليقات
   - النصيحة: اطلب من الجمهور التعليق والمشاركة

3. معدل المشاركة (Share Rate)
   - كل مشاركة = إشارة قوية للخوارزمية
   - المشاركات توسع الوصول بشكل كبير
   - النصيحة: اجعل المحتوى قابلاً للمشاركة

4. معدل الحفظ (Save Rate)
   - الحفظ = إشارة قوية جداً
   - يعني أن المحتوى ذو قيمة
   - النصيحة: قدم محتوى يستحق الحفظ`
      },
      {
        id: "2-2",
        title: "الفرق بين المنصات",
        content: `إنستغرام 2026:
- تركز على الفيديوهات القصيرة (Reels)
- الوقت المقضي أهم من الإعجابات
- التعليقات لها وزن كبير
- الاستراتيجية: فيديوهات 15-60 ثانية مع دعوة للتعليق

تيك توك 2026:
- الخوارزمية الأقوى في العالم
- تركز على الوقت المقضي أكثر من أي شيء
- لا تحتاج متابعين كثيرين للانتشار
- الاستراتيجية: محتوى إدماني يجعل المستخدم يشاهد حتى النهاية

يوتيوب 2026:
- تركز على الوقت المقضي في الفيديو
- التعليقات والإعجابات مهمة
- الفيديوهات الطويلة أفضل من القصيرة
- الاستراتيجية: فيديوهات 8-15 دقيقة مع محتوى قيمة`
      }
    ]
  },
  {
    id: 3,
    title: "الفصل 3: هندسة الأوامر المتقدمة",
    sections: [
      {
        id: "3-1",
        title: "أساسيات هندسة الأوامر",
        content: `هندسة الأوامر هي فن كتابة تعليمات واضحة وفعالة للذكاء الاصطناعي.

المبادئ الأساسية:
1. كن واضحاً ومحدداً
2. أعطِ السياق الكافي
3. حدد النتيجة المطلوبة
4. استخدم أمثلة عند الحاجة
5. اطلب تنسيقاً محدداً للإجابة`
      },
      {
        id: "3-2",
        title: "أنواع الأوامر الفعالة",
        content: `1. أوامر التوليد: توليد أفكار ومحتوى جديد
2. أوامر التحسين: تحسين محتوى موجود
3. أوامر التحليل: تحليل البيانات والأداء
4. أوامر التحويل: تحويل محتوى من شكل لآخر
5. أوامر الإبداع: إنشاء محتوى إبداعي فريد`
      }
    ]
  }
];

export default function Guide() {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChapters = CHAPTERS.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.sections.some(section => 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">الدليل الاستراتيجي الشامل</h1>
          <p className="text-muted-foreground">تعلم كيفية إنتاج محتوى عالي الجودة 5 مرات أسرع</p>
        </div>

        {/* البحث */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في الدليل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* الفصول */}
        <div className="space-y-4" dir="rtl">
          {filteredChapters.map(chapter => (
            <Card key={chapter.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <h2 className="text-xl font-semibold">{chapter.title}</h2>
                {expandedChapter === chapter.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedChapter === chapter.id && (
                <div className="border-t">
                  {chapter.sections.map(section => (
                    <div key={section.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors text-right"
                      >
                        <h3 className="font-medium">{section.title}</h3>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedSection === section.id && (
                        <div className="p-4 bg-muted/50 whitespace-pre-wrap text-sm leading-relaxed">
                          {section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لم يتم العثور على محتوى</p>
          </div>
        )}
      </div>
    </div>
  );
}
