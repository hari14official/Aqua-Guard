/* ==============================================================================
 *  🚰 AquaGuard: ESP32 IoT Prototype Firmware
 *  Real-Time Multi-Sensor Telemetry & Firebase Realtime Database Sync
 * ==============================================================================
 *  Department of Electronics and Communication Engineering
 *  Thiagarajar College of Engineering (TCE), Madurai - Team 5
 * ==============================================================================
 *  HARDWARE PINOUT CONFIGURATION:
 *  - Turbidity Sensor Analog Out : GPIO 32 (ADC1_CH4 via 5V-to-3.3V divider)
 *  - HW-038 LOW Level Probe      : GPIO 34 (Input-only, pull-down)
 *  - HW-038 FULL Level Probe     : GPIO 35 (Input-only, pull-down)
 *  - HW-038 Probe Power Gate     : GPIO 21 (Pulsed 5ms to prevent galvanic rust)
 *  - IR Lid Tamper Proximity     : GPIO 27 (Digital Input, LOW = Obstacle/Lid off)
 *  - Relay CH1 (12V Solenoid)    : GPIO 25 (Active-LOW optocoupled relay)
 *  - Relay CH2 (Water Pump)      : GPIO 26 (Active-LOW optocoupled relay)
 *  - Active 5V Piezo Buzzer      : GPIO 23 (Active HIGH)
 *  - Status Green LED (Healthy)  : GPIO 18 (Active HIGH)
 *  - Status Red LED (Alarm/Dirty): GPIO 19 (Active HIGH)
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// -----------------------------------------------------------------------------
// 1. NETWORK & FIREBASE CREDENTIALS (REPLACE WITH YOUR DETAILS)
// -----------------------------------------------------------------------------
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Your Firebase Realtime Database URL (without trailing slash)
// Example: "https://aquaguard-tce-default-rtdb.firebaseio.com"
const char* FIREBASE_HOST = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com";

// Optional Database Secret/Auth token (leave empty if rules allow read/write)
const char* FIREBASE_AUTH = ""; 

// -----------------------------------------------------------------------------
// 2. PIN DEFINITIONS
// -----------------------------------------------------------------------------
#define PIN_TURBIDITY_ADC   32
#define PIN_LOW_PROBE       34
#define PIN_FULL_PROBE      35
#define PIN_PROBE_POWER     21
#define PIN_IR_TAMPER       27

#define PIN_RELAY_SOLENOID  25
#define PIN_RELAY_PUMP      26
#define PIN_BUZZER          23
#define PIN_LED_GREEN       18
#define PIN_LED_RED         19

// Turbidity voltage thresholds (at sensor 5V scale)
const float TURBIDITY_DIRTY_THRESH  = 2.50; // Below 2.5V = DIRTY (Contamination!)
const float TURBIDITY_CLOUDY_THRESH = 3.50; // Between 2.5V and 3.5V = CLOUDY

// -----------------------------------------------------------------------------
// 3. OPERATIONAL STATE VARIABLES
// -----------------------------------------------------------------------------
bool pumpState      = false;
bool valveState     = false;
bool alarmState     = false;
String currentMode  = "AUTO";
unsigned long lastUploadTime = 0;
const unsigned long UPLOAD_INTERVAL = 2000; // Push telemetry every 2 seconds

// -----------------------------------------------------------------------------
// 4. SENSOR READING FUNCTIONS
// -----------------------------------------------------------------------------

// Reads turbidity with a 64-sample median oversampled filter
float readTurbidityVoltage() {
  uint32_t adcSum = 0;
  for (int i = 0; i < 64; i++) {
    adcSum += analogRead(PIN_TURBIDITY_ADC);
    delayMicroseconds(250);
  }
  float rawADC = adcSum / 64.0;
  // Convert 12-bit ADC (0 - 4095) to 3.3V reference
  float pinVoltage = (rawADC / 4095.0) * 3.3;
  // Account for 5V to 3.3V resistor voltage divider (scale ~1.5x)
  float sensorVoltage = pinVoltage * 1.515;
  if (sensorVoltage > 5.0) sensorVoltage = 5.0;
  return sensorVoltage;
}

// Estimates NTU clarity from voltage curve
float calculateNTU(float voltage) {
  if (voltage >= 4.2) return 3.5;
  if (voltage >= 3.5) return 15.0;
  if (voltage >= 2.5) return 65.0;
  return 240.0; // Highly contaminated
}

// Reads liquid probes with pulsed 5ms energization to eliminate galvanic rust
void readLiquidLevel(bool &lowDetected, bool &fullDetected, int &percent, String &stateLabel) {
  // Pulse power pin HIGH
  digitalWrite(PIN_PROBE_POWER, HIGH);
  delay(5); // Allow water conductivity settling

  lowDetected  = digitalRead(PIN_LOW_PROBE) == HIGH;
  fullDetected = digitalRead(PIN_FULL_PROBE) == HIGH;

  // Turn power OFF immediately
  digitalWrite(PIN_PROBE_POWER, LOW);

  if (fullDetected) {
    percent = 95;
    stateLabel = "FULL";
  } else if (lowDetected) {
    percent = 55;
    stateLabel = "MID";
  } else {
    percent = 15;
    stateLabel = "LOW";
  }
}

// -----------------------------------------------------------------------------
// 5. FIREBASE REST JSON UPLOAD
// -----------------------------------------------------------------------------
void uploadTelemetryToFirebase(
  int levelPercent, 
  String levelState, 
  bool lowSensor, 
  bool fullSensor,
  float turbVoltage, 
  float turbNTU, 
  String turbStatus,
  bool lidTampered,
  bool pump, 
  bool valve, 
  bool alarm,
  String systemState,
  String systemStateLabel
) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Wi-Fi] Disconnected! Skipping Firebase sync.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Uses TLS without storing root certificate locally

  HTTPClient https;
  String url = String(FIREBASE_HOST) + "/tank/live.json";
  if (strlen(FIREBASE_AUTH) > 0) {
    url += "?auth=" + String(FIREBASE_AUTH);
  }

  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");

    // Construct valid JSON telemetry payload expected by AquaGuard web dashboard
    String json = "{";
    json += "\"levelPercent\":" + String(levelPercent) + ",";
    json += "\"levelState\":\"" + levelState + "\",";
    json += "\"lowSensor\":" + String(lowSensor ? "true" : "false") + ",";
    json += "\"fullSensor\":" + String(fullSensor ? "true" : "false") + ",";
    json += "\"turbidityVoltage\":" + String(turbVoltage, 2) + ",";
    json += "\"turbidityNTU\":" + String(turbNTU, 1) + ",";
    json += "\"turbidityStatus\":\"" + turbStatus + "\",";
    json += "\"objectDetected\":" + String(lidTampered ? "true" : "false") + ",";
    json += "\"pump\":" + String(pump ? "true" : "false") + ",";
    json += "\"valve\":" + String(valve ? "true" : "false") + ",";
    json += "\"alarm\":" + String(alarm ? "true" : "false") + ",";
    json += "\"mode\":\"" + currentMode + "\",";
    json += "\"systemState\":\"" + systemState + "\",";
    json += "\"systemStateLabel\":\"" + systemStateLabel + "\",";
    json += "\"wifiRssi\":" + String(WiFi.RSSI()) + ",";
    json += "\"isOnline\":true,";
    json += "\"lastSeen\":{\".sv\":\"timestamp\"}"; // Firebase server timestamp
    json += "}";

    int httpResponseCode = https.PUT(json);
    if (httpResponseCode > 0) {
      Serial.printf("[Firebase] PUT Status: %d | Data synced successfully.\n", httpResponseCode);
    } else {
      Serial.printf("[Firebase] PUT Error: %s\n", https.errorToString(httpResponseCode).c_str());
    }
    https.end();
  }
}

// -----------------------------------------------------------------------------
// 6. SETUP & INITIALIZATION
// -----------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("  🚰 AquaGuard ESP32 Prototype Initializing...   ");
  Serial.println("==================================================");

  // Configure Pin Modes
  pinMode(PIN_LOW_PROBE, INPUT);
  pinMode(PIN_FULL_PROBE, INPUT);
  pinMode(PIN_IR_TAMPER, INPUT_PULLUP);
  pinMode(PIN_PROBE_POWER, OUTPUT);
  digitalWrite(PIN_PROBE_POWER, LOW);

  pinMode(PIN_RELAY_SOLENOID, OUTPUT);
  pinMode(PIN_RELAY_PUMP, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);

  // Relays are active-LOW: HIGH = OFF (safe default)
  digitalWrite(PIN_RELAY_SOLENOID, HIGH);
  digitalWrite(PIN_RELAY_PUMP, HIGH);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED_GREEN, HIGH);
  digitalWrite(PIN_LED_RED, LOW);

  // Configure ADC1
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // Connect to Wi-Fi
  Serial.printf("[Wi-Fi] Connecting to SSID: %s ", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[Wi-Fi] Connected! IP: %s | RSSI: %d dBm\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
  } else {
    Serial.println("\n[Wi-Fi] Connection timed out! Continuing in autonomous local mode.");
  }
}

// -----------------------------------------------------------------------------
// 7. MAIN REPETITIVE CONTROL LOOP (FreeRTOS Core 1 execution)
// -----------------------------------------------------------------------------
void loop() {
  // A. Read Sensors
  float turbVoltage = readTurbidityVoltage();
  float turbNTU     = calculateNTU(turbVoltage);
  String turbStatus = "CLEAR";
  if (turbVoltage < TURBIDITY_DIRTY_THRESH) {
    turbStatus = "DIRTY";
  } else if (turbVoltage < TURBIDITY_CLOUDY_THRESH) {
    turbStatus = "CLOUDY";
  }

  bool lowSensor = false, fullSensor = false;
  int levelPercent = 50;
  String levelState = "MID";
  readLiquidLevel(lowSensor, fullSensor, levelPercent, levelState);

  // IR sensor: LOW when lid is off or obstacle blocking beam
  bool lidTampered = digitalRead(PIN_IR_TAMPER) == LOW;

  // B. Safety Interlock Decision Engine
  bool isHazard = (turbStatus == "DIRTY") || lidTampered;
  String systemState = "IDLE_NORMAL";
  String systemStateLabel = "Normal Autonomous Mode";

  if (isHazard) {
    alarmState = true;
    valveState = false; // Emergency: Clamp municipal inlet immediately
    pumpState  = false; // Emergency: Shut down distribution pump

    digitalWrite(PIN_RELAY_SOLENOID, HIGH); // Cut valve (Active LOW)
    digitalWrite(PIN_RELAY_PUMP, HIGH);     // Cut pump (Active LOW)
    digitalWrite(PIN_BUZZER, HIGH);          // Sound 85dB buzzer
    digitalWrite(PIN_LED_RED, HIGH);         // Red Alert LED
    digitalWrite(PIN_LED_GREEN, LOW);

    if (turbStatus == "DIRTY") {
      systemState = "CONTAMINATION_ALERT";
      systemStateLabel = "Contamination Detected – Inlet Clamped";
    } else {
      systemState = "OBJECT_DETECTED";
      systemStateLabel = "Lid Tampering / Intrusion Active";
    }
  } else {
    alarmState = false;
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_LED_RED, LOW);
    digitalWrite(PIN_LED_GREEN, HIGH); // Healthy green LED

    // C. Autonomous Hysteresis Level Control
    if (currentMode == "AUTO") {
      if (levelPercent <= 20) {
        // Tank LOW -> Trigger Inflow
        valveState = true;
        pumpState  = true;
        systemState = "FILLING";
        systemStateLabel = "Tank Low (20%) – Filling Active";
      } else if (levelPercent >= 90) {
        // Tank FULL -> Auto Cutoff
        valveState = false;
        pumpState  = false;
        systemState = "TANK_FULL";
        systemStateLabel = "Tank Full (90%) – Inflow Cutoff";
      }

      // Assert physical relay states (Active LOW: LOW = ON, HIGH = OFF)
      digitalWrite(PIN_RELAY_SOLENOID, valveState ? LOW : HIGH);
      digitalWrite(PIN_RELAY_PUMP, pumpState ? LOW : HIGH);
    }
  }

  // D. Periodic Telemetry Streaming to Firebase (Every 2 seconds)
  if (millis() - lastUploadTime >= UPLOAD_INTERVAL) {
    lastUploadTime = millis();
    uploadTelemetryToFirebase(
      levelPercent, 
      levelState, 
      lowSensor, 
      fullSensor,
      turbVoltage, 
      turbNTU, 
      turbStatus,
      lidTampered,
      pumpState, 
      valveState, 
      alarmState,
      systemState,
      systemStateLabel
    );
  }

  delay(50); // 20 Hz loop frequency
}
