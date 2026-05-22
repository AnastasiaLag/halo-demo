int LED = 13;
int MQ2pin = A0;
int inPin = 7;

void setup()
{
  Serial.begin(9600);
  Serial.println("H.A.L.O. System Initialized. Monitoring work environment...");
  pinMode(LED, OUTPUT);
  pinMode(inPin, INPUT);
}

void loop()
{
  float sensorValue = analogRead(MQ2pin);
  int tiltVal = digitalRead(inPin);

  bool gasDetected  = (sensorValue >= 250);
  bool tiltDetected = (tiltVal == 0);

  if (gasDetected || tiltDetected)
  {
    digitalWrite(LED, HIGH);

    if (gasDetected)
      Serial.println("GAS DETECTED!!");

    if (tiltDetected)
      Serial.println("TILT SENSOR TRIGGERED!");
  }
  else
  {
    digitalWrite(LED, LOW);
  }

  delay(1000);
}