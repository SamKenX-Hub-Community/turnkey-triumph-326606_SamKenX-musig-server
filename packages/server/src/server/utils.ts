import { Interfaces, Transactions, Crypto } from "@arkecosystem/crypto";

// Verifies that all signatures are valid
export const verifySignatures = (
    transaction: Interfaces.ITransactionData,
    multiSignature: Interfaces.IMultiSignatureAsset,
): boolean => {
    const { publicKeys }: Interfaces.IMultiSignatureAsset = multiSignature;
    const { signatures }: Interfaces.ITransactionData = transaction;

    if (!signatures.length) {
        return false;
    }

    const hash: Buffer = Transactions.Utils.toHash(transaction, {
        excludeSignature: true,
        excludeSecondSignature: true,
        excludeMultiSignature: true,
    });

    for (let i = 0; i < signatures.length; i++) {
        const signature: string = signatures[i];
        const publicKeyIndex: number = parseInt(signature.slice(0, 2), 16);
        const partialSignature: string = signature.slice(2, 130);
        const publicKey: string = publicKeys[publicKeyIndex];

        if (!Crypto.Hash.verifySchnorr(hash, partialSignature, publicKey)) {
            return false;
        }
    }

    return true;
}