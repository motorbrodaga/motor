import { BackupPanel } from "@/features/backups/BackupPanel";
import { getLatestBackupRun } from "@/lib/backups/backup-service";

export const dynamic = "force-dynamic";

export default async function BackupsPage() {
  const latest = await getLatestBackupRun();

  return <BackupPanel latest={JSON.parse(JSON.stringify(latest))} />;
}
