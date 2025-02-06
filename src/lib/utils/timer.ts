export type Timings = {
  totalDurationMs: number
  labelledTimesMs: Partial<Record<string, number>>
}

export class Timer {
  private timings: Partial<Record<string, readonly [number, number]>> = {}
  private startTime: [number, number] | undefined
  private ended = false
  private lastMeasuredTime: [number, number] = [0, 0]

  start(): void {
    if (this.startTime) {
      throw new Error('Timer already started')
    }

    console.log('Starting timer')

    this.startTime = process.hrtime()
    this.lastMeasuredTime = this.startTime
  }

  log(label: string): void {
    if (!this.startTime) {
      throw new Error('Timer not started')
    }

    const endTime = process.hrtime()
    const duration = [
      endTime[0] - this.lastMeasuredTime[0],
      endTime[1] - this.lastMeasuredTime[1],
    ] as const

    console.log(
      `[${label}] ${Timer.convertToMs(duration).toFixed(
        2
      )}ms from start. Total: ${Timer.convertToMs(endTime)}ms`
    )

    this.timings[label] = duration
    this.lastMeasuredTime = endTime
  }

  end(): Timings {
    if (!this.startTime) {
      throw new Error('Timer not started')
    }

    if (this.ended) {
      throw new Error('Timer already ended')
    }

    this.ended = true

    console.log('Ending timer')

    const endTime = process.hrtime()
    const duration = [endTime[0] - this.startTime[0], endTime[1] - this.startTime[1]] as const

    return {
      totalDurationMs: Timer.convertToMs(duration),
      labelledTimesMs: Object.fromEntries(
        Object.entries(this.timings).map(
          ([label, duration]) => [label, Timer.convertToMs(duration as [number, number])] as const
        )
      ) as Partial<Record<string, number>>,
    }
  }

  private static convertToMs(duration: readonly [number, number]) {
    return duration[0] * 1000 + duration[1] / 1000000
  }
}
