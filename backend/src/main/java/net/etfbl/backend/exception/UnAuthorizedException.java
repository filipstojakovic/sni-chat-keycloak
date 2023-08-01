package net.etfbl.backend.exception;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends HttpException {

  public UnAuthorizedException(Object data) {
    super(HttpStatus.UNAUTHORIZED, data);
  }

}
