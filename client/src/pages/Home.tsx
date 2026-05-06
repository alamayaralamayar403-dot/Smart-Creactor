import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-background/95 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <span className="font-bold text-xl">Smart Creator 2026</span>
          <button className="px-4 py-2 bg-primary text-white rounded">اشتري الآن</button>
        </div>
      </nav>
      <section className="py-20 text-center">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">نظام المبدع الذكي 2026</h1>
          <p className="text-xl text-muted-foreground mb-8">أنتج محتوى عالي الجودة 5 مرات أسرع</p>
        </div>
      </section>
      <footer className="bg-secondary/50 border-t border-border py-12">
        <div className="container text-center text-muted-foreground">
          <p>جميع الحقوق محفوظة 2026</p>
        </div>
      </footer>
    </div>
  );
}