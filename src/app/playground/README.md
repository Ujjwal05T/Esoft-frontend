# 🎨 Component Playground

An interactive testing environment for all your UI components.

## Access

Navigate to: **`http://localhost:3000/playground`**

## Features

### 🎛️ Interactive Controls
- **Toggle Sidebar**: Show/hide the sidebar to test layouts
- **Adjust Data Values**: Change vehicle counts, inquiry numbers, job counts in real-time
- **Live Preview**: See changes instantly

### 📦 Component Testing

#### Status Cards
- Test with different data values
- Try different color schemes
- See responsive behavior

#### Action Cards
- Add Vehicle Card
- Raise Parts Card

#### Jobs Card
- Test with different job counts (0, 5, 99+)

#### Grid Layouts
- 2-column grids
- 3-column grids (desktop)
- 4-column grids (desktop)
- Responsive behavior testing

### 👥 Role-Based Examples

Pre-configured dashboard examples for different roles:

1. **Staff Dashboard** 🛠️
   - Focused on individual tasks
   - Personal vehicle assignments
   - Limited data scope

2. **Manager Dashboard** 📊
   - Team overview
   - Multiple metrics
   - Broader data scope

3. **Admin Dashboard** ⚙️
   - System-wide statistics
   - User management metrics
   - Health monitoring

## Use Cases

### Testing Different Data Scenarios
```
✅ Empty states (0 vehicles, 0 jobs)
✅ Normal load (5-10 items)
✅ Heavy load (50+ items)
✅ Edge cases (999+)
```

### Testing Layouts
```
✅ Mobile view (< 768px)
✅ Tablet view (768px - 1024px)
✅ Desktop view (> 1024px)
✅ With/without sidebar
```

### Testing Role Variations
```
✅ Staff role components
✅ Manager role components (preview)
✅ Admin role components (preview)
```

## How to Use

1. **Open the playground**: Navigate to `/playground`
2. **Adjust controls**: Use the top control panel to modify data
3. **Toggle sidebar**: Test with/without navigation
4. **Resize browser**: Test responsive behavior
5. **Scroll through sections**: See different component variations
6. **Copy patterns**: Use the examples as templates for your pages

## Tips

- 💡 **Resize your browser** to test responsive breakpoints
- 💡 **Use browser DevTools** to inspect component styles
- 💡 **Copy grid patterns** from the examples for your role-specific pages
- 💡 **Test edge cases** like very large numbers or zero values
- 💡 **Compare role examples** to plan different dashboard layouts

## Adding New Components

To add a new component to the playground:

1. Import the component at the top
2. Add a new section with examples
3. Include different variations and states
4. Document the use case

Example:
```tsx
<section className="mb-12">
  <h2 className="text-2xl font-black mb-4 text-[#171717]">
    Your Component
  </h2>
  <YourComponent prop1="value1" />
  <YourComponent prop1="value2" />
</section>
```

## Component Variations Tested

- ✅ StatusCard (multiple colors, data formats)
- ✅ AddVehicleCard
- ✅ RaisePartsCard
- ✅ JobsCard (0, normal, high counts)
- ✅ Sidebar (show/hide)
- ✅ Header
- ✅ NavigationBar

## Future Enhancements

- [ ] Add more component variations
- [ ] Theme switcher (light/dark)
- [ ] Export component code snippets
- [ ] Save/load configurations
- [ ] Screenshot capture
- [ ] Component performance metrics
