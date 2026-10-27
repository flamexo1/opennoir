# Adapter contract

Only `mockConnector` is implemented and selected. It performs no network or physical actions. Registering a resource does not provision a model, machine or robot.

## Current in-process interface

```js
const connector = {
  id: 'mock',
  describe() {
    return { id: 'mock', label: 'Local mock connector', live: false, version: '1.0' };
  },
  execute({ resource, run, outcome }) {
    // outcome is 'success' or 'failure' selected by the demo operator.
    return {
      status: 'succeeded', // or 'failed'
      message: 'Readable event',
      units: 1200,        // agent tokens OR robot items, not comparable
      cost: 0.48,        // USD; recorded execution estimate
      charge: 1.20,      // USD; modeled service value, not an invoice
      // code: 'UPSTREAM_TIMEOUT' on failure
    };
  }
};
```

Mock robot success returns 24 items / $9 execution cost / $24 service value. Mock agent success returns 1,200 tokens / $0.48 / $1.20. Failure returns zero units/cost/value. Robot errors trigger maintenance safety gating; agent errors trigger execution incidents.

## Extending responsibly

This release provides the interface and example, **not a ready-made remote connector framework**. To add a real integration:

1. Move execution outside SQLite transactions into a durable job dispatcher/outbox. Add unique idempotency keys, retries, timeout/cancellation semantics and verified receipts.
2. Define connector-specific credentials in a secret store and bind them to authorized organization membership. Never accept credentials in resource names or return them to the UI.
3. Validate signed inbound telemetry/webhooks, sequence numbers, resource identity and customer bindings. Map provider result types into explicit units and costs.
4. Implement adapter-result validation and integration tests against a controlled sandbox. Handle malformed results, partial execution, bills on failed attempts, interruption and duplicate delivery.
5. For robots, use certified vendor control infrastructure and local hardware safety systems. Dashboard status or a software pause is not an emergency stop or a safety guarantee.
6. Expose actual connector health and capability discovery only after verified connections. Do not silently replace mock behavior with remote execution.

Agents and robots need different capability metadata, unit accounting and failure taxonomies. The current shared capability vocabulary is intentionally small. There is no live model, provider SDK, ROS/MQTT bridge, fleet API, autonomous planning or billing connector in this source.
