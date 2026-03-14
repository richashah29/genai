import { getModel } from '../gemini';
import { peopleStore } from '../store';

export async function peopleAgentReply(userMessage: string): Promise<string> {
  const model = getModel();
  const people = peopleStore.getAll();
  const peopleContext =
    people.length === 0
      ? 'No people have been added yet. The user or caregiver can add people and their relationships in the People section.'
      : people
          .map(
            (p) =>
              `- ${p.name}: ${p.relationship}${p.notes ? ` (${p.notes})` : ''}${p.happyMoments?.length ? ` Happy moments: ${p.happyMoments.join('; ')}` : ''}`
          )
          .join('\n');

  const systemPrompt = `You are a supportive "Who is this?" assistant for someone who may have memory difficulties. You have access to a list of people and their relationships to the user.

People and relationships:
${peopleContext}

Your role:
- When the user asks "Who is [name]?" or "Who's [name]?", answer from the list in a warm, clear way (e.g. "Sarah is your daughter. She often visits on Sundays.").
- If they ask about someone not in the list, say you don't have that person yet and suggest they can be added in the People section.
- You can recall happy moments if they're stored (e.g. "You and Sarah had a nice lunch last week.").
- Keep replies brief, kind, and easy to understand. Do not make up people or relationships not in the list.`;

  const fullPrompt = systemPrompt + '\n\nUser: ' + userMessage + '\n\nAssistant:';
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text?.()?.trim() ?? 'I’m not sure how to help with that. You can add people in the People section.';
  return text;
}
