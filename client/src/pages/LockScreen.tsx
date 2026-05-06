import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LockScreenProps {
  onUnlock: (code: string) => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(true);

  // أكواد التفعيل الصحيحة - مبسطة وسهلة التذكر
  // هذه الأكواس موجهة للمشترين من Gumroad
  const VALID_CODES = [
    "SMART2026", // كود تجريبي رئيسي
    "CREATOR2026", // كود تجريبي بديل
    "SMARTCREATOR2026", // كود تجريبي موسع
  ];

  const handleActivate = async () => {
    setError("");

    if (!activationCode.trim()) {
      setError("يرجى إدخال كود التفعيل");
      return;
    }

    setIsLoading(true);

    // محاكاة التحقق من الكود (في الواقع، يجب أن يكون هناك اتصال بالخادم)
    setTimeout(() => {
      const code = activationCode.toUpperCase().trim();

      if (VALID_CODES.includes(code)) {
        // حفظ الكود في localStorage
        localStorage.setItem("app_activation_code", code);
        localStorage.setItem("app_unlock_time", new Date().toISOString());

        toast.success("تم تفعيل التطبيق بنجاح!");
        onUnlock(code);
      } else {
        setError("كود التفعيل غير صحيح. يرجى المحاولة مرة أخرى.");
        toast.error("كود تفعيل غير صحيح");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleActivate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* شعار التطبيق */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            نظام المبدع الذكي 2026
          </h1>
          <p className="text-blue-100">تطبيق PWA متقدم</p>
        </div>

        {/* بطاقة التفعيل */}
        <Card className="p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">تفعيل التطبيق</h2>
            <p className="text-muted-foreground text-sm">
              أدخل كود التفعيل الذي تلقيته عند الشراء من Gumroad
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">خطأ</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* حقل إدخال الكود */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              كود التفعيل
            </label>
            <Input
              type="text"
              placeholder="أدخل الكود هنا"
              value={activationCode}
              onChange={(e) => {
                setActivationCode(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-center text-lg font-mono tracking-widest"
            />
          </div>

          {/* زر التفعيل */}
          <Button
            onClick={handleActivate}
            disabled={isLoading || !activationCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto"
            size="lg"
          >
            {isLoading ? "جاري التحقق..." : "تفعيل التطبيق"}
          </Button>

          {/* معلومات إضافية */}
          {showInfo && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-blue-900">معلومات مهمة</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-blue-600 hover:text-blue-700 text-lg"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>الكود الذي تلقيته عند الشراء من Gumroad</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>يمكنك استخدام الكود على جهاز واحد فقط</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>بعد التفعيل، ستتمكن من الوصول لجميع الميزات</span>
                </li>
              </ul>
            </div>
          )}
        </Card>

        {/* رابط الدعم */}
        <div className="text-center mt-6">
          <p className="text-white text-sm mb-2">هل تواجه مشكلة في التفعيل؟</p>
          <a
            href="mailto:support@smartcreator.com"
            className="text-blue-100 hover:text-white underline text-sm"
          >
            تواصل معنا للحصول على الدعم
          </a>
        </div>

        {/* كود تجريبي */}
        <div className="mt-8 p-4 bg-white/10 border border-white/20 rounded-lg text-white text-center text-sm">
          <p className="mb-2">🧪 للاختبار، استخدم الكود:</p>
          <code className="bg-black/30 px-3 py-1 rounded font-mono">
            SMART2026
          </code>
        </div>
      </div>
    </div>
  );
}
