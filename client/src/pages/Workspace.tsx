import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Workspace() {
  const [copied, setCopied] = useState(false);
  const NOTION_TEMPLATE_URL = "https://notion.so/Smart-Creator-2026-Template";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(NOTION_TEMPLATE_URL);
    setCopied(true);
    toast.success("تم نسخ الرابط!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">مساحة العمل الذكية</h1>
          <p className="text-muted-foreground">قالب Notion متقدم جاهز للاستخدام الفوري</p>
        </div>

        {/* معلومات القالب */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📊 لوحة التحكم</h3>
            <p className="text-muted-foreground mb-4">
              عرض شامل لجميع إحصائيات محتواك والأداء الفوري
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ عدد المنشورات</li>
              <li>✓ متوسط التفاعل</li>
              <li>✓ أفضل الأوقات للنشر</li>
              <li>✓ الاتجاهات والتحليلات</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">💡 مركز الأفكار</h3>
            <p className="text-muted-foreground mb-4">
              نظم أفكارك ومشاريعك بطريقة احترافية
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ تصنيفات ذكية</li>
              <li>✓ أولويات وحالات</li>
              <li>✓ تاريخ الأفكار</li>
              <li>✓ ربط الأفكار بالمنشورات</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📅 تقويم المحتوى</h3>
            <p className="text-muted-foreground mb-4">
              خطط محتواك بشكل منظم وفعال
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ عرض تقويمي</li>
              <li>✓ جدولة المنشورات</li>
              <li>✓ تنبيهات النشر</li>
              <li>✓ تتبع المواعيد النهائية</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📚 مكتبة الموارد</h3>
            <p className="text-muted-foreground mb-4">
              جميع الأدوات والموارد في مكان واحد
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ مكتبة الأوامر الذكية</li>
              <li>✓ خطوط وألوان</li>
              <li>✓ أدوات مفيدة</li>
              <li>✓ قوالب وأمثلة</li>
            </ul>
          </Card>
        </div>

        {/* دمج Notion */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">قالب Notion الكامل</h2>
            <p className="text-muted-foreground text-lg">
              انسخ القالب إلى حسابك على Notion واستخدمه فوراً
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 border border-border min-h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                يتم تحميل قالب Notion...
              </p>
              <div className="inline-block">
                <div className="animate-spin">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => window.open(NOTION_TEMPLATE_URL, '_blank')}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              فتح القالب في Notion
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 ml-2" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ الرابط
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* خطوات الاستخدام */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6">كيفية الاستخدام</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">افتح الرابط</h4>
                <p className="text-muted-foreground">
                  اضغط على "فتح القالب في Notion" أو انسخ الرابط والصقه في متصفحك
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">انسخ القالب</h4>
                <p className="text-muted-foreground">
                  اضغط على "Duplicate" أو "نسخ" في أعلى الصفحة
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">خصصه</h4>
                <p className="text-muted-foreground">
                  غيّر الألوان والأسماء حسب احتياجاتك
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ابدأ الاستخدام</h4>
                <p className="text-muted-foreground">
                  أضف أفكارك ومنشوراتك وابدأ تتبع أدائك
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* نصائح */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h4 className="font-semibold mb-3">💡 نصائح مهمة</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• استخدم Dashboard لتتبع أدائك يومياً</li>
            <li>• أضف أفكارك الجديدة في مركز الأفكار فوراً</li>
            <li>• خطط محتواك في التقويم قبل النشر</li>
            <li>• استخدم مكتبة الموارد للأوامر الذكية</li>
            <li>• حدّث الإحصائيات كل أسبوع</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
