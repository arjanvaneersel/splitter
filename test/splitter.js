const Splitter = artifacts.require("Splitter");

contract('Splitter', (accounts) => {
    it('should make the caller owner', async () => {
        const splitterInstance = await Splitter.deployed();
        const owner = await splitterInstance.owner.call();
        assert.equal(owner.valueOf(), accounts[0], "first account wasn't the owner")
    });

    it('should register alice, bob and carol with a balance of 0', async () => {
        const splitterInstance = await Splitter.deployed();
        await splitterInstance.registerParties(accounts[1], accounts[2], accounts[3]);

        const balances = await splitterInstance.getBalances.call();
        assert.equal(balances[0].toNumber(), 0, "alice's balance should be 0");
        assert.equal(balances[1].toNumber(), 0, "bob's balance should be 0");
        assert.equal(balances[2].toNumber(), 0, "carol's balance should be 0");
    });
});
