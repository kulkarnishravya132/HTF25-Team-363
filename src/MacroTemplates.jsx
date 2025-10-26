import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlusCircle } from 'react-icons/fa';

function MacroTemplates({ onSelectTemplate, onCreateMacro }) {
  const [customName, setCustomName] = useState('');
  const [customAction, setCustomAction] = useState('');

  const templates = [
    "Send email to team",
    "Create daily report",
    "Open Zoom meeting",
    "Backup files",
    "Log out of all sessions"
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (customName.trim() && customAction.trim()) {
      onCreateMacro(customName.trim(), customAction.trim());
      setCustomName('');
      setCustomAction('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-90 p-4 rounded-xl shadow-md mb-6"
    >
      <label className="block text-purple-700 font-semibold mb-2">Choose a Macro Template:</label>
      <select
        onChange={(e) => onSelectTemplate(e.target.value)}
        className="w-full border border-purple-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="">-- Select a template --</option>
        {templates.map((template, idx) => (
          <option key={idx} value={template}>{template}</option>
        ))}
      </select>

      <hr className="my-4" />

      <label className="block text-pink-700 font-semibold mb-2 flex items-center gap-2">
        <FaPlusCircle className="text-purple-500" />
        Create Your Own Macro:
      </label>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Macro name"
          className="w-full border border-pink-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="text"
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          placeholder="Action description"
          className="w-full border border-pink-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          Save Macro
        </button>
      </form>
    </motion.div>
  );
}

export default MacroTemplates;
