'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Props interface for the Calculator component
 * @interface CalculatorProps
 * @property windowId - The unique identifier of the window containing the calculator
 */
interface CalculatorProps {
  windowId: string;
}

/**
 * Calculator component that provides a fully functional calculator interface
 * Supports basic arithmetic operations, decimal calculations, and keyboard input
 * @param windowId - The unique identifier of the window containing this calculator
 * @returns JSX element representing the calculator application
 */
export const Calculator: React.FC<CalculatorProps> = ({ windowId }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }> = ({ onClick, className = '', children }) => (
    <motion.button
      className={`
        h-12 rounded-lg font-semibold text-lg transition-all duration-200
        hover:scale-105 active:scale-95 shadow-lg
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white h-full">
      <div className="max-w-sm mx-auto">
        {/* Display */}
        <div className="mb-6 p-4 bg-black/50 rounded-xl border border-white/10">
          <div className="text-right text-3xl font-mono font-bold text-green-400 min-h-[40px] flex items-center justify-end">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            onClick={clear}
            className="col-span-2 bg-red-600 hover:bg-red-500 text-white"
          >
            Clear
          </Button>
          <Button
            onClick={() => performOperation('÷')}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            ÷
          </Button>
          <Button
            onClick={() => performOperation('×')}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            ×
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => inputNumber('7')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber('8')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber('9')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            9
          </Button>
          <Button
            onClick={() => performOperation('-')}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            -
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => inputNumber('4')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber('5')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber('6')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            6
          </Button>
          <Button
            onClick={() => performOperation('+')}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            +
          </Button>

          {/* Row 4 */}
          <Button
            onClick={() => inputNumber('1')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber('2')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber('3')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            3
          </Button>
          <Button
            onClick={handleEquals}
            className="row-span-2 bg-green-600 hover:bg-green-500 text-white"
          >
            =
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => inputNumber('0')}
            className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            .
          </Button>
        </div>
      </div>
    </div>
  );
};
