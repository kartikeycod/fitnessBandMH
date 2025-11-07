const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const heartEl = document.getElementById("heartRate");

connectBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "🔍 Searching for Bluetooth devices...";
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ["heart_rate"] }],
    });

    statusEl.textContent = "📡 Connecting...";
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("heart_rate");
    const characteristic = await service.getCharacteristic("heart_rate_measurement");

    statusEl.textContent = "💓 Receiving live data...";
    characteristic.addEventListener("characteristicvaluechanged", handleHeartRate);
    await characteristic.startNotifications();
  } catch (err) {
    statusEl.textContent = "❌ " + err.message;
  }
});

function handleHeartRate(event) {
  const value = event.target.value;
  // Parse HR according to Bluetooth spec
  let hr;
  const flag = value.getUint8(0);
  if (flag & 0x01) hr = value.getUint16(1, true);
  else hr = value.getUint8(1);
  heartEl.textContent = `❤️ ${hr} bpm`;
  statusEl.textContent = "✅ Connected & streaming";
}
