import React from "react";
import "./Hero.css";
import HeroTile from "./HeroTile/HeroTile";
import HeroChart from "./HeroChart/HeroChart";

const Hero = ({
  currentBalance,
  setCurrentBalance,
  expenseList,
  setExpenseList,
  handleAddExpense,
}) => {
  const handleAddBalance = (value) => {
    setCurrentBalance((currentBalance) => currentBalance + parseInt(value));
    localStorage.setItem("balance", currentBalance + parseInt(value));
  };
  return (
    <div className="hero">
      <div className="hero-tile-container">
        <HeroTile
          currentBalance={currentBalance}
          setCurrentBalance={setCurrentBalance}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          isExpense={false}
          handleAddBalance={handleAddBalance}
        />
        <HeroTile
          currentBalance={currentBalance}
          setCurrentBalance={setCurrentBalance}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          isExpense={true}
          handleAddExpense={handleAddExpense}
        />
      </div>
      <div>
        <HeroChart
          currentBalance={currentBalance}
          setCurrentBalance={setCurrentBalance}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
        />
      </div>
    </div>
  );
};

export default Hero;
