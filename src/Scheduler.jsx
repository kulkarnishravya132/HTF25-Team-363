import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';

function Scheduler({ onSchedule }) {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTime) {
      onSchedule(selectedTime);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 p-4 rounded-xl shadow-md"
    >
      <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-2">
        <FaClock className="text-purple-500" />
        Set Alarm Time (Optional):
      </label>
      <DatePicker
        selected={selectedTime}
        onChange={(date) => setSelectedTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Alarm Time"
        dateFormat="h:mm aa"
        placeholderText="Choose a time"
        className="w-full border border-blue-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        Schedule
      </button>
    </motion.form>
  );
}

export default Scheduler;