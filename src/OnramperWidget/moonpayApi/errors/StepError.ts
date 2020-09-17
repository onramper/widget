export default class StepError extends Error {
  public field?: string;

  constructor(message: string, field: string | null) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    if (typeof field === 'string') {
      this.field = field;
    }
    this.name = 'StepError';
  }
}
