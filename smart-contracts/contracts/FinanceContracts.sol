// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BasicFinance {

  address public owner;
  uint256 public totalPoolBalance;

  mapping(address => uint256) public balances;


  constructor() {
    owner = msg.sender;
  }


  function deposit() public payable {

    require(msg.value > 0, "Must send more than 0");

    balances[msg.sender] += msg.value;
    totalPoolBalance += msg.value;
  }


  function withdraw(uint256 amount) public {
      
    require(balances[msg.sender] >= amount, "Insufficient balance!");

    balances[msg.sender] -= amount;
    totalPoolBalance -= amount;

    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed!");
  }
}