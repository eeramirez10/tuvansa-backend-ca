export function acceptsExistingStagingCredentials(env: Record<string, string | undefined>): boolean {
  return env.STAGING_MODE === "true" && env.STAGING_ERP_ALLOW_EXISTING_CREDENTIALS === "true";
}

export function assertReadOnlyGrants(grants: string[]): void {
  if (!grants.length) throw new Error("Cannot verify SELECT-only ERP credentials.");
  for (const grant of grants) {
    const privileges = /^GRANT (.+?) ON /i.exec(grant)?.[1].toUpperCase().split(/,\s*/);
    if (!privileges || /WITH GRANT OPTION/i.test(grant)
        || privileges.some((privilege) => !["SELECT", "SHOW VIEW", "USAGE"].includes(privilege))) {
      throw new Error("ERP staging requires a dedicated SELECT-only MySQL account without roles or write privileges.");
    }
  }
}
