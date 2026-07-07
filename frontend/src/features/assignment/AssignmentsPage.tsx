import { AssignmentHeader } from "./components/AssignmentHeader";
import { AssignmentKPIs } from "./components/AssignmentKPIs";
import { AssignmentFilter } from "./components/AssignmentFilter";
import { AssignmentTable } from "./components/AssignmentTable";
import { AssignmentDetailsDrawer } from "./components/AssignmentDetailsDrawer";
import { AddAssignmentDialog } from "./components/AddAssignmentDialog";

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      <AssignmentHeader />
      <AssignmentKPIs />
      <AssignmentFilter />
      <AssignmentTable />
      
      <AssignmentDetailsDrawer />
      <AddAssignmentDialog />
    </div>
  );
}
