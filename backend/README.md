## Enabling HTTPS

Generate keystore using `keytool` command in your terminal:
```console
keytool -genkey -alias localhost -keyalg RSA -keystore server.jks -validity 3650 -storetype JKS -keypass password -storepass password
```


```yml
server:
  port: 8443
  ssl:
    enabled: true
    key-alias: localhost
    key-store: classpath:server.jks
    key-store-type: jks
    key-store-password: password
    key-password: password
```
