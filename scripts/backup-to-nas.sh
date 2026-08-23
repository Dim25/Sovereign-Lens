#!/usr/bin/env bash
# Mirror the working trees to the NAS. Run periodically; it is a mirror, not a
# snapshot chain, so it reflects the current state including uncommitted work.
#
# The private research workspace goes to a separate private-backups root: it
# holds the OSINT assessment, which names a real organisation and has not been
# through review. Do not collapse the two destinations.
set -euo pipefail

PROJECTS="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMMON=(-az --delete --exclude '.DS_Store' --exclude '.env' --exclude '__pycache__/')

echo "→ public repo"
rsync "${COMMON[@]}" \
  --exclude 'node_modules/' --exclude 'web/dist/' --exclude '.wrangler/' --exclude '.pytest_cache/' \
  "$PROJECTS/Sovereign-Lens/" nas:/Volume1/backups/sovereign-lens/

if [ -d "$PROJECTS/Sovereign-Lens-private" ]; then
  echo "→ private research workspace"
  rsync "${COMMON[@]}" \
    "$PROJECTS/Sovereign-Lens-private/" nas:/Volume1/private-backups/sovereign-lens-private/
fi

ssh nas 'echo "on NAS:"; du -sh /Volume1/backups/sovereign-lens /Volume1/private-backups/sovereign-lens-private'
echo "backup complete: $(date '+%Y-%m-%d %H:%M')"
