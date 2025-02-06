import { runPythonCode } from './lib/python-execution/run-code'

async function main() {
  const code = /* py */ `
    import js

    print(dir(js))

    js.a = 1

    y = (1, 2)

    x = {
      "yo": {
        "yo": {
          "yo": 1
        }
      }
    }

    x['x'] = x

    x
  `

  console.log('result', await runPythonCode(code))
}

void main()
  .then(() => {
    console.log('\n\n\nDone')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
