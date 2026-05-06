/**
 * محرك الأتمتة الداخلي - توليد 5 أفكار يومية تلقائياً
 * يعمل بدون الاعتماد على أي خادم خارجي
 */

import { PROMPTS_LIBRARY, type Prompt } from './prompts';

export interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  quality: number;
  generatedAt: number;
  tags: string[];
  suggestedContent: string;
}

class AutomationEngine {
  private lastGenerationDate: string = '';

  async initialize(): Promise<void> {
    console.log('[AutomationEngine] تم تهيئة محرك الأتمتة');
    this.checkAndGenerateIdeas();
    setInterval(() => this.checkAndGenerateIdeas(), 60 * 60 * 1000);
  }

  private async checkAndGenerateIdeas(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastGenerationDate === today) return;
    
    console.log('[AutomationEngine] بدء توليد 5 أفكار جديدة...');
    await this.generateDailyIdeas();
    this.lastGenerationDate = today;
  }

  async generateDailyIdeas(): Promise<GeneratedIdea[]> {
    const ideas: GeneratedIdea[] = [];
    const selectedPrompts = this.selectDiversePrompts(5);

    for (const prompt of selectedPrompts) {
      const idea = await this.generateIdeaFromPrompt(prompt);
      ideas.push(idea);
    }

    console.log('[AutomationEngine] تم توليد 5 أفكار جديدة بنجاح');
    return ideas;
  }

  private selectDiversePrompts(count: number): Prompt[] {
    const categories = new Set(PROMPTS_LIBRARY.map((p) => p.category));
    const categoryArray = Array.from(categories);
    const selected: Prompt[] = [];

    for (let i = 0; i < count; i++) {
      const category = categoryArray[i % categoryArray.length];
      const categoryPrompts = PROMPTS_LIBRARY.filter((p) => p.category === category);
      const randomPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
      selected.push(randomPrompt);
    }

    return selected;
  }

  private async generateIdeaFromPrompt(prompt: Prompt): Promise<GeneratedIdea> {
    const title = this.generateTitle(prompt);
    const description = this.generateDescription(prompt);
    const suggestedContent = this.generateSuggestedContent(prompt);
    const quality = this.calculateQuality(prompt, title, description);

    return {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      prompt: prompt.template,
      category: prompt.category,
      quality,
      generatedAt: Date.now(),
      tags: [...prompt.tags, 'auto-generated'],
      suggestedContent,
    };
  }

  private generateTitle(prompt: Prompt): string {
    const templates = [
      `${prompt.title} - نسخة محسّنة`,
      `استراتيجية جديدة: ${prompt.title}`,
      `دليل شامل: ${prompt.title}`,
      `${prompt.title} في 2026`,
      `الطريقة الأمثل ل${prompt.title}`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateDescription(prompt: Prompt): string {
    const descriptions = [
      `فكرة مبتكرة حول ${prompt.description.toLowerCase()} باستخدام أحدث الأساليب.`,
      `دليل عملي شامل لـ ${prompt.description.toLowerCase()} مع أمثلة واقعية.`,
      `استراتيجية متقدمة لـ ${prompt.description.toLowerCase()} تركز على النتائج.`,
      `نهج جديد وفعال لـ ${prompt.description.toLowerCase()} يحقق نتائج سريعة.`,
      `خطة تفصيلية لـ ${prompt.description.toLowerCase()} مع خطوات واضحة.`,
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateSuggestedContent(prompt: Prompt): string {
    const contentTypes = [
      `مقالة مفصلة عن ${prompt.title}`,
      `فيديو شرح شامل لـ ${prompt.title}`,
      `إنفوجرافيك توضيحي عن ${prompt.title}`,
      `ويبينار تدريبي حول ${prompt.title}`,
      `كتاب إلكتروني عن ${prompt.title}`,
    ];
    return contentTypes[Math.floor(Math.random() * contentTypes.length)];
  }

  private calculateQuality(prompt: Prompt, title: string, description: string): number {
    let quality = 5;
    if (prompt.difficulty === 'متقدم') quality += 2;
    else if (prompt.difficulty === 'متوسط') quality += 1;
    if (description.length > 100) quality += 1;
    quality += Math.floor(Math.random() * 2);
    return Math.min(10, Math.max(1, quality));
  }

  resetGenerationDate(): void {
    this.lastGenerationDate = '';
  }
}

export const automationEngine = new AutomationEngine();
