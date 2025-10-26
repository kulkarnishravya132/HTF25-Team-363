import { useState } from 'react';
import CommandInput from './CommandInput';
import Scheduler from './Scheduler';
import MacroTemplates from './MacroTemplates';
import { FaMagic, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Predefined macros
const predefinedMacros = {
  "Send email to team": () => {
    window.location.href = "mailto:team@example.com?subject=Update&body=Hello team!";
  },
  "Create daily report": () => {
    const blob = new Blob(["Daily report content..."], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "daily-report.txt";
    link.click();
  },
  "Open Zoom meeting": () => {
    window.open("https://zoom.us/j/123456789", "_blank");
  },
};

// Load user macros from localStorage
const loadUserMacros = () => {
  const stored = localStorage.getItem('userMacros');
  return stored ? JSON.parse(stored) : {};
};

// Save only user-defined macros to localStorage
const saveUserMacros = (macros) => {
  const userMacros = Object.fromEntries(
    Object.entries(macros).filter(([key]) => !predefinedMacros[key])
  );
  localStorage.setItem('userMacros', JSON.stringify(userMacros));
};

function App() {
  const [macroCommand, setMacroCommand] = useState('');
  const [scheduledTime, setScheduledTime] = useState(null);
  const [macros, setMacros] = useState(() => ({
    ...predefinedMacros,
    ...loadUserMacros()
  }));

  const handleCommandSubmit = (command) => {
    setMacroCommand(command);
    if (macros[command]) {
      macros[command]();
    } else {
      console.log("⚠️ Unknown macro command");
    }
  };

  const handleSelectTemplate = (template) => {
    setMacroCommand(template);
    if (macros[template]) macros[template]();
  };

  const handleCreateMacro = (name, action) => {
    if (!name || !action) return;
    const newMacro = () => alert(`✨ Custom Macro: ${action}`);
    const updatedMacros = { ...macros, [name]: newMacro };
    setMacros(updatedMacros);
    setMacroCommand(name);
    newMacro();
    saveUserMacros(updatedMacros);
  };

  const handleSchedule = (time) => {
    setScheduledTime(time);
    console.log(`🕒 Macro scheduled for: ${time.toLocaleString()}`);
  };

  const runAllMacros = () => {
    console.log("🚀 Running all scheduled macros...");
    if (macroCommand && macros[macroCommand]) {
      macros[macroCommand]();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-extrabold text-purple-700 mb-2 text-center flex items-center justify-center gap-2">
          <FaMagic className="text-pink-500" />
          Smart Macro Automator
        </h1>
        <p className="text-md text-blue-700 mb-6 text-center">
          Automate your digital tasks with a single command.
        </p>

        <MacroTemplates
          onSelectTemplate={handleSelectTemplate}
          onCreateMacro={handleCreateMacro}
        />

        <CommandInput onSubmit={handleCommandSubmit} />
        <Scheduler onSchedule={handleSchedule} />

        {macroCommand && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white bg-opacity-90 rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-pink-600 mb-3">🌟 Macro Preview</h2>
            <p><strong>Command:</strong> {macroCommand}</p>
            {scheduledTime ? (
              <p><strong>Scheduled for:</strong> {scheduledTime.toLocaleString()}</p>
            ) : (
              <p className="text-gray-500 italic">No schedule set</p>
            )}
          </motion.div>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
        onClick={runAllMacros}
      >
        <FaRocket size={24} />
      </motion.button>
    </div>
  );
}

export default App;

