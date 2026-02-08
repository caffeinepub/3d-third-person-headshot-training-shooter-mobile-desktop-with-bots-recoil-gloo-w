# Specification

## Summary
**Goal:** Upgrade the third-person shooter gameplay by adding real 3D characters with basic animations, multiple player weapons, enemy return fire with player health, and improved mobile HUD button spacing.

**Planned changes:**
- Replace player and enemy placeholder sphere meshes with lightweight, original 3D character models suitable for third-person gameplay, including at least idle and walk/run animations, while preserving separate head/body hit detection.
- Add at least two switchable player guns with distinct parameters (fire rate, max ammo/mag size, recoil intensity) and ensure shooting, reload behavior, and ammo UI reflect the selected weapon.
- Give enemies guns and implement return fire based on engagement range and line-of-sight, including player health that decreases on hits and is displayed via a dynamic HUD health bar.
- Increase spacing between on-screen action buttons (Fire, ADS, Jump, Crouch, Reload, Shield) to reduce mis-taps while keeping all buttons visible and reachable in landscape.

**User-visible outcome:** The game shows animated 3D characters for the player and enemies, the player can switch between different guns with different feel/ammo behavior, enemies shoot back and can damage the player with health reflected in the HUD, and mobile action buttons are more comfortably spaced.
