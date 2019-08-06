import "jest-extended";

import { Transactions, Managers } from "@arkecosystem/crypto";
import { Server } from "@hapi/hapi";
import got from "got";
import { launchServer } from "../__support__";

let server: Server;
beforeAll(async () => {
    server = await launchServer();
    Managers.configManager.setFromPreset("testnet");
});
afterAll(async () => server.stop());

const passphrase = "passphrase 1";
const publicKey = "03e8021105a6c202097e97e6c6d650942d913099bf6c9f14a6815df1023dde3b87";
const participants = [
    publicKey,
    "03dfdaaa7fd28bc9359874b7e33138f4d0afe9937e152c59b83a99fae7eeb94899",
    "03de72ef9d3ebf1b374f1214f5b8dde823690ab2aa32b4b8b3226cc568aaed1562",
];
const multisigAsset = {
    min: 2,
    publicKeys: participants,
};
const transaction = Transactions.BuilderFactory.multiSignature()
    .multiSignatureAsset(multisigAsset)
    .network(23);

describe("Transactions", () => {
    describe("GET transaction by ID", () => {
        it("should return no transaction when the given public key doesnt exist", async () => {
            const response = await got.get(`http://localhost:8080/transactions?publicKey=123asd`);

            expect(JSON.parse(response.body)).toEqual([]);
        });

        it("should return no transaction when the given sender public key doesnt exist", async () => {
            const response = await got.get(`http://localhost:8080/transactions?senderPublicKey=123asd`);

            expect(JSON.parse(response.body)).toEqual([]);
        });

        it("should return the transaction associated with the senderPublicKey provided", async () => {
            const data = transaction.sign(passphrase).multiSign(passphrase, 0).getStruct();
            await got.post(`http://localhost:8080/transaction`, { body: JSON.stringify({
                data,
                multisigAsset
            }) });
            const response = await got.get(`http://localhost:8080/transactions?senderPublicKey=${data.senderPublicKey}`);

            const body = JSON.parse(response.body);
            expect(body).toBeArrayOfSize(1);
            expect(body[0].data).toEqual(JSON.parse(JSON.stringify(data)));
            expect(body[0].multisigAsset).toEqual(multisigAsset);
            expect(body[0]).toHaveProperty("timestamp");
        });
    });

    describe("POST transaction", () => {
        it("should store the transaction", async () => {
            const data = transaction.sign(passphrase).multiSign(passphrase, 0).getStruct();
            const response = await got.post(`http://localhost:8080/transaction`, { body: JSON.stringify({
                data,
                multisigAsset
            }) });

            expect(JSON.parse(response.body)).toHaveProperty("id");
        });
    });
});
