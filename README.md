# SHAIS Paper Scanner

Paper-checking scanner for Savitridevi Hariram Agarwal International School (SHAIS).
Built with Expo SDK 58 + `expo-camera`'s native document scanner.

## What it does
- Opens the scanner automatically when the app starts (no button needed).
- Phone's native scanner (Google ML Kit on Android, VisionKit on iOS) detects the paper edges live,
  auto-captures, crops and straightens each page. Scan as many pages as you like.
- Builds an A4 PDF automatically. Review screen: reorder, rotate, delete pages, name the file,
  then Save / Share (Files, Drive, WhatsApp, email...).

## Run on EndeavourOS (Arch) with Expo Go
```bash
cd ~/Projects/shais-paper-scanner
rm -rf node_modules android ios package-lock.json   # clean out the old attempt
npm install
npx expo install --fix       # lines every package up with your SDK
npx expo start
```
1. Install / update **Expo Go** on your phone (it must support SDK 58).
2. Phone and laptop on the same Wi-Fi, scan the QR code shown in the terminal.
3. No Android Studio / Android SDK is needed for Expo Go.

If the QR code won't connect:
- Open the port: `sudo ufw allow 8081/tcp` (ufw) or `sudo firewall-cmd --add-port=8081/tcp` (firewalld).
- Or use a tunnel: `npm run tunnel` (school Wi-Fi often blocks device-to-device traffic).

If Expo Go says the project's SDK is not supported, update Expo Go from the Play Store / App Store.

## If the scanner does not open inside Expo Go
Expo's docs don't state whether `scanDocumentAsync` runs in Expo Go, so it is the one thing to
verify on your phone. If it fails, make a development build (no Android SDK needed, built in the cloud):
```bash
npm i -g eas-cli
eas login
eas build --profile development --platform android
```
Install the APK it gives you; the same code runs there.

## Push to Git
```bash
git init
git add .
git commit -m "SHAIS paper scanner"
git branch -M main
git remote add origin git@github.com:<you>/shais-paper-scanner.git
git push -u origin main
```

## Project layout
```
App.js                    app state: scanning, auto-PDF, share
src/screens/HomeScreen.js     SHAIS home + how-it-works
src/screens/ReviewScreen.js   page grid, reorder/rotate/delete, file name, share
src/components/Header.js      SHAIS header
src/utils/pdf.js              PDF building, rotate, share
src/theme.js                  school name + colours
```
# Docs_scanner
