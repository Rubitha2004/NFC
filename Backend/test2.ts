async function run() {
  console.log("Starting requests...");
  try {
    const [overview, liveFloor] = await Promise.all([
      fetch('http://localhost:5000/api/v1/dashboard/overview'),
      fetch('http://localhost:5000/api/v1/dashboard/live-floor')
    ]);
    console.log("Overview status:", overview.status);
    console.log("Live Floor status:", liveFloor.status);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
