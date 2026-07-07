import { FactoryFloor } from './components/FactoryFloor';

/**
 * Live Factory page — replaces the placeholder with the fully
 * data-driven Smart Factory Floor layout.
 *
 * Route: /live-factory
 * Layout: DashboardLayout (sidebar + navbar already provided)
 */
export default function LiveFactoryPage() {
  return (
    // Expand to fill the DashboardLayout main area
    // The -mx/-mb compensates for any padding the layout adds, giving
    // the factory floor a full-bleed canvas feel.
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      <FactoryFloor />
    </div>
  );
}
