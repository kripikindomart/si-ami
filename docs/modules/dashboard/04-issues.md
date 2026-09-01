# GitHub Issues - Modul Dashboard

## ISSUE #1: Database Views & Functions

**Title**: Create Dashboard Views dan Aggregate Functions

**Labels**: `database`, `view`, `medium-priority`

**Acceptance Criteria**:
- [ ] View v_dashboard_admin
- [ ] View v_temuan_by_unit
- [ ] Function get_dashboard_stats(periode_id)

**Estimate**: 3 jam

---

## ISSUE #2: Dashboard Service

**Title**: DashboardService dengan Aggregate Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] DashboardService.getAdminStats(periodeId?)
- [ ] DashboardService.getAuditorStats(userId)
- [ ] DashboardService.getPICStats(unitId)
- [ ] DashboardService.getTemuanByUnit(periodeId?)
- [ ] DashboardService.getUpcomingSesi(userId?, limit)
- [ ] DashboardService.getAlerts() - overdue, pending review

**Estimate**: 5 jam

---

## ISSUE #3: Dashboard Admin Page

**Title**: Dashboard Admin dengan Charts dan Stats

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Stats cards: Sesi, Temuan, RTL, Completion rate
- [ ] Alert section: Overdue, deadline soon, pending review
- [ ] Chart: Temuan by kategori (pie chart)
- [ ] Chart: RTL status distribution (bar chart)
- [ ] Table: Temuan by unit dengan quick stats
- [ ] Upcoming sesi audit list
- [ ] Period filter dropdown

**Estimate**: 8 jam

---

## ISSUE #4: Dashboard Auditor Page

**Title**: Dashboard Auditor dengan My Sesi List

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Stats cards: My sesi, Temuan input, Nilai positif input
- [ ] Upcoming sesi cards dengan detail
- [ ] Recent activity timeline
- [ ] Quick action buttons

**Estimate**: 5 jam

---

## ISSUE #5: Dashboard PIC Unit Page

**Title**: Dashboard PIC Unit dengan RTL Monitoring

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Stats cards: Temuan, RTL status, Next audit
- [ ] Alert: RTL overdue dengan quick action
- [ ] Temuan aktif table dengan status & deadline
- [ ] Quick action: Submit RTL, View detail

**Estimate**: 6 jam

---

## ISSUE #6: Chart Components

**Title**: Reusable Chart Components (Pie, Bar, Line)

**Labels**: `frontend`, `ui`, `component`, `medium-priority`

**Acceptance Criteria**:
- [ ] PieChart component (using recharts/chart.js)
- [ ] BarChart component
- [ ] LineChart component (for trend)
- [ ] Responsive design
- [ ] Loading state

**Estimate**: 4 jam

---

## ISSUE #7: Real-time Updates

**Title**: Real-time Dashboard Updates (Optional)

**Labels**: `frontend`, `realtime`, `low-priority`

**Acceptance Criteria**:
- [ ] Auto-refresh dashboard every 5 minutes
- [ ] Manual refresh button
- [ ] Notification badge on new alerts

**Estimate**: 3 jam

---

## ISSUE #8: Documentation

**Title**: Dashboard API Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 35 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
