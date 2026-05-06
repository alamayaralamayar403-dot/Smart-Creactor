import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, RefreshCw, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ActivationCode {
  id: number;
  code: string;
  email: string;
  status: "unused" | "used" | "expired" | "revoked";
  usedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

interface Sale {
  id: number;
  customerId: number;
  productName: string;
  totalAmount: number;
  paymentStatus: string;
  transactionId?: string;
  createdAt: Date;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState({
    totalCodes: 0,
    usedCodes: 0,
    unusedCodes: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [searchCode, setSearchCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("تم نسخ الكود!");
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      // Generate new code
      const newCode: ActivationCode = {
        id: Math.random(),
        code: `SMART-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        email: "manual@example.com",
        status: "unused",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
      setCodes([newCode, ...codes]);
      toast.success("تم إنشاء كود جديد!");
    } catch (error) {
      toast.error("خطأ في إنشاء الكود");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchCode.toLowerCase()) ||
    code.email.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">إدارة الأكواد والمبيعات والإحصائيات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">إجمالي الأكواد</div>
            <div className="text-3xl font-bold text-indigo-600">{stats.totalCodes}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">أكواد مستخدمة</div>
            <div className="text-3xl font-bold text-green-600">{stats.usedCodes}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">أكواد متاحة</div>
            <div className="text-3xl font-bold text-blue-600">{stats.unusedCodes}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">إجمالي المبيعات</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalSales}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">الإيرادات</div>
            <div className="text-3xl font-bold text-amber-600">${stats.totalRevenue}</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="codes">الأكواد ({codes.length})</TabsTrigger>
            <TabsTrigger value="sales">المبيعات ({sales.length})</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Codes Tab */}
          <TabsContent value="codes" className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="ابحث عن كود أو بريد إلكتروني..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إنشاء كود جديد
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">الكود</th>
                      <th className="text-right py-3 px-4">البريد الإلكتروني</th>
                      <th className="text-right py-3 px-4">الحالة</th>
                      <th className="text-right py-3 px-4">تاريخ الإنشاء</th>
                      <th className="text-right py-3 px-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCodes.map((code) => (
                      <tr key={code.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-indigo-600">{code.code}</td>
                        <td className="py-3 px-4">{code.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            code.status === "unused" ? "bg-green-100 text-green-800" :
                            code.status === "used" ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {code.status === "unused" ? "متاح" :
                             code.status === "used" ? "مستخدم" :
                             "منتهي"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(code.createdAt).toLocaleDateString("ar-SA")}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyCode(code.code)}
                              className="p-2 hover:bg-gray-200 rounded"
                              title="نسخ الكود"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-200 rounded text-red-600"
                              title="حذف الكود"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">سجل المبيعات</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  تحميل التقرير
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">معرف المبيعة</th>
                      <th className="text-right py-3 px-4">المنتج</th>
                      <th className="text-right py-3 px-4">المبلغ</th>
                      <th className="text-right py-3 px-4">الحالة</th>
                      <th className="text-right py-3 px-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono">#{sale.id}</td>
                        <td className="py-3 px-4">{sale.productName}</td>
                        <td className="py-3 px-4 font-semibold">${(sale.totalAmount / 100).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            مكتملة
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(sale.createdAt).toLocaleDateString("ar-SA")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">إعدادات النظام</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد الدعم الإلكتروني
                  </label>
                  <Input
                    type="email"
                    value="alamavaralamavar403@gmail.com"
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط التطبيق
                  </label>
                  <Input
                    value="https://tiny-queijadas-60d111.netlify.app"
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متجر Sell App
                  </label>
                  <Input
                    value="https://cutemarke.sell.app"
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    تحديث الإحصائيات
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
