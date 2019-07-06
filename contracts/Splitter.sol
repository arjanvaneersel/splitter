pragma solidity >=0.4.25 <0.6.0;

contract Splitter {
    address public owner;
    address alice;
    address bob;
    address carol;
    mapping(address => uint) balances;

    // Constructor. Requires the addresses of alice, bob and carol
    constructor() public {
        owner = msg.sender;
    }

    // registerParties will register Alice, Bob and Carol in the contract
    // with a balance value of 0. Requires their respective addresses.
    // Theoretically this could be integrated with the constructor, however
    // that is considered bad practice within truffle, as described here:
    // https://github.com/trufflesuite/truffle/issues/43
    function registerParties(address a, address b, address c) public {
        alice = a;
        balances[a] = 0;

        bob = b;
        balances[b] = 0;

        carol = c;
        balances[c] = 0;
    }

    // getBalances returns the balances of Alice, Bob and Carol.
    function getBalances() public view returns (uint, uint, uint) {
        return (balances[alice], balances[bob], balances[carol]);
    }
}
