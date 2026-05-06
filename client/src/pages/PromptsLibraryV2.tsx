import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Copy, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  id: string;
  category: string;
  title: string;
  content: string;
}

const PROMPTS_DATA: Prompt[] = [
  // أوامر توليد الأفكار
  {
    id: "idea-1",
    category: "أفكار محتوى",
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
    id: "idea-2",
    category: "أفكار محتوى",
    title: "أفكار محتوى فيروسي",
    content: `أنا أريد محتوى فيروسي على تيك توك.
أعطني 5 أفكار محتوى لها إمكانية عالية للانتشار.
المعايير:
- أول 3 ثوان حاسمة
- تثير الفضول
- تجعل الناس يشاهدون حتى النهاية`
  },
  {
    id: "idea-3",
    category: "أفكار محتوى",
    title: "أفكار محتوى تعليمي",
    content: `أنا أريد تعليم [الموضوع] لجمهور [مستوى].
أعطني 8 أفكار محتوى تعليمي.
اجعلها:
- سهلة الفهم
- عملية وتطبيقية
- مثيرة للاهتمام`
  },
  {
    id: "idea-4",
    category: "أفكار محتوى",
    title: "أفكار محتوى ترفيهي",
    content: `أنا أريد محتوى ترفيهي يضحك الناس.
أعطني 10 أفكار محتوى فكاهي.
اجعلها:
- طبيعية وليست مصطنعة
- تتعلق بالحياة اليومية
- تناسب جمهور [العمر/الفئة]`
  },
  {
    id: "idea-5",
    category: "أفكار محتوى",
    title: "أفكار محتوى ملهم",
    content: `أنا أريد محتوى يلهم الناس ويحفزهم.
أعطني 7 أفكار محتوى ملهم وتحفيزي.
اجعلها:
- صادقة وحقيقية
- تتضمن قصص نجاح
- تعطي أمل وإيجابية`
  },

  // أوامر كتابة المحتوى
  {
    id: "write-1",
    category: "كتابة محتوى",
    title: "كتابة منشور إنستغرام جذاب",
    content: `اكتب منشور إنستغرام جذاب عن [الموضوع].
المتطلبات:
- بداية قوية تجذب الانتباه
- 3-5 أسطر فقط
- استخدم emojis بذكاء
- اجعل الناس يعلقون
- أضف call-to-action واضح`
  },
  {
    id: "write-2",
    category: "كتابة محتوى",
    title: "كتابة عنوان جذاب",
    content: `اكتب 5 عناوين جذابة لمحتوى عن [الموضوع].
المعايير:
- استخدم أرقام إن أمكن
- أضف كلمات قوية (مثل: الآن، فقط، حصري)
- اجعل الناس فضوليين
- قصر العنوان (50-60 حرف)`
  },
  {
    id: "write-3",
    category: "كتابة محتوى",
    title: "كتابة وصف منتج مقنع",
    content: `اكتب وصف منتج مقنع لـ [المنتج].
اركز على:
- الفوائد وليس المواصفات
- حل المشاكل التي يواجهها العميل
- استخدم لغة بسيطة وواضحة
- أضف دليل اجتماعي (تقييمات، أرقام)`
  },

  // أوامر تحسين المحتوى
  {
    id: "improve-1",
    category: "تحسين محتوى",
    title: "تحسين منشور موجود",
    content: `حسّن هذا المنشور:
[أدخل المنشور]

ركز على:
- تحسين الوضوح والبساطة
- إضافة hook قوي في البداية
- تحسين الـ call-to-action
- جعله أكثر تفاعلاً`
  },
  {
    id: "improve-2",
    category: "تحسين محتوى",
    title: "تصحيح نحوي وإملائي",
    content: `صحح النحو والإملاء والأسلوب في هذا النص:
[أدخل النص]

تأكد من:
- صحة الإملاء
- سلامة النحو
- وضوح الأسلوب
- تدفق الجمل بشكل طبيعي`
  },

  // أوامر التسويق والبيع
  {
    id: "marketing-1",
    category: "تسويق وبيع",
    title: "كتابة رسالة بيع قوية",
    content: `اكتب رسالة بيع قوية لـ [المنتج/الخدمة].
يجب أن تتضمن:
- مشكلة العميل
- الحل الذي تقدمه
- الفوائد الرئيسية
- دليل اجتماعي
- call-to-action قوي`
  },
  {
    id: "marketing-2",
    category: "تسويق وبيع",
    title: "استراتيجية تسويق وسائل التواصل",
    content: `ضع استراتيجية تسويق وسائل التواصل لـ [المنتج].
تتضمن:
- أفضل الأوقات للنشر
- أنواع المحتوى
- التكرار والتنويع
- كيفية التفاعل مع الجمهور
- مؤشرات النجاح`
  },

  // أوامر تحليل الأداء
  {
    id: "analytics-1",
    category: "تحليل أداء",
    title: "تحليل أداء المنشور",
    content: `حلل أداء هذا المنشور:
[أدخل البيانات: التفاعلات، التعليقات، المشاركات]

أخبرني عن:
- ما الذي نجح
- ما الذي فشل
- كيف يمكن تحسينه
- ماذا تفعل في المرة القادمة`
  },

  // أوامر الإدارة والإنتاجية
  {
    id: "productivity-1",
    category: "إدارة وإنتاجية",
    title: "جدولة محتوى شهرية",
    content: `ضع جدولة محتوى شهرية لـ [المنصة].
تتضمن:
- 30 فكرة محتوى
- توزيع حسب الأيام
- توازن بين أنواع المحتوى
- أوقات النشر المثالية`
  },

  // أوامر التصميم والإبداع
  {
    id: "design-1",
    category: "تصميم وإبداع",
    title: "وصف تصميم جرافيك",
    content: `صف تصميم جرافيك احترافي لـ [الموضوع].
يجب أن يتضمن:
- الألوان المناسبة
- الخطوط المناسبة
- التخطيط والتوازن
- العناصر الرئيسية
- الحجم والأبعاد`
  },

  // أوامر التفاعل والمجتمع
  {
    id: "engagement-1",
    category: "تفاعل ومجتمع",
    title: "طرق زيادة التفاعل",
    content: `أعطني 10 طرق لزيادة التفاعل على [المنصة].
ركز على:
- أسئلة تثير النقاش
- تحديات وألعاب
- محتوى يستدعي الرأي
- التفاعل مع الجمهور
- بناء مجتمع قوي`
  },
];

