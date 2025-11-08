What's Already Documented
1. Streams vs Projects (WELL DEFINED ✅)
From the architecture docs: PROJECTS = Top-level containers
Example: "ArcUp Plasma Research"
Has: name, description, category, visibility (public/private)
Owner: Single user (in Phase 1)
Think of it like a GitHub repository
STREAMS = Thematic branches WITHIN a project
Example: "Biology Stream", "Hardware Stream", "Soil Stream" within ArcUp
Has: name, description, schema rules, safety protocols
Purpose: Organize different types of work within the same project
Think of it like folders/workflows within a repo
Current Implementation Status:
✅ Projects: Fully implemented (CRUD APIs, UI, detail pages)
❌ Streams: NOT implemented yet (in Phase 1 tasklist as next priority)
2. Public UX Model (PARTIALLY DEFINED 🟡)
What IS documented:
Public visibility exists in the database:
Projects can be public or private
Users have an is_public profile flag
RLS policies allow non-authenticated users to read public projects
Planned: Public profile pages at /[username] showing public projects and updates
Current middleware protection:
Protected (requires login): /, /projects, /api/projects, /api/streams, /api/submissions
Not protected: Everything else (including /updates, public profiles)
What is NOT documented (YOUR NEW CONCEPT):
"Browse without login, login for specific actions":
No explicit design for anonymous visitor landing page
No flow for "you need to login to do X"
No design for when/why login is required beyond "to create content"
Your specific idea: Login required for:
Git integration
Safety-gated content (high voltage projects)
3. Multi-User Collaboration (NOT PLANNED FOR PHASE 1 ❌)
Current State (Phase 1):
Single-user workspaces only
No concept of "joining someone else's project"
No project-level permissions
Future State (Phase 2+):
Commons Workspace with roles:
Admin: Full management
Reviewer: Review submissions
Contributor: Submit to streams
User: View approved content
Public: View published only
Submission workflow: Personal → Submit → Review → Publish → Commons (public)
What's MISSING (YOUR CONCEPT):
No "user joins Project A" membership model
No "invite user to collaborate on my project"
No "shared ownership" of projects
No "grant access to gated information based on project membership"
The "Commons" is a public verified workspace, NOT a "shared pool with access controls"
Gap Analysis: What Needs Design
Gap #1: Public Browsing UX
Decisions needed:
Landing page for anonymous visitors:
What do they see first?
Browse all public projects?
Featured projects?
Activity feed?
Login triggers:
When exactly is login required?
How is this communicated?
"Login to continue" modal vs inline messaging?
Public profile pages:
What info is visible? (projects, updates, bio, stats?)
Privacy controls for users?
Discoverability (search, browse)?
Safety-gated content:
How does this work for anonymous users?
"High voltage project - login required to view safety info"?
Or: Public can see project exists, but content is blurred/locked?
Gap #2: Multi-User Projects / Collaboration
Decisions needed:
Ownership model:
Single owner per project (current)?
OR: Multiple owners/collaborators?
OR: Team workspaces?
Access control model:
Project-level permissions (who can view/edit Project A)?
Stream-level permissions (access to specific streams within a project)?
Activity-level permissions (who can see/edit specific updates)?
Invitation/access flow:
Owner invites users?
Users request access?
Public "join request" button?
Permission levels:
Owner, Editor, Viewer?
OR: Commons-style Admin/Reviewer/Contributor?
Can permissions differ by stream?
Safety acknowledgments:
Per-user, per-stream?
"User X acknowledged high voltage safety for Stream Y"?
Required before accessing gated content?
Gap #3: "Commons" Concept Ambiguity
Current definition: "Verified public workspace" (like Wikipedia for research) Your implied definition: "Shared resource pool with access permissions" (like a data commons) Decisions needed:
Are these the same thing?
Is "Commons" = collaborative space, or "Commons" = public verified knowledge?
When you say "share data back to commons", do you mean:
A: Submit to public verified repository (current plan)
B: Contribute to a shared pool accessible to project members
Key Questions for You
To design these features, I need to understand your vision:
About Public UX:
What should anonymous visitors see when they land on the site?
Browse all public projects?
Landing page explaining the platform?
Featured projects/activity feed?
What can anonymous users do vs authenticated users?
Anonymous: View public projects/updates only?
Authenticated: Create, edit, access gated content?
When is login required?
To create anything?
To view safety-gated content?
To access git integration?
To comment/interact?
How do you want safety gating to work?
"High voltage project - login + acknowledge safety to view"?
"Public can see project exists, but details require safety ack"?
Is this project-level or stream-level?
About Multi-User Collaboration:
Do you want multi-user projects in Phase 1?
Or is this Phase 2+?
How urgent is this feature?
What's the collaboration model?
GitHub-style: Owner invites collaborators with roles
Google Docs-style: Share with anyone, permission levels
Commons-style: Admins manage reviewer/contributor roles
Something else?
What does "joining a project" mean?
Get view access to private projects?
Get edit access to contribute?
Get access to gated/safety content?
Get recognized as a contributor?
Is this about:
A: Multiple people working on the same personal project (like GitHub collab)
B: Community access to a Commons project (like Wikipedia editing)
C: Something hybrid?
Next Steps
Once you answer these questions, I can:
Design the UX flows:
Anonymous visitor → Browse → Login → Safety ack → Access
User A → Invite User B to Project → User B accepts → Permissions granted
Design the data model:
Project memberships table
Project roles/permissions
Safety acknowledgments per user/stream
Design the API endpoints:
/api/projects/[id]/members - Manage project members
/api/projects/[id]/invite - Send invitations
/api/streams/[id]/safety-ack - Acknowledge safety protocols
Update the documentation:
New architecture docs for collaboration model
Updated glossary with clear definitions
Phase 1 vs Phase 2 scope clarification
Create implementation plan:
Database migrations
API endpoints
UI components
Testing plan