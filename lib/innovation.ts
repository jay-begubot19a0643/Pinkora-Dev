export const innovationFields = ['Business', 'Education', 'Tech', 'Lifestyle', 'Healthcare', 'Agriculture', 'Public Service', 'Creative & Media'] as const;
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
  Healthcare: {
    Easy: 'A small clinic has patients missing follow-up appointments because reminders are inconsistent. What simple, privacy-respecting change would help?',
    Medium: 'A community health team receives the same basic questions from residents every week. How would you make accurate information easier to access without replacing professional advice?',
    Hard: 'A rural health center has limited medicine stock and must avoid both shortages and waste. What data and process would you use to improve planning?',
    Advanced: 'A regional health network wants to share patient referrals between clinics. Propose a phased approach that improves continuity of care while protecting sensitive information.',
  },
  Agriculture: {
    Easy: 'A small vegetable grower loses part of each harvest because buyers are not confirmed early enough. What low-cost habit or tool would help?',
    Medium: 'A farming cooperative wants members to compare crop conditions without relying only on memory. What practical reporting routine would you introduce?',
    Hard: 'A farm must decide whether to invest in irrigation improvements or expand planting area. What evidence should guide the decision?',
    Advanced: 'Several growers want a shared system for traceability from harvest to buyer. How would you build it gradually so small producers can participate?',
  },
  'Public Service': {
    Easy: 'A barangay office receives repeated requests for the same document and residents are unsure about the requirements. What clear first improvement would reduce wasted trips?',
    Medium: 'A local government team wants to gather community concerns fairly before improving a public space. What consultation process would you use?',
    Hard: 'A city office has long permit-processing delays but different departments blame each other. How would you identify the bottleneck and improve accountability?',
    Advanced: 'A public service organization is launching a digital request platform. How would you make it accessible, transparent, and safe for residents with different levels of connectivity?',
  },
  'Creative & Media': {
    Easy: 'A freelance designer loses track of client revisions across chat messages. What simple workflow would make approvals clearer?',
    Medium: 'A small media team wants to publish consistently without burning out its members. How would you plan work and measure what is sustainable?',
    Hard: 'A creative agency receives conflicting feedback from several stakeholders. What process would help turn feedback into useful decisions?',
    Advanced: 'A community media project wants to use audience data while respecting privacy and avoiding clickbait. Propose a responsible strategy for planning and evaluation.',
  },
};

type QuickChallengeContext = {
  roles: string[];
  problems: string[];
  goals: string[];
  constraints: string[];
  actions: Record<InnovationLevel, string[]>;
};

