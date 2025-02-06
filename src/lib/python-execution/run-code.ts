import { PyProxy } from 'pyodide/ffi'
import { loadPyodide } from 'pyodide'
import { Timer, Timings } from '../utils/timer'
import { RunPythonCodeInput } from './types'

export async function runPythonCode({ code, auto_install_packages }: RunPythonCodeInput): Promise<{
  result:
    | {
        status: 'success'
        data: unknown
      }
    | {
        status: 'error'
        error: unknown
      }
  timings: Timings
  stdout: string[]
  stderr: string[]
}> {
  const global = createFakeJsGlobalForPythonCode()
  const timer = new Timer()
  const stdout: string[] = []
  const stderr: string[] = []

  try {
    timer.start()
    const pyodide = await loadPyodide({
      jsglobals: global,
      stdout: (text) => {
        stdout.push(text)
      },
      stderr: (text) => {
        stderr.push(text)
      },
    })
    timer.log('Loaded pyodide')

    if (auto_install_packages) {
      const packages = await pyodide.loadPackagesFromImports(code)
      timer.log('Loaded packages from imports')
      console.log('Found & installed packages', packages)
    }

    const resultProxy = await pyodide.runPythonAsync(code)
    timer.log('Ran python code')

    const result = extractAndFreeResult(resultProxy)
    timer.log('Extracted and freed result')

    validateResult(result)
    timer.log('Validated result')

    return {
      result: {
        status: 'success',
        data: result,
      },
      timings: timer.end(),
      stdout,
      stderr,
    }
  } catch (e) {
    return {
      result: {
        status: 'error',
        error: e,
      },
      timings: timer.end(),
      stdout,
      stderr,
    }
  }
}

function createFakeJsGlobalForPythonCode() {
  const global = Object.create(null)

  return new Proxy(global, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver)
    },
    set() {
      // Just don't allow setting anything :)
      return true
    },
  })
}

function isPyProxy(obj: unknown): obj is PyProxy {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Symbol.toStringTag in obj &&
    obj[Symbol.toStringTag] === 'PyProxy'
  )
}

function jsonClone<T>(obj: T): T {
  if (typeof obj === 'undefined') {
    return obj
  }

  return JSON.parse(JSON.stringify(obj))
}

function extractAndFreeResult(maybeResultProxy: unknown): unknown {
  if (!isPyProxy(maybeResultProxy)) {
    return maybeResultProxy
  }

  const proxies: PyProxy[] = [maybeResultProxy]
  const result = maybeResultProxy.toJs({ pyproxies: proxies })

  proxies.forEach((proxy) => {
    proxy.destroy()
  })

  return jsonClone(result)
}

function validateResult(result: unknown) {
  if (typeof result === 'function') {
    throw new Error('Invalid return value')
  }
}
