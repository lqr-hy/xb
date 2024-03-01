
import { exec } from 'node:child_process'


function getLibVersion (lib: string) {
  exec(`npm view ${lib} versions`, (err, stdout, stderr) => {
    console.log(err, 'err')
    console.log(stdout, 'stdout')
    console.log(stderr, 'stderr')
  })
}

getLibVersion('vue')