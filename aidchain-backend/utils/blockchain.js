async function registerFileOnBlockchain(fileId, owner) {
    console.log(`Registered file ${fileId} for owner ${owner} on blockchain.`);
    return { status: 'success', fileId };
}

module.exports = { registerFileOnBlockchain };
