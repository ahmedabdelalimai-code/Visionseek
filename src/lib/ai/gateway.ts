export type AiMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type AiCompletionRequest = {
  messages: AiMessage[];
  purpose: 'summarization' | 'classification' | 'research_assistance';
  correlationId: string;
};
export type AiCompletionResponse = {
  content: string;
  provider: string;
  model: string;
  usage?: { inputTokens: number; outputTokens: number };
};

/** Provider-agnostic application port. Domain services never call providers directly. */
export interface AiGateway {
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}

/** Safe development placeholder: no provider integration or secret is fabricated. */
export class DisabledAiGateway implements AiGateway {
  async complete(): Promise<AiCompletionResponse> {
    throw new Error('AI gateway is not configured. Configure an adapter outside domain modules.');
  }
}
