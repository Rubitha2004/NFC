"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleTransactionController = void 0;
const bundle_transaction_service_1 = require("../service/bundle-transaction.service");
const bundle_transaction_dto_1 = require("../dto/bundle-transaction.dto");
const service = new bundle_transaction_service_1.BundleTransactionService();
class BundleTransactionController {
    async create(req, res) {
        try {
            const validatedData = bundle_transaction_dto_1.createBundleTransactionSchema.parse(req.body);
            const transaction = await service.createTransaction(validatedData);
            return res.status(201).json(transaction);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || error });
        }
    }
    async getAll(req, res) {
        try {
            const transactions = await service.getAllTransactions();
            return res.json(transactions);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const transaction = await service.getTransactionById(Number(req.params.id));
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            return res.json(transaction);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getByBundle(req, res) {
        try {
            const transactions = await service.getTransactionsByBundle(Number(req.params.bundleId));
            return res.json(transactions);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.BundleTransactionController = BundleTransactionController;
