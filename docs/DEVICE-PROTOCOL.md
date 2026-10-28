# Device gateway protocol

Enroll through authenticated Connections as an owner. Registration produces a device ID and a random bearer token shown once. The database retains only its SHA-256 hash. Workspace ownership is derived from the token; devices cannot select another workspace using an HTTP header.

Send all requests over HTTPS outside local development. Use `Authorization: Bearer <device-token>`.

## Telemetry

POST `/api/device/telemetry`, JSON:

```json
{"sequence":1760000000000,"battery":82,"health":100,"location":{"lat":40.745,"lng":-73.99}}
```

Sequence must be a safe integer strictly higher than the previous accepted value. Persist your sequence across restarts or use an appropriate monotonic timestamp strategy. Battery/health are finite values from 0 to 100. Location is optional; latitude must be within ±90 and longitude within ±180. Server receipt time determines last-seen status. The device is offline if nothing arrives for 30 seconds. The schematic UI projection is not a navigation map. Simulator data is labeled as such.

## Read-only commands

GET `/api/device/commands` returns pending, unexpired diagnostic commands. Commands remain queued until acknowledgement, so clients must deduplicate by command ID. Only `diagnostics` is supported. No motion, driving, manipulation, emergency-stop bypass or unrestricted code execution is exposed.

POST `/api/device/ack`:

```json
{"id":"cmd-…","result":{"ok":true,"checkedAt":"2026-10-28T00:00:00.000Z"}}
```

Result objects are limited to 4,000 serialized characters. A repeated acknowledgement of an already-completed command is idempotent. Queued commands expire after two minutes. Revoking a token immediately prevents further telemetry, polling or acknowledgements.

## Hardware adapters

A manufacturer adapter must implement the protocol on a trusted gateway or the device itself, keep the token private, report actual telemetry with correct units and handle reconnects. Test in a simulator first, then on the supported physical device. No manufacturer compatibility or physical safety is implied by this protocol. An opennoir ID identifies a record; the bearer token authenticates a connection.
