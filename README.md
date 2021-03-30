# xhr-q
Transmit XMLHttpRequests in a sequential order. Useful for transactions.

# Basic Example
```js
const xhrQ = window.xhrQ.default;

const que = new xhrQ();
const request = que.push('https://api.linkpreview.net', '', {
  method: 'GET',
  success: (xhr) => console.log(['success', JSON.parse(xhr)]),
  failure: (xhr) => console.log(['failure', xhr]),
});
```
