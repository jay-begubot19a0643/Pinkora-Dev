export const innovationFields = ['Business', 'Education', 'Tech', 'Lifestyle'] as const;
export const innovationLevels = ['Easy', 'Medium', 'Hard', 'Advanced'] as const;

export type InnovationField = typeof innovationFields[number];
export type InnovationLevel = typeof innovationLevels[number];

export const innovationQuestions: Record<InnovationField, Record<InnovationLevel, string>> = {
  Business: {
    Easy: 'A neighborhood bakery has many unsold breads at closing time. What simple change would reduce waste without hurting regular customers?',
    Medium: 'A growing retail store receives complaints about long checkout lines during weekends. How would you improve the customer flow using practical people-and-process changes?',
    Hard: 'A small distributor must choose between opening a second branch or improving delivery operations. What evidence would you collect before making the investment?',
    Advanced: 'A business is expanding quickly but each branch reports sales and inventory differently. Propose a phased plan that creates consistent data without stopping daily operations.',
  },
  Education: {
    Easy: 'A teacher notices that several students cannot submit assignments because they share one device at home. What fair, realistic support could the class provide?',
    Medium: 'A school wants parents to understand student progress without giving them too many messages. What communication routine would you design?',
    Hard: 'A college has low participation in online classes despite good internet on campus. How would you identify the real cause and improve engagement?',
    Advanced: 'A school district plans a digital learning platform for different campuses. How would you protect student data while allowing each school to manage its own workflows?',
  },
  Tech: {
    Easy: 'A local shop keeps customer orders in paper notebooks and often loses details. What is the smallest digital solution you would build first, and why?',
    Medium: 'A team reports the same bug repeatedly because support messages are scattered across chat apps. How would you design a reliable issue-reporting workflow?',
    Hard: 'A mobile app works well online but fails for field workers with unstable connectivity. What offline-first approach would you recommend?',
    Advanced: 'A startup wants to use AI in customer support but must avoid exposing private customer information. Design a practical rollout with safeguards and human review.',
  },
  Lifestyle: {
    Easy: 'A busy household throws away groceries each week because food expires unnoticed. What small habit or tool would make the biggest difference?',
    Medium: 'A community wants to encourage safer walking and cycling near schools. How would you gather input and turn it into a realistic first improvement?',
    Hard: 'A remote worker feels constantly distracted and overworked. What system would you create to improve focus without sacrificing personal time?',
    Advanced: 'A city wants residents to adopt more sustainable daily habits without making life more expensive. Propose a program that is measurable, inclusive, and practical.',
  },
};

export function isInnovationField(value: unknown): value is InnovationField {
  return typeof value === 'string' && innovationFields.includes(value as InnovationField);
}

export function isInnovationLevel(value: unknown): value is InnovationLevel {
  return typeof value === 'string' && innovationLevels.includes(value as InnovationLevel);
}
