### Import realm

1) Navigate to admin console (in this example: http://localhost:9000)
2) Create new realm
3) Browse for my-realm.json

### To extract realm data:

1) `docker exec -it <container-id> bash`
2) `cd /opt/bitnami/keycloak/bin`
3) `kc.sh export --dir /opt/bitnami/keycloak/data/my-realms --realm my-realm --users realm_file`

