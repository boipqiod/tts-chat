<script lang="ts">
  let message = ''

  const sendMessage = () => {
    fetch('/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
    message = ''
  }

</script>

<div>
  <input type="text" bind:value={message} />
  <button on:click={sendMessage}>Send</button>
</div>