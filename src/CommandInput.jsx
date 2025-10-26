import { useState } from 'react';
import { FaKeyboard } from 'react-icons/fa';

function CommandInput({ onSubmit }) {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-4 rounded-xl shadow-md mb-6">
      <label className="block text-purple-700 font-semibold mb-2 flex items-center gap-2">
        <FaKeyboard className="text-pink-500" />
        Enter Macro Command:
      </label>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="e.g., Send email to team"
        className="w-full border border-purple-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        Run Macro
      </button>
    </form>
  );
}

export default CommandInput;
