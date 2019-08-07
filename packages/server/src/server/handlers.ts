import { Interfaces } from "@arkecosystem/crypto";
import Boom from "@hapi/boom";
import { IStoreTransaction } from "../interfaces";
import { store } from "../services/store";
import { TransactionStatus } from "./enums";
import { verifySignatures } from "./utils";

export const getTransactions = (request, h) => {
    if (request.query.publicKey) {
        const storeTransactions = store.getTransactionsByPublicKey(request.query.publicKey);

        if (request.query.state === TransactionStatus.Pending) {
            return storeTransactions.filter(t => t.data.signatures.length < t.multisigAsset.min);
        } else if (request.query.state === TransactionStatus.Ready) {
            return storeTransactions.filter(t => t.data.signatures.length >= t.multisigAsset.min);
        }
        return storeTransactions;
    }

    return store.getAllTransactions(); // keep or throw error ? (why would we need to get all tx ?)
};

export const getTransaction = (request, h) => {
    return store.getTransactionById(request.params.id);
};

export const postTransaction = (request, h) => {
    const transaction: IStoreTransaction = request.payload;

    if (!transaction.data.signatures || !transaction.data.signatures.length) {
        return Boom.badData("Transaction provided does not have any signature from multisignature keys");
    }

    if (!verifySignatures(transaction.data, transaction.multisigAsset)) {
        return Boom.badData("Transaction signatures are not valid");
    }

    const storeId = store.saveTransaction(transaction);
    return { id: storeId };
};

export const putTransaction = (request, h) => {
    const data: Interfaces.ITransactionData = request.payload.data;
    const id: string = request.params.id;
    const storeTransaction = store.getTransactionById(id);
    if (!storeTransaction) {
        return Boom.notFound(`Transaction with id ${id} was not found`);
    }

    for (const signature of storeTransaction.data.signatures) {
        if (!data.signatures.includes(signature)) {
            return Boom.badData(
                "The transaction provided does not include all existing signatures from the transaction to update",
            );
        }
    }

    if (!verifySignatures(data, storeTransaction.multisigAsset)) {
        return Boom.badData("Transaction signatures are not valid");
    }

    store.updateTransaction(data, id);

    return { id };
};

export const deleteTransactions = (request, h) => {
    store.deleteAllTransactions();
    return true;
};