const quickChallengeContexts: Record<InnovationField, QuickChallengeContext> = {
  Business: {
    roles: ['neighborhood store owner', 'small restaurant manager', 'local distributor', 'growing service business owner'],
    problems: ['inconsistent sales records', 'frequent stock shortages', 'long customer waiting times', 'unclear daily operating costs'],
    goals: ['make a reliable decision', 'reduce avoidable errors', 'improve service without overspending', 'build a repeatable workflow'],
    constraints: ['a limited budget', 'a small team', 'a busy operating day', 'incomplete information'],
    actions: {
      Easy: ['daily sales-and-stock checklist', 'simple inventory count routine', 'short customer-flow observation'],
      Medium: ['one-week workflow pilot with staff feedback', 'shared issue log with clear ownership', 'small dashboard for the most important daily measures'],
      Hard: ['cost-and-demand comparison before investing', 'branch-by-branch process review with measurable baselines', 'controlled pilot before a wider rollout'],
      Advanced: ['phased operating standard with shared data definitions', 'cross-team pilot with governance checkpoints', 'measured rollout with role-based training and review'],
    },
  },
  Education: {
    roles: ['class adviser', 'school coordinator', 'college program lead', 'district learning team'],
    problems: ['unequal access to learning materials', 'low participation in online activities', 'too many parent messages', 'unclear student progress information'],
    goals: ['support learners fairly', 'improve participation', 'make communication useful', 'protect student information'],
    constraints: ['different home resources', 'limited teacher time', 'multiple school campuses', 'mixed digital confidence'],
    actions: {
      Easy: ['flexible submission option and simple access check', 'short learner survey before changing the routine', 'shared class schedule with clear deadlines'],
      Medium: ['weekly progress summary with one clear action', 'small pilot with students and parents', 'central question channel with response ownership'],
      Hard: ['root-cause review using attendance and student feedback', 'accessibility audit before introducing a new tool', 'measured engagement pilot across different class groups'],
      Advanced: ['school-scoped data plan with access roles and audit checks', 'phased platform rollout with privacy review', 'shared governance routine across campuses'],
    },
  },
  Tech: {
    roles: ['small product team', 'local business developer', 'support lead', 'mobile application team'],
    problems: ['lost customer request details', 'repeated reports of the same bug', 'unstable field connectivity', 'unclear ownership of sensitive data'],
    goals: ['deliver a dependable first solution', 'reduce support friction', 'keep users working offline', 'protect personal information'],
    constraints: ['limited development time', 'a small support team', 'unreliable internet', 'existing customer data'],
    actions: {
      Easy: ['simple digital form with a clear owner', 'small prototype for the most common task', 'basic issue log with screenshots and steps'],
      Medium: ['shared triage workflow with priority labels', 'one focused integration pilot with monitoring', 'reusable template for complete support reports'],
      Hard: ['offline queue with clear sync and conflict rules', 'root-cause analysis from support trends', 'security review before connecting systems'],
      Advanced: ['phased architecture rollout with human review checkpoints', 'privacy-by-design pilot with access controls and audit logs', 'resilience test plan before scaling the service'],
    },
  },
  Lifestyle: {
    roles: ['busy household member', 'community volunteer', 'remote worker', 'local sustainability group'],
    problems: ['unnoticed food expiry', 'unsafe routes near a school', 'constant distractions and overtime', 'low participation in sustainable habits'],
    goals: ['make a useful habit easier', 'improve safety practically', 'protect personal time', 'encourage inclusive participation'],
    constraints: ['limited time', 'different community needs', 'small available budget', 'no dedicated technical team'],
    actions: {
      Easy: ['shared reminder and weekly review habit', 'short observation walk with affected residents', 'simple routine that makes the next action visible'],
      Medium: ['small community survey followed by a low-cost pilot', 'shared tracker with one weekly check-in', 'trial routine with measurable progress'],
      Hard: ['time-and-impact review before changing the system', 'inclusive pilot with feedback from different users', 'focused boundary-setting plan with weekly reflection'],
      Advanced: ['measurable community program with transparent reporting', 'phased initiative that tests cost and access barriers', 'cross-group plan with practical incentives and review points'],
    },
  },
  Healthcare: {
    roles: ['clinic coordinator', 'community nurse', 'health center pharmacist', 'regional care team'],
    problems: ['missed follow-up visits', 'repeated basic health questions', 'uncertain medicine stock', 'fragmented referral information'],
    goals: ['make care easier to continue', 'share reliable guidance', 'reduce shortages and waste', 'protect sensitive information'],
    constraints: ['limited staff time', 'different patient access needs', 'small operating budgets', 'confidential health records'],
    actions: {
      Easy: ['consistent consent-based reminder routine', 'simple appointment follow-up check', 'clear verified information handout'],
      Medium: ['small service pilot with patient feedback', 'shared question log reviewed by qualified staff', 'weekly stock review with clear escalation'],
      Hard: ['demand-and-stock analysis before changing orders', 'root-cause review with frontline staff', 'measured referral workflow pilot'],
      Advanced: ['privacy-reviewed referral plan with role-based access', 'phased care coordination rollout with audit checks', 'governance routine that protects sensitive patient information'],
    },
  },
  Agriculture: {
    roles: ['smallholder grower', 'farming cooperative coordinator', 'farm operations lead', 'local produce distributor'],
    problems: ['unconfirmed harvest buyers', 'inconsistent crop condition records', 'unreliable water availability', 'limited produce traceability'],
    goals: ['reduce harvest loss', 'make field decisions clearer', 'use resources efficiently', 'build buyer confidence'],
    constraints: ['seasonal uncertainty', 'small farm budgets', 'different member practices', 'limited connectivity in the field'],
    actions: {
      Easy: ['buyer confirmation checklist before harvest', 'simple field observation log', 'shared harvest schedule'],
      Medium: ['weekly crop-condition reporting pilot', 'shared demand tracker with buyers', 'cooperative review of quality and delivery data'],
      Hard: ['cost-and-water-use comparison before investing', 'field trial with measured yield results', 'risk review across seasonal scenarios'],
      Advanced: ['phased traceability pilot with participating growers', 'shared data standard that works offline first', 'governance plan for fair producer participation'],
    },
  },
  'Public Service': {
    roles: ['barangay service officer', 'local government planner', 'permit-processing team', 'public digital service lead'],
    problems: ['unclear document requirements', 'uneven community participation', 'long permit-processing delays', 'residents unable to access online services'],
    goals: ['reduce wasted resident visits', 'hear concerns fairly', 'improve accountability', 'make public services accessible'],
    constraints: ['different resident needs', 'limited office capacity', 'multiple departments', 'uneven internet access'],
    actions: {
      Easy: ['plain-language requirements checklist', 'visible service request guide', 'short resident feedback channel'],
      Medium: ['consultation pilot with diverse community groups', 'public issue tracker with response owners', 'weekly service feedback review'],
      Hard: ['end-to-end process map with measured handoffs', 'bottleneck analysis using real request data', 'cross-department improvement pilot'],
      Advanced: ['accessible digital service rollout with offline alternatives', 'transparent performance dashboard with privacy safeguards', 'phased resident testing across connectivity levels'],
    },
  },
  'Creative & Media': {
    roles: ['freelance designer', 'small media team lead', 'creative agency producer', 'community content coordinator'],
    problems: ['lost client revision details', 'inconsistent publishing and burnout', 'conflicting stakeholder feedback', 'pressure to prioritize clicks over trust'],
    goals: ['make approvals clearer', 'work sustainably', 'turn feedback into decisions', 'build responsible audience trust'],
    constraints: ['multiple communication channels', 'small production teams', 'tight deadlines', 'limited audience data'],
    actions: {
      Easy: ['single revision checklist with approval owner', 'shared content calendar with realistic capacity', 'clear feedback deadline and template'],
      Medium: ['publishing pilot with workload review', 'feedback grouping process tied to project goals', 'simple content-performance dashboard with context'],
      Hard: ['stakeholder alignment session before production changes', 'root-cause review of revision loops', 'measured workflow experiment across one campaign'],
      Advanced: ['privacy-respecting audience strategy with clear success measures', 'phased editorial governance plan with human review', 'responsible data practice that balances trust and performance'],
    },
  },
};

