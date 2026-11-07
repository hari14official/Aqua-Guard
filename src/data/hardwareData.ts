import { HardwareItem } from '../components/HardwareDetailModal';

export const HARDWARE_COMPONENTS: HardwareItem[] = [
  {
    id: "esp32",
    name: "ESP32 DevKit V1",
    model: "ESP-WROOM-32 / 30-Pin DIP",
    category: "Microcontroller & Cloud Gateway",
    role: "Central Processing, ADC Filtering & Wi-Fi Gateway",
    image: "/assets/components/esp32.jpg",
    price: "₹380 - ₹450",
    statusTag: "Primary Core MCU",
    summary: "Xtensa dual-core 32-bit LX6 microprocessor clocked at 240 MHz with integrated 2.4 GHz 802.11 b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR. Runs FreeRTOS non-blocking task loops, ADC1 optical turbidity sampling, dual-probe debounce, and bi-directional Firebase RTDB synchronization.",
    howItWorks: {
      physicalPrinciple: "The ESP-WROOM-32 integrates two Harvard architecture CPU cores (Protocol Core 0 and Application Core 1) with 520 KB SRAM and 4 MB Flash memory. Its high-speed silicon substrate facilitates 240 MIPS calculation throughput.",
      signalProcessing: "ADC1 channel 4 (GPIO32) is configured with 11dB input attenuation (0-3.3V dynamic range) and samples 64-point oversampled median filtering to eliminate electrical noise induced by motor switching.",
      esp32Interaction: "Core 1 executes the 50ms real-time control interlock loop (reading probes, comparing turbidity against threshold, asserting relay states). Core 0 manages Wi-Fi background beaconing, WPA2 encryption, and JSON serialization to Firebase RTDB.",
      failSafeMechanism: "Internal Task Watchdog Timer (TWDT) triggers automatic hardware reboot if the network stack or sampling loop hangs for > 3.0 seconds, returning all control pins to safe LOW states."
    },
    specs: [
      { label: "Architecture", value: "Xtensa 32-bit Dual-Core LX6" },
      { label: "Clock Speed", value: "240 MHz (Up to 600 DMIPS)" },
      { label: "Operating Voltage", value: "3.3V Logic (5V Micro-USB In)" },
      { label: "Wi-Fi Protocol", value: "802.11 b/g/n (Up to 150 Mbps)" },
      { label: "ADC Channels", value: "12-bit SAR ADC (Configured on ADC1)" },
      { label: "Flash Memory", value: "4 MB SPI Flash" },
      { label: "SRAM", value: "520 KB Internal SRAM" },
      { label: "GPIO Pins", value: "30-Pin Dual Inline Package (DIP)" }
    ],
    wiring: [
      { pinName: "VIN / VCC", esp32Pin: "VIN", signalType: "Power Input", voltage: "5.0V DC", notes: "Supplied from common 5V 2A switching buck converter" },
      { pinName: "GND", esp32Pin: "GND", signalType: "Common Ground", voltage: "0V", notes: "Star-grounded to eliminate motor ground bounce" },
      { pinName: "GPIO32", esp32Pin: "GPIO32 (ADC1_CH4)", signalType: "Analog Input", voltage: "0 - 3.3V", notes: "Connected to turbidity divider midpoint" },
      { pinName: "GPIO34", esp32Pin: "GPIO34 (Input Only)", signalType: "Digital Input", voltage: "3.3V", notes: "Low Water Level Probe signal" },
      { pinName: "GPIO35", esp32Pin: "GPIO35 (Input Only)", signalType: "Digital Input", voltage: "3.3V", notes: "Full Water Level Probe signal" },
      { pinName: "GPIO26", esp32Pin: "GPIO26", signalType: "Digital Output", voltage: "3.3V", notes: "Relay CH1 - Submersible Pump" },
      { pinName: "GPIO25", esp32Pin: "GPIO25", signalType: "Digital Output", voltage: "3.3V", notes: "Relay CH2 - Normally Closed Solenoid Valve" },
      { pinName: "GPIO23", esp32Pin: "GPIO23", signalType: "Digital Output", voltage: "3.3V", notes: "5V Piezo Alarm Buzzer" },
      { pinName: "GPIO18", esp32Pin: "GPIO18", signalType: "Digital Output", voltage: "3.3V", notes: "Status Green LED (Healthy System)" },
      { pinName: "GPIO19", esp32Pin: "GPIO19", signalType: "Digital Output", voltage: "3.3V", notes: "Status Red LED (Contamination Alert)" }
    ],
    codeSnippet: `// ESP32 FreeRTOS Core 1 Sensor Task
void SensorTask(void *pvParameters) {
  for(;;) {
    // 64-sample median filtered ADC read
    uint32_t adcSum = 0;
    for(int i = 0; i < 64; i++) {
      adcSum += analogRead(32);
      delayMicroseconds(200);
    }
    float rawVoltage = (adcSum / 64.0) * (3.3 / 4095.0);
    float sensorVoltage = rawVoltage * 1.5; // Divider compensation (5V scale)

    bool lowProbe = digitalRead(34);
    bool fullProbe = digitalRead(35);

    // Evaluate interlock logic
    if (sensorVoltage < TURBIDITY_THRESHOLD_V) {
      triggerContaminationInterlock();
    }
    vTaskDelay(pdMS_TO_TICKS(50));
  }
}`,
    whyChosenByTCE: "Eliminated the need for separate Arduino + Wi-Fi shields (ESP8266 AT commands). Dual-core allows ADC1 reads without Wi-Fi RF jitter, providing enterprise-grade reliability under ₹450."
  },
  {
    id: "hw038",
    name: "HW-038 Water Level Sensor Probes (x2)",
    model: "HW-038 / Immersion Gold Plate",
    category: "Level Sensing",
    role: "Solid-State High/Low Level Sensing",
    image: "/assets/components/hw038.jpg",
    price: "₹45 - ₹65 each",
    statusTag: "Solid-State Probe Pair",
    summary: "Pairs of parallel immersion-gold conductive traces mounted at fixed tank elevations: 20% (LOW probe) and 90% (FULL probe). Replaces fragile mechanical float switches with zero moving parts and pulse-energized anti-galvanic operation.",
    howItWorks: {
      physicalPrinciple: "When water contacts the parallel copper/gold traces, the liquid acts as an electrolytic conductor, closing the circuit between the VCC trace and sense trace and pulling the sense node HIGH through conductivity.",
      signalProcessing: "Conditioning circuit with LM393 comparator transforms conductive resistance change into a crisp 0V or 3.3V logic level without chatter.",
      esp32Interaction: "Pulsed GPIO energization: The ESP32 supplies power to the probes for only 5 milliseconds every 500ms before taking a reading, then immediately drives the power pin to 0V. This eliminates DC galvanic corrosion.",
      failSafeMechanism: "Probe lines are pulled LOW via 10kΩ resistors. If a probe wire is severed or unplugged, the system fails to a safe 'LOW' level reading."
    },
    specs: [
      { label: "Working Voltage", value: "3.3V - 5.0V DC" },
      { label: "Working Current", value: "< 20 mA (when energized)" },
      { label: "Sensor Type", value: "Conductive Immersion Gold" },
      { label: "Detection Area", value: "40 mm x 16 mm active traces" },
      { label: "Corrosion Prevention", value: "Pulsed 5ms Duty Cycle" },
      { label: "Operational Life", value: "> 50,000 hours (with pulsed drive)" }
    ],
    wiring: [
      { pinName: "VCC", esp32Pin: "GPIO21 (Pulse Power)", signalType: "Switched Power", voltage: "3.3V DC", notes: "Energized 5ms prior to ADC read" },
      { pinName: "GND", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Common reference" },
      { pinName: "Signal Low", esp32Pin: "GPIO34", signalType: "Digital Input", voltage: "0 - 3.3V", notes: "Low level trigger (20% tank depth)" },
      { pinName: "Signal Full", esp32Pin: "GPIO35", signalType: "Digital Input", voltage: "0 - 3.3V", notes: "Full level trigger (90% tank depth)" }
    ],
    codeSnippet: `// Pulsed Anti-Galvanic Immersion Reading
bool readPulsedProbe(int powerPin, int sensePin) {
  digitalWrite(powerPin, HIGH); // Energize probe
  delayMicroseconds(500);       // Allow trace settling
  bool state = digitalRead(sensePin);
  digitalWrite(powerPin, LOW);  // Depower immediately to prevent electrolysis
  return state;
}`,
    whyChosenByTCE: "Replaced mechanical floats that jam due to algae, calcium deposits, and lime buildup in overhead municipal tanks."
  },
  {
    id: "turbidity",
    name: "TS-300B Optical Turbidity Sensor",
    model: "TS-300B / LM393 Driver Board",
    category: "Optical Water Quality",
    role: "Optical Nephelometric Contamination Detector",
    image: "/assets/components/turbidity.jpg",
    price: "₹420 - ₹550",
    statusTag: "Optical Nephelometer",
    summary: "Infrared nephelometric optical sensor that measures light scattered by suspended particulates (clay, sewage, silt, iron rust). Translates particulate density into a precise 0-5V analog voltage proportional to NTU (Nephelometric Turbidity Units).",
    howItWorks: {
      physicalPrinciple: "A 940nm infrared emitting diode (IRED) projects a collimated beam across a water sample slot toward an opposing phototransistor. Suspended particles cause Tyndall scattering, attenuating transmitted beam intensity.",
      signalProcessing: "The conditioning board converts phototransistor collector current into an analog voltage: Pure clean water delivers ~4.1V-4.5V; high mud/turbidity drops voltage below 2.5V.",
      esp32Interaction: "Output is stepped down via a 10kΩ:20kΩ precision resistor voltage divider to 0-3.0V and sampled by ESP32 ADC1 Channel 4 (GPIO32).",
      failSafeMechanism: "Threshold voltage calibrated to 3.0V. Any reading below 3.0V causes the ESP32 to immediately de-energize Relay CH2, snapping the Normally Closed solenoid valve shut."
    },
    specs: [
      { label: "Operating Voltage", value: "5.0V DC (Conditioning Board)" },
      { label: "Output Voltage", value: "0 - 4.5V Analog (Divided to 0-3.0V)" },
      { label: "Operating Wavelength", value: "940 nm Infrared" },
      { label: "Measuring Range", value: "0 - 3000 NTU" },
      { label: "Response Time", value: "< 500 ms" },
      { label: "Operating Temp", value: "-30°C to +80°C" }
    ],
    wiring: [
      { pinName: "VCC", esp32Pin: "5V (External Supply)", signalType: "DC Power", voltage: "5.0V DC", notes: "Requires clean 5V rail for stable IR intensity" },
      { pinName: "GND", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Tied to common ESP32 ground" },
      { pinName: "Analog Out", esp32Pin: "GPIO32 via Divider", signalType: "Analog Voltage", voltage: "0 - 3.0V", notes: "Connected through 10k:20k divider midpoint" }
    ],
    codeSnippet: `// Turbidity Voltage & NTU Calculation
float calculateNTU(float sensorVoltage5V) {
  // Polynomial curve fit from ISO 7027 nephelometric calibration
  if (sensorVoltage5V >= 4.2) return 0.0; // Crystal clear
  float ntu = -1120.4 * pow(sensorVoltage5V, 2) + 5742.3 * sensorVoltage5V - 4352.9;
  return max(0.0f, ntu);
}`,
    whyChosenByTCE: "Provides instant continuous optical screening of municipal inlet water BEFORE contaminated water can enter and ruin the overhead storage reservoir."
  },
  {
    id: "ir-sensor",
    name: "LM393 IR Obstacle & Debris Sensor",
    model: "FC-51 / LM393 Dual Comparator",
    category: "Physical Obstruction Screening",
    role: "Municipal Inlet Mesh Debris & Pest Detection",
    image: "/assets/components/ir-sensor.jpg",
    price: "₹35 - ₹50",
    statusTag: "Debris Intercept",
    summary: "Mounted at the inlet pipe filtration mesh. Emits 850nm infrared light to detect physical debris, insects, leaves, or heavy sediment cake blinding the primary inlet filter.",
    howItWorks: {
      physicalPrinciple: "An IR emitter diode transmits pulsed infrared light. In normal conditions, the light dissipates into the clear pipe. When physical debris lodges on the wire mesh, reflected IR returns to the photodiode receiver.",
      signalProcessing: "On-board LM393 comparator compares receiver voltage against an adjustable multi-turn potentiometer threshold.",
      esp32Interaction: "Connected to GPIO27 configured as digital INPUT_PULLUP with hardware interrupt (CHANGE) to detect debris instantly without CPU polling.",
      failSafeMechanism: "When debris is sensed, the system sounds the buzzer and illuminates the Red LED to prompt user manual cleaning."
    },
    specs: [
      { label: "Detection Angle", value: "35° conical beam" },
      { label: "Detection Distance", value: "2 cm to 30 cm (adjustable)" },
      { label: "Operating Voltage", value: "3.3V - 5.0V DC" },
      { label: "Comparator IC", value: "LM393 Low Power Differential" },
      { label: "Output Signal", value: "Active LOW Digital (0V debris, 3.3V clear)" }
    ],
    wiring: [
      { pinName: "VCC", esp32Pin: "3.3V", signalType: "Power", voltage: "3.3V DC", notes: "Directly powered from 3.3V rail" },
      { pinName: "GND", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Common ground" },
      { pinName: "OUT", esp32Pin: "GPIO27", signalType: "Digital Input", voltage: "0 or 3.3V", notes: "Internal pull-up enabled" }
    ],
    codeSnippet: `// Interrupt-driven Debris Detection
void IRAM_ATTR onInletMeshBlocked() {
  inletObstacleDetected = true;
}
void setup() {
  pinMode(27, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(27), onInletMeshBlocked, FALLING);
}`,
    whyChosenByTCE: "In Indian municipal water supply lines, pipe rust chunks and street debris frequently clog pipes; this sensor warns operators before backpressure blows pipeline joints."
  },
  {
    id: "relay",
    name: "5V Dual-Channel Relay Module",
    model: "Songle SRD-05VDC-SL-C with Optocoupler",
    category: "Actuator Isolation Switching",
    role: "Galvanic Actuator Isolation & High-Current Switching",
    image: "/assets/components/relay.jpg",
    price: "₹95 - ₹130",
    statusTag: "Opto-Isolated Switch",
    summary: "Dual electromagnetic relay board equipped with EL817 optocouplers to provide 2500V galvanic isolation between the low-voltage 3.3V ESP32 and high-current 12V DC inductive loads (pump motor and solenoid valve coil).",
    howItWorks: {
      physicalPrinciple: "The ESP32 digital pin drives the infrared LED inside the EL817 optocoupler. The internal phototransistor conducts, switching a PNP transistor that energizes the 5V relay electromagnetic coil.",
      signalProcessing: "Active-LOW triggering ensures the relay remains OFF if the ESP32 reset line floats during bootloader execution.",
      esp32Interaction: "GPIO26 controls Relay CH1 (Pump); GPIO25 controls Relay CH2 (Normally-Closed Solenoid Valve).",
      failSafeMechanism: "Freewheeling 1N4148 diodes across relay coils snub inductive flyback voltage spikes (L di/dt), preventing reset transients on the ESP32 power rail."
    },
    specs: [
      { label: "Coil Voltage", value: "5V DC" },
      { label: "Max Contact Rating", value: "10A @ 250VAC / 10A @ 30VDC" },
      { label: "Isolation", value: "Optocoupler Phototransistor (EL817)" },
      { label: "Trigger Logic", value: "Active LOW (Configured)" },
      { label: "Switching Time", value: "< 10 ms operate, < 5 ms release" },
      { label: "Contact Type", value: "SPDT (Form C: NO / COM / NC)" }
    ],
    wiring: [
      { pinName: "VCC", esp32Pin: "5V", signalType: "Coil Power", voltage: "5.0V DC", notes: "Separate 5V rail (isolated from 3.3V logic)" },
      { pinName: "GND", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Optocoupler ground return" },
      { pinName: "IN1 (Pump)", esp32Pin: "GPIO26", signalType: "Digital Output", voltage: "3.3V", notes: "LOW = Pump Energized, HIGH = Standby" },
      { pinName: "IN2 (Valve)", esp32Pin: "GPIO25", signalType: "Digital Output", voltage: "3.3V", notes: "LOW = Valve Open, HIGH = Valve Shut" }
    ],
    codeSnippet: `// Active-LOW Relay Switching
#define PUMP_RELAY_PIN  26
#define VALVE_RELAY_PIN 25

void setPump(bool state) {
  // Active LOW logic: LOW = Relay CLOSED
  digitalWrite(PUMP_RELAY_PIN, state ? LOW : HIGH);
}
void setValve(bool state) {
  digitalWrite(VALVE_RELAY_PIN, state ? LOW : HIGH);
}`,
    whyChosenByTCE: "High-current motors generate lethal inductive back-EMF spikes; optocouplers guarantee the ESP32 never resets or burns out."
  },
  {
    id: "solenoid",
    name: "12V NC Solenoid Valve",
    model: "FPD-270A / 1/2-Inch Threaded Brass/Poly",
    category: "Fluid Flow Control",
    role: "Normally-Closed Fail-Safe Inlet Gate",
    image: "/assets/components/solenoid.jpg",
    price: "₹240 - ₹320",
    statusTag: "Fail-Safe NC Valve",
    summary: "Normally-Closed (NC) electromagnetic pilot-operated diaphragm valve. If electrical power fails or water contamination is detected, internal return spring snaps the valve instantly closed to prevent dirty water ingress.",
    howItWorks: {
      physicalPrinciple: "In unpowered rest state, an internal stainless steel spring pushes a rubber seal against the inlet orifice. When energized with 12V DC, magnetic flux draws the plunger upward, opening the pilot orifice and enabling fluid flow.",
      signalProcessing: "Driven via Relay Channel 2 with 1N4007 reverse protection diode.",
      esp32Interaction: "Operated exclusively when turbidity is verified CLEAR (>3.0V) and tank is not full (<90%). If contamination occurs, the ESP32 de-energizes the relay within 15 milliseconds.",
      failSafeMechanism: "Normally-Closed default: Complete power outage automatically seals the tank shut. No dirty water can contaminate storage during power cuts."
    },
    specs: [
      { label: "Rated Voltage", value: "12V DC" },
      { label: "Current Draw", value: "450 mA (5.4W)" },
      { label: "Operating Pressure", value: "0.02 – 0.8 MPa (0.2 – 8 bar)" },
      { label: "Default State", value: "Normally Closed (NC)" },
      { label: "Inlet/Outlet Ports", value: "1/2 inch Male Threaded" },
      { label: "Response Time", value: "Open < 0.15s, Close < 0.3s" }
    ],
    wiring: [
      { pinName: "Coil Terminal +", esp32Pin: "12V DC + via Relay COM", signalType: "Switched 12V", voltage: "12V DC", notes: "Switched through Relay CH2 NO contact" },
      { pinName: "Coil Terminal -", esp32Pin: "12V DC Supply GND", signalType: "Ground", voltage: "0V", notes: "Flyback diode 1N4007 placed in parallel across terminals" }
    ],
    codeSnippet: `// Fail-Safe Interlock Emergency Valve Shutdown
void emergencyShutoff() {
  digitalWrite(VALVE_RELAY_PIN, HIGH); // De-energizes coil -> snaps closed
  digitalWrite(PUMP_RELAY_PIN, HIGH);  // Turns off pump
  triggerAudibleAlarm(true);
  Serial.println("INTERLOCK: Normally-Closed Valve SEALED!");
}`,
    whyChosenByTCE: "A motorized ball valve takes 5-10 seconds to close; an NC solenoid snaps shut in under 200ms, completely halting contaminated municipal inlet surges."
  },
  {
    id: "pump",
    name: "12V DC Mini Submersible Pump",
    model: "JT-160A / Brushless DC Submersible",
    category: "Pumping & Fluid Transfer",
    role: "Automated Reservoir Refilling",
    image: "/assets/components/pump.jpg",
    price: "₹180 - ₹260",
    statusTag: "Brushless Submersible",
    summary: "Submersible brushless DC centrifugal pump driven by Relay Channel 1. Features ceramic shaft construction, IP68 waterproofing, and whisper-quiet automated hysteresis replenishment.",
    howItWorks: {
      physicalPrinciple: "A multi-phase permanent magnet brushless rotor is driven by an electronic commutated stator. The impellers generate centrifugal kinetic energy that forces water through the discharge outlet.",
      signalProcessing: "Controlled via Relay CH1 with automated hysteresis logic (starts refilling when water drops below 20%, stops when water reaches 90%).",
      esp32Interaction: "ESP32 monitors pump run duration; if the pump runs continuously for > 20 minutes without water level rising, dry-run protection shuts it off automatically.",
      failSafeMechanism: "Thermal and stall protection: If water source is dry or inlet obstructed, software lockout halts operation to prevent motor coil burnout."
    },
    specs: [
      { label: "Operating Voltage", value: "12V DC (6 - 12V range)" },
      { label: "Flow Rate", value: "240 Liters / Hour (Max)" },
      { label: "Static Head (Lift)", value: "3.0 meters" },
      { label: "Power Consumption", value: "4.8W (400 mA @ 12V)" },
      { label: "Waterproof Rating", value: "IP68 Submersible" },
      { label: "Continuous Life", value: "> 20,000 operational hours" }
    ],
    wiring: [
      { pinName: "Motor Positive (+)", esp32Pin: "12V Supply via Relay CH1", signalType: "Switched Power", voltage: "12V DC", notes: "Switched via Relay Channel 1" },
      { pinName: "Motor Negative (-)", esp32Pin: "12V Supply Ground", signalType: "Ground", voltage: "0V", notes: "Common DC ground bus" }
    ],
    codeSnippet: `// Hysteresis Automated Pumping Loop
void evaluatePumpAutomation(float levelPercent, bool isWaterClean) {
  if (levelPercent <= 20.0 && isWaterClean) {
    startPump(); // Turn on pump when depleted
  } else if (levelPercent >= 90.0) {
    stopPump();  // Prevent overflow at 90%
  }
}`,
    whyChosenByTCE: "Demonstrates realistic household automation: completely eliminates water wastage from tank overflows while maintaining optimal water pressure."
  },
  {
    id: "buzzer",
    name: "5V Active Piezo Buzzer",
    model: "TMB12A05 / Active Transducer",
    category: "Audible Notification",
    role: "Audible High-Decibel Warning Sounder",
    image: "/assets/components/buzzer.jpg",
    price: "₹20 - ₹35",
    statusTag: "85 dB Sounder",
    summary: "Active piezoelectric ceramic buzzer with built-in internal oscillating circuit. Emits an unmistakable 85 dB high-frequency audio pulse when water contamination is intercepted or inlet filters become blocked.",
    howItWorks: {
      physicalPrinciple: "Contains an internal multivibrator that oscillates automatically at 2.3 kHz when DC voltage is applied across its piezoelectric ceramic diaphragm.",
      signalProcessing: "Driven via 2N2222 NPN transistor buffer or directly from GPIO23 with current limiting.",
      esp32Interaction: "Pulsed alarm sequence: 250ms ON / 250ms OFF during contamination alert; continuous 1000ms chirp upon tank full state.",
      failSafeMechanism: "Software mute timeout disables continuous buzzing after 60 seconds to prevent neighborhood annoyance while preserving visual Red LED alert."
    },
    specs: [
      { label: "Rated Voltage", value: "5V DC (operates from 3.3V - 5.5V)" },
      { label: "Sound Pressure Level", value: "Min 85 dB at 10 cm" },
      { label: "Oscillation Frequency", value: "2,300 Hz ± 300 Hz" },
      { label: "Current Consumption", value: "< 30 mA" },
      { label: "Transducer Type", value: "Active Piezoelectric Disc" }
    ],
    wiring: [
      { pinName: "VCC (+)", esp32Pin: "GPIO23", signalType: "Digital Output", voltage: "3.3V - 5V", notes: "Driven through 100Ω protection resistor" },
      { pinName: "GND (-)", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Common system ground" }
    ],
    codeSnippet: `// Alarm Beep Sequence
void soundAlarmAlert() {
  for(int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(150);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}`,
    whyChosenByTCE: "Provides immediate local feedback even when home Wi-Fi is disconnected or smartphone notifications are muted."
  },
  {
    id: "leds",
    name: "Red & Green Status LEDs",
    model: "5mm High-Brightness Diffused",
    category: "Visual Enclosure Indicators",
    role: "Local Optical Enclosure Indicators",
    image: "/assets/components/leds.jpg",
    price: "₹5 - ₹10 pair",
    statusTag: "Optical State Indicators",
    summary: "Dual 5mm diffused light-emitting diodes installed on the enclosure faceplate. Green LED signals nominal operating loop; Red LED illuminates in lockstep with the buzzer during contamination emergencies.",
    howItWorks: {
      physicalPrinciple: "Gallium phosphide / Indium gallium nitride semiconductor p-n junctions that emit photons via electroluminescence when forward biased.",
      signalProcessing: "Current limited by 220Ω 1/4W resistors to maintain 10 mA forward current safe for ESP32 GPIO pin ratings (max 40mA per pin).",
      esp32Interaction: "GPIO18 drives Green LED (Heartbeat pulse); GPIO19 drives Red LED (Alarm latch).",
      failSafeMechanism: "Inverse signaling: During contamination interlock, Green is disabled and Red pulses at 2 Hz."
    },
    specs: [
      { label: "Diameter", value: "5 mm Round Diffused" },
      { label: "Forward Voltage", value: "Green: 2.1V • Red: 1.9V" },
      { label: "Forward Current", value: "10 mA - 20 mA" },
      { label: "Luminous Intensity", value: "500 - 800 mcd" },
      { label: "Current Limiting", value: "220Ω Series Resistor Included" }
    ],
    wiring: [
      { pinName: "Green LED Anode (+)", esp32Pin: "GPIO18 via 220Ω", signalType: "Digital Out", voltage: "3.3V", notes: "Normal System Operation" },
      { pinName: "Red LED Anode (+)", esp32Pin: "GPIO19 via 220Ω", signalType: "Digital Out", voltage: "3.3V", notes: "Emergency Interlock Active" },
      { pinName: "LED Cathodes (-)", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Tied to common GND" }
    ],
    codeSnippet: `// LED Heartbeat & Status Routine
void updateLEDIndicators(bool hasAlert) {
  if (hasAlert) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, (millis() / 250) % 2); // 2Hz pulse
  } else {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
  }
}`,
    whyChosenByTCE: "Allows non-technical homeowners to immediately assess system health with a simple glance at the enclosure box."
  },
  {
    id: "resistor",
    name: "Voltage Divider Resistor Pair",
    model: "10 kΩ & 20 kΩ 1% Metal Film",
    category: "Overvoltage Signal Protection",
    role: "ADC1 Pin Overvoltage Protection & Scaling",
    image: "/assets/components/resistor.jpg",
    price: "₹3 - ₹5 pair",
    statusTag: "Precision Signal Scaling",
    summary: "Precision 1% tolerance metal film resistor network in a 2:1 ratio (20kΩ / (10kΩ + 20kΩ) = 0.666). Scales the 0–5.0V analog output of the TS-300B turbidity conditioning board down to a safe 0–3.3V range for the ESP32 ADC1 input.",
    howItWorks: {
      physicalPrinciple: "Ohm's law voltage division: V_out = V_in * (R2 / (R1 + R2)) = V_in * (20k / (10k + 20k)) = V_in * (2/3). A 4.5V turbidity reading is attenuated to exactly 3.0V.",
      signalProcessing: "Low impedance 10k:20k values minimize ADC sampling capacitor charging errors while keeping quiescent power dissipation under 0.8 mW.",
      esp32Interaction: "Output connected to GPIO32 (ADC1 Channel 4).",
      failSafeMechanism: "1% metal film construction provides minimal thermal drift (< 50 ppm/°C), preventing calibration errors across summer and winter ambient temperatures."
    },
    specs: [
      { label: "Resistance Values", value: "R1 = 10 kΩ, R2 = 20 kΩ" },
      { label: "Tolerance", value: "± 1% Precision Metal Film" },
      { label: "Power Rating", value: "0.25 W (1/4 Watt)" },
      { label: "Scaling Ratio", value: "0.6667 (2/3 attenuation)" },
      { label: "Input Range", value: "0.0V – 5.0V DC" },
      { label: "Output to ESP32", value: "0.0V – 3.33V DC" }
    ],
    wiring: [
      { pinName: "R1 In (+)", esp32Pin: "Turbidity Board V_Out", signalType: "5V Analog Signal", voltage: "0 - 5.0V", notes: "Connects to TS-300B signal out" },
      { pinName: "R1/R2 Junction", esp32Pin: "GPIO32 (ADC1_CH4)", signalType: "Scaled Analog In", voltage: "0 - 3.3V", notes: "Safe scaled voltage input" },
      { pinName: "R2 Ground (-)", esp32Pin: "GND", signalType: "Ground", voltage: "0V", notes: "Common circuit ground reference" }
    ],
    codeSnippet: `// Voltage Divider Inversion Formula
float getActualTurbidityVoltage() {
  int rawADC = analogRead(32);
  float vESP = (rawADC / 4095.0) * 3.3;
  // Reconstruct original 0-5V sensor voltage using inverse divider:
  float original5V = vESP * ( (10000.0 + 20000.0) / 20000.0 ); // * 1.5
  return original5V;
}`,
    whyChosenByTCE: "Eliminates expensive active op-amp level shifters. Simple, robust, passive TRIZ principle (Inversion & Self-Service) at negligible cost."
  }
];
