// Pin-Mapping von David Mellis!

#define LEDGRN 8 // grün (LED low active)
#define LEDRED 3 // rot (LED high active)
#define MEASURE A1 // Pin 0 für Messung ist A1! 
#define MPOWER 2 // Pin 2 für Stromversorgung für Messung

// alles initialisieren und LEDs abschalten
void setup() {
  pinMode(LEDGRN, OUTPUT);
  digitalWrite(LEDGRN, LOW);
  pinMode(LEDRED, OUTPUT);
  digitalWrite(LEDRED, LOW);
  pinMode(MPOWER, OUTPUT);
  digitalWrite(MPOWER, LOW);
  digitalWrite(LEDGRN, HIGH);
}

// Der loop() läuft wieder und wieder:
void loop() {
  digitalWrite(MPOWER, HIGH); 
  delay(100);
  if (analogRead(MEASURE) < 200) {
    // rot leuchtet
    digitalWrite(LEDGRN, HIGH); // low active
    digitalWrite(LEDRED, HIGH); // high active
  } else {
    // grün leuchtet
    digitalWrite(LEDGRN, LOW); // low active
    digitalWrite(LEDRED, LOW); // high active
  }
  digitalWrite(MPOWER, LOW);
  // 1 Sekunde Intervall, bitte erhöhen...
  delay(1000);
  // für die Messung kurz (0,2s) blinken
  digitalWrite(LEDGRN, HIGH); // low active
  digitalWrite(LEDRED, LOW); // high active
  delay(200); 
}

