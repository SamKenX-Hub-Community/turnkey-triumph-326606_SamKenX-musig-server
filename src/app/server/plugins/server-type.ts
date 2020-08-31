export const plugin = {
	name: "server-type",
	version: "1.0.0",
	once: true,
	register(server, options) {
		server.ext({
			type: "onPreResponse",
			method: (request, h) => {
				const response = request.response.isBoom ? request.response.output : request.response;
				response.headers["X-Server-Type"] = "MultiSignature";

				return h.continue;
			},
		});
	},
};
