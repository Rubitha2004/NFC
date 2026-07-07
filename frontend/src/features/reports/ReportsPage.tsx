import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsSidebar } from "./components/ReportsSidebar";
import { ReportsFilter } from "./components/ReportsFilter";
import { DashboardView } from "./components/views/DashboardView";

export default function ReportsPage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <ReportsHeader />
      <ReportsFilter />
      <div className="flex-1 flex overflow-hidden">
        <ReportsSidebar />
        <DashboardView />
      </div>
    </div>
  );
}
