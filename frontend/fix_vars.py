import re

def comment_out(file_path, patterns):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        for p in patterns:
            for i in range(len(lines)):
                if re.search(p, lines[i]):
                    if not lines[i].strip().startswith('//'):
                        lines[i] = '// ' + lines[i]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

comment_out('src/features/dashboard/components/Camera/CameraControls.tsx', [r'const isFullscreen'])
comment_out('src/features/dashboard/components/FactoryScene/Floor.tsx', [r'const gridMaterial'])
comment_out('src/features/dashboard/components/FactoryScene/index.tsx', [r'const name\s*='])
comment_out('src/features/dashboard/hooks/useFactoryData.ts', [r'const MACHINE_SPACING_Z', r'const idle\s*='])
comment_out('src/features/dashboard/hooks/useSocketIntegration.ts', [r'import \{ dashboardService \}', r'const dashboardService'])
comment_out('src/features/factory/components/FactoryFloor.tsx', [r'const statusFilter'])
comment_out('src/features/factory/components/pseudo3d/FactoryPseudo3DView.tsx', [r'const floorIndex'])
comment_out('src/features/factory/components/pseudo3d/ProductionLine3D.tsx', [r'const lineIndex', r'const machineCount'])
comment_out('src/features/factory/components/pseudo3d/Room3D.tsx', [r'const rgb'])
