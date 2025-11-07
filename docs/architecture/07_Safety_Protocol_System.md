# 07_Safety Protocol System

**Version:** 2.0 (Self-Hosted Owner/Reader Architecture)
**Last Updated:** November 7, 2025
**Status:** 🟡 Design Complete, Implementation Pending

---

## Overview

The Safety Protocol System enables responsible sharing of potentially hazardous research by requiring users to acknowledge safety protocols before accessing gated content. This system balances **openness** (making research publicly accessible) with **responsibility** (ensuring users understand risks).

---

## Philosophy

### Why Safety Gating?

Many research projects in Workspace involve potentially dangerous work:
- High voltage plasma generation
- Chemical synthesis
- Biological specimens
- DIY equipment that could cause harm

**Goals:**
1. **Informed Consent**: Users explicitly acknowledge risks before viewing content
2. **Legal Protection**: Documented record of safety warnings
3. **Educational**: Links to safety documentation educate users
4. **Non-Obstructive**: Simple, one-time acknowledgment (not a quiz for MVP)
5. **Granular**: Gating at project or stream level as needed

### Not a Substitute for Professional Safety

⚠️ **Important:** This system is NOT:
- A replacement for professional safety training
- A legal liability shield
- A guarantee that users will follow safety protocols
- A certification or qualification

It is simply a mechanism to ensure users are **aware** of risks before viewing potentially hazardous content.

---

## System Components

```
┌───────────────────────────────────────────────────────────┐
│                    User Accesses Content                  │
└───────────────────┬───────────────────────────────────────┘
                    │
                    ↓
         ┌──────────────────────┐
         │   Astro Middleware   │
         │  Checks .access.yml  │
         └──────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
     gated: false        gated: true
          │                   │
          ↓                   ↓
   ┌──────────────┐   ┌──────────────────┐
   │ Show Content │   │ Check Supabase   │
   └──────────────┘   │ acknowledgment   │
                      └─────────┬────────┘
                                │
                      ┌─────────┴─────────┐
                      │                   │
                 Acknowledged       Not Acknowledged
                      │                   │
                      ↓                   ↓
               ┌──────────────┐   ┌─────────────────┐
               │ Show Content │   │ Show Safety     │
               └──────────────┘   │ Modal           │
                                  └─────────┬───────┘
                                            │
                                            ↓
                                    ┌───────────────────┐
                                    │ User Acknowledges │
                                    │ → Log to Supabase │
                                    └─────────┬─────────┘
                                              │
                                              ↓
                                      ┌──────────────┐
                                      │ Show Content │
                                      └──────────────┘
```

---

## `.access.yml` Configuration

### Location

Access control files can exist at two levels:

1. **Project-level:** `content/projects/<project>/.access.yml`
   - Applies to entire project (all streams and updates)
2. **Stream-level:** `content/projects/<project>/streams/<stream>/.access.yml`
   - Overrides project-level for specific stream

### Schema

```yaml
# Required
gated: true                       # Whether content requires acknowledgment

# Safety Protocol
required_acknowledgment: "plasma_safety_v1.3"  # Unique code

# Risk Classification
risk_level: "high"                # "low" | "medium" | "high"

# Documentation
safety_docs:
  - url: "/docs/safety/plasma-basics"
    version: "1.3"
    updated: "2025-10-01"
    title: "Plasma Safety Basics"

# Future: Role-based access
allowed_roles:
  - owner
  - collaborator
  - vetted
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gated` | boolean | ✅ | If `true`, requires acknowledgment |
| `required_acknowledgment` | string | ⚠️ | Safety code (required if `gated: true`) |
| `risk_level` | enum | ❌ | Risk classification for UI indicators |
| `safety_docs` | array | ❌ | Links to safety documentation |
| `allowed_roles` | array | ❌ | Future: role-based permissions |

### Example: High-Risk Project

```yaml
# content/projects/plasma-design/.access.yml
gated: true
required_acknowledgment: "plasma_safety_v1.3"
risk_level: "high"
safety_docs:
  - url: "/docs/safety/plasma-basics"
    version: "1.3"
    updated: "2025-10-01"
    title: "Plasma Safety Basics"
  - url: "/docs/safety/high-voltage"
    version: "2.0"
    updated: "2025-09-15"
    title: "High Voltage Safety"
```

### Example: Low-Risk Stream

```yaml
# content/projects/plasma-design/streams/documentation/.access.yml
gated: false
risk_level: "low"
```

### Inheritance Rules

1. If **no `.access.yml`** exists → default to `gated: false` (public)
2. **Stream-level** `.access.yml` overrides project-level
3. **Project-level** applies to all streams unless overridden

---

### Additional .access.yml Examples

#### Example: Low-Risk Project (No Gating)

```yaml
# content/projects/documentation-site/.access.yml
gated: false
risk_level: "low"

# Optional: Still document risk level for UI indicators
# (e.g., show green badge: "Low Risk - No special requirements")
```

#### Example: Medium-Risk Project

```yaml
# content/projects/cnc-fabrication/.access.yml
gated: true
required_acknowledgment: "machine_shop_safety_v1.0"
risk_level: "medium"
safety_docs:
  - url: "/docs/safety/machine-shop-basics"
    version: "1.0"
    updated: "2025-10-15"
    title: "Machine Shop Safety Basics"
  - url: "/docs/safety/cnc-specific"
    version: "1.2"
    updated: "2025-11-01"
    title: "CNC-Specific Safety Protocols"
```

