package net.etfbl.backend.util;

import lombok.experimental.UtilityClass;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Generic functions logger
 */
@UtilityClass
public class LoggingUtil {

  public static void logException(Throwable e, Log log) {
    StringBuilder builder = new StringBuilder();
    builder.append(e);
    builder.append(System.lineSeparator());
    for (StackTraceElement element : e.getStackTrace()) {
      builder.append(element);
      builder.append(System.lineSeparator());
    }
    log.error(builder);
  }

  public static <T> void logException(Throwable e, Class<T> clazz) {
    logException(e, LogFactory.getLog(clazz));
  }
}
