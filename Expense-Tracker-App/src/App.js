import { useEffect, useState } from "react";
import "./App.css";
import Hero from "./components/Hero/Hero";
import Summarry from "./components/Summarry/Summarry";
import Chat from "./components/Chat/Chat";
import { v4 as uuid } from "uuid";
import { enqueueSnackbar } from "notistack";

function App() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  useEffect(() => {
    const balance = localStorage.getItem("balance");
    if (balance === null) {
      localStorage.setItem("balance", 5000);
      setCurrentBalance(5000);
    } else {
      setCurrentBalance(balance ? parseInt(balance) : 5000);
    }
    const expenses = localStorage.getItem("expenses");
    setExpenseList(expenses ? JSON.parse(expenses) : []);
  }, []);
  const handleAddExpense = (expense) => {
    if (expense.id) {
      //edit expense
      const newExpenseList = expenseList.map((item) => {
        if (item.id === expense.id) {
          return expense;
        }
        return item;
      });
      setExpenseList(newExpenseList);
      localStorage.setItem("expenses", JSON.stringify(newExpenseList));
      return;
    }
    const currentExpenseAmount = expense.amount;
    if (currentExpenseAmount > currentBalance) {
      enqueueSnackbar("Expense amount is greater than current balance", {
        variant: "warning",
      });
      return;
    }
    setCurrentBalance(
      (currentBalance) => currentBalance - currentExpenseAmount
    );
    localStorage.setItem("balance", currentBalance - currentExpenseAmount);
    const currExpense = {
      id: uuid(),
      ...expense,
    };
    setExpenseList([...expenseList, currExpense]);
    localStorage.setItem(
      "expenses",
      JSON.stringify([...expenseList, currExpense])
    );
  };
  return (
    <div className="bg-black body">
      <h2 className="heading">Expense Tracker</h2>
      <Hero
        currentBalance={currentBalance}
        setCurrentBalance={setCurrentBalance}
        expenseList={expenseList}
        setExpenseList={setExpenseList}
        handleAddExpense={handleAddExpense}
      />
      <Summarry
        currentBalance={currentBalance}
        setCurrentBalance={setCurrentBalance}
        expenseList={expenseList}
        setExpenseList={setExpenseList}
        handleAddExpense={handleAddExpense}
      />
      <Chat
        currentBalance={currentBalance}
        setCurrentBalance={setCurrentBalance}
        handleAddExpense={handleAddExpense}
        expenseList={expenseList}
      />
    </div>
  );
}

export default App;