#### Example: Stream-Level Override

```yaml
# content/projects/plasma-design/sub-projects/theory-only/.access.yml
# Plasma project is gated at project level, but this sub-project
# contains only theory/simulations with no physical experiments

gated: false
risk_level: "low"

note: "This sub-project contains theoretical work only. No physical plasma experiments described."
```

#### Example: Multi-Code Safety (Future)

```yaml
# content/projects/advanced-chemistry/.access.yml
# Future enhancement: Multiple safety codes required

gated: true
required_acknowledgments:  # Note: plural
  - "chemistry_basics_v1.0"
  - "fume_hood_safety_v2.1"
  - "hazmat_disposal_v1.5"
risk_level: "high"

# User must acknowledge ALL codes before accessing content
```

#### Example: Commons Workspace Safety (Phase 4)

```yaml
# content/projects/community-experiments/.access.yml
# In Arc^ Commons (organizational workspace)

gated: true
required_acknowledgment: "commons_plasma_safety_v1.0"
risk_level: "high"
safety_registry: "arc_commons"  # Use centralized safety registry

# In Commons, safety acknowledgments are tracked centrally
# across all community workspaces for compliance monitoring
```

---

## Local vs Commons Safety Tracking

### Personal Workspace Model (Current - Phase 1)

**Architecture:** Self-hosted, single-owner workspace

**Safety Tracking:**
- Acknowledgments stored in **local** Supabase instance
- Owner manages their own safety protocols
- Readers (Phase 2) acknowledge safety to access owner's content
- Each workspace is independent - no cross-workspace tracking

**Database Table:** `reader_acknowledgments`

```sql
-- Personal workspace: reader_acknowledgments table
create table reader_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  safety_code text not null,
  protocol_url text,
  acknowledged_at timestamp default now(),

  unique(user_id, safety_code)
);
```

**Use Cases:**
- Ali deploys his own workspace: `workspace-by-ali.vercel.app`
- Ali creates plasma project with `plasma_safety_v1.3`
- Jane (reader) visits Ali's workspace
- Jane acknowledges safety → logged in Ali's local database
- If Jane visits another workspace with the same safety code, she must acknowledge again (different database)

---

### Commons Workspace Model (Future - Phase 4)

**Architecture:** Arc^ Commons - organizational shared workspace

**Safety Tracking:**
- Acknowledgments stored in **centralized** Commons safety registry
- Multiple researchers share same workspace
- Org-level compliance monitoring
- Cross-project acknowledgment reuse

**Database Table (Future):** `commons_safety_registry`

```sql
-- Arc^ Commons: Centralized safety registry (future)
create table commons_safety_registry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,  -- Commons member ID
  safety_code text not null,
  workspace_id uuid not null,  -- Which Commons workspace
  acknowledged_at timestamp default now(),
  reviewed_by uuid,  -- Optional: Safety officer review
  expires_at timestamp,   -- Optional: Time-limited acknowledgments

  unique(user_id, safety_code, workspace_id)
);

-- Additional compliance tracking
create table commons_safety_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,  -- 'acknowledge', 'revoke', 'expire'
  safety_code text not null,
  audited_by uuid not null,  -- Safety officer
  audit_date timestamp default now(),
  notes text
);
```

**Use Cases:**
- Arc^ Commons workspace deployed at `commons.arcscience.org`
- Multiple researchers collaborate on dangerous research
- Sarah acknowledges `bio_safety_v2.0` in Commons
- Sarah can now access ANY Commons project requiring that safety code
- Safety officer can view compliance dashboard showing all acknowledgments
- If safety protocol is updated, all users must re-acknowledge

---

### Hybrid Model (Phase 3)

**Scenario:** Personal workspace + Commons membership

**Safety Tracking:**
- User has acknowledgments in **both** databases:
  - Local acknowledgments for their personal workspace
  - Commons acknowledgments for Arc^ Commons projects
- UI shows unified view: "You have acknowledged this protocol in 2 workspaces"

```typescript
// Future: Check safety acknowledgment across multiple sources
async function checkSafetyAcknowledgment(userId, safetyCode) {
  // Check local workspace
  const localAck = await supabase
    .from('reader_acknowledgments')
    .select()
    .eq('user_id', userId)
    .eq('safety_code', safetyCode)
    .single();

  if (localAck.data) {
    return { acknowledged: true, source: 'local' };
  }

  // Check Commons registry (if user is Commons member)
  if (userIsCommonsMember) {
    const commonsAck = await commonsSupabase
      .from('commons_safety_registry')
      .select()
      .eq('user_id', userId)
      .eq('safety_code', safetyCode)
      .single();

    if (commonsAck.data) {
      return { acknowledged: true, source: 'commons' };
    }
  }

  return { acknowledged: false };
}
```

---

### Comparison Table

