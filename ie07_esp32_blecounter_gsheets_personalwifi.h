#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <ESP_Google_Sheet_Client.h>

// For SD/SD_MMC mounting helper
#include <GS_SDHelper.h>

#define WIFI_SSID "XXX" // Insert Wi-Fi network SSID
#define WIFI_PASSWORD "XXX" // Insert Wi-Fi password

// Google Project ID
#define PROJECT_ID "ie07-crowd-datalogging"

// Service Account's client email
#define CLIENT_EMAIL "ie07-datalogger-01@ie07-crowd-datalogging.iam.gserviceaccount.com"

// Service Account's private key
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\ninsertprivatekeyhere\n-----END PRIVATE KEY-----\n";

// The ID of the spreadsheet where you'll publish the data
const char spreadsheetId[] = "1dBDgXQRbJYZQTPfNbU1qovM5s6QG_g4XJ_9z4hEB2n0";

// Timer variables
unsigned long lastTime = 0;  
unsigned long timerDelay = 300000;  // 5 minutes delay

// BLE scan variables
BLEScan* pBLEScan;
int deviceCount = 0;
int scanTime = 5;  // 5 seconds for scanning

// Token Callback function
void tokenStatusCallback(TokenInfo info);

// NTP server to request epoch time
const char* ntpServer = "pool.ntt.org";

// Variable to save current epoch time
unsigned long epochTime;

// Variable for location
String location;

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return(0);
  }
  time(&now);
  return now;
}

// BLE Advertised Device Callback
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    deviceCount++;  // Increment device count for each found device
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println();

  // Configure time
  configTime(0, 0, ntpServer);

  GSheet.printf("ESP Google Sheet Client v%s\n\n", ESP_GOOGLE_SHEET_CLIENT_VERSION);

  // Initialize Wi-Fi
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Initialize Google Sheets client
  GSheet.setTokenCallback(tokenStatusCallback);
  GSheet.setPrerefreshSeconds(10 * 60);
  GSheet.begin(CLIENT_EMAIL, PROJECT_ID, PRIVATE_KEY);
  // Initialize BLE
  BLEDevice::init("ESP32_BLE_Scanner");
  pBLEScan = BLEDevice::getScan();  // Create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);  // Active scan uses more power, but gets results faster
}

void loop() {
  // Call ready() repeatedly in loop for authentication checking
  bool ready = GSheet.ready();

  if (ready && millis() - lastTime > timerDelay) {
    lastTime = millis();
    deviceCount = 0;  // Reset the device count before scanning

    FirebaseJson response;

    Serial.println("\nAppending spreadsheet values...");
    Serial.println("----------------------------");

    FirebaseJson valueRange;

    // Start BLE scan
    Serial.println("Scanning for BLE devices...");
    pBLEScan->start(scanTime, false);  // Scan for the specified time
    pBLEScan->stop();

    // Print and send device count
    Serial.print("Total BLE devices found: ");
    Serial.println(deviceCount);

    // Get timestamp
    epochTime = getTime();

    // Set location
    location = "South Spine Canteen";

    valueRange.add("majorDimension", "COLUMNS");
    valueRange.set("values/[0]/[0]", epochTime);
    valueRange.set("values/[1]/[0]", deviceCount);
    valueRange.set("values/[2]/[0]", location);

    // For Google Sheet API ref doc, go to https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
    // Append values to the spreadsheet
    bool success = GSheet.values.append(&response /* returned response */, spreadsheetId /* spreadsheet Id to append */, "Sheet1!A1" /* range to append */, &valueRange /* data range to append */);
    if (success){
      response.toString(Serial, true);
      valueRange.clear();
    }
    else{
      Serial.println(GSheet.errorReason());
    }
    Serial.println();
    Serial.println(ESP.getFreeHeap());
    }
}

void tokenStatusCallback(TokenInfo info){
    if (info.status == token_status_error){
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
        GSheet.printf("Token error: %s\n", GSheet.getTokenError(info).c_str());
    }
    else{
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
    }
}