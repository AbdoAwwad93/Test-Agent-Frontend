/* eslint-disable @typescript-eslint/no-explicit-any */
export function getStepOrder(step: any, fallbackIndex = 0) {
  return step.step_index ?? step.index ?? fallbackIndex;
}

export function getStepKey(step: any, fallbackIndex = 0) {
  const order = getStepOrder(step, fallbackIndex);
  const action = step.action ?? 'step';
  const description = step.description ?? '';
  const status = step.status ?? 'unknown';
  const duration = step.duration_ms ?? 'na';
  return `${order}-${action}-${description}-${status}-${duration}-${fallbackIndex}`;
}

export function mergeStep(prevSteps: any[], incomingStep: any) {
  const incomingOrder = getStepOrder(incomingStep, -1);

  if (incomingOrder !== -1) {
    const existingIndex = prevSteps.findIndex(
      (step) => getStepOrder(step, -1) === incomingOrder,
    );

    if (existingIndex !== -1) {
      const next = [...prevSteps];
      next[existingIndex] = { ...next[existingIndex], ...incomingStep };
      return next;
    }
  }

  const incomingKey = getStepKey(incomingStep, prevSteps.length);
  if (prevSteps.some((step, index) => getStepKey(step, index) === incomingKey)) {
    return prevSteps;
  }

  return [...prevSteps, incomingStep];
}