| Feature | Personal Workspace (Phase 1) | Commons Workspace (Phase 4) | Hybrid (Phase 3) |
|---------|------------------------------|----------------------------|------------------|
| **Safety Database** | Local Supabase | Centralized Commons DB | Both |
| **Acknowledgment Scope** | Single workspace | All Commons projects | Context-dependent |
| **Compliance Monitoring** | Owner self-manages | Org safety officer | Mixed |
| **Acknowledgment Reuse** | None (per-workspace) | Yes (across Commons) | Conditional |
| **Expiration** | Optional (future) | Recommended | Varies by workspace |
| **Audit Trail** | Basic logging | Full audit log | Merged view |

---

## Reader Acknowledgment System

**Phase 2 Feature:** Reader accounts with acknowledgment flow

### Owner vs Reader Acknowledgments

#### Owner Acknowledgments

- **Purpose:** Owner acknowledges risks before creating gated content
- **Flow:** Optional - owner can create gated content without personally acknowledging
- **Enforcement:** Not required (owner trusts themselves)
- **Use Case:** Owner creates plasma project but doesn't need to view safety modal

```yaml
# Owner creates content/projects/plasma-design/.access.yml
# Owner is NOT forced to acknowledge - they created the content
gated: true
required_acknowledgment: "plasma_safety_v1.3"
```

#### Reader Acknowledgments

- **Purpose:** Readers acknowledge risks before viewing gated content
- **Flow:** REQUIRED - readers cannot access content without acknowledging
- **Enforcement:** Middleware blocks access until acknowledgment logged
- **Database:** `reader_acknowledgments` table (self-hosted architecture)

**Table Schema:**

```sql
create table reader_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,  -- Reader's user ID
  safety_code text not null,  -- e.g., "plasma_safety_v1.3"
  protocol_url text,          -- Link to safety doc they acknowledged
  acknowledged_at timestamp default now(),
  ip_address inet,            -- Optional: Log IP for records
  user_agent text,            -- Optional: Log browser

  unique(user_id, safety_code)
);

-- RLS Policies
alter table reader_acknowledgments enable row level security;

-- Readers can read their own acknowledgments
create policy "Readers can read own acknowledgments"
  on reader_acknowledgments for select
  using (auth.uid() = user_id);

-- Readers can insert their own acknowledgments
create policy "Readers can insert own acknowledgments"
  on reader_acknowledgments for insert
  with check (auth.uid() = user_id);

-- Owners can read all reader acknowledgments (compliance monitoring)
create policy "Owners can read all reader acknowledgments"
  on reader_acknowledgments for select
  using (is_workspace_owner(auth.uid()));
```

### Reader Acknowledgment Flow

```
1. Reader visits gated content URL
   ↓
2. Middleware checks .access.yml
   ↓ (gated: true)
3. Middleware checks reader_acknowledgments table
   ↓ (no acknowledgment found)
4. Redirect to /safety-gate?code=plasma_safety_v1.3&return=/projects/plasma-design
   ↓
5. Safety modal displays:
   - Warning message
   - Link to safety protocol docs
   - Risk level indicator
   - Checkbox: "I acknowledge all risks"
   ↓
6. Reader checks box and clicks "Agree & Continue"
   ↓
7. POST /api/safety/acknowledge
   {
     user_id: <reader-id>,
     safety_code: "plasma_safety_v1.3",
     protocol_url: "/docs/safety/plasma-basics"
   }
   ↓
8. Insert into reader_acknowledgments table
   ↓
9. Redirect back to original URL: /projects/plasma-design
   ↓
10. Middleware re-checks acknowledgment (now exists)
    ↓
11. Content displayed to reader
```

### API Endpoints for Reader Acknowledgments

See [API_ENDPOINTS.md](../reference/API_ENDPOINTS.md) for full specs:

- `POST /api/safety/acknowledge` - Log acknowledgment
- `GET /api/safety/check/:safety_code` - Check if user acknowledged
- `GET /api/acknowledgments` - Get user's own acknowledgments
- `GET /api/acknowledgments/all` - Owner views all reader acknowledgments (compliance)

### Reader Acknowledgment UI Components

#### Safety Modal for Readers

```tsx
// src/components/SafetyModal.tsx
export function SafetyModal({ safetyCode, riskLevel, docsUrl }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content safety-modal">
        <div className="modal-header">
          <div className={`risk-badge risk-${riskLevel}`}>
            ⚠️ {riskLevel.toUpperCase()} RISK CONTENT
          </div>
          <h2>Safety Acknowledgment Required</h2>
        </div>

        <div className="modal-body">
          <p>
            This content involves potentially hazardous procedures.
            You must read and acknowledge the safety protocols before proceeding.
          </p>

          {/* Reader-specific warning */}
          <div className="reader-notice">
            <strong>As a reader of this workspace:</strong>
            <ul>
              <li>You are viewing content created by the workspace owner</li>
              <li>The owner is not responsible for your actions</li>
              <li>You accept full liability for any experiments you attempt</li>
            </ul>
          </div>

          <a href={docsUrl} target="_blank" className="btn-primary">
            📖 Read Safety Protocol
          </a>

          <label className="checkbox-label">
            <input type="checkbox" />
            <span>
              I have read the safety protocols. I understand the risks
              and accept full responsibility for my actions. I will not
              hold the workspace owner liable for any injuries or damages.
            </span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={goBack}>
            Cancel
          </button>
          <button className="btn-warning" onClick={acknowledge}>
            ✓ Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Owner Dashboard: Reader Compliance View

```tsx
// src/pages/owner/safety-compliance.astro
// Owner can see which readers have acknowledged which protocols

