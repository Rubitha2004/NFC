import React, { useState, useEffect } from "react";
import { Building2, Plus, ArrowRight, Settings } from "lucide-react";
import { PageContainer, PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/components/ui/button";
import { floorService } from "./services/floor.service";
import type { Floor, Room } from "./types/factory-layout.types";
import { AddFloorDialog } from "./components/AddFloorDialog";
import { FloorDetailsDrawer } from "./components/FloorDetailsDrawer";
export default function FactoryLayoutPage() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const data = await floorService.getAll();
      setFloors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  return (
    <PageContainer>
      <PageHeader 
        title="Factory Layout Configuration"
        description="Manage physical floors and rooms to accurately map the production facility."
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>/</span>
            <span>Settings</span>
            <span>/</span>
            <span className="text-foreground font-medium">Layout</span>
          </div>
        }
      >
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsAddFloorOpen(true)}>
          <Plus className="w-4 h-4" /> Add Floor
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/50">Loading layout...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floors.map(floor => (
            <div key={floor.id} className="bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors rounded-xl shadow-sm text-card-foreground">
              <div className="flex flex-col space-y-1.5 p-6 pb-2 flex-row items-center justify-between">
                <div className="font-semibold tracking-tight text-lg text-white font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> {floor.name}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">
                  Floor {floor.floorNumber}
                </span>
              </div>
              <div className="p-6 pt-0">
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-white/60">
                    <span className="font-medium text-white">{floor._count?.rooms || 0}</span> Rooms Configured
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10" onClick={() => setSelectedFloor(floor)}>
                    Manage Rooms <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {floors.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-white/5">
              <Building2 className="w-8 h-8 text-white/20 mb-4" />
              <p className="text-white/60">No floors configured yet.</p>
              <p className="text-sm text-white/40 mb-4">Add your first floor to begin mapping your factory.</p>
              <Button variant="outline" onClick={() => setIsAddFloorOpen(true)}>Create Floor</Button>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      {isAddFloorOpen && (
        <AddFloorDialog 
          isOpen={isAddFloorOpen} 
          onClose={() => setIsAddFloorOpen(false)} 
          onSuccess={fetchFloors} 
        />
      )}
      
      {selectedFloor && (
        <FloorDetailsDrawer 
          floor={selectedFloor} 
          onClose={() => setSelectedFloor(null)} 
          onUpdate={fetchFloors}
        />
      )}
    </PageContainer>
  );
}
