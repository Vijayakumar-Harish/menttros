export function auditLog(action: string, meta: Record<string, any>) {
  console.log(`[AUDIT] ${action}`, meta);
}
