import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { licenseService } from "@/lib/licenseService";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "license">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة البريد الإلكتروني
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    setIsLoading(true);

    // محاكاة التحقق من البريد
    setTimeout(() => {
      toast.success("تم التحقق من البريد الإلكتروني!");
      setStep("license");
      setIsLoading(false);
    }, 1000);
  };

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // التحقق من صحة كود الترخيص
      if (!licenseCode.trim()) {
        toast.error("الرجاء إدخال كود الترخيص");
        setIsLoading(false);
        return;
      }

      // تفعيل الترخيص
      const license = await licenseService.activateLicense(licenseCode, email);

      if (!license) {
        toast.error("كود الترخيص غير صحيح أو منتهي الصلاحية");
        setIsLoading(false);
        return;
      }

      // حفظ بيانات المستخدم
      localStorage.setItem("userEmail", email);
      localStorage.setItem("licenseCode", licenseCode);
      localStorage.setItem("activated", "true");
      localStorage.setItem("activationTime", new Date().toISOString());

      toast.success("تم تفعيل الحساب بنجاح! 🎉");

      // الانتقال إلى لوحة التحكم
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("خطأ في التفعيل:", error);
      toast.error("حدث خطأ أثناء التفعيل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-slate-900/50 border-cyan-400/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-4 border border-cyan-400/30">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">تفعيل الحساب</h1>
          <p className="text-slate-400">
            {step === "email"
              ? "أدخل بريدك الإلكتروني أولاً"
              : "أدخل كود الترخيص الخاص بك"}
          </p>
        </div>

        {/* Email Step */}
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-5 h-5 text-cyan-400/50" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-slate-800/50 border-cyan-400/30 text-white placeholder-slate-500"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                استخدم البريد الإلكتروني المسجل لديك
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/50"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحقق..." : "التالي"}
            </Button>
          </form>
        ) : (
          /* License Step */
          <form onSubmit={handleLicenseSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                كود الترخيص
              </label>
              <div className="relative">
                <Key className="absolute right-3 top-3 w-5 h-5 text-cyan-400/50" />
                <Input
                  type="text"
                  placeholder="SC-XXXX-XXXX-XXXX"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value.toUpperCase())}
                  className="pr-10 bg-slate-800/50 border-cyan-400/30 text-white placeholder-slate-500 font-mono"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                ستجد الكود في بريدك الإلكتروني أو في حسابك على Gumroad
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/50"
              disabled={isLoading || !licenseCode.trim()}
            >
              {isLoading ? "جاري التفعيل..." : "تفعيل الحساب"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-400 hover:text-slate-300"
              onClick={() => {
                setStep("email");
                setLicenseCode("");
              }}
            >
              تغيير البريد الإلكتروني
            </Button>
          </form>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-cyan-400/20 rounded-lg">
          <h3 className="font-semibold text-sm text-cyan-400 mb-3">ℹ️ معلومات مهمة</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>✓ التطبيق يعمل بدون إنترنت بعد التفعيل</li>
            <li>✓ جميع البيانات محفوظة محلياً على جهازك</li>
            <li>✓ لا توجد رسوم إضافية بعد الشراء</li>
            <li>✓ الترخيص صالح لمدة سنة كاملة</li>
          </ul>
        </div>

        {/* Test Codes Info (للتطوير فقط) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-xs text-purple-400 font-mono">
              أكواز اختبار: SC-TEST-001-DEMO-2026
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
