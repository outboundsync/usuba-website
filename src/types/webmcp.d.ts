export interface ToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

export interface ToolExecuteCallbackOptions {
  signal?: AbortSignal;
}

export type ToolExecuteCallback = (input: Record<string, unknown>, options?: ToolExecuteCallbackOptions) => unknown | Promise<unknown>;

export interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: ToolExecuteCallback;
  annotations?: ToolAnnotations;
}

export interface ModelContext {
  registerTool(tool: ModelContextTool): void;
  unregisterTool?(name: string): void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }

  interface Document {
    modelContext?: ModelContext;
  }
}
