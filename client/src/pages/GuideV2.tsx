import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Menu, X } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    title: "الفصل 1: مقدمة عن نظام المبدع الذكي 2026",
    content: `## ما هو نظام المبدع الذكي؟

نظام المبدع الذكي 2026 هو منظومة متكاملة تجمع بين الذكاء الاصطناعي والاستراتيجيات المثبتة لمساعدة صناع المحتوى على:

- **إنتاج محتوى عالي الجودة 5 مرات أسرع**
- **تنظيم الأفكار بطريقة احترافية**
- **فهم ما ينجح وما لا ينجح**
- **توزيع المحتوى بذكاء على 5 منصات**
- **بناء جمهور مخلص ومتفاعل**

## من يستفيد من هذا النظام؟

- ✅ منشئو محتوى على إنستغرام وتيك توك
- ✅ مدونون وكتاب
- ✅ مسوقون رقميون
- ✅ رواد أعمال
- ✅ أي شخص يريد بناء حضور رقمي قوي

## ماذا ستحصل عليه؟

1. **دليل استراتيجي شامل** (50+ صفحة)
2. **قالب Notion متقدم** - جاهز للاستخدام
3. **200+ أمر ذكي** - منظمة حسب الاستخدام
4. **نصائح حصرية** - من خبراء المحتوى
5. **دعم مدى الحياة** - تحديثات مستمرة`
  },
  {
    id: "ch2",
    title: "الفصل 2: فهم خوارزميات 2026",
    content: `## كيف تعمل الخوارزميات الحديثة؟

### الخوارزمية الأساسية

الخوارزميات الحديثة تعتمد على 4 عوامل أساسية:

#### 1. **الوقت المقضي (Watch Time)**
- كل ثانية يقضيها المستخدم تزيد من قوة المنشور
- المحتوى الذي يحافظ على المشاهدين أطول = أداء أفضل
- **النصيحة:** اجعل أول 3 ثوان حاسمة جداً

#### 2. **معدل التفاعل (Engagement Rate)**
- التعليقات والإعجابات والمشاركات مهمة جداً
- التعليقات أقوى من الإعجابات
- المشاركات أقوى من التعليقات
- **النصيحة:** اطلب من الجمهور التعليق والمشاركة

#### 3. **معدل المشاركة (Share Rate)**
- كل مشاركة = إشارة قوية للخوارزمية
- المشاركات توسع الوصول بشكل كبير
- **النصيحة:** اجعل المحتوى قابلاً للمشاركة

#### 4. **معدل الحفظ (Save Rate)**
- الحفظ = إشارة قوية جداً
- يعني أن المحتوى ذو قيمة
- **النصيحة:** قدم محتوى يستحق الحفظ

### الفرق بين المنصات

#### إنستغرام 2026
- تركز على الفيديوهات القصيرة (Reels)
- الوقت المقضي أهم من الإعجابات
- التعليقات لها وزن كبير
- **الاستراتيجية:** فيديوهات 15-60 ثانية مع دعوة للتعليق

#### تيك توك 2026
- الخوارزمية الأقوى في العالم
- تركز على الوقت المقضي أكثر من أي شيء
- لا تحتاج متابعين كثيرين للانتشار
- **الاستراتيجية:** محتوى إدماني يجعل المستخدم يشاهد حتى النهاية`
  },
  {
    id: "ch3",
    title: "الفصل 3: هندسة الأوامر المتقدمة",
    content: `## ما هي هندسة الأوامر؟

هندسة الأوامر هي فن صياغة الأسئلة والتعليمات للذكاء الاصطناعي بطريقة تحصل على أفضل النتائج.

## المبادئ الأساسية

### المبدأ 1: الوضوح
\`\`\`
❌ سيء: "اكتب شيء عن التسويق"
✅ جيد: "اكتب منشور إنستغرام عن فوائد التسويق الرقمي للشركات الصغيرة، 150 كلمة، بأسلوب ودي"
\`\`\`

### المبدأ 2: التفاصيل
\`\`\`
❌ سيء: "اكتب دليل"
✅ جيد: "اكتب دليل خطوة بخطوة لبدء مشروع تجارة إلكترونية، موجه للمبتدئين، مع أمثلة عملية"
\`\`\`

### المبدأ 3: السياق
- أخبر الذكاء الاصطناعي عن الهدف
- اشرح من هو الجمهور المستهدف
- وضح النتيجة المطلوبة`
  },
  {
    id: "ch4",
    title: "الفصل 4: استراتيجية التوزيع على 5 منصات",
    content: `## استراتيجية التوزيع الذكية

### المنصات الخمس الأساسية

#### 1. تيك توك
- **الأفضل للنمو السريع**
- الخوارزمية تعطي فرصة متساوية للجميع
- المحتوى الفيروسي يحدث بسرعة
- **الاستراتيجية:** منشور يومي، محتوى إدماني

#### 2. إنستغرام
- **الأفضل لبناء مجتمع**
- الجمهور أكثر تفاعلاً
- يمكنك بناء علاقات قوية
- **الاستراتيجية:** 3-5 منشورات أسبوعياً

#### 3. يوتيوب
- **الأفضل للمحتوى الطويل**
- محرك البحث الثاني بعد جوجل
- الدخل من الإعلانات
- **الاستراتيجية:** فيديو واحد أسبوعياً

#### 4. لينكدإن
- **الأفضل للمحتوى الاحترافي**
- جمهور مهتم بالتعلم
- فرص عمل وتعاون
- **الاستراتيجية:** منشور 2-3 مرات أسبوعياً

#### 5. فيسبوك
- **الأفضل للمحتوى المحلي**
- جمهور أكبر سناً
- مجموعات نشطة
- **الاستراتيجية:** منشور يومي في المجموعات`
  },
  {
    id: "ch5",
    title: "الفصل 5: نصائح عملية من الخبراء",
    content: `## نصائح ذهبية لنجاح المحتوى

### 1. الاتساق أهم من الكمية
- منشور واحد جيد يومياً أفضل من 5 سيئة
- الاتساق يبني الثقة مع الخوارزمية
- الجمهور يتوقع منك محتوى منتظم

### 2. الجودة قبل الكمية
- محتوى عالي الجودة = أداء أفضل
- الخوارزمية تكافئ الجودة
- لا تركض خلف الأرقام

### 3. الوقت المقضي هو الملك
- اجعل المحتوى يستحق المشاهدة
- اجعل الناس يبقون حتى النهاية
- أول 3 ثوان حاسمة جداً

### 4. التفاعل مع الجمهور
- رد على التعليقات
- اطلب من الناس التعليق
- بناء مجتمع قوي

### 5. التحليل والتحسين
- تابع الإحصائيات
- اختبر أشياء جديدة
- تعلم من الأخطاء`
  },
  {
    id: "ch6",
    title: "الفصل 6: دراسات حالة حقيقية",
    content: `## قصص نجاح حقيقية

### دراسة الحالة 1: من صفر إلى 100K متابع

**الشخص:** منشئ محتوى تعليمي
**المنصة:** تيك توك
**الفترة:** 6 أشهر

**الاستراتيجية:**
- محتوى تعليمي قصير (15-30 ثانية)
- موضوع واحد متخصص
- منشور يومي بدون انقطاع
- تفاعل مستمر مع الجمهور

**النتائج:**
- 100K متابع في 6 أشهر
- ملايين المشاهدات
- عروض عمل وتعاون

### دراسة الحالة 2: من مدونة إلى مشروع ربحي

**الشخص:** كاتب ومدون
**المنصة:** يوتيوب + لينكدإن
**الفترة:** سنة واحدة

**الاستراتيجية:**
- محتوى متخصص في مجال واحد
- فيديوهات طويلة على يوتيوب
- منشورات احترافية على لينكدإن
- بناء سلطة في المجال

**النتائج:**
- 50K مشترك على يوتيوب
- دخل من الإعلانات والرعايات
- عروض استشارة وتدريب`
  },
  {
    id: "ch7",
    title: "الفصل 7: الخطوات العملية للبدء",
    content: `## ابدأ الآن - خطوة بخطوة

### الأسبوع الأول
1. اختر موضوع متخصص تحبه
2. اختر منصة واحدة فقط
3. ادرس المنصة وكيفية عمل الخوارزمية
4. ادرس منشئي محتوى ناجحين في مجالك

### الأسبوع الثاني
1. أنشئ 10 أفكار محتوى
2. اجمع الموارد والأدوات
3. ابدأ في إنشاء المحتوى
4. انشر أول منشور

### الأسابيع 3-4
1. انشر منشور يومي
2. تفاعل مع الجمهور
3. حلل الإحصائيات
4. اختبر أشياء جديدة

### الشهر الثاني
1. أضف منصة ثانية
2. كرر ما ينجح
3. بناء مجتمع قوي
4. ابدأ في التفكير بالدخل

### النصيحة الذهبية
**لا تستسلم في الأسابيع الأولى!**
- معظم الناس يستسلمون بعد أسبوعين
- النجاح يأتي بعد الاستمرار
- الاتساق هو المفتاح الحقيقي`
  },
];

