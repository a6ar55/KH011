// LoanContract.sol
pragma solidity >=0.4.22 <0.9.0;

contract LoanContract {
    address public owner;
    uint public totalLoans;

    struct Loan {
        uint id;
        address borrower;
        uint amount;
        uint interestRate;
        uint repaymentPeriod;
        bool repaid;
    }

    mapping(uint => Loan) public loans;

    event LoanCreated(uint id, address borrower, uint amount, uint interestRate, uint repaymentPeriod);
    event LoanRepaid(uint id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() public{
        owner = msg.sender;
    }

    function createLoan(uint amount, uint interestRate, uint repaymentPeriod) external {
        totalLoans++;
        loans[totalLoans] = Loan(totalLoans, msg.sender, amount, interestRate, repaymentPeriod, false);
        emit LoanCreated(totalLoans, msg.sender, amount, interestRate, repaymentPeriod);
    }

    function repayLoan(uint loanId) external payable {
        Loan storage loan = loans[loanId];
        require(!loan.repaid, "Loan already repaid");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");
        require(msg.value == loan.amount, "Incorrect repayment amount");

        loan.repaid = true;
        emit LoanRepaid(loanId);
    }
}
