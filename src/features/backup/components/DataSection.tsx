import { useEffect, useState } from 'react';
import {
  backupFileName,
  backupReminder,
  formatBytes,
  omitEmptyWorkouts,
  parseBackup,
  summarizeBackup,
  BackupFile,
  BackupSummary,
} from '../backup';
import { applyBackup, createBackupFile, deliverBackupFile, readLastBackupAt, recordBackupTime } from '../backupStore';
import { ensurePersistentStorage, StorageStatus } from '../persistentStorage';

interface DataSectionProps {
  onBack: () => void;
}

function formatWhen(iso: string | null): string {
  if (!iso) return 'none';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'none';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export const DataSection = ({ onBack }: DataSectionProps) => {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [lastBackupAt, setLastBackupAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ backup: BackupFile; summary: BackupSummary } | null>(null);
  const [skipEmpty, setSkipEmpty] = useState(true);

  const refreshMeta = async () => {
    const [storage, last] = await Promise.all([ensurePersistentStorage(), readLastBackupAt()]);
    setStatus(storage);
    setLastBackupAt(last);
  };

  useEffect(() => {
    refreshMeta().catch(() => {
      setStatus({ supported: false, persisted: false, usage: null, quota: null });
    });
  }, []);

  const reminder = backupReminder(lastBackupAt, new Date());

  const handleExport = async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const now = new Date();
      const backup = await createBackupFile(now);
      const result = await deliverBackupFile(JSON.stringify(backup, null, 2), backupFileName(now));
      if (result === 'cancelled') {
        setMessage('Share cancelled. Nothing was marked as backed up.');
        return;
      }
      await recordBackupTime(now);
      setLastBackupAt(now.toISOString());
      setMessage(result === 'shared'
        ? 'Backup ready to save in Files or iCloud.'
        : 'Backup file downloaded.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export a backup.');
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File | undefined) => {
    setError(null);
    setMessage(null);
    setPreview(null);
    if (!file) return;
    const text = await file.text();
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setPreview({ backup: parsed.backup, summary: summarizeBackup(parsed.backup) });
  };

  const emptySplit = preview ? omitEmptyWorkouts(preview.backup) : null;
  const importBackup = preview
    ? (skipEmpty ? emptySplit!.backup : preview.backup)
    : null;

  const handleApply = async (mode: 'merge' | 'replace') => {
    if (!importBackup) return;
    if (mode === 'replace') {
      const confirmed = window.confirm(
        'Replace all data on this phone with the backup? Workouts, programs, and custom exercises that are not in the file will be deleted.',
      );
      if (!confirmed) return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await applyBackup(importBackup, mode);
      const inserted = Object.values(result.inserted).reduce((sum, n) => sum + n, 0);
      const updated = Object.values(result.updated).reduce((sum, n) => sum + n, 0);
      const skipped = Object.values(result.skipped).reduce((sum, n) => sum + n, 0);
      setMessage(`Imported ${inserted} new, updated ${updated}, skipped ${skipped}. Reloading…`);
      window.setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed. No partial write was kept if the transaction aborted.');
      setBusy(false);
    }
  };

  return (
    <section className="data-section">
      <button type="button" className="data-back-btn" onClick={onBack}>
        ← Back to History
      </button>
      <h2>Backup & data</h2>
      <p className="data-lead">
        Workouts, programs, and custom exercises stay in this browser. A backup file is the copy you can keep in Files or iCloud.
      </p>

      {reminder && <p className="data-reminder" role="status">{reminder}</p>}
      {message && <p className="data-message" role="status">{message}</p>}
      {error && <p className="data-error" role="alert">{error}</p>}

      <div className="data-card">
        <h3>On this phone</h3>
        <p>
          Persistent storage:{' '}
          {status == null
            ? 'checking…'
            : status.supported
              ? (status.persisted ? 'yes' : 'no')
              : 'not supported in this browser'}
        </p>
        <p>
          Space used: {formatBytes(status?.usage ?? null)}
          {status?.quota != null ? ` of ${formatBytes(status.quota)}` : ''}
        </p>
        <p className="data-note">Last backup: {formatWhen(lastBackupAt)}</p>
      </div>

      <div className="data-card">
        <h3>Export</h3>
        <button
          type="button"
          className="data-action-btn"
          onClick={handleExport}
          disabled={busy}
        >
          Backup / Export data
        </button>
      </div>

      <div className="data-card">
        <h3>Import</h3>
        <label className="data-file-label" htmlFor="backup-file">Choose a backup JSON file</label>
        <input
          id="backup-file"
          className="data-file"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            handleFile(file).catch(() => setError('Could not read that file.'));
            event.target.value = '';
          }}
        />
        {preview && (
          <div className="data-preview">
            <p>
              {preview.summary.workoutLogs} workouts, {preview.summary.programs} programs, {preview.summary.exercises} custom exercises.
            </p>
            <p>
              {preview.summary.earliest
                ? `Dates ${formatWhen(preview.summary.earliest)} – ${formatWhen(preview.summary.latest)}.`
                : 'No workouts in this file.'}
            </p>
            {preview.backup.legacyHistoryOnly && (
              <p className="data-note">
                This is an older history-only export. Programs and custom exercises are not in this file. Unknown exercises still import and show as “Unknown exercise”.
              </p>
            )}
            <label className="data-check">
              <input
                type="checkbox"
                checked={skipEmpty}
                onChange={(event) => setSkipEmpty(event.target.checked)}
              />
              Skip workouts with no sets{emptySplit && emptySplit.skippedEmpty > 0 ? ` (${emptySplit.skippedEmpty} in this file)` : ''}
            </label>
            <p className="data-note">
              Merge keeps this phone’s copy when the same id is already here. A workout is replaced only when the backup date is later.
            </p>
            <button type="button" className="data-action-btn" disabled={busy} onClick={() => handleApply('merge')}>
              Merge into this phone
            </button>
            {!preview.backup.legacyHistoryOnly && (
              <button type="button" className="data-action-btn data-action-btn-danger" disabled={busy} onClick={() => handleApply('replace')}>
                Replace all
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
