import { dashboardService } from "./src/modules/dashboard/service/dashboard.service";

async function main() {
  try {
    const overview = await dashboardService.getOverview();
    console.log("Overview success:");
    console.log(JSON.stringify(overview, null, 2));
    
    const live = await dashboardService.getLiveFloor();
    console.log("Live floor success:");
    console.log(JSON.stringify(live, null, 2));
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

main();
