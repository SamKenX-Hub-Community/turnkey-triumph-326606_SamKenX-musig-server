import { Server } from "@hapi/hapi";
import { startServer } from "./server";
import { logger } from "./services/logger";

export * from "./interfaces";

export const start = async (options: {
    server: Record<string, any>;
    logger?: any;
}): Promise<Server> => {
    if (options.logger) {
        logger.setLogger(options.logger);
    }

    return startServer(options.server);
};
