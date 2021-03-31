# xhr-q
Transmit XMLHttpRequests in a sequential order. Useful for transactions.

# Basic Example
```js
const que = new xhrQ({
  retryDelay: 1000, // If there's a timeout issue, wait 1 second before retrying
});

const request = que.push('https://api.linkpreview.net', '', {
  method: 'GET',
  success: (xhr) => console.log(['success', JSON.parse(xhr.responseText)]),
  failure: (xhr) => console.log(['failure', xhr]),
});
```

[More examples](examples/)
