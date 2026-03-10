import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  // --- 1. THE BRAIN (State) ---
  const [currentNumber, setCurrentNumber] = useState('0');
  const [previousNumber, setPreviousNumber] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  // --- 2. THE LOGIC ---
  const handlePress = (buttonValue: string) => {
    // Clear everything
    if (buttonValue === 'C') {
      setCurrentNumber('0');
      setPreviousNumber(null);
      setOperator(null);
      return;
    }

    // Handle math operators
    if (['+', '-', 'x', '/'].includes(buttonValue)) {
      setOperator(buttonValue);
      setPreviousNumber(currentNumber);
      setCurrentNumber('0');
      return;
    }

    // Do the calculation
    if (buttonValue === '=') {
      let result = 0;
      const current = parseFloat(currentNumber);
      const previous = parseFloat(previousNumber!);

      if (operator === '+') result = previous + current;
      if (operator === '-') result = previous - current;
      if (operator === 'x') result = previous * current;
      if (operator === '/') result = previous / current;

      setCurrentNumber(result.toString());
      setPreviousNumber(null);
      setOperator(null);
      return;
    }

    // Handle normal numbers
    if (currentNumber === '0') {
      setCurrentNumber(buttonValue); // Replace the '0'
    } else {
      setCurrentNumber(currentNumber + buttonValue); // Append the number
    }
  };

  // --- A Helper Component for our Buttons ---
  const CalcButton = ({ title, color = '#333' }: { title: string, color?: string }) => (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]} 
      onPress={() => handlePress(title)}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  // --- 3. THE UI ---
  return (
    <View style={styles.container}>
      {/* Top Display Area */}
      <View style={styles.displayContainer}>
        {previousNumber && operator && (
          <Text style={styles.previousText}>{previousNumber} {operator}</Text>
        )}
        <Text style={styles.displayText}>{currentNumber}</Text>
      </View>

      {/* Button Grid Area */}
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton title="C" color="#a5a5a5" />
          <CalcButton title="/" color="#f09a36" />
        </View>
        <View style={styles.row}>
          <CalcButton title="7" />
          <CalcButton title="8" />
          <CalcButton title="9" />
          <CalcButton title="x" color="#f09a36" />
        </View>
        <View style={styles.row}>
          <CalcButton title="4" />
          <CalcButton title="5" />
          <CalcButton title="6" />
          <CalcButton title="-" color="#f09a36" />
        </View>
        <View style={styles.row}>
          <CalcButton title="1" />
          <CalcButton title="2" />
          <CalcButton title="3" />
          <CalcButton title="+" color="#f09a36" />
        </View>
        <View style={styles.row}>
          <CalcButton title="0" />
          <CalcButton title="." />
          <CalcButton title="=" color="#f09a36" />
        </View>
      </View>
    </View>
  );
}

// --- 4. THE STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark mode background
    justifyContent: 'flex-end',
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
  },
  previousText: {
    color: '#a5a5a5',
    fontSize: 24,
  },
  displayText: {
    color: '#fff',
    fontSize: 70,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes it a perfect circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
  },
});