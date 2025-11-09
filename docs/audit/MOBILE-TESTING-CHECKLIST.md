# Mobile Testing Checklist

**Created:** 2025-11-09
**Status:** Ready for Testing

---

## Overview

Phase 1 accessibility improvements include mobile navigation, focus indicators, and responsive layouts. This checklist guides manual testing on real devices.

---

## Test Devices

### Required
- **iOS Safari** (iPhone 12 or newer, iOS 15+)
- **Android Chrome** (Samsung/Pixel, Android 11+)

### Optional
- **iOS Safari** (iPad)
- **Android Chrome** (Tablet)

---

## 1. Mobile Navigation Tests

### Hamburger Menu
- [ ] **Open menu** - Tap hamburger icon in top-right
- [ ] **Drawer slides in** - Smooth animation from left
- [ ] **Backdrop visible** - Semi-transparent overlay appears
- [ ] **Close with X** - Tap X button in drawer header
- [ ] **Close with backdrop** - Tap outside drawer on overlay
- [ ] **Body scroll locked** - Cannot scroll page when drawer is open
- [ ] **Navigation works** - Tap each link, verify navigation
- [ ] **Auto-close** - Drawer closes after navigating

### Touch Targets
- [ ] **Minimum size** - All buttons/links at least 44×44px
- [ ] **Easy to tap** - No accidental taps on adjacent items
- [ ] **Visual feedback** - Buttons show active state when tapped

### Swipe Gestures
- [ ] **No conflict** - Drawer doesn't interfere with page swipes
- [ ] **Smooth scrolling** - Drawer content scrolls smoothly

---

## 2. Focus Indicators

### Keyboard Navigation (External Keyboard)
- [ ] **Visible focus** - 3px green outline on focused elements
- [ ] **Tab navigation** - Can tab through all interactive elements
- [ ] **Focus trap** - Focus stays within open drawer
- [ ] **Focus restoration** - Focus returns to hamburger when drawer closes

### Screen Reader (VoiceOver/TalkBack)
- [ ] **Drawer announced** - "Navigation menu, dialog"
- [ ] **Aria-modal** - Screen reader knows it's a modal
- [ ] **Close button** - Announced as "Close navigation menu"
- [ ] **Nav items** - Each link properly announced
- [ ] **Current page** - Active page marked with aria-current

---

## 3. Form Accessibility

### FormInput Component
- [ ] **Error messages** - Screen reader announces errors
- [ ] **Hint text** - Helper text properly associated
- [ ] **Character counter** - Updates announced to screen reader
- [ ] **Focus states** - Red outline on error fields

### Input Fields
- [ ] **Labels** - All inputs have visible labels
- [ ] **Placeholder** - Placeholder doesn't replace labels
- [ ] **Auto-zoom** - iOS doesn't zoom on focus (font-size ≥ 16px)

---

## 4. Loading States

### Workbench Page
- [ ] **Skeleton loaders** - Show while loading (if applicable)
- [ ] **Screen reader** - "Loading..." announced
- [ ] **Smooth transition** - No layout shift when content loads

### Projects Page
- [ ] **Skeleton cards** - Show during initial load
- [ ] **Results counter** - Updates with filtering
- [ ] **No results** - "No projects found" state displays correctly
- [ ] **Filter feedback** - Screen reader announces result changes

---

## 5. Viewport Scaling

### Responsive Breakpoints
- [ ] **320px** - Content fits without horizontal scroll
- [ ] **375px** - iPhone SE/8 layout
- [ ] **390px** - iPhone 12/13 layout
- [ ] **414px** - iPhone Plus layout
- [ ] **768px** - iPad portrait layout
- [ ] **1024px** - iPad landscape layout

### Zoom Levels
- [ ] **100%** - Default zoom looks correct
- [ ] **200%** - Content still usable at 200% zoom
- [ ] **Pinch zoom** - Can pinch to zoom on text

---

## 6. Touch Interactions

### Buttons
- [ ] **Single tap** - Buttons respond to single tap
- [ ] **No double-tap** - Doesn't require double-tap
- [ ] **Active state** - Shows visual feedback on touch
- [ ] **Debounced** - Doesn't trigger multiple times

### Links
- [ ] **Tap area** - Easy to tap without zooming
- [ ] **External links** - Open in new tab/app correctly
- [ ] **Long press** - Context menu works (copy link, etc.)

---

## 7. Orientation Changes

### Portrait → Landscape
- [ ] **Layout adjusts** - No broken layouts
- [ ] **Drawer closes** - Mobile drawer closes on rotation
- [ ] **Content visible** - All content accessible
- [ ] **No overlap** - UI elements don't overlap

### Landscape → Portrait
- [ ] **Layout reflows** - Returns to portrait layout
- [ ] **State preserved** - Form data/scroll position preserved

---

## 8. Performance

### Load Time
- [ ] **First paint** - < 1 second
- [ ] **Interactive** - < 2 seconds
- [ ] **Smooth animations** - 60fps drawer animation

### Scroll Performance
- [ ] **Smooth scrolling** - No jank or stuttering
- [ ] **Drawer scroll** - Drawer content scrolls smoothly
- [ ] **Fixed elements** - Header stays fixed correctly

---

## 9. Dark Mode

### Theme Toggle
- [ ] **Toggle works** - Theme changes on tap
- [ ] **Drawer adapts** - Drawer colors update correctly
- [ ] **Focus visible** - Green outline visible in dark mode
- [ ] **Contrast** - All text readable (WCAG AA)

### System Preference
- [ ] **Respects system** - Matches iOS/Android dark mode setting
- [ ] **Smooth transition** - No flash of wrong theme

---

## 10. Edge Cases

### Network Issues
- [ ] **Slow 3G** - Loading states show correctly
- [ ] **Offline** - Appropriate error messages
- [ ] **Timeout** - Doesn't hang indefinitely

### Interruptions
- [ ] **Phone call** - App state preserved
- [ ] **Notification** - Doesn't break interaction
- [ ] **App switcher** - Returns to correct state

### Multitasking
- [ ] **Split view** (iPad) - Layout adapts correctly
- [ ] **Picture-in-picture** - Doesn't conflict

---

## Issue Reporting Template

If you find an issue, report it with:

```markdown
**Device:** iPhone 13, iOS 16.2
**Browser:** Safari
**Issue:** Hamburger menu doesn't close when tapping backdrop
**Steps:**
1. Open mobile menu
2. Tap outside drawer on overlay
3. Expected: Menu closes
4. Actual: Menu stays open

**Screenshot:** [attach screenshot]
```

---

## Testing Notes

### iOS Safari Specific
- Test with default Safari (not Chrome on iOS - it's the same engine)
- Check for zoom issues on input focus
- Verify safe area insets (notch devices)

### Android Chrome Specific
- Test address bar hide/show behavior
- Check bottom navigation bar spacing
- Verify hardware back button behavior

---

## Success Criteria

✅ **PASS:** All critical items checked (hamburger menu, touch targets, screen reader)
⚠️ **PARTIAL:** Minor issues but usable (small visual bugs)
❌ **FAIL:** Major functionality broken (can't navigate, crashes)

---

**Ready for Testing!** Report any issues in [GitHub Issues](https://github.com/your-repo/issues) with the "mobile" label.
