import Boom from "@hapi/boom";
import nm from "nanomatch";

const isWhitelisted = (whitelist: string[], remoteAddress: string): boolean => {
	if (!Array.isArray(whitelist) || !whitelist.length) {
		return true;
	}

	for (const ip of whitelist) {
		try {
			if (nm.isMatch(remoteAddress, ip)) {
				return true;
			}
			// eslint-disable-next-line no-empty
		} catch {}
	}

	return false;
};

export const plugin = {
	name: "whitelist",
	version: "1.0.0",
	once: true,
	register(server, options) {
		server.ext({
			type: "onRequest",
			async method(request, h) {
				if (!options.whitelist) {
					return h.continue;
				}

				const whitelist = options.whitelist.split(",") || ["*"];

				if (isWhitelisted(whitelist, request.info.remoteAddress)) {
					return h.continue;
				}

				return Boom.forbidden();
			},
		});
	},
};
