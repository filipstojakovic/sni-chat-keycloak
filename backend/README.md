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

### Creating Self-Signed SSL Certificate without Prompt
```console
openssl req -newkey rsa:2048 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key \
            -subj "/C=SI/ST=Ljubljana/L=Ljubljana/O=Security/OU=IT Department/CN=www.example.com"
```

Add certificate to keystore:

```console
keytool -import -file .\cert.crt -keystore .\server.jks -alias filip
```
