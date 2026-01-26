import React, { useState } from "react";
import "./HeroTile.css";
import Modal from "../../Modal/Modal";

const HeroTile = ({
  isExpense,
  currentBalance,
  setCurrentBalance,
  expenseList,
  setExpenseList,
  handleAddBalance,
  handleAddExpense,
}) => {
  const title = isExpense ? "Expenses" : "Wallet Balance";
  const label = isExpense ? "Expense" : "Income";
  const currentExpenses = expenseList.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const money = isExpense ? currentExpenses : currentBalance;
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="hero-tile">
      <div className="hero-tile-title">
        {`${title}: `}
        <span className={`${isExpense ? "orange-text" : "green-text"}`}>
          ₹{money}
        </span>
      </div>
      <button
        onClick={() => setIsModalVisible(true)}
        className={`hero-button ${
          isExpense ? "red-gradient" : "green-gradient"
        }`}
      >
        + Add {label}
      </button>
      {isModalVisible && (
        <Modal
          handleAddBalance={handleAddBalance}
          isExpense={isExpense}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          expenseList={expenseList}
          handleAddExpense={handleAddExpense}
        />
      )}
    </div>
  );
};

export default HeroTile;
