import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [macroCommand, setMacroCommand] = useState('');
  const [scheduledTime, setScheduledTime] = useState(null);
  const [macros, setMacros] = useState({});
  const [customName, setCustomName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const predefinedMacros = {
    'Send email to team': () => {
      Linking.openURL(
        'mailto:team@example.com?subject=Daily Update&body=Hi team, here’s today’s update...'
      );
    },
    'Create daily report': () => {
      Alert.alert('📄 Report', 'Daily report created!');
    },
    'Open Zoom meeting': () => {
      Linking.openURL('https://zoom.us/j/123456789');
    },
  };

  useEffect(() => {
    const loadMacros = async () => {
      const stored = await AsyncStorage.getItem('userMacros');
      const parsed = stored ? JSON.parse(stored) : {};
      setMacros({ ...predefinedMacros, ...parsed });
    };
    loadMacros();
  }, []);

  const saveUserMacros = async (updated) => {
    const userMacros = Object.fromEntries(
      Object.entries(updated).filter(([key]) => !predefinedMacros[key])
    );
    await AsyncStorage.setItem('userMacros', JSON.stringify(userMacros));
  };

  const createEmailMacro = (to, subject, body) => {
    return () => {
      const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      Linking.openURL(url);
    };
  };

  const handleCreateMacro = () => {
    if (!customName || !emailTo || !emailSubject || !emailBody) {
      Alert.alert('Missing Fields', 'Please fill in all fields to create a macro.');
      return;
    }
    const newMacro = createEmailMacro(emailTo, emailSubject, emailBody);
    const updated = { ...macros, [customName]: newMacro };
    setMacros(updated);
    setMacroCommand(customName);
    saveUserMacros(updated);
    setCustomName('');
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
  };

  const handleRunMacro = () => {
    if (macros[macroCommand]) {
      macros[macroCommand]();
    } else {
      Alert.alert('Unknown Macro', 'No macro found for that command.');
    }
  };

  const handleSchedule = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setScheduledTime(selectedDate);
      Alert.alert('🕒 Scheduled', `Macro scheduled for ${selectedDate.toLocaleTimeString()}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Macro Automator</Text>

      <Text style={styles.label}>Choose a Macro Template:</Text>
      {Object.keys(predefinedMacros).map((template) => (
        <TouchableOpacity
          key={template}
          style={styles.button}
          onPress={() => {
            setMacroCommand(template);
            predefinedMacros[template]();
          }}
        >
          <Text style={styles.buttonText}>{template}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Create Email Macro:</Text>
      <TextInput
        style={styles.input}
        placeholder="Macro name"
        value={customName}
        onChangeText={setCustomName}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient email"
        value={emailTo}
        onChangeText={setEmailTo}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={emailSubject}
        onChangeText={setEmailSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Body"
        value={emailBody}
        onChangeText={setEmailBody}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateMacro}>
        <Text style={styles.buttonText}>Save Email Macro</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Run Macro by Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Send email to team"
        value={macroCommand}
        onChangeText={setMacroCommand}
      />
      <TouchableOpacity style={styles.button} onPress={handleRunMacro}>
        <Text style={styles.buttonText}>Run Macro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>Set Alarm Time (Optional)</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleSchedule}
        />
      )}

      {macroCommand ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>🌟 Macro Preview</Text>
          <Text><Text style={styles.bold}>Command:</Text> {macroCommand}</Text>
          {scheduledTime ? (
            <Text>
              <Text style={styles.bold}>Scheduled for:</Text> {scheduledTime.toLocaleTimeString()}
            </Text>
          ) : (
            <Text style={styles.italic}>No schedule set</Text>
          )}
        </View>
      ) : null}
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
  italic: {
    fontStyle: 'italic',
    color: '#757575',
  },
});
