import { UserHeader } from "./components/UserHeader";
import { UserKPIs } from "./components/UserKPIs";
import { UserFilter } from "./components/UserFilter";
import { UserTable } from "./components/UserTable";
import { UserDetailsDrawer } from "./components/UserDetailsDrawer";
import { AddUserDialog } from "./components/AddUserDialog";

export default function UserManagementPage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <UserHeader />
      <UserKPIs />
      <UserFilter />
      <UserTable />
      
      <UserDetailsDrawer />
      <AddUserDialog />
    </div>
  );
}
