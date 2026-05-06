/**
 * نظام قاعدة البيانات المحلي المستقل
 * يعمل بدون الاتصال بأي خادم خارجي
 * استخدام IndexedDB للتخزين المحلي الدائم
 */

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: number;
  lastLogin: number;
  licenseKey?: string;
  isActive: boolean;
}

interface GeneratedIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  qualityScore: number;
  promptsUsed: string[];
  createdAt: number;
  synced: boolean;
}

interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  autoGenerateIdeas: boolean;
  notificationsEnabled: boolean;
  backupEnabled: boolean;
  lastBackup: number;
}

interface LicenseInfo {
  licenseKey: string;
  userId: string;
  purchaseDate: number;
  expiryDate: number;
  isActive: boolean;
  features: string[];
}

class LocalDatabase {
  private dbName = 'SmartCreatorDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  /**
   * تهيئة قاعدة البيانات
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // جدول المستخدمين
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // جدول الأفكار المولدة
        if (!db.objectStoreNames.contains('ideas')) {
          const ideaStore = db.createObjectStore('ideas', { keyPath: 'id' });
          ideaStore.createIndex('userId', 'userId');
          ideaStore.createIndex('createdAt', 'createdAt');
        }

        // جدول الإعدادات
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'userId' });
        }

        // جدول معلومات الترخيص
        if (!db.objectStoreNames.contains('licenses')) {
          const licenseStore = db.createObjectStore('licenses', { keyPath: 'licenseKey' });
          licenseStore.createIndex('userId', 'userId');
        }

        // جدول الأوامر المفضلة
        if (!db.objectStoreNames.contains('favoritePrompts')) {
          const promptStore = db.createObjectStore('favoritePrompts', { keyPath: 'id' });
          promptStore.createIndex('userId', 'userId');
        }
      };
    });
  }

  /**
   * إضافة مستخدم جديد
   */
  async addUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(user);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * الحصول على مستخدم بواسطة البريد الإلكتروني
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  async getUserById(userId: string): Promise<User | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(userId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * تحديث بيانات المستخدم
   */
  async updateUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(user);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * إضافة فكرة مولدة
   */
  async addIdea(idea: GeneratedIdea): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ideas'], 'readwrite');
      const store = transaction.objectStore('ideas');
      const request = store.add(idea);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * الحصول على أفكار المستخدم
   */
  async getUserIdeas(userId: string, limit: number = 50): Promise<GeneratedIdea[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ideas'], 'readonly');
      const store = transaction.objectStore('ideas');
      const index = store.index('userId');
      const range = IDBKeyRange.only(userId);
      const request = index.getAll(range, limit);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.reverse());
    });
  }

  /**
   * حفظ إعدادات المستخدم
   */
  async saveSettings(settings: UserSettings): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put(settings);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * الحصول على إعدادات المستخدم
   */
  async getSettings(userId: string): Promise<UserSettings | undefined> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(userId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * التحقق من صحة الترخيص
   */
  async validateLicense(licenseKey: string): Promise<LicenseInfo | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['licenses'], 'readonly');
      const store = transaction.objectStore('licenses');
      const request = store.get(licenseKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const license = request.result;
        if (license && license.isActive && license.expiryDate > Date.now()) {
          resolve(license);
        } else {
          resolve(null);
        }
      };
    });
  }

  /**
   * إضافة ترخيص جديد
   */
  async addLicense(license: LicenseInfo): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['licenses'], 'readwrite');
      const store = transaction.objectStore('licenses');
      const request = store.add(license);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * إضافة أمر إلى المفضلة
   */
  async addFavoritePrompt(userId: string, promptId: string, promptTitle: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favoritePrompts'], 'readwrite');
      const store = transaction.objectStore('favoritePrompts');
      const request = store.add({
        id: `${userId}-${promptId}`,
        userId,
        promptId,
        promptTitle,
        addedAt: Date.now(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * الحصول على أوامر المفضلة
   */
  async getFavoritePrompts(userId: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favoritePrompts'], 'readonly');
      const store = transaction.objectStore('favoritePrompts');
      const index = store.index('userId');
      const range = IDBKeyRange.only(userId);
      const request = index.getAll(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * حذف قاعدة البيانات بالكامل (للاختبار)
   */
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['users', 'ideas', 'settings', 'licenses', 'favoritePrompts'],
        'readwrite'
      );

      const stores = ['users', 'ideas', 'settings', 'licenses', 'favoritePrompts'];
      let completed = 0;

      stores.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          completed++;
          if (completed === stores.length) resolve();
        };
      });
    });
  }

  /**
   * النسخ الاحتياطي إلى JSON
   */
  async exportBackup(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const backup: any = {};

    const stores = ['users', 'ideas', 'settings', 'licenses', 'favoritePrompts'];

    for (const storeName of stores) {
      await new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          backup[storeName] = request.result;
          resolve(null);
        };
      });
    }

    return JSON.stringify(backup);
  }

  /**
   * استعادة من النسخة الاحتياطية
   */
  async importBackup(backupJson: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const backup = JSON.parse(backupJson);

    for (const storeName of Object.keys(backup)) {
      await new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        backup[storeName].forEach((item: any) => {
          store.put(item);
        });

        transaction.onerror = () => reject(transaction.error);
        transaction.oncomplete = () => resolve(null);
      });
    }
  }
}

// إنشاء instance واحد من قاعدة البيانات
export const localDB = new LocalDatabase();

// تصدير الأنواع
export type { User, GeneratedIdea, UserSettings, LicenseInfo };
