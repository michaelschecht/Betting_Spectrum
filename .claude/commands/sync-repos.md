---
description: Sync every Mikes_AI_Lab repo — pull deploy-branch (main/master) updates into local mike_desktop, then push local mike_desktop commits to origin
---

Sync every repo under `D:\AI_Agents\Projects\Mikes_AI_Lab\Repos\` (both `Live_Apps\` and `Other_Apps\`) in two passes: pull deploy-branch updates into local `mike_desktop`, then push any local `mike_desktop` commits back to origin.

**Workflow:**

1. **Pull pass.** Run the PowerShell script:

   ```
   pwsh -File "D:\AI_Agents\Resources\Scripts\powershell\Update-Repos-AI_Lab.ps1"
   ```

   For each repo, the script: fetches + prunes, detects the deploy branch from `origin/HEAD`, skips repos with uncommitted tracked changes (untracked files like `.vercel/` are ignored), checks out `mike_desktop` (creating it from `origin/mike_desktop` if missing locally), fast-forwards `mike_desktop` from its remote, then `git merge --no-edit origin/<deploy-branch>` into `mike_desktop`. Capture its stdout — you'll need it for the summary.

2. **Push pass.** For every repo directory under `D:\AI_Agents\Projects\Mikes_AI_Lab\Repos\Live_Apps\` and `D:\AI_Agents\Projects\Mikes_AI_Lab\Repos\Other_Apps\` that contains a `.git/` folder, push `mike_desktop` to origin:

   ```
   cd <repo> && git push origin mike_desktop
   ```

   This is a no-op when local matches remote (`Everything up-to-date`). Issue all push commands in parallel — one `Bash` call per repo in a single message. Pushing does not require `mike_desktop` to be the currently checked-out branch.

3. **Report** a per-repo summary table with three columns: `repo | pull result | push result`.
   - **Pull result** (parsed from the script's stdout): `already up to date`, `merged N commits from origin/<branch>`, or `skipped — <reason>` (e.g. `dirty tree`, `merge conflict`, `no origin/HEAD`).
   - **Push result** (parsed from each `git push` output): `already up to date`, `pushed <oldsha>..<newsha>`, or `failed — <reason>`.
   - End with a one-line takeaway: how many repos synced cleanly vs. need attention.

**Rules:**

- **Never force-push.** If a push is rejected as non-fast-forward, surface it and stop touching that repo.
- **Don't commit anything.** This command only pulls (via merge) and pushes existing commits.
- **Don't resolve merge conflicts.** If the script aborts a merge for a repo, report it and leave the repo for the user to handle.
- **Don't touch other branches.** Operate on `mike_desktop` only; do not switch back to `main`/`master` or modify them.
- **Don't add untracked files to commits.** The script ignores them on purpose; the push pass should too.