export default function GuideV2() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("ch1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentChapter = useMemo(
    () => CHAPTERS.find((ch) => ch.id === selectedChapter),
    [selectedChapter]
  );

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold">الدليل الاستراتيجي</h1>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar - جدول المحتويات */}
            {isSidebarOpen && (
              <div className="md:col-span-1">
                <Card className="p-4 sticky top-24">
                  <h2 className="font-semibold mb-4">جدول المحتويات</h2>
                  <nav className="space-y-2">
                    {CHAPTERS.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          setSelectedChapter(chapter.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedChapter === chapter.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {chapter.title}
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>
            )}

            {/* Main Content */}
            <div className="md:col-span-3">
              {currentChapter && (
                <Card className="p-8">
                  <h1 className="text-3xl font-bold mb-6">
                    {currentChapter.title}
                  </h1>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-base">
                      {currentChapter.content}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4 mt-8 pt-8 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = CHAPTERS.findIndex(
                          (ch) => ch.id === selectedChapter
                        );
                        if (currentIndex > 0) {
                          setSelectedChapter(CHAPTERS[currentIndex - 1].id);
                        }
                      }}
                      disabled={
                        CHAPTERS.findIndex((ch) => ch.id === selectedChapter) ===
                        0
                      }
                    >
                      ← الفصل السابق
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = CHAPTERS.findIndex(
                          (ch) => ch.id === selectedChapter
                        );
                        if (currentIndex < CHAPTERS.length - 1) {
                          setSelectedChapter(CHAPTERS[currentIndex + 1].id);
                        }
                      }}
                      disabled={
                        CHAPTERS.findIndex((ch) => ch.id === selectedChapter) ===
                        CHAPTERS.length - 1
                      }
                    >
                      الفصل التالي →
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
