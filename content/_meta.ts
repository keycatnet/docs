import type { MetaRecord } from "nextra";

export default {
  index: "Overview",
  quickstart: "Quickstart",
  "-- concepts": { type: "separator", title: "Concepts" },
  charges: "Charges and payment links",
  payments: "How customers pay",
  refunds: "Refunds",
  account: "Your account and security",
  "-- integrate": { type: "separator", title: "Integrate" },
  sdk: "Node.js SDK",
  api: "HTTP API",
  webhooks: "Webhooks",
  guides: "Guides",
  "-- protocol": { type: "separator", title: "Under the hood" },
  protocol: "How Keycat works",
} satisfies MetaRecord;
