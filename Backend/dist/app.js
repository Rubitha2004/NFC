"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("././routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://nfc-seven-psi.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.use((err, req, res, next) => {
    console.error("Global Error:", err.message || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors
    });
});
exports.default = app;
