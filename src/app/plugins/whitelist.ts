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
		} catch {}
	}

	return false;
};

export const whitelist = {
	name: "whitelist",
	version: "0.1.0",
	register(server, options) {
		server.ext({
			type: "onRequest",
			async method(request, h) {
				if (!options.whitelist) {
					return h.continue;
				}

				if (isWhitelisted(options.whitelist, request.info.remoteAddress)) {
					return h.continue;
				}

				return Boom.forbidden();
			},
		});
	},
};
