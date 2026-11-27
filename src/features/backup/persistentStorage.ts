export interface StorageStatus {
  supported: boolean;
  persisted: boolean;
  usage: number | null;
  quota: number | null;
}

type StorageManagerLike = {
  persisted?: () => Promise<boolean>;
  persist?: () => Promise<boolean>;
  estimate?: () => Promise<{ usage?: number; quota?: number }>;
};

/**
 * Ask the browser to keep IndexedDB when the user clears site data less aggressively.
 * iOS may still drop data; the backup file is the copy that survives that.
 */
export async function ensurePersistentStorage(
  storage: StorageManagerLike | undefined = typeof navigator !== 'undefined' ? navigator.storage : undefined,
): Promise<StorageStatus> {
  if (!storage || typeof storage.persisted !== 'function' || typeof storage.persist !== 'function') {
    return { supported: false, persisted: false, usage: null, quota: null };
  }
  let persisted = false;
  try {
    persisted = await storage.persisted();
    if (!persisted) persisted = await storage.persist();
  } catch {
    persisted = false;
  }
  let usage: number | null = null;
  let quota: number | null = null;
  if (typeof storage.estimate === 'function') {
    try {
      const estimate = await storage.estimate();
      usage = typeof estimate.usage === 'number' ? estimate.usage : null;
      quota = typeof estimate.quota === 'number' ? estimate.quota : null;
    } catch {
      usage = null;
      quota = null;
    }
  }
  return { supported: true, persisted, usage, quota };
}
