const initDotEnv = (path) => {
  try {
    const pathToEnv = path ? path : `${ __dirname }`
    if (validateDirPath(pathToEnv) !== 0) {
      throw new Error(`.env file not found in path - ${ pathToEnv }`)
    }
    const result = dotenv.config( { path: `${ pathToEnv }/.env`, silent: true } )
    if (result.error) {
      throw result.error
    }
  }
  catch (err) {
    throw err
  }
}

/**
	 * Validate that the path exists and is a directory
	 * @static
	 * @param {String} pathToDir Path specification
	 * @returns {Number} 0: Directory exists; -1: Not found or inaccessible; -2: Not a directory
	 * @memberof FileOps
	 */
const validateDirPath = (pathToDir) => {
  try {
    const pathStat = fs.statSync(pathToDir)
    if (!pathStat.isDirectory()) {
      return -2 // Not a directory
    }
    return 0 // Path is a valid directory
  }
  catch(err) {
    return -1 // Not found or inaccessible
  }
}

export { initDotEnv, validateDirPath }