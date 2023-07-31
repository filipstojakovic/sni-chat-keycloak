package net.etfbl.backend.exception;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@ToString
public class HttpException extends RuntimeException {

  private HttpStatus status;
  private Object data;

  public HttpException() {
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.data = null;
  }

  public HttpException(Object data) {
    this(HttpStatus.INTERNAL_SERVER_ERROR, data);
  }

  public HttpException(HttpStatus status, String data) {
    super(data);
    this.status = status;
    this.data = data;
  }

  public HttpException(HttpStatus status, Object data) {
    super(data.toString());
    this.status = status;
    this.data = data;
  }
}
