void setup() {
  pinMode(2, OUTPUT);
  pinMode(12,  PUT);
  Serial.begin(9600);
}

void loop() {
  if(digitalRead(12) == HIGH)
  {
    Serial.println("HIGH");
    digitalWrite(2, HIGH);
  }
  else
  {
    Serial.println("LOW");
    digitalWrite(2, LOW);
  }
  delay(500);
}