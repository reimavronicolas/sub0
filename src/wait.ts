export class Wait {
  constructor(private timeoutMs?: number, private frequencyMs: number = 10) {
  }

  public until(condition: () => boolean, success: () => void, timeout?: () => void): void {

    let currentTime = 0;

    if (condition()) {
      success();

      return;
    }

    const u = () => {
      setTimeout(() => {

        if (condition()) {
          success();

          return;
        }

        currentTime += this.frequencyMs;

        if (!this.timeoutMs || currentTime < this.timeoutMs) {
          u();

          return;
        }

        if (timeout)
          timeout();

      }, this.frequencyMs)
    };

    u();
  }
}