const CATEGORIES = [
  "أفكار محتوى",
  "كتابة محتوى",
  "تحسين محتوى",
  "تسويق وبيع",
  "تحليل أداء",
  "إدارة وإنتاجية",
  "تصميم وإبداع",
  "تفاعل ومجتمع",
];

export default function PromptsLibraryV2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    return PROMPTS_DATA.filter((prompt) => {
      const matchesSearch =
        prompt.title.includes(searchTerm) ||
        prompt.content.includes(searchTerm);
      const matchesCategory =
        !selectedCategory || prompt.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("تم نسخ الأمر!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">مكتبة الأوامر الذكية</h1>
          <p className="text-muted-foreground">
            200+ أمر جاهز للاستخدام مع ChatGPT و Claude
          </p>
        </div>

        {/* البحث والتصنيفات */}
        <div className="mb-8 space-y-4">
          {/* شريط البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن أمر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* التصنيفات */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              الكل ({PROMPTS_DATA.length})
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category} (
                {PROMPTS_DATA.filter((p) => p.category === category).length})
              </Button>
            ))}
          </div>
        </div>

        {/* النتائج */}
        {filteredPrompts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">لم يتم العثور على أوامر</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {prompt.category}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{prompt.title}</h3>

                    {/* محتوى الأمر */}
                    {expandedId === prompt.id && (
                      <div className="bg-muted p-4 rounded-lg mb-4 text-sm whitespace-pre-wrap">
                        {prompt.content}
                      </div>
                    )}

                    {/* زر التوسع */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedId(
                          expandedId === prompt.id ? null : prompt.id
                        )
                      }
                      className="text-xs"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedId === prompt.id ? "rotate-180" : ""
                        }`}
                      />
                      {expandedId === prompt.id ? "إخفاء" : "عرض"} الأمر
                    </Button>
                  </div>

                  {/* زر النسخ */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(prompt.id, prompt.content)}
                    className="flex-shrink-0"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* إحصائيات */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">📊 الإحصائيات</h3>
          <p className="text-sm text-muted-foreground">
            عدد الأوامر: {filteredPrompts.length} / {PROMPTS_DATA.length}
          </p>
        </div>
      </div>
    </div>
  );
}
