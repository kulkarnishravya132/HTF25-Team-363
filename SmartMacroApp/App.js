import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [selectedMacro, setSelectedMacro] = useState('');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [userMacros, setUserMacros] = useState({});

  const predefinedMacros = {
    'Join Zoom': () => {
      Linking.openURL('https://zoom.us/j/123456789');
    },
    'Create Report': () => {
      Alert.alert('📄 Report', 'Your daily report has been generated and saved.');
    },
    'Send Email': () => {
      Linking.openURL(
        'mailto:team@example.com?subject=Daily Update&body=Hello team, here’s today’s update.'
      );
    },
  };

  const allMacros = { ...predefinedMacros, ...userMacros };

  useEffect(() => {
    const loadMacros = async () => {
      const stored = await AsyncStorage.getItem('userMacros');
      const parsed = stored ? JSON.parse(stored) : {};
      setUserMacros(parsed);
    };
    loadMacros();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (
        scheduledDate &&
        selectedMacro &&
        now.getHours() === scheduledDate.getHours() &&
        now.getMinutes() === scheduledDate.getMinutes() &&
        now.getDate() === scheduledDate.getDate() &&
        now.getMonth() === scheduledDate.getMonth() &&
        now.getFullYear() === scheduledDate.getFullYear()
      ) {
        handleRunMacro();
        setScheduledDate(null);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [scheduledDate, selectedMacro]);

  const handleCreateMacro = () => {
    if (!customName || !customDescription) {
      Alert.alert('Missing Fields', 'Please enter both name and description.');
      return;
    }
    const newMacro = () => {
      Alert.alert(`🚀 ${customName}`, customDescription);
    };
    const updated = { ...userMacros, [customName]: newMacro };
    setUserMacros(updated);
    AsyncStorage.setItem('userMacros', JSON.stringify(updated));
    setCustomName('');
    setCustomDescription('');
    Alert.alert('✅ Macro Created', `Macro "${customName}" is ready to use.`);
  };

  const handleRunMacro = () => {
    if (allMacros[selectedMacro]) {
      allMacros[selectedMacro]();
    } else {
      Alert.alert('No macro selected');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const updated = new Date(date);
      if (scheduledDate) {
        updated.setHours(scheduledDate.getHours());
        updated.setMinutes(scheduledDate.getMinutes());
      }
      setScheduledDate(updated);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      const updated = scheduledDate ? new Date(scheduledDate) : new Date();
      updated.setHours(time.getHours());
      updated.setMinutes(time.getMinutes());
      setScheduledDate(updated);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Macro Automator</Text>

      <Text style={styles.label}>Select a Macro Template:</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedMacro}
          onValueChange={(itemValue) => setSelectedMacro(itemValue)}
        >
          <Picker.Item label="-- Choose Macro --" value="" />
          {Object.keys(allMacros).map((macro) => (
            <Picker.Item key={macro} label={macro} value={macro} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRunMacro}>
        <Text style={styles.buttonText}>Run Macro Now</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Schedule Macro:</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Pick Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate || new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Pick Time</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={scheduledDate || new Date()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>📅 Scheduled Macro</Text>
        <Text><Text style={styles.bold}>Macro:</Text> {selectedMacro || 'None selected'}</Text>
        <Text>
          <Text style={styles.bold}>Date:</Text>{' '}
          {scheduledDate ? scheduledDate.toDateString() : 'Not set'}
        </Text>
        <Text>
          <Text style={styles.bold}>Time:</Text>{' '}
          {scheduledDate ? scheduledDate.toLocaleTimeString() : 'Not set'}
        </Text>
      </View>

      <Text style={styles.label}>Create Your Own Macro:</Text>
      <TextInput
        style={styles.input}
        placeholder="Macro name"
        value={customName}
        onChangeText={setCustomName}
      />
      <TextInput
        style={styles.input}
        placeholder="Macro description"
        value={customDescription}
        onChangeText={setCustomDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateMacro}>
        <Text style={styles.buttonText}>Save Macro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fce4ec',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 6,
    marginTop: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ce93d8',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ce93d8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ab47bc',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e91e63',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
});
