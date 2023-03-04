# Auth

- Authentication: if(logon)
- Authorization: if (user===validUser)

## Tokenizar

Las peticiones del front tokenizadas se envían por headers. En el repo, el fetch tendrá un header "Authorization" con valor 'Bearer ' + token

```javascript
    const resp = await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
        "Content-type": "application/json",
        "Authorization": "Bearer " + token,
        },
    })
```
