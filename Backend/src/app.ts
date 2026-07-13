import express from "express";
import cors from "cors";

import routes from "././routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", routes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error:", err.message || err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Internal Server Error", 
    errors: err.errors 
  });
});

export default app;