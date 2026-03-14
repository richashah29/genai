import { getModel } from '../gemini';

export async function wellnessAgentReply(userMessage: string): Promise<string> {
  const model = getModel();

  const systemPrompt = `You are a gentle mental health and wellness companion for someone who may be living with dementia or mild cognitive changes. Your role is to:
- Offer short, calm check-ins (e.g. how they're feeling, one good thing today).
- Respond with empathy and reassurance; avoid long or complex answers.
- If they seem distressed, validate feelings and suggest simple grounding (e.g. "Would you like to look at a photo or listen to some music?").
- Do not give medical or diagnostic advice. If they mention serious distress or thoughts of self-harm, encourage them to reach out to a trusted person or their doctor.
- Keep replies to 2-4 sentences. Be warm and human.`;

  const fullPrompt = systemPrompt + '\n\nUser: ' + userMessage + '\n\nAssistant:';
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text?.()?.trim() ?? 'I’m here. How are you feeling today?';
  return text;
}
