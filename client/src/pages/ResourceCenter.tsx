import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  Copy,
  ExternalLink,
  FileText,
  BookOpen,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function ResourceCenter() {
  // رابط قالب Notion الحقيقي - يجب تحديثه برابط القالب الفعلي
  const NOTION_TEMPLATE_URL =
    "https://notion.so/Smart-Creator-2026-Template-7-Pages-Master-Dashboard";

  const handleCopyNotion = () => {
    navigator.clipboard.writeText(NOTION_TEMPLATE_URL);
    toast.success("تم نسخ رابط Notion! انقر على الرابط لنسخ القالب إلى حسابك");
  };

  // روابط تحميل الملفات PDF - روابط مباشرة عاملة
  const PDF_DOWNLOADS = {
    guide: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663329081884/LRJFogAhWCuAbjxE.pdf",
    prompts: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663329081884/STsGROslCkAgtrrW.pdf",
    quickStart:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663329081884/PFOCYvFndwioMgvT.pdf",
  };

  const resources = [
    {
      id: 1,
      title: "الدليل الاستراتيجي الشامل",
      description:
        "50+ صفحة من الاستراتيجيات والنصائح العملية لبناء محتوى ناجح - بقلم عمر المقطري",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600",
      downloadUrl: PDF_DOWNLOADS.guide,
      fileSize: "2.5 MB",
      chapters: [
        "الفصل 1: أساسيات صناعة المحتوى",
        "الفصل 2: استراتيجيات التخطيط",
        "الفصل 3: كتابة المحتوى الفعال",
        "الفصل 4: تحسين الأداء",
        "الفصل 5: التسويق والبيع",
        "الفصل 6: تحليل البيانات",
        "الفصل 7: بناء المجتمع",
      ],
    },
    {
      id: 2,
      title: "مكتبة الأوامر الذكية",
      description:
        "200+ أمر جاهز للاستخدام مع ChatGPT و Claude - موزعة على 8 فئات",
      icon: Zap,
      color: "bg-yellow-500/10 text-yellow-600",
      downloadUrl: PDF_DOWNLOADS.prompts,
      fileSize: "1.8 MB",
      categories: [
        "أوامر توليد الأفكار",
        "أوامر كتابة المحتوى",
        "أوامر تحسين المحتوى",
        "أوامر التسويق والبيع",
        "أوامر تحليل الأداء",
        "أوامر الإدارة والإنتاجية",
        "أوامر التصميم والإبداع",
        "أوامر التفاعل والمجتمع",
      ],
    },
    {
      id: 3,
      title: "دليل الاستخدام السريع",
      description:
        "خطوات سريعة لبدء الاستخدام والاستفادة القصوى من النظام",
      icon: FileText,
      color: "bg-green-500/10 text-green-600",
      downloadUrl: PDF_DOWNLOADS.quickStart,
      fileSize: "0.8 MB",
      sections: [
        "التثبيت والتفعيل",
        "الخطوات الأولى",
        "استخدام مكتبة الأوامر",
        "إعداد Notion",
        "نصائح للنجاح",
        "الأسئلة الشائعة",
      ],
    },
  ];

  const handleDownload = (url: string, fileName: string) => {
    if (url.startsWith("https://")) {
      // فتح رابط التحميل المباشر
      window.open(url, "_blank");
      toast.success("جاري تحميل الملف...");
    } else {
      toast.error("رابط التحميل غير متاح حالياً");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* العنوان */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">مركز الموارد</h1>
          <p className="text-lg text-muted-foreground">
            كل ما تحتاجه للبدء والنجاح مع نظام المبدع الذكي 2026
          </p>
        </div>

        {/* قسم Notion */}
        <div className="mb-12">
          <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">قالب Notion المتقدم</h2>
                <p className="text-muted-foreground mb-4">
                  قالب Notion احترافي يتضمن 7 صفحات أساسية مصممة خصيصاً لصناع
                  المحتوى:
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li>✅ لوحة التحكم (Dashboard) - نظرة عامة على الأداء</li>
                  <li>✅ مركز الأفكار (Ideas Hub) - تخزين وتنظيم الأفكار</li>
                  <li>✅ تقويم المحتوى (Content Calendar) - جدولة المحتوى</li>
                  <li>✅ مكتبة الموارد (Resource Library) - حفظ المراجع</li>
                  <li>✅ لوحة التحليل (Analytics Board) - متابعة الإحصائيات</li>
                  <li>✅ قائمة المهام (Tasks) - إدارة المشاريع</li>
                  <li>✅ ملاحظات وأفكار (Notes) - توثيق الدروس المستفادة</li>
                </ul>
                <p className="text-sm text-muted-foreground mb-6">
                  انقر على الزر أدناه لنسخ القالب إلى حسابك على Notion مباشرة
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleCopyNotion}
                  >
                    <Copy className="w-5 h-5 ml-2" />
                    نسخ القالب إلى حسابي
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(NOTION_TEMPLATE_URL, "_blank")}
                  >
                    <ExternalLink className="w-5 h-5 ml-2" />
                    فتح القالب مباشرة
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block text-6xl">📋</div>
            </div>
          </Card>
        </div>

        {/* قسم الملفات */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">الملفات القابلة للتحميل</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card
                  key={resource.id}
                  className="p-6 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-4`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>

                  {/* عرض الفصول أو الفئات */}
                  {resource.chapters && (
                    <div className="mb-4 text-xs text-muted-foreground">
                      <p className="font-semibold mb-2">الفصول:</p>
                      <ul className="space-y-1">
                        {resource.chapters.slice(0, 3).map((chapter, idx) => (
                          <li key={idx}>• {chapter}</li>
                        ))}
                        {resource.chapters.length > 3 && (
                          <li>• و {resource.chapters.length - 3} فصول أخرى</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {resource.categories && (
                    <div className="mb-4 text-xs text-muted-foreground">
                      <p className="font-semibold mb-2">الفئات:</p>
                      <ul className="space-y-1">
                        {resource.categories.slice(0, 3).map((cat, idx) => (
                          <li key={idx}>• {cat}</li>
                        ))}
                        {resource.categories.length > 3 && (
                          <li>• و {resource.categories.length - 3} فئات أخرى</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {resource.sections && (
                    <div className="mb-4 text-xs text-muted-foreground">
                      <p className="font-semibold mb-2">الأقسام:</p>
                      <ul className="space-y-1">
                        {resource.sections.slice(0, 3).map((section, idx) => (
                          <li key={idx}>• {section}</li>
                        ))}
                        {resource.sections.length > 3 && (
                          <li>• و {resource.sections.length - 3} أقسام أخرى</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <span className="text-xs text-muted-foreground">
                      {resource.fileSize}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleDownload(resource.downloadUrl, resource.title)
                      }
                    >
                      <Download className="w-4 h-4 ml-1" />
                      تحميل
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* قسم الدعم */}
        <Card className="p-8 bg-muted/50 mb-8">
          <h2 className="text-2xl font-bold mb-4">هل تحتاج مساعدة؟</h2>
          <p className="text-muted-foreground mb-6">
            إذا واجهت أي مشاكل أو كان لديك أسئلة، لا تتردد في التواصل معنا عبر
            أحد القنوات التالية.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg">
              📧 البريد الإلكتروني
            </Button>
            <Button variant="outline" size="lg">
              💬 WhatsApp
            </Button>
            <Button variant="outline" size="lg">
              📱 Telegram
            </Button>
          </div>
        </Card>

        {/* نصائح سريعة */}
        <div className="p-6 bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold mb-3">💡 نصائح سريعة للبدء</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              1️⃣ ابدأ بقراءة الدليل الاستراتيجي لفهم النظام بشكل أفضل
            </li>
            <li>
              2️⃣ استخدم مكتبة الأوامر مع ChatGPT أو Claude للحصول على أفضل
              النتائج
            </li>
            <li>
              3️⃣ نسخ قالب Notion وابدأ تنظيم محتواك فوراً
            </li>
            <li>
              4️⃣ تابع دليل الاستخدام السريع لتجنب الأخطاء الشائعة
            </li>
            <li>
              5️⃣ استخدم الأوامر بانتظام وطور مهاراتك تدريجياً
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
