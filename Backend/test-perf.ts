import { dashboardService } from "./src/modules/dashboard/service/dashboard.service";

async function run() {
  console.time("overview");
  await dashboardService.getOverview();
  console.timeEnd("overview");
  
  console.time("live-floor");
  await dashboardService.getLiveFloor();
  console.timeEnd("live-floor");
}

run();
