import re

def strip_import(file_path, to_strip):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        for item in to_strip:
            content = re.sub(r'(import\s+\{.*?)(\b' + item + r'\b)(\s*,?.*?\}\s+from)', r'\1\3', content, flags=re.DOTALL)
            content = re.sub(r'import\s+\{\s*,\s*', 'import { ', content)
            content = re.sub(r',\s*,\s*', ', ', content)
            content = re.sub(r'\{\s*,\s*\}\s*from\s*[\'\"].*?[\'\"];?\n?', '', content)
            content = re.sub(r'\{\s*\}\s*from\s*[\'\"].*?[\'\"];?\n?', '', content)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

strip_import('src/features/control-center/components/ControlCenterHeader.tsx', ['Sun'])
strip_import('src/features/control-center/components/Modals/ValidationReleaseModal.tsx', ['AnimatePresence', 'AlertCircle'])
strip_import('src/features/control-center/ControlCenterPage.tsx', ['motion'])
strip_import('src/features/dashboard/components/Camera/CameraControls.tsx', ['ZoomIn', 'ZoomOut', 'isFullscreen'])
strip_import('src/features/dashboard/components/FactoryScene/index.tsx', ['Environment'])
strip_import('src/features/dashboard/components/Machine/MachineDetailPanel.tsx', ['Zap', 'MachineData'])
strip_import('src/features/dashboard/DashboardPage.tsx', ['useCallback', 'Layers', 'FileText'])
strip_import('src/features/factory/components/FloorLevel.tsx', ['cn'])
strip_import('src/features/factory/components/MachineDetailsPanel.tsx', ['Layers'])
strip_import('src/features/factory/components/pseudo3d/FactoryPseudo3DView.tsx', ['useRef', 'cn'])
strip_import('src/features/factory/components/three3d/Factory3DView.tsx', ['Environment'])
