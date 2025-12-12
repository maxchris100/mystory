# Enhanced Material System for 3D Architectural Design

This guide explains how to use the enhanced material system for walls, rooms, and other architectural elements in your 3D design application.

## Overview

The enhanced material system provides:
- **Layered wall materials** (core, insulation, finish)
- **Room-specific material management** (walls, floors, ceilings)
- **Material presets** for common architectural materials
- **Advanced material properties** (roughness, metalness, texture repeat)
- **Material library** with drag-and-drop support

## Key Components

### 1. Material Properties (`utils/materials.ts`)

Enhanced material properties with support for:
```typescript
export type MaterialProperties = {
    id: string;
    name: string;
    imageUrl: string; // data URL or /public path
    repeatU?: number;
    repeatV?: number;
    rotation?: number;
    roughness?: number;
    metalness?: number;
};
```

### 2. Room Building (`utils/room.tsx`)

Enhanced room creation with material support:
```typescript
export type CreateRoomOptions = {
    // ... existing options
    wallMaterialId?: string;
    floorMaterialId?: string;
    ceilingMaterialId?: string;
    wallLayerMaterials?: { [layerName: string]: string };
};
```

### 3. Material Application Functions

#### Apply Material to Object
```typescript
applyMaterialToObject(target: THREE.Object3D, material: MaterialProperties)
```

#### Apply Material to Wall Layer
```typescript
applyMaterialToWallLayer(target: THREE.Object3D, material: MaterialProperties, layerName?: string)
```

#### Apply Material to Room Element
```typescript
applyMaterialToRoomElement(target: THREE.Object3D, material: MaterialProperties, elementType: 'wall' | 'floor' | 'ceiling')
```

## Usage Examples

### 1. Creating a Room with Materials

```typescript
import { createRoom } from './utils/room';
import { getDefaultMaterials } from './utils/materials';

// Get material presets
const materials = getDefaultMaterials();
const brickMaterial = materials.find(m => m.id === 'mat-brick');
const woodFloorMaterial = materials.find(m => m.id === 'mat-wood');

// Create room with materials
const room = createRoom(worldRef, {
    width: 6,
    length: 4,
    wallHeight: 3,
    wallMaterialId: brickMaterial?.id,
    floorMaterialId: woodFloorMaterial?.id,
    wallLayerMaterials: {
        'core': brickMaterial?.id,
        'insulation': materials.find(m => m.id === 'mat-plaster')?.id,
        'finish': materials.find(m => m.id === 'mat-paint')?.id
    }
});
```

### 2. Applying Materials to Existing Objects

```typescript
import { useEnhancedMaterials } from './hooks/useEnhancedMaterials';

function MyComponent() {
    const { applyMaterialToSelection, materials } = useEnhancedMaterials();
    
    const handleApplyMaterial = (object, materialId, elementType, layerName) => {
        applyMaterialToSelection(object, materialId, {
            elementType: elementType,
            layerName: layerName
        });
    };
    
    // Apply brick material to wall core layer
    handleApplyMaterial(selectedObject, 'mat-brick', 'wall', 'core');
    
    // Apply wood material to floor
    handleApplyMaterial(selectedObject, 'mat-wood', 'floor');
}
```

### 3. Using the Material Library

The material library provides:
- **Drag & Drop**: Drag materials onto objects to apply them
- **Search & Filter**: Find materials by name, type, or category
- **Material Presets**: Pre-configured materials for common architectural elements
- **Custom Materials**: Upload and configure your own materials

### 4. Wall Material Manager

The Wall Material Manager provides specialized controls for:
- **Element Type Selection**: Choose between walls, floors, or ceilings
- **Layer Selection**: Apply materials to specific wall layers (core, insulation, finish)
- **Material Preview**: See how materials will look before applying
- **Room Element Info**: View information about room elements and layers

### 5. Material Properties Panel

Edit material properties including:
- **Texture Settings**: Upload and configure texture images
- **Repeat Settings**: Control how textures repeat across surfaces
- **Material Properties**: Adjust roughness and metalness
- **Rotation**: Rotate textures for better alignment

## Material Presets

The system includes presets for common architectural materials:

### Wall Materials
- **Brick**: Traditional brick texture with high roughness
- **Concrete**: Industrial concrete finish
- **Plaster**: Smooth plaster surface
- **Stone**: Natural stone texture
- **Paint**: Standard painted surface

### Floor Materials
- **Wood Floor**: Hardwood flooring
- **Marble Floor**: Elegant marble finish
- **Ceramic Tile**: Bathroom/kitchen tiles
- **Carpet**: Soft carpet texture

### Ceiling Materials
- **Ceiling Tile**: Standard acoustic tiles
- **Gypsum Board**: Smooth drywall finish

### Specialized Materials
- **Glass**: Transparent glass material
- **Metal**: Reflective metal surfaces

## Best Practices

### 1. Material Organization
- Use descriptive names for materials
- Group materials by category (walls, floors, ceilings)
- Create material libraries for different project types

### 2. Performance Optimization
- Use appropriate texture sizes (512x512 or 1024x1024 for most cases)
- Dispose of unused materials to prevent memory leaks
- Use material instances for repeated elements

### 3. Layered Walls
- Apply different materials to different wall layers
- Use core materials for structural elements
- Apply finish materials to visible surfaces
- Use insulation materials for thermal properties

### 4. Room Materials
- Apply consistent materials across room elements
- Consider material relationships (e.g., matching floor and wall colors)
- Use different materials for different room types

## Integration with Existing Code

To integrate the enhanced material system with your existing code:

1. **Replace the old useMaterials hook** with `useEnhancedMaterials`
2. **Update material application calls** to use the new functions
3. **Add the new UI components** to your interface
4. **Update room creation** to use the enhanced options

## Troubleshooting

### Common Issues

1. **Materials not applying**: Check that the object has the correct userData structure
2. **Texture not loading**: Verify the image URL is correct and accessible
3. **Performance issues**: Reduce texture sizes or use fewer materials
4. **Memory leaks**: Ensure materials are properly disposed when no longer needed

### Debug Tips

- Use the browser's developer tools to inspect material properties
- Check the console for material loading errors
- Verify object userData contains the correct material references
- Use the material properties panel to debug material settings

## Future Enhancements

Potential future improvements:
- **Material animations** (e.g., water effects, fire)
- **Procedural materials** (generated textures)
- **Material physics** (realistic material behavior)
- **Material libraries** (shared material collections)
- **Material versioning** (track material changes over time)