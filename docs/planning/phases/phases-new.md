## 🎯 High-Level Implementation Phases (Updated)

Based on your preferences:

- Mock auth first
- REST polling before WebSocket
- Detailed DynamoDB modeling needed
- E2E tests with Vitest
- Voice/video out of scope

---

### **Phase 0: Foundation & Data Modeling** ⚙️

_Prerequisites for any feature work_

**Infrastructure:**

- Set up pnpm monorepo with workspaces (`packages/frontend`, `packages/core`, `packages/functions`)
- Initialize SST project with AWS configuration
- Set up local DynamoDB with Docker Compose + Admin UI
- **Detailed DynamoDB single-table design session** (entities, access patterns, GSIs)

**Frontend Scaffold:**

- Vite + React + TypeScript setup
- Tailwind CSS configuration
- React Query + Zustand setup
- Basic routing structure (React Router)

**Testing Setup:**

- Vitest configuration for unit tests
- E2E testing framework setup (Playwright or Cypress?)

**Deliverable:** `pnpm dev` runs locally, DynamoDB schema documented, testing framework ready

---

### **Phase 1: Auth & Basic User Profile** 🔐

_User Stories: #1, #2, #3_

**Backend:**

- Mock authentication system (JWT tokens with hardcoded users)
- User CRUD operations
- Lambda handlers: `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`

**Frontend:**

- Login/signup forms
- Auth state management (Zustand + localStorage)
- Protected routes
- Basic profile display (username, default avatar)

**Tests:**

- E2E: Sign up → Log in → View profile → Log out

**Deliverable:** Users can sign up, log in, and see their profile

---

### **Phase 2: Servers & Channels (Structure Only)** 🏗️

_User Stories: #4, #6, #7, #8_

**Backend:**