<Table>
  <thead>
    <tr>
      <th>Reader</th>
      <th>Email</th>
      <th>Safety Code</th>
      <th>Acknowledged</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {acknowledgments.map(ack => (
      <tr>
        <td>{ack.reader_name}</td>
        <td>{ack.reader_email}</td>
        <td>{ack.safety_code}</td>
        <td>{formatDate(ack.acknowledged_at)}</td>
        <td>
          <span className="badge badge-success">✓ Acknowledged</span>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

### Compliance Monitoring (Owner Tools)

Owners can monitor reader safety compliance:

```sql
-- Owner query: Which readers have NOT acknowledged a specific protocol?
select u.email, u.full_name
from user_roles ur
join auth.users u on u.id = ur.user_id
where ur.role = 'reader'
  and ur.status = 'approved'
  and ur.user_id not in (
    select user_id
    from reader_acknowledgments
    where safety_code = 'plasma_safety_v1.3'
  );

-- Owner query: Safety protocol coverage by reader
select
  u.email,
  count(ra.safety_code) as protocols_acknowledged,
  array_agg(ra.safety_code) as acknowledged_codes
from user_roles ur
join auth.users u on u.id = ur.user_id
left join reader_acknowledgments ra on ra.user_id = ur.user_id
where ur.role = 'reader' and ur.status = 'approved'
group by u.email
order by protocols_acknowledged desc;
```

---

## Safety Codes

### Naming Convention

Format: `<topic>_safety_v<major>.<minor>`

Examples:
- `plasma_safety_v1.3`
- `high_voltage_safety_v2.0`
- `chemistry_safety_v1.0`
- `biology_safety_v1.1`

### Versioning

- **Major version change** (e.g., 1.x → 2.x): Significant safety updates, users must re-acknowledge
- **Minor version change** (e.g., 1.3 → 1.4): Minor clarifications, existing acknowledgments still valid

**MVP:** All acknowledgments are permanent. Future: implement expiration/re-acknowledgment.

---

## Safety Documentation

### Required Safety Docs

Each safety code should have corresponding documentation:

**Location:** `public/docs/safety/<topic>.md`

**Example:** `public/docs/safety/plasma-basics.md`

```markdown
# Plasma Safety Basics (v1.3)

**Last Updated:** 2025-10-01
**Risk Level:** High

## Overview

Non-thermal plasma generation involves high voltage electricity...

## Hazards

### Electrical Shock
- Voltage: 10,000V - 50,000V
- Can cause severe injury or death
- ...

### Ozone Generation
- Plasma produces ozone gas
- Exposure limits: <0.1 ppm for extended periods
- ...

## Required Safety Equipment

- [ ] Insulated gloves (rated for >50kV)
- [ ] Safety goggles
- [ ] Ventilated workspace
- [ ] Fire extinguisher

## Safe Operating Procedures

1. Always power down before touching equipment
2. Use insulated tools only
3. ...

## Emergency Procedures

If shock occurs:
1. Turn off power immediately
2. Call emergency services
3. ...

## Acknowledgment

By acknowledging this protocol, you confirm:
- ✅ I have read and understood all hazards
- ✅ I have the required safety equipment
- ✅ I understand the emergency procedures
- ✅ I accept all risks associated with this work
```

### Documentation Structure

Recommended sections:
1. **Overview** - What hazards are involved
2. **Hazards** - Specific risks with severity ratings
3. **Required Equipment** - Safety gear checklist
4. **Safe Operating Procedures** - Step-by-step safety practices
5. **Emergency Procedures** - What to do if something goes wrong
6. **Acknowledgment** - Clear statement of what user is agreeing to

---

## Safety Modal (MVP)

### User Experience Flow

1. User clicks on gated project/stream
2. Middleware detects `gated: true` in `.access.yml`
3. Checks Supabase: `SELECT * FROM safety_acknowledgments WHERE user_id = ? AND safety_code = ?`
4. If no row found → redirect to `/safety-gate?code=plasma_safety_v1.3&return=/projects/plasma-design`
5. Safety gate page displays modal
6. User must:
   - Click link to view safety docs (opens in new tab)
   - Check "I have read and understood" checkbox
   - Click "Agree & Continue" button
7. POST `/api/safety/acknowledge` → insert row in Supabase
8. Redirect to original content URL

### UI Components

#### Modal Component

```tsx
// src/components/SafetyModal.tsx
import { useState } from 'react';

interface SafetyModalProps {
  safetyCode: string;
  riskLevel: 'low' | 'medium' | 'high';
  docsUrl: string;
  onAcknowledge: () => void;
}

export function SafetyModal({
  safetyCode,
  riskLevel,
  docsUrl,
  onAcknowledge
}: SafetyModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/safety/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ safety_code: safetyCode }),
      });

      if (response.ok) {
        onAcknowledge();
      } else {
        alert('Failed to save acknowledgment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal safety-modal risk-${riskLevel}`}>
        <div className="modal-header">
          <h2>⚠️ Safety Acknowledgment Required</h2>
          <span className={`risk-badge risk-${riskLevel}`}>
            {riskLevel.toUpperCase()} RISK
          </span>
        </div>

        <div className="modal-body">
          <p>
            This content involves <strong>potentially hazardous work</strong>.
            You must read and understand the safety documentation before continuing.
          </p>

          <div className="safety-warning">
            <h3>⚡ Hazards May Include:</h3>
            <ul>
              <li>High voltage electricity</li>
              <li>Toxic or hazardous chemicals</li>
              <li>Risk of injury or death</li>
            </ul>
          </div>

          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            📖 View Safety Protocol
          </a>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I have read and understood the safety protocols. I acknowledge
              all risks and accept full responsibility for my actions.
            </span>
          </label>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            className="btn btn-warning"
            disabled={!agreed || loading}
            onClick={handleAcknowledge}
          >
            {loading ? 'Saving...' : '✓ Agree & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Safety Gate Page

```astro
---
// src/pages/safety-gate.astro
import Layout from '../layouts/Layout.astro';
import SafetyModal from '../components/SafetyModal';

const safetyCode = Astro.url.searchParams.get('code');
const returnUrl = Astro.url.searchParams.get('return');

if (!safetyCode || !returnUrl) {
  return Astro.redirect('/');
}

// Fetch safety doc info
const docsUrl = `/docs/safety/${safetyCode.replace(/_safety_v.*/, '')}.md`;
const riskLevel = 'high'; // TODO: fetch from .access.yml
---

<Layout title="Safety Acknowledgment Required">
  <SafetyModal
    safetyCode={safetyCode}
    riskLevel={riskLevel}
    docsUrl={docsUrl}
    onAcknowledge={() => {
      window.location.href = returnUrl;
    }}
    client:load
  />
</Layout>
```

### Styling Considerations

- **Risk indicators:** Color-code by risk level (yellow for medium, red for high)
- **Clear typography:** Large, readable text for important warnings
- **Accessibility:** Keyboard navigation, screen reader support
- **Mobile-friendly:** Responsive modal design

---

## Database Schema

### `safety_acknowledgments` Table

```sql
create table safety_acknowledgments (
  user_id uuid references auth.users(id) on delete cascade,
  safety_code text not null,
  acknowledged_at timestamp default now(),
  ip_address inet,                -- Optional: log IP for records
  user_agent text,                -- Optional: log browser info

  primary key (user_id, safety_code)
);

-- Indexes
create index idx_safety_ack_user on safety_acknowledgments(user_id);
create index idx_safety_ack_code on safety_acknowledgments(safety_code);

-- RLS Policies
alter table safety_acknowledgments enable row level security;

-- Users can read own acknowledgments
create policy "Users can read own acknowledgments"
  on safety_acknowledgments for select
  using (auth.uid() = user_id);

-- Users can insert own acknowledgments
create policy "Users can insert own acknowledgments"
  on safety_acknowledgments for insert
  with check (auth.uid() = user_id);
```

### Example Rows

| user_id | safety_code | acknowledged_at | ip_address | user_agent |
|---------|-------------|-----------------|------------|------------|
| uuid1 | plasma_safety_v1.3 | 2025-11-05 10:30:00 | 192.168.1.1 | Mozilla/5.0... |
| uuid1 | high_voltage_safety_v2.0 | 2025-11-05 11:00:00 | 192.168.1.1 | Mozilla/5.0... |
| uuid2 | chemistry_safety_v1.0 | 2025-11-04 14:20:00 | 10.0.0.5 | Chrome/120... |

---

## Middleware Implementation

### Astro Middleware

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { parseAccessConfig, checkAccess } from './lib/safety';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Check if path is a gated project or stream
  const projectMatch = pathname.match(/^\/projects\/([^\/]+)/);
  if (!projectMatch) {
    return next(); // Not a project page, continue
  }

  const projectSlug = projectMatch[1];

  // Fetch .access.yml from user's repo
  const accessConfig = await parseAccessConfig(
    context.locals.userRepo,
    `content/projects/${projectSlug}/.access.yml`
  );

  if (!accessConfig || !accessConfig.gated) {
    return next(); // Not gated, allow access
  }

  // Check if user has acknowledged
  const session = context.locals.session;
  if (!session) {
    // Not logged in, redirect to login
    return context.redirect(
      `/login?return=${encodeURIComponent(pathname)}`
    );
  }

  const hasAcknowledged = await checkAccess(
    session.user.id,
    accessConfig.required_acknowledgment
  );

  if (!hasAcknowledged) {
    // Redirect to safety gate
    return context.redirect(
      `/safety-gate?code=${accessConfig.required_acknowledgment}&return=${encodeURIComponent(pathname)}`
    );
  }

  // User has acknowledged, allow access
  return next();
});
```

### Helper Functions

```ts
// src/lib/safety.ts
import yaml from 'yaml';
import { createClient } from '@supabase/supabase-js';

export interface AccessConfig {
  gated: boolean;
  required_acknowledgment?: string;
  risk_level?: 'low' | 'medium' | 'high';
  safety_docs?: Array<{
    url: string;
    version: string;
    title: string;
  }>;
}

export async function parseAccessConfig(
  repoUrl: string,
  path: string
): Promise<AccessConfig | null> {
  try {
    // Fetch .access.yml from GitHub
    const response = await fetch(
      `${repoUrl}/raw/main/${path}`,
      { cache: 'no-cache' } // Don't cache for security
    );

    if (!response.ok) {
      return null; // File doesn't exist, default to not gated
    }

    const content = await response.text();
    const config = yaml.parse(content) as AccessConfig;

    return config;
  } catch (error) {
    console.error('Failed to parse .access.yml:', error);
    return null;
  }
}

export async function checkAccess(
  userId: string,
  safetyCode: string
): Promise<boolean> {
  const supabase = createClient(/* ... */);

  const { data, error } = await supabase
    .from('safety_acknowledgments')
    .select('*')
    .eq('user_id', userId)
    .eq('safety_code', safetyCode)
    .single();

  return !!data && !error;
}
```

---

## API Endpoints

### POST `/api/safety/acknowledge`

**Description:** Log user acknowledgment of safety protocol

**Authentication:** Required

**Request:**
```json
{
  "safety_code": "plasma_safety_v1.3"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "acknowledgment": {
    "safety_code": "plasma_safety_v1.3",
    "acknowledged_at": "2025-11-05T16:00:00Z"
  }
}
```

**Implementation:**
```ts
// src/pages/api/safety/acknowledge.ts
export async function POST({ request, locals }) {
  const session = locals.session;
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { safety_code } = await request.json();

  if (!safety_code || typeof safety_code !== 'string') {
    return new Response('Invalid safety_code', { status: 400 });
  }

  const supabase = createClient(/* ... */);

  const { error } = await supabase
    .from('safety_acknowledgments')
    .insert({
      user_id: session.user.id,
      safety_code,
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
    });

  if (error && error.code !== '23505') {
    // 23505 = unique violation (already acknowledged)
    console.error('Failed to log acknowledgment:', error);
    return new Response('Failed to save', { status: 500 });
  }

  return new Response(JSON.stringify({
    success: true,
    acknowledgment: {
      safety_code,
      acknowledged_at: new Date().toISOString(),
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

### GET `/api/safety/check/:safety_code`

**Description:** Check if current user has acknowledged a safety protocol

**Authentication:** Required

**Response (200 OK - Acknowledged):**
```json
{
  "acknowledged": true,
  "safety_code": "plasma_safety_v1.3",
  "acknowledged_at": "2025-11-05T10:30:00Z"
}
```

**Response (200 OK - Not Acknowledged):**
```json
{
  "acknowledged": false,
  "safety_code": "plasma_safety_v1.3"
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Create project with `.access.yml` (gated: true)
- [ ] Access project while not logged in → redirect to login
- [ ] Login → redirect to safety gate
- [ ] Safety modal displays with correct info
- [ ] "View Safety Protocol" link works
- [ ] Cannot click "Agree" until checkbox checked
- [ ] Click "Agree" → acknowledgment saved to database
- [ ] Redirect to original content URL
- [ ] Access same project again → no modal (already acknowledged)
- [ ] Access different gated project → new modal for different code
- [ ] Test stream-level gating overrides project-level

### Automated Tests

```ts
// tests/safety.test.ts
import { expect, test } from 'vitest';
import { checkAccess } from '../src/lib/safety';

test('checkAccess returns false for new user', async () => {
  const hasAccess = await checkAccess('user-123', 'plasma_safety_v1.3');
  expect(hasAccess).toBe(false);
});

test('checkAccess returns true after acknowledgment', async () => {
  // Insert acknowledgment
  await supabase.from('safety_acknowledgments').insert({
    user_id: 'user-123',
    safety_code: 'plasma_safety_v1.3',
  });

  const hasAccess = await checkAccess('user-123', 'plasma_safety_v1.3');
  expect(hasAccess).toBe(true);
});
```

---

## Performance Considerations

### Caching `.access.yml`

**Problem:** Fetching `.access.yml` from GitHub on every request is slow

**Solution:** Cache in Supabase during webhook sync

```sql
-- Add column to project_cache
alter table project_cache add column access_config jsonb;

-- Store parsed .access.yml in this column
```

**Benefits:**
- No GitHub API call on every request
- Faster middleware execution
- Still invalidated via webhook when `.access.yml` changes

---

## GitHub OAuth Privacy & Security Considerations

### Overview

In addition to content safety gating, the workspace system requires GitHub OAuth access to manage users' workspace repositories. This section documents the privacy implications and security considerations.

### Current OAuth Scope

**Requested Permissions:**
```typescript
scope: 'repo read:user'
```

**What this grants:**
- `repo` - Full read/write access to **ALL repositories** (public and private)
- `read:user` - Read-only access to user profile information

### What We Actually Use vs What We CAN Access

| Access Level | What We CAN Do (Granted) | What We ACTUALLY Do (Code) |
|--------------|--------------------------|----------------------------|
| **Repository Access** | Read/write ALL user repos | Only access the single workspace repo created from template |
| **Code Access** | Read code from any private repo | Never read code from other repos |
| **Write Access** | Push code to any repo | Only write to workspace repo (main/draft branches) |
| **Delete Access** | Delete any user repo | Never delete any repos |
| **User Profile** | Read user email, username | Only read username for repo setup |

### Developer Access to User Data

**⚠️ Important Privacy Consideration:**

As the application owner, you (Ali) **CAN** access user GitHub data because:

1. **Database Access**: You have the Supabase service role key
   - Can query `user_repos` table
   - Can retrieve encrypted tokens

2. **Encryption Key**: You have `GITHUB_TOKEN_ENCRYPTION_KEY`
   - Can decrypt any stored GitHub token
   - Can use that token to access user's GitHub account

3. **Technical Capability**: With a decrypted token, you could:
   - Read code from user's private repos
   - Push/delete files in any repo
   - Create/delete repositories
   - Access sensitive data

**Current Trust Model:**
- Users must trust you (the developer) not to abuse access
- Code is transparent (users can audit)
- No actual code accesses non-workspace repos
- Encrypted tokens are never logged or exposed

### Privacy Risks for Users

**Scenario 1: Software Engineer User**
- Has private repo: `super-secret-startup-code`
- Connects GitHub to use workspace
- **Risk**: Developer could technically access their startup code

**Scenario 2: User with Sensitive Data**
- Has private repos with credentials, API keys, personal notes
- Just wants a workspace for public writing
- **Risk**: Developer has access to all of it

### Why We Need `repo` Scope

The workspace system requires `repo` access to:
1. ✅ **Fork the template** - Create workspace repo in user's account
2. ✅ **Manage branches** - Create and switch between `main` and `draft`
3. ✅ **Read/write content** - Manage workspace files via GitHub API
4. ✅ **Setup webhooks** (future) - Auto-sync cache when user pushes changes

### Alternative Approaches (Future Improvements)

#### Option 1: GitHub Apps (RECOMMENDED for Public Service)

**Advantages:**
- ✅ Users grant access to **specific repositories only**
- ✅ User selects "workspace-by-ali" repo only during OAuth
- ✅ No access to other repos
- ✅ Fine-grained permissions (read-only, write-only, etc.)
- ✅ Better security model for multi-user service

**Implementation:**
- Create GitHub App instead of OAuth App
- Request repository access during installation
- User explicitly selects which repos to grant access to

**Example:** Vercel, Netlify, and other services use this model

#### Option 2: Fine-Grained Personal Access Tokens

**Advantages:**
- ✅ User creates token scoped to specific repos only
- ✅ Can limit to only the workspace repo
- ✅ User has full control over permissions

**Disadvantages:**
- ❌ Manual setup (less user-friendly)
- ❌ User must generate and paste token
- ❌ More friction in onboarding

#### Option 3: Public Repos Only (`public_repo` scope)

**Change scope to:**
```typescript
scope: 'public_repo read:user'
```

**Advantages:**
- ✅ Can only access public repositories
- ✅ Less privacy concern
- ✅ User's other private repos are safe

**Disadvantages:**
- ❌ User's workspace MUST be public
- ❌ Cannot support private workspaces
- ❌ Users might want private drafts

#### Option 4: No Token Storage (GitHub Actions)

**Alternative Architecture:**
- Don't store GitHub tokens in database
- Use GitHub Actions in user's repo
- User pushes changes directly via Git
- Webhooks notify app of changes

**Advantages:**
- ✅ No stored tokens to compromise
- ✅ Developer has no GitHub access
- ✅ Better security model

**Disadvantages:**
- ❌ Cannot auto-fork template
- ❌ Cannot create branches programmatically
- ❌ More manual setup required

### Current Implementation Status

**Development Phase (Current):**
- ✅ Using OAuth with `repo` scope
- ✅ Storing encrypted tokens
- ✅ Code is transparent and auditable
- ✅ Only developer (Ali) uses the system
- ⚠️ Not recommended for public multi-user service yet

**Pre-Public Launch (Recommended Changes):**
1. **Switch to GitHub App** for repository-specific access
2. **Add Privacy Policy** explaining what access is requested and why
3. **Add Terms of Service** disclaiming liability
4. **Open source the codebase** for transparency
5. **Consider token encryption rotation** for added security

### Privacy Policy Recommendations

When launching publicly, include clear statements:

```markdown
## GitHub Access & Privacy

### What We Access
- Your GitHub username and email
- Your workspace repository (created from our template)
- Read/write access to workspace branches (main/draft)

### What We DON'T Access
- Code from your other repositories
- Your private repos (unless they are your workspace)
- Any data outside your workspace repo

### Why We Need Access
- To create your workspace repository
- To manage draft/publish workflow
- To sync content updates

### Your Data Security
- GitHub tokens are encrypted (AES-256-GCM)
- Tokens are never logged or exposed
- You can revoke access anytime at: github.com/settings/applications
- We never access repos other than your workspace

### Data Retention
- GitHub tokens stored until you disconnect GitHub
- You can delete your account anytime
- All data is deleted within 30 days of account deletion
```

### Security Best Practices

**For Production Deployment:**

1. **Environment Security:**
   - ✅ Rotate `GITHUB_TOKEN_ENCRYPTION_KEY` periodically
   - ✅ Use different OAuth apps for dev/staging/prod
   - ✅ Never commit `.env` to version control
   - ✅ Use Vercel environment variables for production

2. **Access Control:**
   - ✅ Limit Supabase service role key access
   - ✅ Use RLS policies to prevent cross-user data access
   - ✅ Audit database queries regularly

3. **Monitoring:**
   - ✅ Log all GitHub API calls
   - ✅ Alert on unusual access patterns
   - ✅ Monitor token usage

4. **User Controls:**
   - ✅ Provide "Disconnect GitHub" button
   - ✅ Show users what repos are accessed
   - ✅ Allow users to delete all data

### Transparency Checklist

Before public launch:
- [ ] Document all GitHub API calls made by the app
- [ ] Create privacy policy explaining data access
- [ ] Add "What we access" section to onboarding
- [ ] Open source the codebase for auditing
- [ ] Provide clear instructions for revoking access
- [ ] Consider switching to GitHub App model
- [ ] Add user data export functionality
- [ ] Implement account deletion

### Migration Path: OAuth → GitHub App

**Phase 1 (Current):** OAuth with `repo` scope
- For personal use and early testing
- Trust-based model

**Phase 2 (Pre-Launch):** GitHub App
- Create GitHub App in GitHub settings
- Request repository access during installation
- Allow users to select workspace repo only
- More granular permissions

**Phase 3 (Mature):** Zero-Token Model
- Explore GitHub Actions-based workflow
- No token storage required
- Maximum privacy

### Related Security Documentation

- [03_Authentication_Security.md](03_Authentication_Security.md) - Supabase auth security
- [06_Supabase_Caching_Strategy.md](06_Supabase_Caching_Strategy.md) - RLS policies
- [tokenEncryption.ts](../../src/lib/tokenEncryption.ts) - Token encryption implementation

---

## Future Enhancements (Phase 2+)

### 1. Safety Quizzes

Instead of simple checkbox, require users to answer questions:

```yaml
# .access.yml
gated: true
required_acknowledgment: "plasma_safety_v1.3"
quiz_required: true
quiz:
  - question: "What is the minimum safe distance from active plasma?"
    options: ["5cm", "10cm", "20cm", "50cm"]
    correct: 2  # Index of correct answer
  - question: "What should you do if you smell ozone?"
    options: ["Ignore it", "Ventilate the area", "Keep working"]
    correct: 1
```

### 2. Expiration & Re-Acknowledgment

Require users to re-acknowledge after a certain period:

```sql
alter table safety_acknowledgments add column expires_at timestamp;

-- Expire after 1 year
update safety_acknowledgments
set expires_at = acknowledged_at + interval '1 year';
```

### 3. Version Upgrades

When safety protocol is updated, require re-acknowledgment:

```ts
// Check if user has acknowledged LATEST version
const latestVersion = 'plasma_safety_v2.0';
const { data } = await supabase
  .from('safety_acknowledgments')
  .select('*')
  .eq('user_id', userId)
  .eq('safety_code', latestVersion) // Must be exact version
  .single();
```

### 4. Change Log Highlighting

Show users what changed since their last acknowledgment:

```markdown
# Plasma Safety Basics (v2.0)

## ⚠️ Changes Since v1.3
- **NEW:** Added requirement for grounded workbench
- **UPDATED:** Increased minimum safe distance to 30cm
- **REMOVED:** Alternative glove option (only 50kV+ rated gloves allowed)
```

### 5. Role-Based Access

Restrict certain content to vetted collaborators:

```yaml
gated: true
required_acknowledgment: "advanced_chemistry_v1.0"
allowed_roles:
  - vetted_chemist
  - lab_member
```

---

## Legal Disclaimer Template

**Recommended disclaimer for safety docs:**

```markdown
## Legal Disclaimer

**This safety protocol is provided for educational purposes only.**

By acknowledging this protocol, you agree:
- You are solely responsible for your own safety
- The author(s) of this content assume no liability for injuries or damages
- You will not attempt any procedures unless you have proper training and equipment
- You understand that replicating experiments carries inherent risks
- You will comply with all local laws and regulations

If you do not agree with these terms, **do not proceed**.
```

---

## Summary

| Component | Status | Implementation |
|-----------|--------|----------------|
| `.access.yml` parsing | ⏳ Phase 1 | `src/lib/safety.ts` |
| Safety modal | ⏳ Phase 1 | `src/components/SafetyModal.tsx` |
| Middleware gating | ⏳ Phase 1 | `src/middleware.ts` |
| Database logging | ⏳ Phase 1 | Supabase table + API |
| Safety documentation | ⏳ Phase 1 | `public/docs/safety/*.md` |
| Quizzes | 🔮 Phase 2+ | Future enhancement |
| Expiration | 🔮 Phase 2+ | Future enhancement |

**MVP Approach:**
- Simple modal with link to docs + checkbox
- One-time acknowledgment (no expiration)
- No quiz (Phase 2+)
- Logged in database for records

---

## Related Documentation

- [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Safety UX decisions
- [08_content_structure_and_branch_workflow.md](../new/08_content_structure_and_branch_workflow.md) - Gating logic overview
- [Data_Structures.md](../reference/Data_Structures.md) - `.access.yml` schema
- [API_Endpoints.md](../reference/API_Endpoints.md) - Safety API specs

---

**Author:** Claude + Ali + Lumen
**Version:** 1.0
**Last Updated:** November 5, 2025
