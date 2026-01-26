import React from "react";
import "./HeroChart.css";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { ENTERTAINMENT, FOOD, TRAVEL } from "../../../constants";

const HeroChart = ({
  currentBalance,
  setCurrentBalance,
  expenseList,
  setExpenseList,
}) => {
  const food = expenseList.filter((expense) => expense.category === FOOD);
  const foodAmount = food.reduce((acc, expense) => acc + expense.amount, 0);
  const entertainment = expenseList.filter(
    (expense) => expense.category === ENTERTAINMENT
  );
  const entertainmentAmount = entertainment.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const travel = expenseList.filter((expense) => expense.category === TRAVEL);
  const travelAmount = travel.reduce((acc, expense) => acc + expense.amount, 0);
  const data = [
    { name: "Food", value: foodAmount },
    { name: "Entertainment", value: entertainmentAmount },
    { name: "Travel", value: travelAmount },
  ];

  const COLORS = ["#A000FF", "#FF9304", "#FDE006"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className="hero-chart">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={83}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* <Legend
          layout="vertical"
          verticalAlign="bottom"
          align="center"
          iconType="rect"
          wrapperStyle={{
            backgroundColor: "red",
            marginTop: -120,
            width: "100%",
            overflow: "hidden",
            textAlign: "center",
          }}
        /> */}
      </PieChart>
    </div>
  );
};

export default HeroChart;
