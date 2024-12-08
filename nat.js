const NATS_URL = "wss://prod-v2.nats.realtime.pump.fun";
const SUBJECT = "newCoinCreated.prod";

(async () => {
  try {
    const ws = new WebSocket(NATS_URL);

    ws.onopen = () => {
      console.log(`✅ Connected to NATS at ${NATS_URL}`);

      // Send subscription message
      const subscription = {
        op: "sub",
        subject: SUBJECT,
        sid: "1",
      };
      ws.send(JSON.stringify(subscription));
      console.log(`Subscribed to NATS subject: ${SUBJECT}`);
    };

    ws.onmessage = async (event) => {
      try {
        let rawData = event.data;

        // Convert Blob to string if necessary
        if (rawData instanceof Blob) {
          rawData = await rawData.text();
        }

        // Attempt to parse the incoming data
        if (typeof rawData === "string") {
          // Handle cases like `INFO {...}`
          const cleanedData = rawData.trim().startsWith("{")
            ? rawData
            : rawData.substring(rawData.indexOf("{"));

          const message = JSON.parse(cleanedData);
          console.log("Received message:", message);
        } else {
          console.warn("Unknown message format:", rawData);
        }
      } catch (error) {
        console.error("Failed to parse incoming message:", error.message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("NATS connection closed.");
    };
  } catch (error) {
    console.error("Failed to connect to NATS:", error);
  }
})();
