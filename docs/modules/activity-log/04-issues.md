# GitHub Issues - Modul Activity Log

## ISSUE #1: Database Schema

**Title**: Create activity_log Table dan Triggers

**Labels**: `database`, `schema`, `medium-priority`

**Acceptance Criteria**:
- [ ] Tabel activity_log
- [ ] Function log_activity()
- [ ] Trigger examples for RTL status change
- [ ] RLS policies

**Estimate**: 3 jam

---

## ISSUE #2: Activity Log Service

**Title**: ActivityLogService dengan Log Methods

**Labels**: `api`, `service`, `medium-priority`

**Acceptance Criteria**:
- [ ] ActivityLogService.log(data)
- [ ] ActivityLogService.getAll(filters)
- [ ] ActivityLogService.getByResource(type, id)
- [ ] ActivityLogService.getRecentActivity(limit)

**Estimate**: 3 jam

---

## ISSUE #3: Auto-logging Middleware

**Title**: Middleware untuk Auto-log CRUD Operations

**Labels**: `backend`, `middleware`, `high-priority`

**Acceptance Criteria**:
- [ ] createActivityLogger() helper
- [ ] Integrate dengan service methods
- [ ] Capture IP & User Agent
- [ ] Log format consistency

**Estimate**: 4 jam

---

## ISSUE #4: Activity Log Page

**Title**: Activity Log Page dengan Filter

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Activity log list page
- [ ] Filter: user, action, module, date
- [ ] Log detail modal
- [ ] Pagination
- [ ] Export to CSV

**Estimate**: 5 jam

---

## ISSUE #5: Resource History Component

**Title**: Activity Timeline Component untuk Detail Pages

**Labels**: `frontend`, `ui`, `component`, `medium-priority`

**Acceptance Criteria**:
- [ ] Timeline component (vertical)
- [ ] Display in Temuan/RTL/Sesi detail
- [ ] Icon per action type
- [ ] Collapse/expand details

**Estimate**: 4 jam

---

## ISSUE #6: Recent Activity Widget

**Title**: Recent Activity Widget untuk Dashboard

**Labels**: `frontend`, `ui`, `low-priority`

**Estimate**: 2 jam

---

## ISSUE #7: Documentation

**Title**: Activity Log Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 22 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
