import React, { useState } from "react";
import "./Modal.css";
import ReactModal from "react-modal";
import { ENTERTAINMENT, FOOD, TRAVEL } from "../../constants";

const Modal = ({
  isModalVisible,
  setIsModalVisible,
  isExpense = false,
  handleAddBalance,
  handleAddExpense,
  expenseList,
  editId,
}) => {
  let currSelectedExpense = null;
  let buttonText = editId ? "Edit" : "Add";
  console.log("expense List is ", expenseList);
  if (editId) {
    currSelectedExpense = expenseList.find((item) => item.id === editId);
  }
  console.log("edit id ", editId);
  console.log("currSelectedExpense", currSelectedExpense);
  const [incomeAmount, setIncomeAmount] = useState(
    currSelectedExpense?.amount || 0
  );
  const [text, setText] = useState(currSelectedExpense?.name || "");
  const [price, setPrice] = useState(
    parseInt(currSelectedExpense?.amount) || 0
  );
  const [category, setCategory] = useState(
    currSelectedExpense?.category || FOOD
  );
  const [date, setDate] = useState(currSelectedExpense?.date || "");
  return (
    <div className="modal-container">
      <ReactModal
        className="modal"
        onRequestClose={() => setIsModalVisible(false)}
        isOpen={isModalVisible}
      >
        <h1 className="modal-heading">
          {isExpense ? buttonText + " Expenses" : "Add Balance"}
        </h1>
        <div className="input-container-modal">
          {!isExpense && (
            <div>
              <input
                onChange={(e) => setIncomeAmount(e.target.value)}
                value={incomeAmount}
                className="input"
                type="number"
                placeholder="income amount"
              />
            </div>
          )}
          {isExpense && (
            <div>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input"
                type="text"
                placeholder="Text"
              />
            </div>
          )}
          {isExpense && (
            <div>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input"
                type="number"
                placeholder="Price"
              />
            </div>
          )}
          {isExpense && (
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
                name="Category"
                id=""
              >
                <option value={FOOD}>{FOOD}</option>
                <option value={ENTERTAINMENT}>{ENTERTAINMENT}</option>
                <option value={TRAVEL}>{TRAVEL}</option>
              </select>
            </div>
          )}
          {isExpense && (
            <div>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
                type="date"
                placeholder="Date"
              />
            </div>
          )}
          <div>
            <button
              onClick={() => {
                if (!isExpense) {
                  handleAddBalance(incomeAmount);
                } else {
                  if (!editId) {
                    handleAddExpense({
                      name: text,
                      amount: parseInt(price),
                      category,
                      date,
                    });
                  } else {
                    handleAddExpense({
                      name: text,
                      amount: parseInt(price),
                      category,
                      date,
                      id: editId,
                    });
                  }
                }
                setIsModalVisible(false);
              }}
              className="hero-button"
              style={{ backgroundColor: "#F4BB4A" }}
            >
              {isExpense ? buttonText + " Expense" : "Add Balance"}
            </button>
          </div>
          <div>
            <button
              onClick={() => setIsModalVisible(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Modal;
