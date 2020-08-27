import { Managers, Types, Validation } from "@arkecosystem/crypto";
import Boom from "@hapi/boom";
import { Server } from "@hapi/hapi";

import { IStoreTransaction } from "../interfaces";
import { corsHeaders, serverType } from "../plugins";
import { logger } from "../services/logger";
import { memory } from "../services/memory";
import { Storage } from "../services/storage";
import { TransactionStatus } from "./enums";
import { transactionSchemaVerifier } from "./transaction-schema-verifier";
import { getBaseTransactionId, verifySignatures } from "./utils";

const bootDatabase = (network: string) => {
	const storage = new Storage();
	storage.connect(`transactions-storage-${network}.sqlite`);

	const transactions = storage.loadAll();
	memory.loadTransactions(transactions);

	storage.disconnect();
};

export async function startServer(options: Record<string, string | number | boolean>): Promise<Server> {
	const server = new Server({
		host: options.host as string,
		port: options.port as number,
	});

	await server.register({
		plugin: corsHeaders,
	});

	await server.register({
		plugin: serverType,
	});

	Managers.configManager.setFromPreset(options.network as Types.NetworkName);
	Managers.configManager.setHeight(options.height as number);
	Managers.configManager.getMilestone().aip11 = true;

	server.route({
		method: "GET",
		path: "/transactions",
		handler: (request, h) => {
			try {
				const storeTransactions = memory.getTransactionsByPublicKey(request.query.publicKey);

				if (request.query.state === TransactionStatus.Pending) {
					return storeTransactions.filter((t) => (t.data.signatures || []).length < t.multisigAsset.min);
				}

				if (request.query.state === TransactionStatus.Ready) {
					return storeTransactions.filter((t) => (t.data.signatures || []).length >= t.multisigAsset.min);
				}

				return storeTransactions;
			} catch (error) {
				return Boom.badImplementation(error.message);
			}
		},
		options: {
			validate: {
				// @ts-ignore
				async query(data: object, options: object) {
					const schema = {
						type: "object",
						properties: {
							publicKey: {
								$ref: "publicKey",
							},
							state: { enum: [TransactionStatus.Ready, TransactionStatus.Pending] },
						},
					};
					const { error } = Validation.validator.validate(schema, data);
					if (error) {
						throw new Error(error);
					}
				},
			},
		},
	});

	server.route({
		method: "GET",
		path: "/transaction/{id}",
		handler: (request, h) => {
			try {
				const transaction = memory.getTransactionById(request.params.id);

				if (transaction === undefined) {
					return Boom.notFound(`Failed to find transaction [${request.params.id}]`);
				}

				return transaction;
			} catch (error) {
				return Boom.badImplementation(error.message);
			}
		},
	});

	server.route({
		method: "POST",
		path: "/transaction",
		handler: (request, h) => {
			try {
				const transaction: IStoreTransaction = request.payload as IStoreTransaction;

				if (transaction.data.signatures && transaction.data.signatures.length) {
					if (!verifySignatures(transaction.data, transaction.multisigAsset)) {
						return Boom.badData("Transaction signatures are not valid");
					}
				}

				const baseTransactionId = getBaseTransactionId(transaction.data);
				const storeTransaction = memory.getTransactionById(baseTransactionId);
				if (storeTransaction) {
					memory.updateTransaction(transaction.data);

					return { id: baseTransactionId };
				}

				return { id: memory.saveTransaction(transaction) };
			} catch (error) {
				return Boom.badImplementation(error.message);
			}
		},
		options: {
			validate: {
				// @ts-ignore
				async payload(data: IStoreTransaction, options: object) {
					transactionSchemaVerifier.verifySchema(data.data);
				},
			},
		},
	});

	server.route({
		method: "DELETE",
		path: "/transactions/{id}",
		handler: (request, h) => {
			try {
				memory.removeById(request.params.id);

				return h.response().code(204);
			} catch (error) {
				return Boom.badImplementation(error.message);
			}
		},
	});

	bootDatabase(options.network as string);

	await server.start();

	logger.info(`MultiSignature server running on ${server.info.uri}`);

	// @ts-ignore
	server.app.memory = memory;

	return server;
}

export const exitHandler = (network: string) => {
	const storage = new Storage();
	storage.connect(`transactions-storage-${network}.sqlite`);

	const memTransactions = memory.getAllTransactions();
	storage.deleteAll();
	storage.bulkAdd(memTransactions);

	storage.disconnect();
};
