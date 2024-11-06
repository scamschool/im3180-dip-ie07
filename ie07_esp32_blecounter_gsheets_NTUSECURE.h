#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <ESP_Google_Sheet_Client.h>

// For SD/SD_MMC mounting helper
#include <GS_SDHelper.h>

// Wi-Fi credentials
#define EAP_ANONYMOUS_IDENTITY  ""
#define EAP_IDENTITY  "XXXX1234@student.main.ntu.edu.sg"
#define EAP_PASSWORD  "abc123"
// #define WIFI_SSID "YOUR_WIFI_SSID"
// #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

const char *ssid = "NTUSECURE";
int wifi_reconnect_counter = 0;
unsigned long last_disconnected_time = 0;
int HTTP_TIMEOUT = 30 * 1000;

// Google Project ID
#define PROJECT_ID "ie07-crowd-datalogging"

// Service Account's client email
#define CLIENT_EMAIL "ie07-datalogger-01@ie07-crowd-datalogging.iam.gserviceaccount.com"

// Service Account's private key
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoyTkVoeH9t3yq\nBLDShqaATrdkay7gvl/1erMRHqbW08e49qH6opkf2SVYGEkHaYZaKdKz3wrrksAE\nBRHJr1Ff5wubu7kMglV1C1Qk0KsIl++gS8eJAvsqF0lpDkJzpZl1fe19I7+muF2Y\nhXoJ2o8o2P8lidt3yiurez9iZBLDaezxyGDrqAxmqAbRNLSp2Q6Ty9hIwlb8RdQW\nEs5W/OV3ORs/u7VraZqkk3g+pYg/mYfj8UCfVR6v7mVSFFmBvhui8PFkbcBGHjDK\ncAKlkHzAY2GppnXIFB6kyw9hTq/1PF2gi3HF6CnzJovu4Xrl/ayJeh3zydW4BKWC\nv1g3hq/lAgMBAAECggEALnNSVnW6sAxzLocj8oxD/kOrjONCf29lETW3WhrJZ43Z\nBTo60bM12OH1uQzV7EhKRT4FUqMrajF0zqZmgs7Q4ke/lhhPkPW9dvyrJ4aVy0Ol\nGsRAIaDEZo0KEvNtrk4Asaj6VtojwEo01+jD8TpI88DkVvxdfdYRtpuwke9gio6F\nT0IdcKdShvriIS+R3HowOF4D0lCU37kwddn+fYoUTTonA8UaIAJyBilPXPpluWUq\nG2Z2dWBzWvnbAXSwT2U3Ttj8WbctkHwOVFH9sWrGuutmFdB/5w5BcObmiez7ogny\nieePz7QTxcHSCA+LoYUQhwXwjpk15p+uqz58ftA+cQKBgQDkYJXeReK/aEbTPIdS\n/3+ZT3x2wUiCPbEVUEmKG3AVmyxgVKDuroY/s+2/gFdPaFxYwjKGLgzDp/DykRrt\nUpld2xcTbVDwtLSHYsaT+yI54dH31SEKEHvp+ZzgRsJZ6MgBPtOLR1tj6BZ6qdJS\nk4jc6sTXt7WVriVX8HV8HM5COwKBgQC9M3gp7Ne1JMvsYi4MRk+DMoH3Eh2VJtkZ\noHMwtWHAB3Kx+jSGglg6DvmOo+/StHOU+o/cvLIeHpHGKqM2aq3fRveD4Zn0MWH1\nBjsW17sTfqTuCu6Z4b98uoFBFvpmwSXjn2dBSd0sx9Fyf8yfBjJ35puBGmLgfO70\nZILdrPaUXwKBgHRKqoYQ2DHXi5ktDUu6RuNuklZ2fdG0UGQmCgyFhEG8TpCPB5QC\n0uHFYZ9OXydUYRHhcZDaCi3nas5aDXgjw20Dj3CZDcpEelkmdzALhZYr45trr/NM\nCY1PSg76eSUHYDEiKN6Xa3YoTKoRp8Pc1KiJ88pVBeY+U03AaFLW6EDZAoGAN7fE\nl3QsQihH9aEkNnEuUVC6fWxUUexS2v0pbxq7YrXOzSMF/Oa93Ls0OxGEOuTxdNol\nK7hWLBCMlXNRBWF9OtfHZIs3r3YrhuEC3cNCUIdnQsLtaVvV7IFwNx7xNvmCkvoK\nimuaOunNgI6qT9qfWjgLa4W9wKaKKGbBM08QfrkCgYEAs6omM9h5iuWOJvCpVzoP\nQ7MY5FNRIDqL2SeIq+p/a01tZfx2G69Xp6wnPdXmZYUVPN6TKFbrMCLBxFqL77JR\nOMzceCMRuSd5cAS73qwO7YvZy7eqB5mjm9WXjZIi7tHZ+2xiCzTb7wAKYprfaf11\nsd08zMlnW+nweWQoYCd0o8s=\n-----END PRIVATE KEY-----\n";

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
  WiFi.begin(ssid, WPA2_AUTH_PEAP, EAP_ANONYMOUS_IDENTITY, EAP_IDENTITY, EAP_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

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