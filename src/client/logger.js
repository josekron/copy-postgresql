// Singleton Instance
let INSTANCE = void 0;

// Prefixed Logger
class Logger
{
  /** Initialises an instance of the Logger class (setup as a singleton) */
  constructor()
  {
    if (!Logger.instance)
    {
      this._logStreams = {};
      this._logLevel = LogLevel.DEBUG;
      this.info('Initialising logger client');
      INSTANCE = this;
    }
  }

  /** Returns singleton instance */
  getInstance()
  {
    return INSTANCE;
  }

  /** Returns the current log level */
  getLogLevel()
  {
    return this._logLevel;
  }

  /** Sets a new specified log level */
  setLogLevel(lvl)
  {
    lvl = Number(lvl)
    const isValidLogLevel = (e) => Object.values(LogLevel).includes(e);

    if (isValidLogLevel(lvl))
    {
      const logLevelName = this._getLogLevelName(lvl);
      this.info(`Setting logging level to ${ logLevelName }`);
      this._logLevel = lvl;
    }
    else
    {
      throw new Error(`Invalid log level specified: ${ lvl }`);
    }
  }

  // --- ↓   PRIVATE   ↓ --- \\

  /** No operation */
  _noop() {}

  /** Gets the print-friendly name of the specified log level */
  _getLogLevelName(lvl)
  {
    return Object.keys(LogLevel)[lvl]
  }

  /** Builds and returns a level-appropriate logging method */
  _loggerFactory(loggerFn, logLevel)
  {
    if (logLevel < this._logLevel) return this._noop;

    const prefix = `[${ this._getLogLevelName(logLevel) }]`;
    return Function.prototype.bind.call(loggerFn, console, prefix);
  }

  // --- ↓   PUBLIC   ↓ --- \\

  /** Returns the log streams object */
  getLogStreams()
  {
    return this._logStreams;
  }

  /** Returns a boolean based on the existence of the specified log stream */
  logStreamExists(stream)
  {
    return this.getLogStreams().hasOwnProperty(stream);
  }

  /** Records an entry in the log stream in CSV format */
  record(stream, content)
  {
    try
    {
      const logStreams = this.getLogStreams();

      if (!this.logStreamExists(stream))
        logStreams[stream] = "";

      if (Array.isArray(content))
      {
        content.forEach(e => logStreams[stream] += `${ e }\n`);
      }
      else
      {
        logStreams[stream] += `${ content }\n`;
      }
    }
    catch (err)
    {
      this.error(`Error recording to log stream '${ stream }': ${ err.message }`);
    }
  }

  /** DEBUG level logging */
  debug(...params)
  {
    return this._loggerFactory(console.debug, LogLevel.DEBUG)(...params);
  }

  /** QUERY level logging */
  query(...params)
  {
    return this._loggerFactory(console.log, LogLevel.QUERY)(...params);
  }

  /** INFO level logging */
  info(...params)
  {
    return this._loggerFactory(console.info, LogLevel.INFO)(...params);
  }

  /** WARNING level logging */
  warn(...params)
  {
    return this._loggerFactory(console.warn, LogLevel.WARNING)(...params);
  }

  /** ERROR level logging */
  error(...params)
  {
    return this._loggerFactory(console.error, LogLevel.ERROR)(...params);
  }
};

// Log Levels
const LogLevel = Object.freeze({
  DEBUG:   0,
  QUERY:   1,
  INFO:    2,
  WARNING: 3,
  ERROR:   4
});

// Log Streams
const LogStream = Object.freeze({
  SUCCESS: 'success',
  FAILURE: 'failure'
});

// Exports
module.exports.Logger = new Logger().getInstance();
module.exports.LogStream = LogStream;
module.exports.LogLevel = LogLevel;