- Server CRUD operations (create, list user's servers)
- Channel CRUD operations (create, list server's channels)
- Membership tracking in DynamoDB
- Lambda handlers for all server/channel operations

**Frontend:**

- Server sidebar (list of servers)
- Channel list within selected server
- Create server modal
- Create channel modal
- Navigation between servers/channels
- Empty state when no messages

**Tests:**

- E2E: Create server → Create channel → Navigate between servers/channels

**Deliverable:** Users can create servers/channels and navigate between them (no messaging yet)

---

### **Phase 3: Basic Messaging (REST with Polling)** 💬

_User Stories: #9, #11, #12_

**Backend:**

- Message storage in DynamoDB
- Lambda handlers:
  - `POST /channels/:id/messages` (send message)
  - `GET /channels/:id/messages` (get history with pagination)
- Message metadata: userId, username, content, timestamp

**Frontend:**

- Message list component (displays history)
- Message input component
- Send message via REST API
- Display sender info + timestamp
- **Polling mechanism** (query every 2-3 seconds for new messages)
- Auto-scroll to latest message

**Tests:**

- E2E: Send message → See message appear → Refresh → Message persists

**Deliverable:** Users can send/view messages with polling (temporary until WebSocket)

---

### **Phase 4: Real-time Messaging (WebSocket Upgrade)** ⚡

_User Stories: #10_

**Backend:**

- WebSocket API Gateway setup
- Connection management (store connectionId in DynamoDB)
- Lambda handlers:
  - `$connect` (register connection with userId + channelId)
  - `$disconnect` (cleanup connection)
  - `sendMessage` (broadcast to all connections in channel)
- Modify REST POST to also broadcast via WebSocket

**Frontend:**

- WebSocket connection management (reconnect logic)
- Subscribe to channel on mount
- Listen for new messages via WebSocket
- **Remove polling**, use WebSocket events
- Handle connection states (connecting, connected, disconnected)

**Tests:**

- E2E: Open two browser windows → Send message in one → Appears in other instantly

**Deliverable:** Messages appear in real-time without polling

---

### **Phase 5: Server Invites & Online Presence** 👥

_User Stories: #5, #13_

**Backend:**

- Invite link generation (unique codes, optional expiry)
- `POST /servers/:id/invites` (create invite)
- `POST /invites/:code/join` (join via invite, add to server members)
- Presence tracking via WebSocket connections (GSI query)
- Heartbeat mechanism to keep presence updated

**Frontend:**

- "Invite People" button → generates shareable link
- Copy invite link to clipboard
- Join server via invite page (`/invite/:code`)
- Online user list in server sidebar
- Green/gray dot indicator for online/offline users

**Tests:**

- E2E: Create invite → Open in new session → Join server → See online status update

**Deliverable:** Users can invite others and see who's online

---

### **Phase 6: Message Management** ✏️

_User Stories: #14, #15_

**Backend:**

- `PATCH /messages/:id` (edit message - verify ownership)
- `DELETE /messages/:id` (soft delete with tombstone or hard delete)
- Broadcast edits/deletes via WebSocket to all channel members

**Frontend:**

- Edit button on own messages (show on hover)
- Delete button on own messages (show on hover)
- Inline editing or modal
- Show "(edited)" timestamp indicator
- Show deleted message placeholder: "_Message deleted_"

**Tests:**

- E2E: Send message → Edit → Verify change → Delete → Verify removal

**Deliverable:** Users can edit/delete their own messages

---

### **Phase 7: Typing Indicators & Reactions** 😊

_User Stories: #16, #17_

**Backend:**

- WebSocket event: `typing` (broadcast userId to channel, no DB persistence)
- Reactions stored in DynamoDB (as message attribute array)
- `POST /messages/:id/reactions` (add reaction)
- `DELETE /messages/:id/reactions/:emoji` (remove reaction)
- Broadcast reaction changes via WebSocket

**Frontend:**

- Detect typing in message input (debounced, send every 1-2s while typing)
- Send typing event via WebSocket
- Display "Username is typing..." indicator (disappear after 3s)
- Emoji picker component for reactions
- Display reaction counts below messages (clickable to toggle)

**Tests:**

- E2E: Type in one window → See typing indicator in other → Add reaction → See count update

**Deliverable:** Live typing indicators and emoji reactions

---

### **Phase 8: Server Management** 🛠️

_User Stories: #18, #19, #20_

**Backend:**

- Track server owner in DynamoDB (ownerId field)
- `DELETE /channels/:id` (verify requester is server owner)
- `DELETE /servers/:serverId/members/:userId` (leave server - can't leave if owner)
- Cleanup: remove user from presence, memberships

**Frontend:**

- Show "Owner" badge in member list
- Delete channel option (visible only to owners)
- "Leave Server" button in server settings
- Confirmation modals for destructive actions
- Transfer ownership UI (optional - or prevent owner from leaving)

**Tests:**

- E2E: Create server → Create channel → Delete channel → Leave server

**Deliverable:** Server owners can manage servers, users can leave

---

### **Phase 9: Avatar Upload & Profile** 🖼️

_User Stories: #21_

**Backend:**

- S3 bucket configuration (CORS, public read)
- Presigned URL generation for uploads
- `POST /users/avatar/upload-url` (returns presigned S3 URL)
- `PATCH /users/me` (update avatarUrl after upload)

**Frontend:**

- Avatar upload component (file picker)
- Image preview before upload
- Upload to S3 via presigned URL
- Update user profile with new avatarUrl
- Display avatars everywhere: messages, member list, profile, typing indicators

**Tests:**

- E2E: Upload avatar → See in profile → Send message → Avatar appears in message

**Deliverable:** Users can upload custom avatars visible across the app

---

### **Phase 10: UX Polish** ✨

_User Stories: #22, #23_

**Backend:**

- Track last read message per user/channel (DynamoDB attribute)
- `POST /channels/:id/read` (mark as read)
- `GET /channels/:id/messages/search?q=query` (DynamoDB scan or filter)
- Unread count calculation (messages after lastReadMessageId)

**Frontend:**

- Unread badge on channels (red dot or count)
- Mark channel as read on view/scroll to bottom
- Search bar in channel header
- Search results UI with highlighting
- Loading states (skeletons)
- Error boundaries for graceful failures
- Smooth animations (Framer Motion?)
- Toast notifications for errors/success

**Tests:**

- E2E: Receive message in background channel → See unread badge → Open → Badge clears
- E2E: Search for keyword → Results appear

**Deliverable:** Polished UX with search and unread tracking

---

## 📊 Summary Table

| Phase | Focus Area                 | User Stories   | Estimated Effort |
| ----- | -------------------------- | -------------- | ---------------- |
| 0     | Foundation + Data Modeling | Setup          | 2-3 days         |
| 1     | Authentication             | #1, #2, #3     | 1-2 days         |
| 2     | Servers & Channels         | #4, #6, #7, #8 | 2-3 days         |
| 3     | REST Messaging + Polling   | #9, #11, #12   | 2-3 days         |
| 4     | WebSocket Real-time        | #10            | 2-3 days         |
| 5     | Invites & Presence         | #5, #13        | 2-3 days         |
| 6     | Message Edit/Delete        | #14, #15       | 1-2 days         |
| 7     | Typing & Reactions         | #16, #17       | 2-3 days         |
| 8     | Server Management          | #18, #19, #20  | 1-2 days         |
| 9     | Avatar Upload              | #21            | 1-2 days         |
| 10    | UX Polish                  | #22, #23       | 2-4 days         |

**MVP (Phases 0-5):** ~2-3 weeks
**Full "Must Have + Should Have" (Phases 0-10):** ~4-5 weeks

---

## 🤔 Final Questions Before Detailed Planning

1. **DynamoDB Data Modeling Session:**
   - Should I create a detailed document showing all entities, access patterns, GSI designs, and example queries?
   - Or would you prefer to pair on this interactively?

2. **E2E Testing Preferences:**
   - Which E2E framework: **Playwright** (recommended, better DX) or **Cypress**?
   - Test coverage level: Critical paths only, or comprehensive?

3. **Phase 0 Depth:**
   - Should Phase 0 include basic CI/CD setup (GitHub Actions)?
   - Or focus purely on local dev environment?

4. **Starting Point:**
   - Ready to dive into **detailed Phase 0 plan** (step-by-step tasks)?
   - Or need more clarification on any phase above?

5. **Access Patterns Clarity:**
   - I should map out all DynamoDB access patterns based on user stories - would this be helpful to review before implementation?
   - Example: "Get all messages in channel X ordered by time" → Query pattern

**What would you like me to work on next?**

---
