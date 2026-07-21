import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "././routes";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nfc-seven-psi.vercel.app",
  ],
  credentials: true,
}));

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

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