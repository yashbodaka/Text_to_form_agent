import React from "react";
import "./Summary.css";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import TopExpense from "./TopExpense/TopExpense";

const Summarry = ({
  currentBalance,
  setCurrentBalance,
  expenseList,
  setExpenseList,
  handleAddExpense,
}) => {
  const handleDelete = (id) => {
    const newExpenseList = expenseList.filter((item) => item.id !== id);
    setExpenseList(newExpenseList);
    const newRemainingBalance =
      currentBalance +
      parseInt(expenseList.find((item) => item.id === id).amount);
    setCurrentBalance(() => newRemainingBalance);
    localStorage.setItem("balance", JSON.stringify(newRemainingBalance));
    localStorage.setItem("expenses", JSON.stringify(newExpenseList));
  };
  return (
    <div className="summary-container">
      <RecentTransactions
        currentBalance={currentBalance}
        setCurrentBalance={setCurrentBalance}
        expenseList={expenseList}
        setExpenseList={setExpenseList}
        handleDelete={handleDelete}
        handleAddExpense={handleAddExpense}
      />
      <TopExpense
        currentBalance={currentBalance}
        setCurrentBalance={setCurrentBalance}
        expenseList={expenseList}
        setExpenseList={setExpenseList}
      />
    </div>
  );
};

export default Summarry;
