import React from "react";
import "./TopExpense.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ENTERTAINMENT, FOOD, TRAVEL } from "../../../constants";

const TopExpense = ({
  currentBalance,
  setCurrentBalance,
  expenseList,
  setExpenseList,
}) => {
  const food = expenseList.filter((expense) => expense.category === FOOD);
  const entertainment = expenseList.filter(
    (expense) => expense.category === ENTERTAINMENT
  );
  const travel = expenseList.filter((expense) => expense.category === TRAVEL);
  const data = [
    { name: "Entertainment", value: entertainment.length },
    { name: "Food", value: food.length },
    { name: "Travel", value: travel.length },
  ];
  const showChart =
    entertainment.length > 0 || food.length > 0 || travel.length > 0;

  return (
    <div>
      <h3 className="heading">Top Expense</h3>
      {showChart && (
        <div className="expense-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#9b88ff"
                radius={[0, 30, 30, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopExpense;
