// Web NFC (Chrome on Android only) is not in TypeScript's DOM lib yet.
// Minimal subset used by the admin panel. Spec: https://w3c.github.io/web-nfc/

interface NDEFRecordInit {
  recordType: string;
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
  data?: string | BufferSource;
}

interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

interface NDEFMakeReadOnlyOptions {
  signal?: AbortSignal;
}

declare class NDEFReader extends EventTarget {
  constructor();
  write(message: string | NDEFMessageInit, options?: NDEFWriteOptions): Promise<void>;
  makeReadOnly(options?: NDEFMakeReadOnlyOptions): Promise<void>;
}
