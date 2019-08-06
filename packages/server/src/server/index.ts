//import { Types } from "@arkecosystem/crypto";
import { Server } from "@hapi/hapi";
//import { Joi } from "@hapi/joi";
import { logger } from "../services/logger";
import * as handlers from "./handlers";

export async function startServer(options: Record<string, string | number | boolean>): Promise<Server> {
    const server = new Server({
        host: options.host as string,
        port: options.port as number,
    });

    server.route({
        method: 'GET',
        path:'/transactions',
        handler: handlers.getTransactions,
        options: {
            auth: false,
            /*validate: {
                query: Joi.object({
                    senderPublicKey: Joi.string().min(1).max(20), // the sender public key of transaction (useful or no ?)
                    publicKey: Joi.string().min(1).max(20), // any public key involved in signatures
                }).or('senderPublicKey', 'publicKey')
            }*/
        }
    });
    
    server.route({
        method: 'POST',
        path:'/transaction',
        handler: handlers.postTransaction,
        options: {
            auth: false,
            /* TODO validate with $ref: "transaction" (not available, only "transactions")
            validate: {
                payload(data: object, options: object) {
                    try {
                        const schema = { transaction: { $ref: "transaction" } };
                        const { error } = Validation.validator.validate(schema, data);
                        return { value: data, error: error ? error : null };
                    } catch (error) {
                        return { value: null, error: error.stack };
                    }
                }
            },*/
        }
    });

    server.route({
        method: 'PUT',
        path:'/transaction/{id}',
        handler: handlers.putTransaction,
        options: {
            auth: false,
            /* TODO validate with $ref: "transaction" (not available, only "transactions")
            validate: {
                payload(data: object, options: object) {
                    try {
                        const schema = { transaction: { $ref: "transaction" } };
                        const { error } = Validation.validator.validate(schema, data);
                        return { value: data, error: error ? error : null };
                    } catch (error) {
                        return { value: null, error: error.stack };
                    }
                }
            },*/
        }
    });

    await server.start();

    logger.info(`MultiSignature server running on ${server.info.uri}`);

    return server;
}
