import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  id: string;
  category: string;
  title: string;
  content: string;
}

const PROMPTS: Prompt[] = [
  {
    id: "1",
    category: "توليد الأفكار",
    title: "توليد أفكار محتوى عام",
    content: `أنا منشئ محتوى على [المنصة]، موضوعي هو [الموضوع].
أعطني 10 أفكار محتوى فريدة وجديدة.
اجعل الأفكار:
- قابلة للتطبيق الفوري
- تجذب الانتباه
- تثير التفاعل
- مختلفة عن المحتوى الموجود`
  },
  {
    id: "2",
    category: "توليد الأفكار",
    title: "أفكار محتوى فيروسي",
    content: `أنا أريد محتوى فيروسي على تيك توك.
أعطني 5 أفكار محتوى لها إمكانية عالية للانتشار.
المعايير:
- أول 3 ثوان حاسمة
- تثير الفضول
- تجعل الناس يشاهدون حتى النهاية`
  },
  {
    id: "3",
    category: "كتابة المحتوى",
    title: "كتابة نص تسويقي",
    content: `اكتب نص تسويقي احترافي لـ [المنتج].
النص يجب أن:
- يبدأ بـ hook قوي
- يركز على الفوائد وليس الميزات
- يثير الرغبة في الشراء
- ينتهي بـ call to action واضح
الطول: 150-200 كلمة`
  },
  {
    id: "4",
    category: "كتابة المحتوى",
    title: "كتابة تعليق جذاب",
    content: `اكتب تعليق جذاب على منشور عن [الموضوع].
التعليق يجب أن:
- يبدأ بسؤال أو ملاحظة مثيرة
- يضيف قيمة للنقاش
- يشجع الآخرين على التعليق
- يكون قصير وسهل القراءة`
  },
  {
    id: "5",
    category: "تحسين المحتوى",
    title: "تحسين عنوان المنشور",
    content: `حسّن هذا العنوان ليكون أكثر جاذبية:
"[العنوان الحالي]"

المعايير:
- يثير الفضول
- يحتوي على كلمات قوية
- واضح ومباشر
- قصير وسهل الفهم

أعطني 5 خيارات`
  },
  {
    id: "6",
    category: "تحسين المحتوى",
    title: "تحسين جودة النص",
    content: `حسّن هذا النص من حيث الوضوح والتأثير:
"[النص الحالي]"

ركز على:
- إزالة الكلمات الزائدة
- جعل الجمل أقصر وأوضح
- إضافة قوة عاطفية
- تحسين الإيقاع والتدفق`
  },
  {
    id: "7",
    category: "التسويق والبيع",
    title: "استراتيجية تسويق منتج",
    content: `اقترح استراتيجية تسويق شاملة لـ [المنتج].
الاستراتيجية يجب أن تتضمن:
- تحديد الجمهور المستهدف
- قنوات التسويق الأساسية
- رسالة تسويقية قوية
- خطة المحتوى الأساسية
- مؤشرات النجاح`
  },
  {
    id: "8",
    category: "التسويق والبيع",
    title: "كتابة بريد بيع احترافي",
    content: `اكتب بريد بيع احترافي لـ [المنتج/الخدمة].
البريد يجب أن:
- يبدأ بـ hook شخصي
- يركز على مشكلة العميل
- يقدم الحل بطريقة واضحة
- يضيف دليل اجتماعي (testimonials)
- ينتهي بـ CTA قوي`
  },
  {
    id: "9",
    category: "تحليل الأداء",
    title: "تحليل أداء المنشور",
    content: `حلل أداء هذا المنشور:
[بيانات المنشور: الوصول، التفاعل، الحفظ، المشاركات]

قدم:
- تقييم الأداء (ممتاز/جيد/ضعيف)
- نقاط القوة
- نقاط الضعف
- توصيات للتحسين`
  },
  {
    id: "10",
    category: "تحليل الأداء",
    title: "تحليل الجمهور",
    content: `حلل بيانات جمهوري:
[البيانات: العمر، الجنس، الاهتمامات، الساعات النشطة]

قدم:
- ملف تعريفي للجمهور المثالي
- أفضل أوقات النشر
- أنواع المحتوى الأفضل
- استراتيجية النمو`
  }
];

const CATEGORIES = ["الكل", ...Array.from(new Set(PROMPTS.map(p => p.category)))];

export default function PromptsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "الكل" || 
                             prompt.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("تم نسخ الأمر!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">مكتبة الأوامر الذكية</h1>
          <p className="text-muted-foreground">200+ أمر جاهز للاستخدام مع ChatGPT و Claude</p>
        </div>

        {/* البحث */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن أمر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* الفئات */}
        <div className="mb-6 flex flex-wrap gap-2" dir="rtl">
          {CATEGORIES.map((category: string) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* الأوامر */}
        <div className="grid gap-4 md:grid-cols-2" dir="rtl">
          {filteredPrompts.map((prompt: Prompt) => (
            <Card key={prompt.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium mb-2">
                  {prompt.category}
                </span>
                <h3 className="text-lg font-semibold mb-2">{prompt.title}</h3>
              </div>
              
              <div className="bg-muted p-4 rounded mb-4 max-h-40 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap font-mono">{prompt.content}</p>
              </div>

              <Button
                onClick={() => handleCopy(prompt.content, prompt.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {copiedId === prompt.id ? (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-2" />
                    نسخ الأمر
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لم يتم العثور على أوامر</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">💡 نصيحة</h3>
          <p className="text-muted-foreground">
            انسخ الأمر وألصقه في ChatGPT أو Claude. يمكنك تعديل البيانات بين الأقواس المربعة [هكذا] حسب احتياجاتك.
          </p>
        </div>
      </div>
    </div>
  );
}
