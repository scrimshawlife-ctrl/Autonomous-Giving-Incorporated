#!/usr/bin/env bash
# Create (or reuse) the AGI suite GitHub Project and link all suite repos.
# Requires: gh CLI with scopes read:project,project (+ repo)
#   gh auth refresh -h github.com -s read:project,project
set -euo pipefail

OWNER="${GH_PROJECT_OWNER:-scrimshawlife-ctrl}"
TITLE="${GH_PROJECT_TITLE:-AGI Suite}"
OWNER_TYPE="${GH_PROJECT_OWNER_TYPE:-user}" # user | org

REPOS=(
  Autonomous-Giving-Incorporated
  Fund-Intel
  Impact-Relay
  Autonomous-Giving-Specs
)

need_scopes() {
  echo "Missing project scopes. Run:"
  echo "  gh auth refresh -h github.com -s read:project,project"
  exit 1
}

if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "Not logged in to GitHub CLI"
  exit 1
fi

# Probe project API
if ! gh project list --owner "$OWNER" --limit 1 >/dev/null 2>&1; then
  need_scopes
fi

echo "=== Owner: $OWNER ($OWNER_TYPE) ==="
echo "=== Project title: $TITLE ==="

# Find existing open project by title
PROJECT_NUMBER=$(
  gh project list --owner "$OWNER" --limit 50 --format json 2>/dev/null \
    | python3 -c "
import json,sys
title=$(json.dumps('$TITLE'))
data=json.load(sys.stdin)
# gh may return list or {projects:[...]}
items=data if isinstance(data,list) else data.get('projects') or data.get('nodes') or []
for p in items:
  t=p.get('title') or p.get('Title') or ''
  n=p.get('number') or p.get('Number')
  closed=p.get('closed') or p.get('Closed') or False
  if t==title and not closed:
    print(n); break
" 2>/dev/null || true
)

if [[ -z "${PROJECT_NUMBER:-}" ]]; then
  echo "Creating project \"$TITLE\"..."
  if [[ "$OWNER_TYPE" == "org" ]]; then
    CREATE_OUT=$(gh project create --owner "$OWNER" --title "$TITLE" --format json)
  else
    CREATE_OUT=$(gh project create --owner "$OWNER" --title "$TITLE" --format json)
  fi
  PROJECT_NUMBER=$(echo "$CREATE_OUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('number') or d.get('Number') or '')")
  echo "Created project number: $PROJECT_NUMBER"
else
  echo "Reusing existing project number: $PROJECT_NUMBER"
fi

if [[ -z "${PROJECT_NUMBER:-}" ]]; then
  echo "Could not resolve project number"
  exit 1
fi

# Project node id (for GraphQL link)
PROJECT_ID=$(
  gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json 2>/dev/null \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id') or d.get('ID') or '')" || true
)

if [[ -z "${PROJECT_ID:-}" ]]; then
  PROJECT_ID=$(gh api graphql -f query='
    query($login:String!, $n:Int!) {
      user(login:$login) {
        projectV2(number:$n) { id }
      }
    }' -f login="$OWNER" -F n="$PROJECT_NUMBER" --jq '.data.user.projectV2.id' 2>/dev/null || true)
fi

if [[ -z "${PROJECT_ID:-}" && "$OWNER_TYPE" == "org" ]]; then
  PROJECT_ID=$(gh api graphql -f query='
    query($login:String!, $n:Int!) {
      organization(login:$login) {
        projectV2(number:$n) { id }
      }
    }' -f login="$OWNER" -F n="$PROJECT_NUMBER" --jq '.data.organization.projectV2.id' 2>/dev/null || true)
fi

echo "Project ID: ${PROJECT_ID:-unknown}"
URL=$(gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json 2>/dev/null \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('url') or d.get('URL') or '')" || true)
echo "Project URL: ${URL:-https://github.com/users/$OWNER/projects/$PROJECT_NUMBER}"

link_repo() {
  local repo="$1"
  local repo_id
  repo_id=$(gh api "repos/$OWNER/$repo" --jq .node_id)
  echo "Linking $OWNER/$repo ($repo_id)..."
  if [[ -z "${PROJECT_ID:-}" ]]; then
    echo "  (skip GraphQL link — open project settings → Linked repositories)"
    return 0
  fi
  gh api graphql -f query='
    mutation($project:ID!, $repo:ID!) {
      linkProjectV2ToRepository(input: {projectId: $project, repositoryId: $repo}) {
        repository { nameWithOwner }
      }
    }' -f project="$PROJECT_ID" -f repo="$repo_id" >/dev/null \
    && echo "  linked" \
    || echo "  link may already exist or needs UI (ok)"
}

for r in "${REPOS[@]}"; do
  link_repo "$r"
done

add_issue() {
  local repo="$1"
  local num="$2"
  echo "  + $repo#$num"
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "https://github.com/$OWNER/$repo/issues/$num" 2>/dev/null \
    || gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "https://github.com/$OWNER/$repo/issues/$num" 2>&1 | head -3 || true
}

add_pr() {
  local repo="$1"
  local num="$2"
  echo "  + $repo PR#$num"
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "https://github.com/$OWNER/$repo/pull/$num" 2>/dev/null || true
}

echo "=== Seeding open issues/PRs ==="
# Fund-Intel
add_issue Fund-Intel 48 2>/dev/null || true
add_pr Fund-Intel 55 2>/dev/null || true
add_pr Fund-Intel 53 2>/dev/null || true
add_pr Fund-Intel 47 2>/dev/null || true
# Impact-Relay
add_pr Impact-Relay 35 2>/dev/null || true

# Suite tracking issues (created by this workflow if labeled suite-project)
for r in "${REPOS[@]}"; do
  while read -r n; do
    [[ -n "$n" ]] && add_issue "$r" "$n"
  done < <(gh issue list -R "$OWNER/$r" --label suite-project --state open --json number -q '.[].number' 2>/dev/null || true)
done

echo
echo "Done."
echo "Open: ${URL:-https://github.com/users/$OWNER/projects/$PROJECT_NUMBER}"
echo
echo "Next in the project UI:"
echo "  1. Add custom fields: Repo, Track, Priority (see docs/GITHUB-PROJECT.md)"
echo "  2. Confirm Linked repositories includes all four suite repos"
echo "  3. Set Status workflow on the board view"
