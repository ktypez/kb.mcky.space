---
title: 'COMP-001: Dashboard'
description: ''
original_frontmatter:
  type: component
  id: COMP-001
  project: clientdata
  last_updated: 2026-07-04T00:00:00.000Z
  status: active
  freshness: 2026-07-04T00:00:00.000Z
  verified: 2026-07-04T00:00:00.000Z
  expires: null
  superseded_by: null
  anchors:
    - /home/clientdata/app/page.tsx
  links:
    - type: relates-to
      target: DEC-001
    - type: relates-to
      target: TASK-001
    - type: relates-to
      target: LSN-001
    - type: relates-to
      target: RSK-001

---

# COMP-001: Dashboard

The main SPA dashboard — entry point for all client management workflows.

## Sub-components

- PageHeader (search, add, theme toggle)
- Sidebar (sheet drawer with collapsible groups)
- InlineMap (cluster map with geolocation)
- ClientDetail (client info panel, suggestions)
- ThemePresetPicker (14 presets dropdown)