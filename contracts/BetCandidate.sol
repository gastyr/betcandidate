
//SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

struct Bet {
    uint amount;
    uint candidate;
    uint timestamp;
    uint claimed;
}

struct Dispute {
    string candidate1;
    string candidate2;
    string image1;
    string image2;
    uint total1;
    uint total2;
    uint candidate1_votes;
    uint candidate2_votes;
    uint winner;
}

contract BetCandidate {

    Dispute public dispute;
    mapping(address => Bet) public allBets;

    address immutable owner;
    uint constant fee = 1000;//10% (escala de 4 zeros)
    uint public netPrize;
    uint public immutable BETTING_END_TIME = 1730635200;
    uint public immutable ELECTION_TIME = 1730980800;

    constructor(){
        owner = msg.sender;
        dispute = Dispute({
            candidate1: "Donald Trump",
            candidate2: "Kamala Harris",
            image1: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg",
            image2: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg/800px-Kamala_Harris_Vice_Presidential_Portrait.jpg",
            total1: 0,
            total2: 0,
            candidate1_votes: 0,
            candidate2_votes: 0,
            winner: 0
        });
    }

    modifier onlyOwner() {
    require(msg.sender == owner, "Invalid account");
    _;
}

    function changeImage(uint8 candidate, string calldata newImage) external onlyOwner{
        require(candidate == 1 || candidate == 2, "Invalid candidate");

        if(candidate == 1) {
            dispute.image1 = newImage;
        } else {
            dispute.image2 = newImage;
        }

    }

    function bet(uint candidate) external payable {
        require(candidate == 1 || candidate == 2, "Invalid candidate");
        require(msg.value > 0, "Invalid bet");
        require(dispute.winner == 0, "Dispute closed");
        require(block.timestamp <= BETTING_END_TIME, "The deadline for betting has passed");
        require(allBets[msg.sender].amount == 0, "You already placed a bet");

        Bet memory newBet;
        newBet.amount = msg.value;
        newBet.candidate = candidate;
        newBet.timestamp = block.timestamp;

        allBets[msg.sender] = newBet;

        if(candidate == 1) {
            dispute.total1 += msg.value;
            dispute.candidate1_votes += 1;
        } else {
            dispute.total2 += msg.value;
            dispute.candidate2_votes += 1;
        }
    }

    function finish(uint winner) external onlyOwner{
        require(winner == 1 || winner == 2, "Invalid candidate");
        require(dispute.winner == 0, "Dispute closed");
        require(block.timestamp >= ELECTION_TIME, "The elections have not yet taken place");

        dispute.winner = winner;

        uint grossPrize = dispute.total1 + dispute.total2;
        uint commission = (grossPrize * fee) / 1e4;
        netPrize = grossPrize - commission;
 
    }

    function feeClaim() external onlyOwner{
        require(dispute.winner > 0, "The bet don't have a winner yet");
        uint balance = address(this).balance;
        uint ownerPrize = balance - netPrize;

        payable(owner).transfer(ownerPrize);
    }

    function claim() external {
        Bet memory userBet = allBets[msg.sender];
        require(dispute.winner > 0 && dispute.winner == userBet.candidate && userBet.claimed == 0, "Invalid claim");

        uint winnerAmount = dispute.winner == 1 ? dispute.total1 : dispute.total2;
        uint ratio = (userBet.amount * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;
        allBets[msg.sender].claimed = individualPrize;
        payable(msg.sender).transfer(individualPrize);
    }

}