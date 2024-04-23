import log from 'npmlog'

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'

log.heading = 'OnePieces'

log.addLevel('version', 2000, { fg: 'red' })

export default log