export const quickChallengePoints: Record<InnovationLevel, number> = {
  Easy: 2,
  Medium: 4,
  Hard: 7,
  Advanced: 10,
};

function choice<T>(values: T[], seed: number) {
  return values[Math.abs(seed) % values.length];
}

export function getInnovationQuickChallenge(field: InnovationField, level: InnovationLevel, round: number) {
  const normalizedRound = Math.max(1, Math.floor(round));
  const context = quickChallengeContexts[field];
  const seed = [...`${field}-${level}`].reduce((total, character) => total + character.charCodeAt(0), normalizedRound * 31);
  const action = choice(context.actions[level], seed + 17);
  const question = `Quick challenge #${normalizedRound}: A ${choice(context.roles, seed)} faces ${choice(context.problems, seed + 3)} and wants to ${choice(context.goals, seed + 7)} despite ${choice(context.constraints, seed + 11)}. Which first response is the most responsible?`;
  const correct = `Start with a ${action}, involve the people affected, and measure the result before expanding the solution.`;
  const distractors = [
    'Buy the largest available solution immediately without checking the real cause, users, or available resources.',
    'Use a single quick assumption for everyone and skip feedback because it would slow the decision down.',
    'Wait until the problem becomes severe, then make a major change without testing a smaller practical step.',
  ];
  const correctIndex = Math.abs(seed + 23) % 4;
  const optionTexts = [...distractors];
  optionTexts.splice(correctIndex, 0, correct);
  const optionIds = ['a', 'b', 'c', 'd'] as const;

  return {
    round: normalizedRound,
    question,
    points: quickChallengePoints[level],
    correctOptionId: optionIds[correctIndex],
    options: optionTexts.map((text, index) => ({ id: optionIds[index], text })),
  };
}

export function isInnovationField(value: unknown): value is InnovationField {
  return typeof value === 'string' && innovationFields.includes(value as InnovationField);
}

export function isInnovationLevel(value: unknown): value is InnovationLevel {
  return typeof value === 'string' && innovationLevels.includes(value as InnovationLevel);
}
