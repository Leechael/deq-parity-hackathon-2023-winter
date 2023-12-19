// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract QuestionDeposit {
  IERC20 public token;

  struct Question {
    uint256 amount;
    address questioner;
    address payable answerer;
    bool isAnswered;
  }

  mapping(uint256 => Question) public questions;

  constructor (address _token) {
    token = IERC20(_token);
  }

  function askQuestion(uint256 _questionId, uint256 _amount) public {
    // TODO check _questionId
    require(_amount > 0, "Amount should be greater than 0.");
    token.transferFrom(msg.sender, address(this), _amount);
    questions[_questionId] = Question(_amount, msg.sender, payable(address(0)), false);
  }

  function answerQuestion(uint256 _questionId, address payable _answerer) public {
    Question storage question = questions[_questionId];

    require(msg.sender == question.questioner, "Only the questioner can select the answer.");
    require(!question.isAnswered, "Question is already answered.");
    require(question.amount > 0, "The question doesn't exist or the question amount is zero.");

    token.transfer(_answerer, question.amount);

    question.isAnswered = true;
    question.answerer = _answerer;
  }

  function getQuestion(uint256 _questionId) public view returns (uint256, address, address, bool) {
    Question storage question = questions[_questionId];
    return (question.amount, question.questioner, question.answerer, question.isAnswered);
  }
}
