// src/components/InputBar.tsx
import React, { useState } from "react";

interface InputBarProps {
  onNewCommand: (command: string) => void;
  disabled: boolean;
}
// input box
const InputBar: React.FC<InputBarProps> = ({ onNewCommand, disabled }) => {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onNewCommand(command);
      setCommand("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-bar-form">
      <input
        type="text"
        className="input-bar"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Try: remind me to call the team tomorrow afternoon"
        disabled={disabled}
      />
    </form>
  );
};

export default InputBar;
