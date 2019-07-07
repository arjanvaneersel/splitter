const Splitter = artifacts.require("Splitter");

contract('Splitter', (accounts) => {
    it('should make the caller owner', async () => {
        const splitterInstance = await Splitter.deployed();
        const owner = await splitterInstance.owner.call();
        assert.equal(owner.valueOf(), accounts[0], "first account wasn't the owner")
    });

    it('should not top-up balances while paused', async () => {
        const splitterInstance = await Splitter.deployed();

        let error;
        try {
            await splitterInstance.topUp({value: 2, from: accounts[1]});
        } catch(e) {
            error = e;
        }
        assert.equal(error, 'Error: Returned error: VM Exception while processing transaction: revert contract is paused -- Reason given: contract is paused.');
    });

    it('should be unpaused only by the owner', async () => {
        const splitterInstance = await Splitter.deployed();

        // Check that Alice can't unpause the contract
        let error;
        try {
            await splitterInstance.pause({from: accounts[1]});
        } catch(e) {
            error = e;
        }
        assert.equal(error, 'Error: Returned error: VM Exception while processing transaction: revert');

        error = '';
        try {
            await splitterInstance.pause({from: accounts[0]});
        } catch(e) {
            error = e;
        }
        assert.equal(error, '');
    });

    it('should not top-up balances while not having registered users', async () => {
        const splitterInstance = await Splitter.deployed();

        let error;
        try {
            await splitterInstance.topUp({value: 2, from: accounts[1]});
        } catch(e) {
            error = e;
        }
        assert.equal(error, 'Error: Returned error: VM Exception while processing transaction: revert invalid address for Alice -- Reason given: invalid address for Alice.');
    });

    it('should register alice, bob and carol with a balance of 0', async () => {
        const splitterInstance = await Splitter.deployed();
        await splitterInstance.registerParties(accounts[1], accounts[2], accounts[3]);

        const balances = await splitterInstance.getBalances.call();
        assert.equal(balances[0].toNumber(), 0, "alice's balance should be 0");
        assert.equal(balances[1].toNumber(), 0, "bob's balance should be 0");
        assert.equal(balances[2].toNumber(), 0, "carol's balance should be 0");
    });

    it('should top-up balances', async () => {
        const splitterInstance = await Splitter.deployed();
        await splitterInstance.topUp({value: 2, from: accounts[1]});

        const balances = await splitterInstance.getBalances.call();
        assert.equal(balances[0].toNumber(), 2, "alice's balance should be 2");
        assert.equal(balances[1].toNumber(), 0, "bob's balance should be 0");
        assert.equal(balances[2].toNumber(), 0, "carol's balance should be 0");
    });

    it('should split alice\'s payments', async () => {
        const splitterInstance = await Splitter.deployed();
        await splitterInstance.split({value: 25, from: accounts[1]});

        const balances = await splitterInstance.getBalances.call();
        assert.equal(balances[0].toNumber(), 3, "alice's balance should be 3");
        assert.equal(balances[1].toNumber(), 12, "bob's balance should be 0");
        assert.equal(balances[2].toNumber(), 12, "carol's balance should be 0");
    });

    it('should fail to split payment not from Alice', async () => {
        const splitterInstance = await Splitter.deployed();

        let error;
        try {
            await splitterInstance.split({value: 25, from: accounts[2]});
        } catch(e) {
            error = e;
        }

        assert.equal(error, 'Error: Returned error: VM Exception while processing transaction: revert');
    });
});
