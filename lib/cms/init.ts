import { seedCMSIfEmpty } from './seed';

let initialized = false;

export async function ensureCMSInitialized() {
  if (initialized) return;
  await seedCMSIfEmpty();
  initialized = true;
}
