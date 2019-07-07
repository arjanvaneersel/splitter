pragma solidity >=0.4.25 <0.6.0;

contract Splitter {
    address public owner;
    address alice;
    address bob;
    address carol;
    mapping(address => uint) balances;
    bool paused;

    modifier active() {
        require(!paused, "contract is paused");
        require(alice != address(0), "invalid address for Alice");
        require(bob != address(0), "invalid address for Bob");
        require(carol != address(0), "invalid address for Carol");
        _;
    }

    // onlyOwner is a modifier to limit access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // onlyAlice is a modifier to limit access to Alice
    modifier onlyAlice() {
        require(msg.sender == alice);
        _;
    }

    // onlyParticipant is a modifier to limit access to Alice, Bob or Carol
    modifier onlyParticipant() {
        require(msg.sender == alice || msg.sender == bob || msg.sender == carol);
        _;
    }

    // Constructor. Requires the addresses of alice, bob and carol
    constructor() public {
        owner = msg.sender;
        paused = true;
    }

    function pause() public onlyOwner {
        paused = !paused;
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

    // topUp adds the paid value to the sender's balance.
    function topUp() public payable active onlyParticipant {
        balances[msg.sender] += msg.value;
    }

    // split will split the paid amount over the balances of
    // Bob and Carol. Any remainder will be added to the balance
    // of the sender. This function can only be executed by Alice.
    function split() public payable active onlyAlice {
        uint amount = msg.value;
        uint half = amount / 2;
        uint remainder = amount - (half * 2);

        balances[bob] += half;
        balances[carol] += half;
        if (remainder > 0) {
            balances[msg.sender] += remainder;
        }
    }
}
