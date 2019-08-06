import { Server } from "@hapi/hapi";
import { startServer } from "../../packages/server/src/server";

jest.setTimeout(10000);

export const launchServer = async (): Promise<Server> => {
    return startServer({
        host: "0.0.0.0",
        port: 8080,
        allowRemote: false,
        whitelist: ["127.0.0.1", "::ffff:127.0.0.1"] as any,
        network: "devnet",
    });
};
